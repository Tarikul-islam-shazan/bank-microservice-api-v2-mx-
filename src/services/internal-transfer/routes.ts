import { asyncWrapper } from '../../middleware/asyncWrapper';
import handleValidation, { ValidationLevel } from '../../middleware/validator';

import { Transfer, UpdateTransfer, DeleteTransfer } from './validators/transferVerification';
import { TransferController } from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';

export default [
  {
    path: 'v1.0.0/bank/internal-transfer',
    method: 'post',
    handler: [AuthMiddleware.isBankAuthenticated, handleValidation(Transfer), asyncWrapper(TransferController.transfer)]
  },
  {
    path: 'v1.0.0/bank/internal-transfer',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(TransferController.getTransfers)]
  },
  {
    path: 'v1.0.0/bank/internal-transfer',
    method: 'patch',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(UpdateTransfer),
      asyncWrapper(TransferController.modifyTransfer)
    ]
  },
  {
    path: 'v1.0.0/bank/internal-transfer',
    method: 'delete',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(DeleteTransfer, ValidationLevel.Query),
      asyncWrapper(TransferController.deleteTransfer)
    ]
  }
];
