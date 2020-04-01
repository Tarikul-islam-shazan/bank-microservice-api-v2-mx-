import AuthMiddleware from '../../middleware/authMiddleware';
import { asyncWrapper } from '../../middleware/asyncWrapper';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import BillPayController from './controller';
import { payeeHeaders, addPayee, editPayee, ebillHeaders, createPayment, editPayment, billerToken } from './validators';

export default [
  //#region Payee
  {
    path: 'v1.0.0/bill-pay/payees',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(payeeHeaders, ValidationLevel.Headers),
      handleValidation(addPayee, ValidationLevel.Body),
      asyncWrapper(BillPayController.addPayee)
    ]
  },
  {
    path: 'v1.0.0/bill-pay/payees',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(payeeHeaders, ValidationLevel.Headers),
      asyncWrapper(BillPayController.getPayeeList)
    ]
  },
  {
    path: 'v1.0.0/bill-pay/payees/:id',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(payeeHeaders, ValidationLevel.Headers),
      asyncWrapper(BillPayController.getPayee)
    ]
  },
  {
    path: 'v1.0.0/bill-pay/payees/:id',
    method: 'put',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(payeeHeaders, ValidationLevel.Headers),
      handleValidation(editPayee, ValidationLevel.Body),
      asyncWrapper(BillPayController.editPayee)
    ]
  },
  {
    path: 'v1.0.0/bill-pay/payees/:id',
    method: 'delete',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(payeeHeaders, ValidationLevel.Headers),
      asyncWrapper(BillPayController.deletePayee)
    ]
  },
  //#endregion
  //#region Payment
  {
    path: 'v1.0.0/bill-pay/payments',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(ebillHeaders, ValidationLevel.Headers),
      handleValidation(createPayment, ValidationLevel.Body),
      asyncWrapper(BillPayController.createPayment)
    ]
  },
  {
    path: 'v1.0.0/bill-pay/payments',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(ebillHeaders, ValidationLevel.Headers),
      asyncWrapper(BillPayController.getPayments)
    ]
  },
  {
    path: 'v1.0.0/bill-pay/payments/:id',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(ebillHeaders, ValidationLevel.Headers),
      asyncWrapper(BillPayController.getPayment)
    ]
  },
  {
    path: 'v1.0.0/bill-pay/payments/:id',
    method: 'patch',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(ebillHeaders, ValidationLevel.Headers),
      handleValidation(editPayment, ValidationLevel.Body),
      asyncWrapper(BillPayController.editPayment)
    ]
  },
  {
    path: 'v1.0.0/bill-pay/payments/:id',
    method: 'delete',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(ebillHeaders, ValidationLevel.Headers),
      asyncWrapper(BillPayController.deletePayment)
    ]
  },
  //#endregion
  //#region eBill
  {
    path: 'v1.0.0/bill-pay/ebills',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(ebillHeaders, ValidationLevel.Headers),
      asyncWrapper(BillPayController.getEBills)
    ]
  },
  //#endregion
  //#region Token
  {
    path: 'v1.0.0/bill-pay/token',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(ebillHeaders, ValidationLevel.Headers),
      handleValidation(billerToken, ValidationLevel.Body),
      asyncWrapper(BillPayController.createToken)
    ]
  }
  //#endregion
];
