import { FundRequestData, UpdateFundRequest } from '../validators';
import handleValidation, { ValidationLevel } from '../../../middleware/validator';
import AuthMiddleware from '../../../middleware/authMiddleware';
import { asyncWrapper } from '../../../middleware/asyncWrapper';
import FundRequestController from '../controllers/fundrequests';

export default [
  {
    path: 'v1.0.0/fundrequests',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(FundRequestData),
      asyncWrapper(FundRequestController.createFundRequest)
    ]
  },
  {
    path: 'v1.0.0/fundrequests',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(FundRequestController.getFundRequests)]
  },
  {
    path: 'v1.0.0/fundrequests/:id',
    method: 'patch',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(UpdateFundRequest),
      asyncWrapper(FundRequestController.updateFundRequest)
    ]
  },
  {
    path: 'v1.0.0/fundrequests/:id',
    method: 'delete',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(FundRequestController.removeFundRequest)]
  }
];
