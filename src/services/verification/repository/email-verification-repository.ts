import { BaseRepository } from './repository';
import { IEmailVerification, IEmailVerificationModel, EmailVerificationModel } from '../models/email-verification';

export class EmailVerificationRepository extends BaseRepository<IEmailVerification, IEmailVerificationModel> {
  constructor() {
    super(EmailVerificationModel);
  }

  async findLastInvitationCode(email): Promise<IEmailVerification> {
    return await this.model
      .findOne({ email })
      .sort({ createdDate: -1 })
      .exec();
  }
}
