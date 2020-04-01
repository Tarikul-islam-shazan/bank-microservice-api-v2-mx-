/**
 * This is the mock implementation of MeedAxios in /utils/api.ts
 * This can be use by importing in test files like this jest.mock('path/to//utils/api');
 * Also can be replace expected value like this in test files:
 *          MeedAxios.getAxiosInstance().post.mockResolvedValueOnce(expectedData)
 *
 * Or can be replace methods like this:
 *    MeedAxios.getAxiosInstance.mockResolvedValueOnce(expectedAxios Value)
 */

import { axiosInstanceMock } from '../../__mocks__/axios';

export class MeedAxios {
  public static getAxiosInstance = jest.fn().mockReturnValue(axiosInstanceMock);
  public static getAxiosInstanceForUAS = jest.fn().mockReturnValue(axiosInstanceMock);
  public static getAffinityAxiosInstance = jest.fn().mockReturnValue(axiosInstanceMock);
  public static getAxiosInstanceForVA = jest.fn().mockReturnValue(axiosInstanceMock);
  public static getAxiosInstanceForJumio = jest.fn().mockReturnValue(axiosInstanceMock);
  public static getAxiosInstanceLiveChat = jest.fn().mockReturnValue(axiosInstanceMock);
  public static getAxiosInstanceSaveChat = jest.fn().mockReturnValue(axiosInstanceMock);
}
