import 'reflect-metadata';
import { Container } from 'inversify';

import { TransferType } from '../../services/models/internal-transfer/interface';
import {
  ImmediateTransferStrategy,
  ScheduledTransferStrategy,
  RecurringTransferStrategy
} from './../../services/internal-transfer/strategy/ax-strategy';

import { ICustomerService } from '../../services/models/customer-service/interface';
import { AxCustomerService } from './../../services/customer-service/ax-service';
import { IAccountService } from '../../services/models/account-service/interface';
import { IBankCredentialService } from '../../services/models/bank-credentials-service/interface';
import { IBankLoginService } from '../../services/models/bank-login-service/interface';
import { AxiommeAuthorization } from './../../services/bank-auth/factory/ax-auth';
import { IAuthorization } from './../../services/bank-auth/models/interface';
import { BankIdentifier } from '../../interfaces/MeedRequest';
import { IOnboardingService } from '../../services/models/bank-onboarding/interface';
import { IvxOnboardingService } from './../../services/bank-onboarding/ax-service';

import { TYPES } from './types';
import { AxBankLoginService } from '../../services/bank-login-service/service';
import BankCredentialService from '../../services/bank-credential-service/service';
import { AccountService } from '../../services/account-service/ax-service';
import { ITransferStrategy } from '../../services/models/internal-transfer/interface';
import { TransferService, AxxiomeTransferService } from '../../services/internal-transfer/ax-service';
import { ICardService } from '../../services/models/card-service';
import AxxiomeCardService from '../../services/card-service/ax-service';
import { AxxiomeDepositService } from './../../services/deposit-service/ax-service';
import { IDepositService } from './../../services/models/deposit-service/interface';
import JumioService from '../../services/jumio-service/service';
import { IJumioService } from '../../services/models/jumio-service/interface';
import { P2PTransferType, IP2PTransferStrategy } from '../../services/models/p2p-service/interface';
import AxContactService, { ContactService } from '../../services/p2p-service/services/contacts';
import { IFundRequestService } from '../../services/models/p2p-service/fundrequests';
import FundRequestService from '../../services/p2p-service/services/fundrequests';
import {
  InternalP2PTransferStrategy,
  ExternalP2PTransferStrategy
} from '../../services/p2p-service/strategy/ax-strategy';
import { AxP2PTransferService, P2PTransferService } from '../../services/p2p-service/ax-service';
import { BillPayService, AxBillPayService } from '../../services/bill-pay-service/ax-service';
import { BillPayProvider, IBillPayStrategy } from '../../services/models/bill-pay/interface';
import { AxQ2Strategy } from '../../services/bill-pay-service/strategy/ax/ax-q2-strategy';
import { AxIpayStrategy } from '../../services/bill-pay-service/strategy/ax/ax-ipay-strategy';
import { AxPromotionService } from '../../services/promotion-service/ax-service';
import { IPromotionService } from '../../services/models/promotion-service/interface';
import { IUrbanAirshipService } from '../../services/models/urban-airship/interface';
import { UrbanAirshipService } from '../../services/urban-airship-service/service';

const DIContainer = new Container();

// Axiomme Mappings
DIContainer.bind<IOnboardingService>(TYPES.BankOnboarding)
  .to(IvxOnboardingService)
  .whenTargetNamed(BankIdentifier.Invex);

DIContainer.bind<IAuthorization>(TYPES.AxBankAuthorization)
  .to(AxiommeAuthorization)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<IBankLoginService>(TYPES.AxBankLoginService)
  .to(AxBankLoginService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<IBankCredentialService>(TYPES.AxBankCredentials)
  .to(BankCredentialService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<IAccountService>(TYPES.AxAccountService)
  .to(AccountService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<ICustomerService>(TYPES.CustomerService)
  .to(AxCustomerService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<TransferService>(TYPES.AxTransferService)
  .to(AxxiomeTransferService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<ITransferStrategy>(TYPES.AxTransferStrategy)
  .to(ImmediateTransferStrategy)
  .whenTargetTagged(BankIdentifier.Axiomme, TransferType.Immediate);

DIContainer.bind<ITransferStrategy>(TYPES.AxTransferStrategy)
  .to(ScheduledTransferStrategy)
  .whenTargetTagged(BankIdentifier.Axiomme, TransferType.Scheduled);

DIContainer.bind<ITransferStrategy>(TYPES.AxTransferStrategy)
  .to(RecurringTransferStrategy)
  .whenTargetTagged(BankIdentifier.Axiomme, TransferType.Recurring);

DIContainer.bind<ICardService>(TYPES.AxBankCardService)
  .to(AxxiomeCardService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<IDepositService>(TYPES.AxBankDepositService)
  .to(AxxiomeDepositService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<IJumioService>(TYPES.JumioService)
  .to(JumioService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<P2PTransferService>(TYPES.P2PTransferService)
  .to(AxP2PTransferService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<IP2PTransferStrategy>(TYPES.P2PTransferStrategy)
  .to(InternalP2PTransferStrategy)
  .whenTargetTagged(BankIdentifier.Axiomme, P2PTransferType.INTERNAL);

DIContainer.bind<IP2PTransferStrategy>(TYPES.P2PTransferStrategy)
  .to(ExternalP2PTransferStrategy)
  .whenTargetTagged(BankIdentifier.Axiomme, P2PTransferType.EXTERNAL);

DIContainer.bind<ContactService>(TYPES.ContactService)
  .to(AxContactService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<IFundRequestService>(TYPES.FundRequestService)
  .to(FundRequestService)
  .whenTargetNamed(BankIdentifier.Axiomme);

//#region BillPay
DIContainer.bind<BillPayService>(TYPES.BillPayService)
  .to(AxBillPayService)
  .whenTargetTagged(BankIdentifier.Axiomme, BillPayProvider.IPAY);

DIContainer.bind<BillPayService>(TYPES.BillPayService)
  .to(AxBillPayService)
  .whenTargetTagged(BankIdentifier.Axiomme, BillPayProvider.Q2);

DIContainer.bind<IBillPayStrategy>(TYPES.BillPayStrategy)
  .to(AxIpayStrategy)
  .whenParentTagged(BankIdentifier.Axiomme, BillPayProvider.IPAY);

DIContainer.bind<IBillPayStrategy>(TYPES.BillPayStrategy)
  .to(AxQ2Strategy)
  .whenParentTagged(BankIdentifier.Axiomme, BillPayProvider.Q2);
//#endregion

DIContainer.bind<IPromotionService>(TYPES.PromotionService)
  .to(AxPromotionService)
  .whenTargetNamed(BankIdentifier.Axiomme);

DIContainer.bind<IUrbanAirshipService>(TYPES.UrbanAirshipService).to(UrbanAirshipService);

export default DIContainer;
