export const EmailVerificationErrorCodes = Object.freeze({
  createVerificationCode: {
    INVALID_EMAIL_ADDRESS: {
      message: 'This type of email is not allowed',
      errorCode: '1100',
      httpCode: 400
    }
  },
  verifyEmailCode: {
    NO_CODE_GENERATED_FOR_THIS_EMAIL: {
      message: 'Invalid email address',
      errorCode: '1101',
      httpCode: 400
    },
    NEW_VERIFICATION_CODE_IS_REQUIRED: {
      message: 'New verification code is required',
      errorCode: '1102',
      httpCode: 400
    },
    EMAIL_VERIFICATION_CODE_IS_INVALID: {
      message: 'Invalid verification code',
      errorCode: '1103',
      httpCode: 400
    },
    ACTIVATION_CODE_EXPIRED: {
      message: 'Verification code is expired',
      errorCode: '1104',
      httpCode: 400
    },
    ALREADY_USED_VERIFICATION_CODE: {
      message: 'This verification code is already used',
      errorCode: '1105',
      httpCode: 400
    }
  }
});
