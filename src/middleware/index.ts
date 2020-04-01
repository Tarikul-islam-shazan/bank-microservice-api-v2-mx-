import {
  handleCors,
  handleBodyRequestParsing,
  handleCookieParsing,
  handleCompression,
  addBankIdToRequest,
  loggingMiddleware
} from './common';

export default [
  loggingMiddleware,
  handleCors,
  handleBodyRequestParsing,
  handleCookieParsing,
  handleCompression,
  addBankIdToRequest
];
