// import {
//   ImmediateTransferStrategy,
//   ScheduledTransferStrategy,
//   RecurringTransferStrategy
// } from '../strategy/ax-strategy';
// import { TransferType, ITransferStrategy } from './../../models/internal-transfer/interface';
// import { AxxiomeTransferService, TransferService } from '../ax-service';
// import { IAuthorization } from '../../bank-auth/models/interface';
// import { ServiceFactory as BankAuthFactory } from '../../bank-auth/factory/factory';
// import { BankIdentifier, MeedRequest } from '../../../interfaces/MeedRequest';

// export class TransferServiceFactory {
//   private static axTransferService = new AxxiomeTransferService(null);

//   /**
//    * Returns a transfer service instance if it already exists, if not it will create it one time and save it
//    * to use later. The auth module must be set on the service instance each time, since it used
//    * by different transfer strategies to get headers and auth information.
//    *
//    * @static
//    * @param {Request} req
//    * @returns {TransferService}
//    * @memberof TransferServiceFactory
//    */
//   public static getTransferService(identifier: BankIdentifier): TransferService {
//     if (identifier === BankIdentifier.Axiomme) {
//       return TransferServiceFactory.axTransferService;
//     } else {
//       this.axTransferService = new AxxiomeTransferService(null);
//       return TransferServiceFactory.axTransferService;
//     }
//   }

//   /**
//    * Returns a transfer strategy based on the transfer type. Currently, that is immediate, recurring or scheduled only.
//    *
//    * @static
//    * @param {Request} req
//    * @param {TransferType} transferType
//    * @returns {ITransferStrategy}
//    * @memberof TransferServiceFactory
//    */
//   public static getStrategy(identifier: BankIdentifier, transferType: TransferType): ITransferStrategy {
//     let strategy: ITransferStrategy;
//     if (identifier === BankIdentifier.Axiomme) {
//       if (transferType === TransferType.Immediate) {
//         strategy = new ImmediateTransferStrategy();
//       } else if (transferType === TransferType.Scheduled) {
//         strategy = new ScheduledTransferStrategy();
//       } else {
//         strategy = new RecurringTransferStrategy();
//       }
//     } else {
//       if (transferType === TransferType.Immediate) {
//         strategy = new ImmediateTransferStrategy();
//       } else if (transferType === TransferType.Recurring) {
//         strategy = new ScheduledTransferStrategy();
//       } else {
//         strategy = new RecurringTransferStrategy();
//       }
//     }

//     return strategy;
//   }
// }
