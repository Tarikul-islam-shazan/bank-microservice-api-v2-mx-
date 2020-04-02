import { injectable, named, inject } from 'inversify';
import { IContact, IPayContact, ContactType } from '../../models/p2p-service/contacts';
import { IAuthorization } from '../../bank-auth/models/interface';
import { BankIdentifier } from '../../../interfaces/MeedRequest';
import { TYPES } from '../../../utils/ioc/types';
import RequestMapper from '../mappers/request-mapper';
import { MeedAxios } from '../../../utils/api';
import ResponseMapper from '../mappers/response-mapper';
import { P2PErrors } from '../errors';
import { HTTPError } from '../../../utils/httpErrors';
import config from '../../../config/config';
import { IBankService } from '../../models/shared/interface';
import { ContactRepository } from '../repository/contacts';

@injectable()
export abstract class ContactService implements IBankService {
  public auth: IAuthorization;
  public contactRepository = new ContactRepository();

  public abstract setAuthorizationService(authService: IAuthorization): void;
  public abstract getAuthorizationService(): IAuthorization;
  public abstract addContact(contactData: IContact): Promise<IContact>;
  public abstract getContacts(memberId: string): Promise<IContact[]>;
  public abstract updateContact(id: string, contactType: string, updateData: IContact): Promise<IContact>;
  public abstract deleteContact(id: string, contactType: string): Promise<IContact>;

  constructor(injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public async getMeedContacts(memberId: string): Promise<IContact[]> {
    const meedContacts = await this.contactRepository.getContacts(memberId);
    return meedContacts;
  }
}

@injectable()
class AxContactService extends ContactService {
  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    super(injectedAuth);
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  async addContact(contactData: IPayContact): Promise<IPayContact> {
    try {
      const headers = await this.auth.getBankHeaders();
      const iPayMappedData = RequestMapper.ipayContactMapper(contactData);
      const iPayContactResponse = await MeedAxios.getAxiosInstance().post(
        `/createP2PTransfer/${config.api.axxiome.version}/p2p/payees`,
        iPayMappedData,
        headers
      );
      const iPayContact = ResponseMapper.iPayContactResponseMapper(iPayContactResponse);
      return iPayContact;
    } catch (err) {
      const error = P2PErrors.extractError(err);
      if (error.otpID) {
        return error;
      }
      throw new HTTPError(error.message, error.errorCode, error.httpCode);
    }
  }

  async getContacts(memberId: string): Promise<IPayContact[]> {
    try {
      const meedContacts: IContact[] = await this.getMeedContacts(memberId);
      const headers = await this.auth.getBankHeaders();
      const iPayContactsResponse = await MeedAxios.getAxiosInstance().get(
        `/createP2PTransfer/${config.api.axxiome.version}/p2p/payees`,
        headers
      );
      const iPayMappedContacts = ResponseMapper.iPayContactsMapper(iPayContactsResponse);
      return [...meedContacts, ...iPayMappedContacts];
    } catch (err) {
      const { message, errorCode, httpCode } = P2PErrors.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async updateContact(id: string, contactType: string, updateData: IPayContact): Promise<IPayContact> {
    try {
      if (contactType?.toUpperCase() === ContactType.MEED) {
        const updated = await this.contactRepository.updateContact(id, updateData);
        return updated;
      }

      const headers = await this.auth.getBankHeaders();
      const contactMappedData = RequestMapper.ipayContactMapper({
        nickName: updateData.nickName,
        email: updateData.email
      });
      await MeedAxios.getAxiosInstance().put(
        `/createP2PTransfer/${config.api.axxiome.version}/p2p/payees/${id}`,
        contactMappedData,
        headers
      );
      return updateData;
    } catch (err) {
      const { message, errorCode, httpCode } = P2PErrors.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async deleteContact(id: string, contactType: string): Promise<IPayContact> {
    try {
      if (contactType?.toUpperCase() === ContactType.MEED) {
        const deleted = await this.contactRepository.deleteContact(id);
        return deleted;
      }

      const headers = await this.auth.getBankHeaders();
      await MeedAxios.getAxiosInstance().delete(
        `/createP2PTransfer/${config.api.axxiome.version}/p2p/payees/${id}`,
        headers
      );
      return { customerId: id };
    } catch (err) {
      const { message, errorCode, httpCode } = P2PErrors.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export default AxContactService;
