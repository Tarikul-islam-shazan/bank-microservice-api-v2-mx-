class Client {
  constructor() {}
  public setApiKey = jest.fn(() => {});
  public setDefaultHeader = jest.fn(() => {});
  public setDefaultRequest = jest.fn(() => {});
  public createHeaders = jest.fn(() => {});
  public createRequest = jest.fn(() => {});
  public request = jest.fn().mockImplementation(() => Promise.resolve({}));
}

module.exports = new Client();
