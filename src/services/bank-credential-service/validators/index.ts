import Joi from '@hapi/joi';

export const ForgotUsername = Joi.object({
  email: Joi.string()
    .email()
    .required()
});

export const GetChallengeQuestions = Joi.object({
  username: Joi.string().required()
});

export const ValidateChallengeQuestions = GetChallengeQuestions.append({
  key: Joi.string().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        answer: Joi.string().required()
      })
    )
    .required()
});

export const ResetPassword = GetChallengeQuestions.append({
  key: Joi.string().required(),
  password: Joi.string().required()
});

export const ChangePassword = GetChallengeQuestions.append({
  username: Joi.string().required(),
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required()
});
