import { injectable, inject, named } from 'inversify';
import {
  ICustomerService,
  Customer,
  ContactPreference,
  OtpResponse,
  IPrivacyAndLegalDocument
} from '../models/customer-service/interface';
import { HTTPError } from '../../utils/httpErrors';
import { AxxiomeRequestDTO, AxxiomeResponseDTO } from './mappers';
import { MeedAxios } from '../../utils/api';
import { IAuthorization } from '../bank-auth/models/interface';
import { AxCustomerErrMapper, AxErrorCodes } from './errors';
import { MeedService } from './../meedservice/service';
import { BankIdentifier } from './../../interfaces/MeedRequest';
import { SendGrid, ISendGridTemplate } from '../../utils/sendgrid/sendGridHelper';
import { TYPES } from '../../utils/ioc/types';
import { UrbanAirshipService } from './../urban-airship-service/service';
import config from '../../config/config';
import { ErrorMapper } from '../../utils/error-mapper/errorMapper';

@injectable()
export class AxCustomerService implements ICustomerService {
  private auth: IAuthorization;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Axiomme) injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  async customerInfo(memberId): Promise<Customer> {
    const headers = await this.auth.getBankHeaders();
    try {
      const member = await MeedService.findMemberById(memberId);
      const response = await MeedAxios.getAxiosInstance().get(
        `/customerUpdate/${config.api.axxiome.version}/customer`,
        headers
      );
      response.data.nickname = member.nickname ? member.nickname : '';
      return AxxiomeResponseDTO.getCustomerInfo(response.data);
    } catch (error) {
      const { message, errorCode, httpCode } = AxErrorCodes.UNABLE_TO_FIND_CUSTOMER;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async updateContactPreference(req: any): Promise<OtpResponse | ContactPreference> {
    const headers = await this.auth.getBankHeaders();
    const request = req;
    return await this.changeContactPreference(request, headers);
  }

  async updateCustomerInfo(
    req: Customer,
    files: any,
    memberId: string,
    customerId: string
  ): Promise<OtpResponse | Customer> {
    const headers = await this.auth.getBankHeaders();
    const request = req;

    if (request.email && !request.firstName) {
      return await this.changeEmail(request, memberId, customerId, headers);
    } else if (request.address) {
      return await this.changeAddress(request, headers);
    } else if (request.mobilePhone) {
      return await this.changeContactNumber(request, headers);
    } else if (request.salutation) {
      return await this.changeName(request, files, headers);
    } else if (request.nickname) {
      return await this.changeNickName(request, memberId);
    } else {
      const { message, errorCode, httpCode } = AxErrorCodes.UNABLE_TO_FIND_CUSTOMER;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async changeNickName(req: Customer, memberId: string): Promise<OtpResponse | Customer> {
    const memberUpdateReq = {
      id: memberId,
      nickname: req.nickname
    };
    const updatedMember = await MeedService.updateMember(memberUpdateReq);
    return AxxiomeResponseDTO.changeNickName(updatedMember);
  }

  async changeEmail(
    req: Customer,
    memberId: string,
    customerId: string,
    headers: any
  ): Promise<OtpResponse | Customer> {
    const member = await MeedService.findMemberByEmail(req.email);
    if (member) {
      const { errorCode, message, httpCode } = AxErrorCodes.ALREADY_EXIST_MEMBER;
      throw new HTTPError(message, errorCode, httpCode);
    }

    try {
      const bankApiBody = AxxiomeRequestDTO.changeEmailReq(req);
      const response = await MeedAxios.getAxiosInstance().put(
        `/customerUpdate/${config.api.axxiome.version}/customer/email`,
        { ...bankApiBody },
        headers
      );

      // update meed local database
      await MeedService.updateEmail(memberId, req.email);

      try {
        // TODO: currently checking if email associated with urban airship, if not then throw
        // need to decide to ignore it or not
        const urbanAirship = new UrbanAirshipService();
        const lookUp = await urbanAirship.uasNamedUserLookup(customerId);
        // update urban airship
        await urbanAirship.uasUpdateEmailChannel({
          channelID: lookUp.channelId,
          type: 'email',
          address: req.email
        });
      } catch (err) {
        // UPDATE: Ignoring Error intentionaly
        // have to handle the error if need in future
      }

      return AxxiomeResponseDTO.changeEmailResponse(response.data);
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const errorResponse = AxCustomerErrMapper.additionalOTPResponse(error);
      if (errorResponse.httpCode === 403) {
        return AxxiomeResponseDTO.getotpRequest(errorResponse);
      }
      throw new HTTPError(errorResponse.message, errorResponse.errorCode, errorResponse.httpCode);
    }
  }

  async changeAddress(req: Customer, headers: any): Promise<OtpResponse | Customer> {
    try {
      const apiBody = AxxiomeRequestDTO.changeAddressReq(req);
      const response = await MeedAxios.getAxiosInstance().put(
        `/customerUpdate/${config.api.axxiome.version}/customer/address`,
        { ...apiBody },
        headers
      );
      return AxxiomeResponseDTO.changeContactAddressResponse(response.data);
    } catch (error) {
      const errorResponse = AxCustomerErrMapper.additionalOTPResponse(error);
      if (errorResponse.httpCode === 403) {
        return AxxiomeResponseDTO.getotpRequest(errorResponse);
      }
      throw new HTTPError(errorResponse.message, errorResponse.errorCode, errorResponse.httpCode);
    }
  }

  async changeContactNumber(req: Customer, headers: any): Promise<OtpResponse | Customer> {
    try {
      const apiBody = AxxiomeRequestDTO.changeContactNumberReq(req);
      const response = await MeedAxios.getAxiosInstance().put(
        `/customerUpdate/${config.api.axxiome.version}/customer/communicationdata`,
        { ...apiBody },
        headers
      );
      return AxxiomeResponseDTO.changeContactNuberResponse(response.data);
    } catch (error) {
      const errorResponse = AxCustomerErrMapper.additionalOTPResponse(error);
      if (errorResponse.httpCode === 403) {
        return AxxiomeResponseDTO.getotpRequest(errorResponse);
      }
      throw new HTTPError(errorResponse.message, errorResponse.errorCode, errorResponse.httpCode);
    }
  }

  async changeContactPreference(req: ContactPreference, headers: any): Promise<OtpResponse | ContactPreference> {
    try {
      const apiBody = AxxiomeRequestDTO.changeContactPreferenceReq(req);
      const response = await MeedAxios.getAxiosInstance().put(
        `/customerUpdate/${config.api.axxiome.version}/customer/contactpreferences`,
        { ...apiBody },
        headers
      );
      return AxxiomeResponseDTO.changeContactPreferenceResponse(response.data);
    } catch (error) {
      const errorResponse = AxCustomerErrMapper.additionalOTPResponse(error);
      if (errorResponse.httpCode === 403) {
        return AxxiomeResponseDTO.getotpRequest(errorResponse);
      }
      throw new HTTPError(errorResponse.message, errorResponse.errorCode, errorResponse.httpCode);
    }
  }

  async changeName(req: Customer, files: any, headers: any): Promise<Customer> {
    try {
      const apiBody = AxxiomeRequestDTO.changeNameReq(req);
      const response = await MeedAxios.getAxiosInstance().put(
        `/customerUpdate/${config.api.axxiome.version}/customer/masterdata`,
        { ...apiBody },
        headers
      );

      await this.changeNameDocumentsUpload(req, files);
      return AxxiomeResponseDTO.changeCustomerName(response.data);
    } catch (error) {
      const errorResponse = AxCustomerErrMapper.additionalOTPResponse(error);
      if (errorResponse.httpCode === 403) {
        return AxxiomeResponseDTO.getotpRequest(errorResponse);
      }
      throw new HTTPError(errorResponse.message, errorResponse.errorCode, errorResponse.httpCode);
    }
  }

  async changeNameDocumentsUpload(req: Customer, files: any) {
    const request: Customer = req;
    const emailConfig = SendGrid.getConfigByLanguage();

    const email: ISendGridTemplate = {
      sender: emailConfig.templates.Name_Change.sender,
      receiver: request.email
    };

    const templateData: any = {
      YEAR: new Date().getFullYear(),
      CURRENT_NAME: request.oldName,
      NEW_NAME: request.firstName + ' ' + request.middleName + ' ' + request.lastName,
      EMAIL_ADDRESS: request.email,
      REASON_FOR_CHANGE: request.reason,
      REQUIRED_DOCUMENT: request.requiredDocument
    };

    const attachFiles = [];
    if (files.frontIdImage) {
      const fileBase64 = files.frontIdImage[0].buffer.toString('base64');
      attachFiles.push({
        content: fileBase64,
        filename: files.frontIdImage[0].originalname,
        content_id: 'name_change_request_file',
        disposition: 'attachment',
        type: 'image/png'
      });
    }
    if (files.backIdImage) {
      const fileBase64 = files.backIdImage[0].buffer.toString('base64');
      attachFiles.push({
        content: fileBase64,
        filename: files.backIdImage[0].originalname,
        content_id: 'name_change_request_file',
        disposition: 'attachment',
        type: 'image/png'
      });
    }
    if (files.documentImage) {
      const fileBase64 = files.documentImage[0].buffer.toString('base64');
      attachFiles.push({
        content: fileBase64,
        filename: files.documentImage[0].originalname,
        content_id: 'name_change_request_file',
        disposition: 'attachment',
        type: 'image/png'
      });
    }

    email.attachments = attachFiles;

    email.templateId = emailConfig.templates.Name_Change.id;
    email.groupID = emailConfig.templates.Name_Change.groupID;

    email.templateData = templateData;
    const emailResponse = await SendGrid.sendWithTemplate(email);
    return emailResponse;
  }

  /**
   * @returns {Promise<any>}
   * @memberof AxCustomerService
   */
  async getContactPreference(): Promise<ContactPreference> {
    const headers = await this.auth.getBankHeaders();
    try {
      const response = await MeedAxios.getAxiosInstance().get(
        `/customerUpdate/${config.api.axxiome.version}/customer`,
        headers
      );
      return AxxiomeResponseDTO.getContactPreferenceResponse(response.data);
    } catch (error) {
      const { message, errorCode, httpCode } = AxErrorCodes.UNABLE_TO_FIND_CUSTOMER;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async getPrivacyAndLegal(): Promise<IPrivacyAndLegalDocument[]> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/accountOrigination/2.3.0/originations/products/agreement`,
        headers
      );
      const documents = AxxiomeResponseDTO.privacyAndLegalResponseMapper(response);
      return documents;
    } catch (err) {
      const { message, errorCode, httpCode } = ErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}
