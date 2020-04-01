import { asyncWrapper } from '../../middleware/asyncWrapper';
import JumioServiceController from './controller';

export default [
  {
    path: 'v1.0.0/jumio-web-initiate',
    method: 'post',
    handler: [asyncWrapper(JumioServiceController.webInitiate)]
  },
  {
    path: 'v1.0.0/jumio-verification/:identifier/:memberId',
    method: 'post',
    handler: [asyncWrapper(JumioServiceController.verification)]
  },
  {
    path: 'v1.0.0/jumio-retrieving-details',
    method: 'get',
    handler: [asyncWrapper(JumioServiceController.retrieveDetails)]
  }
];
