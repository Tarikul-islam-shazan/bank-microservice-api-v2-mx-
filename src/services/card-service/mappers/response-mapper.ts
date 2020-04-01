import transfrom from 'jsonata';
import { cardDetailsTemplate } from './template';
import { ICard } from '../../models/card-service';

class ResponseMapper {
  static transformCardDetails(response: any): ICard[] {
    return transfrom(cardDetailsTemplate).evaluate(response.data);
  }
}

export default ResponseMapper;
