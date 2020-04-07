import Joi from '@hapi/joi';
import moment from 'moment';
import { AccountSelection, Sex, MaritalStatus } from '../../models/bank-onboarding/interface';

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

const CommonInfo = Joi.object({
  firstName: Joi.string().required(),
  secondName: Joi.string().optional(),
  dateOfBirth: Joi.string().required(),
  paternalLastName: Joi.string().required(),
  maternalLastName: Joi.string().optional()
});

export const GeneralInfo = CommonInfo.append({
  curp: Joi.string().required(),
  mobileNumber: Joi.string().required()
});

export const ApplyForAccount = Joi.object({
  application: Joi.object({
    generalInfo: CommonInfo.append({
      curp: Joi.string().required(),
      mobileNumber: Joi.string().required()
    }),
    addressInfo: Joi.object({
      addressType: Joi.string().required(),
      propertyType: Joi.string().required(),
      street: Joi.string().required(),
      outdoorNumber: Joi.string().required(),
      interiorNumber: Joi.string().required(),
      postCode: Joi.string().required(),
      state: Joi.string().required(),
      municipality: Joi.string().required(),
      city: Joi.string().required(),
      suburb: Joi.string().required(),
      timeAtResidence: Joi.string().required()
    }),
    beneficiaryInfo: CommonInfo.append({
      selfFundSource: Joi.boolean()
        .strict()
        .required(),
      fundSourceInfo: CommonInfo.when('selfFundSource', { is: false, then: Joi.required() })
    }),
    accountSelection: Joi.string()
      .valid(...Object.values(AccountSelection))
      .required(),
    personalInfo: Joi.object({
      countryOfBirth: Joi.string().required(),
      nationality: Joi.string().required(),
      placeOfBirth: Joi.string().required(),
      sex: Joi.string()
        .valid(...Object.values(Sex))
        .required(),
      maritalStatus: Joi.string()
        .valid(...Object.values(MaritalStatus))
        .required(),
      hightLevelOfEducation: Joi.string().required(),
      profession: Joi.string().required(),
      occupation: Joi.string().required(),
      economicActivity: Joi.string().required(),
      banxicoActivity: Joi.string().required()
    }),
    moreInfo: Joi.object({
      holdGovPosition: Joi.boolean()
        .strict()
        .required(),
      positionInfo: Joi.object({
        position: Joi.string().required(),
        association: Joi.string().required()
      }).when('holdGovPosition', { is: true, then: Joi.required() }),
      relativeHoldGovPosition: Joi.boolean()
        .strict()
        .when('holdGovPosition', { is: true, then: Joi.required() }),
      relativeInfo: Joi.object({
        firstName: Joi.string().required(),
        secondName: Joi.string().optional(),
        paternalLastName: Joi.string().required(),
        maternalLastName: Joi.string().optional(),
        position: Joi.string().required(),
        homeAddress: Joi.string().required(),
        phone: Joi.string().required(),
        participationPersent: Joi.number().required()
      }).when('relativeHoldGovPosition', { is: true, then: Joi.required() })
    }).when('accountSelection', { is: AccountSelection.Express, then: Joi.required() })
  })
});

export const SignupAddressInfo = Joi.object({
  addressType: Joi.string().required(),
  propertyType: Joi.string().required(),
  street: Joi.string().required(),
  outdoorNumber: Joi.string().required(),
  interiorNumber: Joi.string().required(),
  postCode: Joi.string().required(),
  state: Joi.string().required(),
  municipality: Joi.string().required(),
  city: Joi.string().required(),
  suburb: Joi.string().required(),
  timeAtResidence: Joi.string().required()
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
