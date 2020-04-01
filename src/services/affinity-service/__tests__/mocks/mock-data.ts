export const mockHeaders = {
  'meedbankingclub-customerid': '0000006569',
  'meedbankingclub-memberid': '5da410f9801f2742a236c988',
  'meedbankingclub-username': 'meed.dummy',
  'meedbankingclub-bank-identifier': 'axiomme'
};

export const mockSession = { data: { sid: '168XcvnjHY617446' } };

export const unmappedCategories = {
  sid: '168XQkRkxJ7670285',
  status: 'success',
  error: [],
  results: {
    54040: 'Apparel & Accessories',
    54042: 'Auto & Tools',
    54044: 'Beauty & Health',
    54046: 'Business Services'
  }
};

export const mockCategory = [
  {
    id: '54040',
    name: 'Apparel & Accessories'
  },
  {
    id: '54042',
    name: 'Auto & Tools'
  },
  {
    id: '54044',
    name: 'Beauty & Health'
  },
  {
    id: '54046',
    name: 'Business Services'
  }
];

export const unMappedOffer = {
  311405: {
    xid: 311405,
    cobrid: [93, 168],
    xname: '5% Cash Back',
    xpartname: '612 Brew',
    xcccobrids: 'RN',
    xtemp: 'benefits',
    xshowonly: 'f',
    mobilesafe: 't',
    externaltrackinglink: '',
    merchtype: 'local',
    offertype: '2',
    redemptiontype: '',
    offersource: 'traditional',
    excludefromoverlay: 'f',
    domain: '',
    mstr: '',
    xstr: '',
    rtype: ' ',
    rakuten_data: '',
    xtier: 0,
    xtext: '',
    xtenword: 'Earn 5% Cash Back at 612 Brew.',
    xspotonoffercopy: '',
    xreceiptmsg: '',
    xredemptioninstructions: '',
    xadditionaldetails: '',
    xdealwalletheadline: '',
    xbuynowblurb: '',
    xbeneapproved: 'qa-approved',
    xtwentyword:
      '<p>Offer expires 12-31-2019. Offers are subject to change. Rewards are earned based on the net price of eligible goods and services purchased. Rewards apply to purchases made at participating 612 Brew stores only. This offer cannot be combined with any other offer, coupon code(s), or promotion, unless available through this site.</p> Offer valid on 99 purchase(s) per month. Offer valid on up to $600 in monthly purchases.',
    xfiftyword: '',
    xoutsidelink: '',
    xexpiration: 1577768400,
    xdatecreated: 1567616080,
    xpic1: '',
    xpic2: '',
    xpic3: '',
    xpic4: '',
    xcouponpic: '',
    xpicbanner1: '',
    xpicbanner2: '',
    xpicbanner3: '',
    xpicbanner4: '',
    xpxid: '0',
    xpic5: 'bmOnly.gif',
    xpic7: '',
    xpic8: '',
    xbenetype: 'sponsor',
    xorder: '75',
    xoneusegroup: '0',
    xbarcodetypeid: 0,
    xregcardok: 'f',
    xregcardstatus: {
      vs_ok: 'f',
      mc_ok: 'f'
    },
    xregistered_cards: [],
    xspend: 141,
    xclick_trend: '0',
    xmsgdemoid: '0',
    xemailpromotext: '',
    xemailgraphic: '',
    xemailheadline: '612 Brew 5% on all purchases',
    optindemoid: '0',
    offerrun: 'none',
    xlocations: 1,
    xprice: 0,
    xdefaultloc: 't',
    xoffergroup: '0',
    xpartid: '72074',
    xkeywords: '612 Brew ',
    xkeywords_filter: ['612 Brew'],
    xsogroup: 'f',
    shop_type: ['instore'],
    xdemoids: '',
    requires_activation: 'f',
    offer_type: 'loyalty',
    locale: 'local',
    offervalue: 5,
    xpartnamesearch: '612Brew',
    alphaindex: '0',
    xpartnamesort: '612 brew',
    categories: {
      31974: 'Restaurants',
      54052: 'Food, Dining & Entertainment'
    },
    categoryids: [31974, 54052],
    channelid: [],
    pareaids: [31972],
    pareanames: {
      31972: 'Restaurants'
    },
    hash: 'ZDFjMGNiNjRiNDMzNTA3NGQxZjg3MTVjYWQ0YjIzZTU3MzE5ZDdhYmE2MDNjMjdlZjNmZTIzM2VkNDdlN2UwZg==',
    rank: 0,
    activated: 'f',
    xstores: {
      503064: {
        name: '612 Brew',
        locname: '',
        addr: '945 Broadway St NE',
        city: 'Minneapolis',
        st: 'MN',
        zip: '55413',
        long: -93.246707,
        lat: 44.998748,
        phone: '',
        venueid: '',
        notes: '',
        distance: '10.8'
      }
    }
  }
};

export const mockDetails = {
  id: '311405',
  activated: false,
  title: '5% Cash Back',
  merchant: '612 Brew',
  image: 'https://uat.affinity-deals.com/common/images/',
  shopType: 'instore',
  tenWord: 'Earn 5% Cash Back at 612 Brew.',
  twentyWord:
    '<p>Offer expires 12-31-2019. Offers are subject to change. Rewards are earned based on the net price of eligible goods and services purchased. Rewards apply to purchases made at participating 612 Brew stores only. This offer cannot be combined with any other offer, coupon code(s), or promotion, unless available through this site.</p> Offer valid on 99 purchase(s) per month. Offer valid on up to $600 in monthly purchases.',
  outsideLink: '',
  expiration: 1577768400,
  merchantId: '72074',
  requiresActivation: false,
  stores: [
    {
      id: '503064',
      address: '945 Broadway St NE',
      city: 'Minneapolis',
      zip: '55413',
      lat: 44.998748,
      long: -93.246707,
      distance: '10.8'
    }
  ],
  offerValue: 5
};

export const mockSearchQuery = {
  keyword: '5% cash',
  shop_type: mockDetails.shopType,
  categoryid: mockCategory[0].id
};

export const mockCustomer = {
  nickname: 'John Doe',
  salutation: 'MR',
  firstName: 'meed.dummy',
  middleName: '',
  lastName: '',
  email: 'meed.dummy@yopmail.com',
  dateOfBirth: '1978-11-11',
  address: '2038 E AMERICAN BLVD',
  city: 'BLOOMINGTON',
  state: 'AL',
  zipCode: '55425',
  country: 'US',
  mobilePhone: '+11212121215'
};
