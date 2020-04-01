import AuthMiddleware from '../../../middleware/authMiddleware';
import { asyncWrapper } from '../../../middleware/asyncWrapper';
import handleValidation from '../../../middleware/validator';
import ContactServiceController from '../controllers/contacts';
import { UpdateContact } from '../validators/contacts';

export default [
  {
    path: 'v1.0.0/contacts',
    method: 'post',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(ContactServiceController.addContact)]
  },
  {
    path: 'v1.0.0/contacts',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(ContactServiceController.getContacts)]
  },
  {
    path: 'v1.0.0/contacts/:id',
    method: 'patch',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(UpdateContact),
      asyncWrapper(ContactServiceController.updateContact)
    ]
  },
  {
    path: 'v1.0.0/contacts/:id',
    method: 'delete',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(ContactServiceController.deleteContact)]
  }
];
