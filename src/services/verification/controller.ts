import { Request, Response } from 'express';
import { VerificationService } from './service';
import { SendGrid, ISendGridTemplate } from '../../utils/sendgrid/sendGridHelper';
import config from '../../config/config';

export class VerificationController {
  public static async createVerificationCode(req: Request, res: Response): Promise<any> {
    const { email } = req.body;
    const response = await VerificationService.createVerificationCode(email);

    const emailConfig = SendGrid.getConfigByLanguage(); // TODO: pass language as inviter.language
    const emailTemplate: ISendGridTemplate = {
      receiver: email,
      sender: emailConfig.templates.Verification.sender,
      templateId: emailConfig.templates.Verification.id,
      groupID: emailConfig.templates.Verification.groupID,
      templateData: {
        CODE: response.verificationCode
      }
    };
    await SendGrid.sendWithTemplate(emailTemplate);
    res.status(204).json();
  }

  public static async verifyEmailCode(req: Request, res: Response) {
    const { email, verificationCode } = req.body;
    const response = await VerificationService.verifyEmailCode(email, verificationCode);
    res.status(200).json(response);
  }
}
