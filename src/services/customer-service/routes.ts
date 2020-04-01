import { asyncWrapper } from '../../middleware/asyncWrapper';
import { CustomerServiceController } from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';
import multer from 'multer';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import {
  UpdateCustomer,
  UpdateContactPreference,
  MemberId,
  updateCustomerHeaders,
  updateContactHeaders,
  privacyAndLegalHeaders
} from './validators';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: 'frontIdImage', maxCount: 1 },
  { name: 'backIdImage', maxCount: 1 },
  { name: 'documentImage', maxCount: 1 }
]);
export default [
  {
    path: 'v1.0.0/customer',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(MemberId, ValidationLevel.Headers),
      asyncWrapper(CustomerServiceController.customerInfo)
    ]
  },
  {
    path: 'v1.0.0/customer',
    method: 'put',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      uploadFields,
      handleValidation(updateCustomerHeaders, ValidationLevel.Headers),
      handleValidation(UpdateCustomer),
      asyncWrapper(CustomerServiceController.updateCustomerInfo)
    ]
  },
  {
    path: 'v1.0.0/customer/contact-preference',
    method: 'put',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(updateContactHeaders, ValidationLevel.Headers),
      handleValidation(UpdateContactPreference),
      asyncWrapper(CustomerServiceController.updateContactPreference)
    ]
  },
  {
    path: 'v1.0.0/customer/contact-preference',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(CustomerServiceController.getContactPreference)]
  },
  {
    path: 'v1.0.0/privacy-and-legal',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(privacyAndLegalHeaders, ValidationLevel.Headers),
      asyncWrapper(CustomerServiceController.getPrivacyAndLegal)
    ]
  }
];
