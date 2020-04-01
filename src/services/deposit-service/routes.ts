import { asyncWrapper } from '../../middleware/asyncWrapper';
import { DepositServiceController } from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';
import multer from 'multer';
import mkdirp from 'mkdirp';
import mime from 'mime-types';
import config from './../../config/config';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { depositFund, depositCheck, depositMoney, depositFundHeader } from './validators';
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = `${config.chequeDepositDirectory}/`;
    mkdirp(dir, err => cb(err, dir));
  },
  filename(req, file, cb) {
    const createFileName = file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype);
    cb(null, createFileName);
  }
});
const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: 'frontCheckImage', maxCount: 1 },
  { name: 'backCheckImage', maxCount: 1 }
]);
export default [
  {
    path: 'v1.0.0/deposit/fund',
    method: 'post',
    handler: [
      AuthMiddleware.allowWithTokenOrWithoutToken,
      handleValidation(depositFund),
      handleValidation(depositFundHeader, ValidationLevel.Headers),
      asyncWrapper(DepositServiceController.depositFund)
    ]
  },
  {
    path: 'v1.0.0/deposit/money',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(depositMoney),
      asyncWrapper(DepositServiceController.depositMoney)
    ]
  },
  {
    path: 'v1.0.0/deposit/check',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      uploadFields,
      handleValidation(depositCheck),
      asyncWrapper(DepositServiceController.depositCheck)
    ]
  }
];
