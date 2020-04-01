export default interface Offer {
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
  offerValue: string;
}
