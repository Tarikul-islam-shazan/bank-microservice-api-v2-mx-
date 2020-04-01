import Joi, { required } from '@hapi/joi';
import moment from 'moment';
import { IdentityType, ArmedForceRelation } from '../../models/bank-onboarding/interface';

const validateDate = value => {
  if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
    throw new Error("invalid date or format, should be in 'YYYY-MM-DD'");
  }
  return value;
};

export const MemberIdRequired = Joi.object({
  'meedbankingclub-memberid': Joi.string().required()
});

export const UsernameMemberIdRequired = Joi.object({
  'meedbankingclub-memberid': Joi.string().required(),
  'meedbankingclub-username': Joi.string().required()
});

export const CreateLogin = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required()
});

export const ApplyForAccount = Joi.object({
  memberApplication: Joi.object({
    email: Joi.string().required(),
    prefix: Joi.string()
      .allow('')
      .optional(),
    firstName: Joi.string().required(),
    middleName: Joi.string()
      .allow('')
      .optional(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string()
      .custom(validateDate)
      .required(),
    addressLine1: Joi.string()
      .allow('')
      .optional(),
    addressLine2: Joi.string()
      .allow('')
      .optional(),
    city: Joi.string().required(),
    mobilePhone: Joi.string().required(),
    workPhone: Joi.string()
      .allow('')
      .optional(),
    zipCode: Joi.string().required(),
    state: Joi.string().required(),
    identityType: Joi.string()
      .valid(...Object.values(IdentityType))
      .required(),
    identityNumber: Joi.string().required(),
    socialSecurityNo: Joi.string().required(),
    country: Joi.string().required(),
    occupation: Joi.string().required(),
    isRelatedToArmedForces: Joi.string()
      .valid(...Object.values(ArmedForceRelation))
      .required(),
    armedForcesMemberFirstName: Joi.string().when('isRelatedToArmedForces', {
      is: ArmedForceRelation.Dependent,
      then: Joi.required(),
      otherwise: Joi.allow('').optional()
    }),
    armedForcesMemberLastName: Joi.string().when('isRelatedToArmedForces', {
      is: ArmedForceRelation.Dependent,
      then: Joi.required(),
      otherwise: Joi.allow('').optional()
    }),
    armedForcesSocialSecurityPin: Joi.string().when('isRelatedToArmedForces', {
      is: ArmedForceRelation.Dependent,
      then: Joi.required(),
      otherwise: Joi.allow('').optional()
    }),
    armedForcesDob: Joi.string().when('isRelatedToArmedForces', {
      is: ArmedForceRelation.Dependent,
      then: Joi.custom(validateDate).required(),
      otherwise: Joi.allow('').optional()
    }),
    sourceOfIncome: Joi.string().required(),
    monthlyWithdrawal: Joi.string().required(),
    monthlyDeposit: Joi.string().required(),
    monthlyIncome: Joi.string()
      .allow('')
      .optional(),
    workPhoneExtension: Joi.string()
      .allow('')
      .optional()
  }),
  scannedIdData: Joi.object({
    reference: Joi.string().required(),
    extractionMethod: Joi.string()
      .allow('')
      .optional(),
    firstName: Joi.string()
      .allow('')
      .optional(),
    lastName: Joi.string()
      .allow('')
      .optional(),
    dateOfBirth: Joi.string()
      .allow('')
      .optional(),
    gender: Joi.string()
      .allow('')
      .valid('m', 'f')
      .required(),
    addressLine: Joi.string()
      .allow('')
      .optional(),
    postCode: Joi.string()
      .allow('')
      .optional(),
    city: Joi.string()
      .allow('')
      .optional(),
    subdivision: Joi.string()
      .allow('')
      .optional(),
    country: Joi.string()
      .allow('')
      .optional(),
    identificationType: Joi.string()
      .allow('')
      .optional(),
    idNumber: Joi.string()
      .allow('')
      .optional(),
    issuingCountry: Joi.string()
      .allow('')
      .optional(),
    issuingDate: Joi.string()
      .allow('')
      .optional(),
    expiryDate: Joi.string()
      .allow('')
      .optional()
  })
});

export const AcceptTermsAndCondition = Joi.object({
  isTermsAccepted: Joi.boolean().required(),
  processId: Joi.string().required(),
  corporateTncAccepted: Joi.boolean()
    .strict()
    .optional()
});

export const IdentityQuestionAnswers = Joi.object({
  identityAnswers: Joi.array().items(
    Joi.object({
      questionId: Joi.string().required(),
      answerId: Joi.string().required()
    })
  )
});

export const RegistrationFee = Joi.object({
  deposits: Joi.array().items(
    Joi.object({
      amount: Joi.number().required(),
      accountNumber: Joi.string().required(),
      accountType: Joi.string()
        .valid('DDA', 'SSA', 'LOC')
        .required()
    })
  ),
  totalAmount: Joi.number().required(),
  currency: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  paymentTrackingId: Joi.string().required()
});
