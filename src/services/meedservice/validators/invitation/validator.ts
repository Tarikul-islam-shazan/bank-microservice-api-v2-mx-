import Joi from '@hapi/joi';

export const Invite = Joi.array().items(
  Joi.object({
    message: Joi.string().required(),
    language: Joi.string().required(),
    inviteeEmail: Joi.string()
      .email()
      .required()
  })
);

export const VerifyInvitees = Joi.array().items(
  Joi.object({
    inviteeEmail: Joi.string()
      .email()
      .required()
  })
);

export const inviteHeader = Joi.object({
  'meedbankingclub-bank-identifier': Joi.string().required(),
  'meedbankingclub-memberid': Joi.string().required()
});
