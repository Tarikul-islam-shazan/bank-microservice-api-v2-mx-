import httpContext from 'express-http-context';
import { pathToRegexp } from 'path-to-regexp';
import { BankIdentifier } from './../interfaces/MeedRequest';
import { Request, Response, Router, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import parser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import logger from '../utils/logger';
import loggerConstants from '../utils/loggerConstants';
import { MeedRequest } from '../interfaces/MeedRequest';
import { MeedAxios } from '../utils/api';
import MeedUtils from '../utils/utils';
import config from '../config/config';

const morganFormat = process.env.NODE_ENV !== 'production' ? 'common' : 'combined';

export const handleCors = (router: Router) =>
  router.use(
    cors({
      credentials: true,
      origin: true,
      exposedHeaders: [
        'MeedBankingClub-Bank-Identifier',
        'MeedBankingClub-Correlation-Id',
        'MeedbankingClub-Otp-Id',
        'MeedbankingClub-Billpay-Provider'
      ]
    })
  );

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

export const handleCookieParsing = (router: Router) => {
  router.use(cookieParser());
};

export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const addBankIdToRequest = (router: Router) => {
  // set bank id
  router.use((req: MeedRequest, res: Response, next: NextFunction) => {
    if (req.header('MeedBankingClub-Bank-Identifier')) {
      // setting bank id to request objc to use in next opearations
      req.bankId = req.header('MeedBankingClub-Bank-Identifier') as BankIdentifier;
      // = req.headers['MeedBankingClub-Bank-Identifier'] as string;
    }
    next();
  });
};

export const loggingMiddleware = (router: Router) => {
  // required to set the context for it to logged later on
  router.use(httpContext.middleware);

  // silent http logger in test environment
  if (process.env.NODE_ENV !== 'test') {
    router.use(
      morgan(morganFormat, {
        skip: (req: Request, res: Response) => {
          return res.statusCode >= 400;
        },
        stream: process.stderr
      })
    );

    router.use(
      morgan(morganFormat, {
        skip: (req: Request, res: Response) => {
          return res.statusCode < 400;
        },
        stream: process.stdout
      })
    );
  }

  // set some logging parameters
  router.use((req: Request, res: Response, next: NextFunction): void => {
    // required otherwise context will be lost between other calls
    httpContext.ns.bindEmitter(req);
    httpContext.ns.bindEmitter(res);
    const urlPath = req.url
      .split('/')
      .slice(3)
      .join('/')
      .replace(/(\/\?.*|\?.*)/gi, '');

    // dynamically matching logger constant from request url
    // to get location and action
    const loggerConstant = Object.keys(loggerConstants).filter(path => {
      const regexp = pathToRegexp(path);
      return regexp.test(urlPath);
    });

    httpContext.set('loggingContext', {
      ...loggerConstants[loggerConstant[0]],
      requestUrl: req.url,
      httpMethod: req.method,
      appVersion: req.get('meedbankingclub-app-version') || '',
      devicePlatform: req.get('meedbankingclub-device-platform') || ''
    });

    next();
  });

  // set logging correlation id
  router.use((req: Request, res: Response, next: NextFunction) => {
    // this is used to correlate multiple individual calls
    // thus acting like a session id for logging purposes
    const correlationId = req.header('MeedBankingClub-Correlation-Id') || uuidv4();

    // this is an individual log id for the current call, which can be sent
    // to third party clients which are called as part of this api call.
    // we will send this to axiome as part of the axiom-uuid header.
    const requestId = uuidv4();

    // sending Correlation-Id to client
    req.headers['MeedBankingClub-Correlation-Id'] = correlationId;
    res.set('MeedBankingClub-Correlation-Id', correlationId);
    // now lets set these values so that when we log they will appear as part of the log call
    const context = httpContext.get('loggingContext');
    httpContext.set('loggingContext', { ...context, correlationId, requestId });

    next();
  });

  // this is where the actual logging takes place once a successful message completes
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      const context = MeedUtils.sanitizeLog({
        ...httpContext.get('loggingContext'),
        ...(req.body && Object.keys(req.body).length && { body: req.body }),
        sourceIp: MeedUtils.getIpAddress(),
        remoteHost: req.headers['x-forwarded-for'] || '',
        deployment: config.logging.deployment,
        date: new Date().toISOString()
      });
      // loggingContext is only defined if we reach the controller function
      // loggingContext will not be defined if a validation middleware error is thrown

      // reset apiLogs array to empty array
      MeedAxios.apiLogs = [];

      // checking if loggingcontext has error key bacause if error happen
      // error logger will log that we don't need to log 2 times
      if (!context.isError) {
        logger.info('{}', context);
        // logger.info(JSON.stringify(context), logMeta);
      } else {
        delete context.isError;
        const { errorMessage } = context;
        delete context.errorMessage;
        logger.error(errorMessage, context);
      }
    });
    next();
  });

  // this function does a callback when we set the json body on the response
  // so we can hook up into that process and set the logging context
  router.use((req: Request, res: Response, next: NextFunction): void => {
    const json = res.json;
    res.json = (obj: any): any => {
      httpContext.set('loggingContext', { ...httpContext.get('loggingContext'), ...(obj && { UI_RESPONSE: obj }) });
      json.call(res, obj);
    };
    next();
  });
};
