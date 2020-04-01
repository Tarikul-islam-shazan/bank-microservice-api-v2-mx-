import { BaseRepository } from './repository';
import { IP2PTransfer } from '../../models/p2p-service/interface';
import { P2PTransferModel } from '../models/p2ptransfers';

export class P2PTransferRepository extends BaseRepository<IP2PTransfer, P2PTransferModel> {
  constructor() {
    super(P2PTransferModel);
  }

  async createTransfer(transferData: IP2PTransfer): Promise<IP2PTransfer> {
    const transfer = await this.create({
      senderEmail: transferData.senderEmail,
      receiverEmail: transferData.receiverEmail,
      amount: transferData.amount,
      message: transferData.message,
      transferType: transferData.transferType,
      confirmationCode: transferData.confirmationCode
    });
    return transfer;
  }
}
