import jsonTransformer from 'jsonata';
import { ISendGridTemplate, ISendGrid } from '../sendGridHelper';

class SendGridMapper {
  static bodyDTO(email: ISendGrid) {
    const dtoTemplate = `{
      ${email.delayTime ? `"send_at" : "${parseInt(String(new Date().getTime() / 1000), 10)}",` : ``}
      ${email.attachments ? `"attachments" : attachments,` : ``}
      "content": [
        {
          "type": "${email.contentType ? `text/` + email.contentType : `text/plain`}",
          "value": content
        }
      ],
      "from": {
        "email": sender,
        "name": ${email.senderName ? `senderName` : `""`}
      },
      "personalizations": [
        {
          "subject": subject,
          "to": [
            {
              "email": receiver,
              name: ""
            }
          ],
          "cc": cc_email ?  "$map(cc_email, function($v) { return { email: $v }; })" : "[]"
        }
      ],
      "subject": subject
    }`;
    return jsonTransformer(dtoTemplate).evaluate(email);
  }

  // TODO: update the groupsToDisplay
  static bodyWithTemplateDTO(email: ISendGridTemplate, groupsToDisplay: Array<number>) {
    const dtoTemplate = `{
      ${
        email.subscribeLink
          ? `"asm" : {
              "group_id": groupID,
              "groups_to_display": groupsToDisplay
            },`
          : ``
      }
      ${email.attachments ? `"attachments" : attachments,` : ``}
      "personalizations": [
        {
          "to": [
            $map(receiver, function($v) {
              { 'email':  $v }
            })
          ],
          "dynamic_template_data": ${email.templateData ? JSON.stringify(email.templateData) : ``}
        }
      ],
      "from": {
        "email": sender,
        "name": ${email.senderName ? `senderName` : `""`}
      },
      "reply_to": {
        "email": sender,
        "name": ${email.senderName ? `senderName` : `""`}
      },
      "template_id": templateId,
      "tracking_settings": {
        "click_tracking": {
          "enable": true
        },
        "open_tracking": {
          "enable": true
        }
      },
      "mail_settings": {
        "bypass_list_management": {
          "enable": true
        }
      }
    }`;
    return jsonTransformer(dtoTemplate).evaluate(email);
  }
}

export default SendGridMapper;
