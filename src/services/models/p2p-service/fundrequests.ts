export interface IFundRequestService {
  createFundRequest(requestData: IFundRequest[]): Promise<IFundRequest[]>;
  getFundRequests(memberId: string): Promise<IFundRequest[]>;
  updateFundRequest(id: string, memberId: string, updateData: IFundRequest): Promise<IFundRequest>;
  findFundRequest(query: IFundRequest): Promise<IFundRequest>;
  removeFundRequest(id: string, memberId: string): Promise<IFundRequest>;
}

export interface IFundRequest {
  senderEmail?: string;
  receiverEmail?: string;
  amount?: number;
  message?: string;
  confirmationCode?: string;
  requestStatus?: RequestStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  DECLINED = 'DECLINED'
}
