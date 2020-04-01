import { IGeoLocation, ILatLng } from '../../models/bank-atms/interface';
import { UnitOfMeasureType } from '../../models/meedservice';

export class BankAtmUtil {
  constructor() {}

  /**
   * If unitOfMeasure is in Metric then distance is in Km, convert it to meter divided by 0.001
   * If unitOfMeasure is in Imperial then distance is in Mile, convert it to meter divided by 0.0006214
   * Get the multiplier based on Unit of Measure
   * @static
   * @param {number} distance
   * @param {string} unitOfMeasure
   * @returns {*}
   * @memberof BankAtmUtil
   */
  public static getMultiplier(distance: number, unitOfMeasure: string): any {
    const retDistance = parseFloat(String(distance));
    const distanceMultiplier = unitOfMeasure === UnitOfMeasureType.Metric ? 0.001 : 0.0006214;

    return { distanceMultiplier, distance: retDistance / distanceMultiplier };
  }

  /**
   * Convert latlng to toGeoJson format
   * @static
   * @param {string} latitude
   * @param {string} longitude
   * @returns {IGeoLocation}
   * @memberof BankAtmUtil
   */
  public static toGeoJson(latitude: string, longitude: string): IGeoLocation {
    const point: IGeoLocation = {
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
      type: 'Point'
    };
    return point;
  }

  /**
   * Adjust decimal point to a given precision point
   * @static
   * @param {string} type
   * @param {number} value
   * @param {number} [exp=0]
   * @returns
   * @memberof BankAtmUtil
   */
  public static adjustDecimal(type: string, value: number, exp: number = 0) {
    if (exp === 0) {
      return Math[type](value);
    }

    // Shift
    let svalue = value.toString().split('e');
    value = Math[type](+(svalue[0] + 'e' + (svalue[1] ? +svalue[1] - exp : -exp)));

    // Shift back
    svalue = value.toString().split('e');
    return +(svalue[0] + 'e' + (svalue[1] ? +svalue[1] + exp : exp));
  }

  /**
   * @static
   * @param {IGeoLocation} geolocation
   * @returns {ILatLng}
   * @memberof BankAtmUtil
   */
  public static toLatLng(geolocation: IGeoLocation): ILatLng {
    return {
      latitude: geolocation.coordinates[1],
      longitude: geolocation.coordinates[0]
    } as ILatLng;
  }
}
