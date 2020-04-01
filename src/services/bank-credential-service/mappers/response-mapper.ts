import jsonTransformer from 'jsonata';
import { IChallengeQuestions } from '../../models/bank-credentials-service/interface';

class ResponseMapper {
  static getChallengeQuestions(data: any): IChallengeQuestions {
    const template = `{
			"key": Key,
			"questions": [ChallengeQuestions.$.{
				"question": Question,
				"id": Id
			}]
		}`;
    return jsonTransformer(template).evaluate(data);
  }
}

export default ResponseMapper;
