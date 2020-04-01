export interface IAffinityAuthCredential {
  uniqueId: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  state: string;
  zipCode: string;
}

export interface IAffinitySession {
  sessionId?: string;
  uniqueId?: string;
  memberId?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  error?: any;
}
