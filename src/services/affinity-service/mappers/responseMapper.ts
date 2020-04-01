import { Category, Offer, OfferDetails } from '../../models/affinity-service';
import jsonTransformer from 'jsonata';
import { HTTPError } from '../../../utils/httpErrors';
import { IAffinitySession } from '../../models/affinity-service/interface';
import HttpStatus from 'http-status-codes';

export default class ResponseMapper {
  static mapAffinitySession(response): Promise<IAffinitySession> {
    try {
      const affinitySession = `$.{
        "sessionId": sid,
        "uniqueId": oldid,
        "memberId": membid,
        "firstName": fname,
        "lastName": lname
      }`;
      return jsonTransformer(affinitySession).evaluate(response);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  /*
   *  This function Map sesstion data which is return after new Affinity Registration
   */

  static mapAffinitySessionAfterReg(response): Promise<IAffinitySession> {
    try {
      const affinitySession = `$.{
        "sessionId": sid,
        "memberId": results.member_id
      }`;
      return jsonTransformer(affinitySession).evaluate(response.data);
    } catch (error) {
      throw new HTTPError(error.message, '', 400);
    }
  }

  static mapAffinityCategories(response): Promise<Category[]> {
    const affinityCategories = `[$each($.results, function($v, $k) { { "id": $k, "name": $v } } )]`;
    try {
      return jsonTransformer(affinityCategories).evaluate(response);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static mapAffinityOffers(response): Promise<Offer[]> {
    try {
      const affinityOffers = `[$.{
        "id": id,
        "activated": value.activated = "t"? true: value.activated = "f"? false,
        "title": value.xname,
        "merchant": value.xpartname,
        "image": value.xpic1 ? "https://uat.affinity-deals.com/common/images/" & value.xpic1,
        "shopType": value.shop_type[0],
        "tenWord": value.xtenword,
        "twentyWord": value.xtwentyword,
        "outsideLink": value.xoutsidelink,
        "expiration": value.xexpiration,
        "merchantId": value.xpartid,
        "requiresActivation": value.requires_activation = "t" ? true : false,
        "offerValue": value.offervalue
      }]`;
      return jsonTransformer(affinityOffers).evaluate(response);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static mapAffinityFeatureOffer(response): Offer[] {
    try {
      const affinityOffers = `[$.{
        "id": id,
        "activated": value.activated = "t"? true: value.activated = "f"? false,
        "title": value.xname,
        "merchant": value.xpartname,
        "image": value.xpic1 ? "https://uat.affinity-deals.com/common/images/" & value.xpic1,
        "shopType": value.shop_type[0],
        "tenWord": value.xtenword,
        "twentyWord": value.xtwentyword,
        "outsideLink": value.xoutsidelink,
        "expiration": value.xexpiration,
        "merchantId": value.xpartid,
        "requiresActivation": value.requires_activation = "t" ? true : false,
        "offerValue": value.offervalue
      }]`;
      return jsonTransformer(affinityOffers).evaluate(response);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static mapAffinityOfferDetails(response): OfferDetails {
    try {
      const affinityOfferDetails = `$.{
        "id": id,
        "activated": value.activated = "t" ? true : false,
        "title": value.xname,
        "merchant": value.xpartname,
        "image": "https://uat.affinity-deals.com/common/images/" & value.xpic1,
        "shopType": value.shop_type[0],
        "tenWord": value.xtenword,
        "twentyWord": value.xtwentyword,
        "outsideLink": value.xoutsidelink,
        "expiration": value.xexpiration,
        "merchantId": value.xpartid,
        "requiresActivation": value.requires_activation = "t" ? true : false,
        "stores": [value.xstores.{
          "id": id,
          "address": value.addr,
          "city": value.city,
          "zip": value.zip,
          "lat": value.lat,
          "long": value.long,
          "distance": value.distance
        }],
        "offerValue": value.offervalue
      }`;
      return jsonTransformer(affinityOfferDetails).evaluate(response);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }
}
