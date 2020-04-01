const Client = require('@sendgrid/client');
import config from '../../config/config';
import SendGridMapper from './mappers/sendgrid-mapper';

Client.setApiKey(config.sendgrid.apiKey);

export interface ISendGridDefault {
  sender: string;
  senderName?: string;
  receiver: string | string[];
  attachments?: object[];
}

// TODO: need to check the type of every element in here
export interface ISendGrid extends ISendGridDefault {
  subject: string;
  content: string;
  contentType?: string;
  delayTime?: string;
  cc_email?: string[];
}

export interface ISendGridTemplate extends ISendGridDefault {
  templateData?: object;
  templateId?: string;
  groupID?: number;
  subscribeLink?: string;
}

export class SendGrid {
  public static async send(email: ISendGrid): Promise<any> {
    const mailBody: any = SendGridMapper.bodyDTO(email);
    const response = await Client.request({
      method: 'POST',
      url: '/v3/mail/send',
      body: mailBody
    });
    return response;
  }

  public static async sendWithTemplate(email: ISendGridTemplate): Promise<any> {
    const mailBody: any = SendGridMapper.bodyWithTemplateDTO(email, config.sendgrid.groupsToDisplay);
    const response = await Client.request({
      method: 'POST',
      url: '/v3/mail/send',
      body: mailBody
    });
    return response;
  }

  public static getConfigByLanguage(language: string = config.sendgrid.defaultLanguage): any {
    let _emailConfig = config.sendgrid.emails.find(email => email.language === language);
    if (!_emailConfig) {
      const defaultLanguage = config.sendgrid.defaultLanguage; // en_US
      _emailConfig = config.sendgrid.emails.find(email => email.language === defaultLanguage);
    }
    return _emailConfig;
  }
}
