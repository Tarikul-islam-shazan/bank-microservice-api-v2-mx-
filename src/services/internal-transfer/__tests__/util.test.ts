import { TransferUtil } from '../util/util';
import { ITransfer, TransferType } from '../../models/internal-transfer/interface';
import { mockImmediate, mockMonthly, mockWeekly, mockYearly, mockSchedule } from './mocks/mock-data';

describe('Internal Transfer Service TransferUtil', () => {
  jest.setTimeout(5000);

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('.getTransferType()', () => {
    let spy;

    beforeEach(() => {
      spy = jest.spyOn(TransferUtil, 'getTransferType');
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('Should return Immediate transferType for frequency Once', async () => {
      const transferType = TransferUtil.getTransferType(mockImmediate.request as ITransfer);
      expect(spy).toBeCalled();
      expect(transferType).toEqual(TransferType.Immediate);
    });

    it('Should return Schedule transferType for frequency Once and upcoming date', async () => {
      const transferType = TransferUtil.getTransferType(mockSchedule.request as ITransfer);
      expect(spy).toBeCalled();
      expect(transferType).toEqual(TransferType.Scheduled);
    });

    it('Should return Recurring for weekly frequency transferType', async () => {
      const transferType = TransferUtil.getTransferType(mockWeekly.request as ITransfer);
      expect(spy).toBeCalled();
      expect(transferType).toEqual(TransferType.Recurring);
    });

    it('Should return Recurring for monthly frequency transferType', async () => {
      const transferType = TransferUtil.getTransferType(mockMonthly.request as ITransfer);
      expect(spy).toBeCalled();
      expect(transferType).toEqual(TransferType.Recurring);
    });

    it('Should return Recurring for yearly frequency transferType', async () => {
      const transferType = TransferUtil.getTransferType(mockYearly.request as ITransfer);
      expect(spy).toBeCalled();
      expect(transferType).toEqual(TransferType.Recurring);
    });
  });
});
