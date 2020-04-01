import { BaseRepository } from './repository';
import { IFundRequest, RequestStatus } from '../../models/p2p-service/fundrequests';
import { FundRequestModel } from '../models/fundrequests';

class FundRequestRepository extends BaseRepository<IFundRequest, FundRequestModel> {
  constructor() {
    super(FundRequestModel);
  }

  async createFundRequest(requests: IFundRequest[]): Promise<IFundRequest[]> {
    const fundRequests = await this.model.create(requests);
    return fundRequests;
  }

  async findFundRequests(memberEmail: string): Promise<IFundRequest[]> {
    const requests = await this.find(
      {
        $or: [{ senderEmail: memberEmail }, { receiverEmail: memberEmail }],
        requestStatus: RequestStatus.PENDING
      },
      null,
      null,
      { updatedAt: -1 }
    );

    return requests;
  }

  async updateFundRequest(id: string, query: IFundRequest, updateData: IFundRequest): Promise<IFundRequest> {
    const updatedRequest = await this.findOneAndUpdate({ _id: id, ...query }, updateData, { new: true });
    return updatedRequest;
  }

  async removeFundRequest(id: string, senderEmail: string): Promise<IFundRequest> {
    const removedRequest = await this.model.findOneAndRemove({ _id: id, senderEmail });
    return removedRequest;
  }
}

export default new FundRequestRepository();
