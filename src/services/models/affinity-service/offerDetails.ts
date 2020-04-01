import Store from './store';

export default interface OfferDetails {
  id: string | number;
  activated: boolean;
  title: string;
  merchant: string;
  image: string;
  shopType: string;
  tenWord: string;
  twentyWord: string;
  outsideLink: string;
  expiration: string;
  merchantId: string;
  requiresActivation: boolean;
  stores: Store[];
  offerValue: string;
}
