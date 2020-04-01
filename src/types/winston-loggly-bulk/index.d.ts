declare module 'winston-loggly-bulk' {
  import * as winston from 'winston';
  import * as Transport from 'winston-transport';

  interface LogglyTransportOptions {
    token?: string;
    level?: string;
    subdomain?: string;
    auth?: {
      username: string;
      password: string;
    };
    inputName?: string;
    inputToken?: string;
    json?: boolean;
    tags?: string[];
    isBulk?: boolean;
    stripColors?: boolean;
    bufferOptions?: {
      size?: number;
      retriesInMilliSeconds?: number;
    };
    timestamp?: boolean;
    networkErrorsOnConsole?: boolean;
  }

  interface LogglyTransportInstance extends Transport {
    new (options?: LogglyTransportOptions): LogglyTransportInstance;
  }
  const Loggly: LogglyTransportInstance;
  const flushLogsAndExit: () => void;
}
