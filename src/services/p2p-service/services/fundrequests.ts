import uuidv4 from 'uuid/v4';
import { injectable, inject } from 'inversify';
import { IFundRequestService, RequestStatus, IFundRequest } from '../../models/p2p-service/fundrequests';
import { HTTPError } from '../../../utils/httpErrors';
import FundRequestRepository from '../repository/fundrequests';
import config from '../../../config/config';
import { MeedService } from '../../meedservice/service';
import { P2PErrors } from '../errors';
import { IUrbanAirshipService } from '../../models/urban-airship/interface';
import { TYPES } from '../../../utils/ioc/types';

@injectable()
class FundRequestService implements IFundRequestService {
  @inject(TYPES.UrbanAirshipService)
  private uasService: IUrbanAirshipService;

  async createFundRequest(requestData: IFundRequest[]): Promise<IFundRequest[]> {
    try {
      const receiversEmail = [];
      const fundRequests = new Map();
      const fundRequestTemplateIds = config.templateIds.p2pFundRequest;

      requestData = requestData.map(request => {
        receiversEmail.push(request.receiverEmail);
        fundRequests.set(request.receiverEmail, {
          email: request.senderEmail,
          amount: request.amount
        });

        request.requestStatus = RequestStatus.PENDING;
        request.confirmationCode = request.confirmationCode || uuidv4();
        return request;
      });

      const members = await MeedService.getMembersByQuery(
        `email=${[...receiversEmail].join(',')}&fields=-_id,customerId,email,language`
      );

      if (members.length !== [...receiversEmail].length) {
        throw new HTTPError('All Receivers Are Not Valid Member', '2106', 400);
      }

      for (const member of members) {
        const request = fundRequests.get(member.email);

        request.templateId = fundRequestTemplateIds[member.language]
          ? fundRequestTemplateIds[member.language]
          : fundRequestTemplateIds.en_US;
        request.customerId = member.customerId;

        await this.uasService.pushTemplateMessage(request);
      }

      const createdFundRequests = await FundRequestRepository.createFundRequest(requestData);

      return createdFundRequests;
    } catch (err) {
      const { message, errorCode, httpCode } = P2PErrors.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async getFundRequests(memberId: string): Promise<IFundRequest[]> {
    try {
      const { email } = await MeedService.findMemberById(memberId);
      const requests = await FundRequestRepository.findFundRequests(email);
      return requests;
    } catch (err) {
      const { message, errorCode, httpCode } = P2PErrors.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async updateFundRequest(id: string, memberId: string, updateData: IFundRequest): Promise<IFundRequest> {
    try {
      const { email } = await MeedService.findMemberById(memberId);
      const query: IFundRequest = {};

      if (updateData.requestStatus === RequestStatus.CANCELLED) {
        query.senderEmail = email;
      } else if (updateData.requestStatus === RequestStatus.DECLINED) {
        query.receiverEmail = email;
      }

      const requests = await FundRequestRepository.updateFundRequest(id, query, updateData);
      return requests;
    } catch (err) {
      const { message, errorCode, httpCode } = P2PErrors.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async removeFundRequest(id: string, memberId: string): Promise<IFundRequest> {
    try {
      const { email } = await MeedService.findMemberById(memberId);
      const request = await FundRequestRepository.removeFundRequest(id, email);
      return request;
    } catch (err) {
      const { message, errorCode, httpCode } = P2PErrors.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async findFundRequest(query: IFundRequest): Promise<IFundRequest> {
    try {
      const request = await FundRequestRepository.findOne(query);
      return request;
    } catch (err) {
      const { message, errorCode, httpCode } = P2PErrors.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export default FundRequestService;
