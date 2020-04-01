import Joi, { required } from '@hapi/joi';

// TODO: for the customerName update meed service need reson and requirementDocument
const UpdateName = Joi.object({
  salutation: Joi.string().required(),
  firstName: Joi.string().required(),
  middleName: Joi.string().optional(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  oldName: Joi.string().required(),
  email: Joi.string().required(),
  reason: Joi.string().required(),
  requiredDocument: Joi.string().required()
  // these are files not in body, in req.files
  // frontIdImage: multerFile.required(), thes
  // backIdImage: multerFile.required(),
  // documentImage: multerFile.required()
});

const UpdateEmail = Joi.object({
  email: Joi.string().required()
});

const UpdateAddress = Joi.object({
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required()
});

const UpdateContactNumber = Joi.object({
  mobilePhone: Joi.string().required(),
  workPhone: Joi.string()
    .allow('', null)
    .required()
});

const UpdateNickName = Joi.object({
  nickname: Joi.string().required()
});

export const UpdateCustomer = Joi.alternatives().try(
  UpdateName,
  UpdateEmail,
  UpdateAddress,
  UpdateContactNumber,
  UpdateNickName
);

export const UpdateContactPreference = Joi.object({
  status: Joi.boolean().required(),
  type: Joi.string().required()
});

export const MemberId = Joi.object({
  'meedbankingclub-memberid': Joi.string().required()
});

export const updateContactHeaders = Joi.object({
  'meedbankingclub-bank-identifier': Joi.string().required(),
  'meedbankingclub-username': Joi.string().required(),
  'meedbankingclub-memberid': Joi.string().required(),
  'meedbankingclub-otp-id': Joi.string(),
  'meedbankingclub-otp-token': Joi.string()
});

export const updateCustomerHeaders = updateContactHeaders.append({
  'meedbankingclub-customerid': Joi.string().required()
});

export const privacyAndLegalHeaders = Joi.object({
  'meedbankingclub-bank-identifier': Joi.string().required(),
  'meedbankingclub-username': Joi.string().required(),
  'meedbankingclub-customerid': Joi.string().required()
});
