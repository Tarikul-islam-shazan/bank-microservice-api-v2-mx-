import { BankAtmUtil } from '../util';
import { UnitOfMeasureType } from '../../models/meedservice';

describe('Bank Atm Service', () => {
  describe('BankAtmUtil.getMultiplier()', () => {
    it('should return expected object', () => {
      const result = BankAtmUtil.getMultiplier(2, UnitOfMeasureType.Imperial);
      expect(result).not.toBeNull();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('distanceMultiplier');
      expect(result).toHaveProperty('distance');
    });
    it('should return valid distanceMultiplier', () => {
      let result = BankAtmUtil.getMultiplier(2, UnitOfMeasureType.Metric);
      expect(result.distanceMultiplier).toEqual(0.001);
      result = BankAtmUtil.getMultiplier(2, UnitOfMeasureType.Imperial);
      expect(result.distanceMultiplier).toEqual(0.0006214);
    });
  });
  describe('BankAtmUtil.toGeoJson()', () => {
    it('should return expected geojson', () => {
      const result = BankAtmUtil.toGeoJson('gdsf', '11.5');
      expect(result).not.toBeNull();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('coordinates');
    });
  });
  describe('BankAtmUtil.adjustDecimal()', () => {
    it('should adjust precision point', () => {
      const result = BankAtmUtil.adjustDecimal('round', 2.36666, -3);
      expect(result).not.toBeNull();
      expect(result.toString()).not.toMatch(/^[0-9]+(\.[0-9]{1,2})?$/gm);
      expect(result.toString()).toMatch(/^[0-9]+(\.[0-9]{1,3})?$/gm);
    });
    it('should adjust precision point without exp', () => {
      const result = BankAtmUtil.adjustDecimal('round', 2.36666);
      expect(result).not.toBeNull();
      expect(result).toEqual(Math.round(2.36666));
    });
  });
});
