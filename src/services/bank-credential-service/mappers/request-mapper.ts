import jsonTransformer from 'jsonata';
import { credential } from './templates';
import { IUserCredentials, IChallengeAnswers } from '../../models/bank-credentials-service/interface';

class RequestMapper {
  static credentialDTO(credentials: IUserCredentials): any {
    // filter based on template
    return jsonTransformer(credential).evaluate(credentials);
  }

  /**
   * @static
   * @param {IChallengeAnswers} answers
   * @returns
   * @memberof RequestMapper
   */
  static validateChallengeQuestion(answers: IChallengeAnswers): any {
    const template = `{
      "Answers": [answers.$.{
        "QuestionId": id,
        "Answer": answer
      }]
    }`;
    return jsonTransformer(template).evaluate(answers);
  }

  static changePassword(data: any): any {
    const template = `
		{
			"CurrentPassword": currentPassword,
			"NewPassword": newPassword
    }`;
    return jsonTransformer(template).evaluate(data);
  }
}

export default RequestMapper;
