import { IBankService } from '../shared/interface';

export interface IBankCredentialService extends IBankService {
  login(credentials: IUserCredentials): Promise<IBankAPICredentials>;
  forgotUsername(email: string): Promise<string>;
  getChallengeQuestions(username: string): Promise<IChallengeQuestions | IOtp>;
  validateChallengeQuestions(username: string, answers: IChallengeAnswers): Promise<any>;
  resetPassword(username: string, recoveryKey: string, password: string): Promise<string>;
  changePassword(username: string, currentPassword: string, newPassword: string): Promise<string>;
}

export interface IUserCredentials {
  username: string;
  password: string;
}

export interface IBankAPICredentials {
  bankToken: string;
  accessToken: string;
}

export interface IQuestionAndAnswer {
  id: string;
  question?: string;
  answer?: string;
}

export interface IChallengeQuestions {
  key: string;
  questions: IQuestionAndAnswer;
}

export interface IChallengeAnswers {
  key: string;
  answers: IQuestionAndAnswer;
}

export interface IOtp {
  httpCode: number;
  message: string;
  code: number;
  otpID?: string;
}
