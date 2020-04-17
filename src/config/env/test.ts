import path from 'path';
import sendgridConfig from '../sendgrid/sendgrid.test';

const testConfig = {
  app: {
    title: 'meed banking club service test',
    baseUrl: '/api/'
  },
  port: process.env.PORT || 6064,
  database: {
    url: `mongodb://localhost:27017/meedv2-test`
  },
  session: {
    secret: 'Z6?x4Td8D&W8j5zAMQv2uxFZ$V$#_RWU',
    tokenEncryptionKey: '4@&ZfX?xWf$shcSV?&', // length must be 16
    tokenLife: 10, // in minute
    issuer: 'meed',
    subject: 'meed@users',
    audience: 'https://meedbankingclub.com/',
    algorithm: 'RS256', // RSASSA [ "RS256", "RS384", "RS512" ]
    rsaPrivateKey: path.join(__dirname, '../keys/private.key'),
    rsaPublicKey: path.join(__dirname, '../keys/public.key')
  },
  logging: {
    label: 'test',
    deployment: 'test',
    level: 'error',
    inputToken: '9c4820c6-8f3d-4aa0-9e6d-f8ba3e333485',
    subdomain: 'meed-v2',
    tags: ['meed-v2'],
    excludedKeysToSanitize: ['password', 'Authorization', 'x-axxiome-digital-token', 'access_token', 'pdf', 'Documents']
  },
  briteVerify: {
    key: 'c2f7ad25-3fe9-4612-af27-49f2ec1abb7a',
    url: 'https://api.briteverify.com/emails.json'
  },
  api: {
    axxiome: {
      url: 'https://demo.axxiome.com:443',
      username: 'EAlFtcZtmdXICu0G9Ynud_O0E6Aa',
      password: 'YBOXEH5_ZhAZmPE3NdTwWSJ1YmMa',
      version: '2.2.0'
    },
    invex: {
      url: 'https://201.175.40.153:8452/InterCMaS_Invex/webresources/Items/METODOS'
    },
    affinity: {
      url: 'https://uat.affinity-deals.com/e/api.php',
      passphrase: 'gKp2ty92SDgbns92uhj9s28C',
      sid: '159XXdKrlo159'
    }
  },
  templateId: {
    p2pFundRequest: {
      en_US: 'd9275e78-dff2-4e6e-9a0c-a785888c62c2',
      es_MX: 'baf676ec-7fa3-4bb2-ae99-cfbf9f75cf2b'
    }
  },
  chequeDepositDirectory: path.join(__dirname, '../..', '/public/chequedeposit'),
  jumio: {
    baseUrl: 'https://netverify.com/api/v4',
    scanURL: 'https://netverify.com/api/netverify/v2/scans',
    apiToken: 'e3facdd9-292d-42da-80fd-6c356d9c8161',
    apiSecret: 'mhYjhzEd49svDm2Sh0T5nHWxM52tqigS'
  },
  urbanAirship: {
    key: '4Ww5Ycv-RBGVTSH2vrivWw',
    appSecret: '-AsJp_A-Rd6j0gZlZT6BoA',
    masterSecret: 'auZHec7CRf-BXm4PJ5IGOA',
    token: 'MTo0V3c1WWN2LVJCR1ZUU0gydnJpdld3OkRHZ1RLenBZNXZSTWxWbUxORnROa0pWTmt2ZWFvZHdaWU5CbFQ2VE5KdGc',
    baseUrl: 'https://go.urbanairship.com'
  },
  virtualAssistance: {
    baseUrl: 'http://vastage1.creativevirtual15.com/dxcvnbstaging/bot.htm',
    liveChatBaseUrl: 'https://cvusalivechatdemo.creativevirtual15.com',
    liveChatCustomerID: 2,
    departmentID: 1,
    saveLivechatHistoryNavApi:
      'https://prod-07.centralus.logic.azure.com:443/workflows/4cf52a4e6f08496b95ce2c3d88e113ce/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jrCAsQXxM8KaBApfy3aV7JT7jQUzhjStLNuaVSLiifA',
    queues: [
      {
        language: 'en_US',
        queueName: 'Meed Share'
      },
      {
        language: 'es_MX',
        queueName: 'Meed Share SP'
      }
    ]
  },
  sendgrid: sendgridConfig,
  inviationEmailUrl: 'https://qa.meedbankingclub.com/signup/',
  googleMap: {
    apiKey: 'AIzaSyB8SWBjbcKvBHeUYxJV_LZ6FRMFTVkzOc8'
  },
  billerDirectHelper: {
    apiHost: 'https://sb-api.q2open.io/v1',
    apiKey: 'fda7bfa0-6b6c-11e9-8a9e-118ad5b300b1',
    connectSSOUrl: 'https://sb-connect.q2open.io',
    cardSwapSSOUrl: 'https://sb-cardswap.q2open.io',
    billerDirectSSOUrl: 'https://sb-biller-direct.q2open.io'
  }
};

module.exports = testConfig;
