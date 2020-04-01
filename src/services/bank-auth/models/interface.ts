import IAuthToken from '../../../interfaces/authToken';

export interface IAuthorization {
  /**
   *  Sets the required header and auth token info for auth object to create
   * appropriate validation request headers.
   *
   * @param {*} headers
   * @param {IAuthToken} token
   * @memberof IAuthorization
   */
  setHeadersAndToken(headers: any, token?: IAuthToken): void;
  /**
   * Returns an access token from the underlying banks authorization service.
   *
   * @returns {Promise<string>}
   * @memberof BankAuthorization
   */
  getAccessToken(): Promise<string>;

  /**
   * This method will return true or false based on user logged in or not
   *
   * @returns {boolean}
   * @memberof IAuthorization
   */
  isLoggedIn(): boolean;

  /**
   * Returns the headers as passed in from meed client
   *
   * @returns {*}
   * @memberof IAuthorization
   */
  getMeedHeaders(): any;

  /**
   * Return bank supported headers format
   *
   * @returns {object} {} axios supported header object
   * @memberof AxiommeAuthorization
   */
  getBankHeaders(): object;
}

// export interface AxiommeAuthorization extends IAuthorizationService {

// }
