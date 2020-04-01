import os from 'os';
import isObject from 'is-plain-object';
import config from '../config/config';

class MeedUtils {
  public static isJSON(data: any): boolean {
    try {
      return JSON.parse(data);
    } catch (e) {
      return false;
    }
  }

  public static sanitizeLog(logData: any): any {
    logData = MeedUtils.isJSON(logData) || logData;
    const excludedKeys = config.logging.excludedKeysToSanitize;
    const deepRegexReplace = (value, keys) => {
      if (typeof value === 'undefined' || typeof keys === 'undefined') {
        return {};
      }

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i = i + 1) {
          value[i] = deepRegexReplace(value[i], keys);
        }
        return value;
      }

      if (!isObject(value)) {
        return value;
      }

      if (typeof keys === 'string') {
        keys = [keys];
      }

      if (!Array.isArray(keys)) {
        return value;
      }

      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < keys.length; j++) {
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            if (new RegExp(keys[j], 'i').test(key)) {
              value[key] = '[REMOVED]';
            }
          }
        }
      }

      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          value[key] = deepRegexReplace(value[key], keys);
        }
      }

      return value;
    };

    return deepRegexReplace(logData, excludedKeys);
  }

  public static getIpAddress() {
    const networkInterfaces = os.networkInterfaces();
    return Object.keys(networkInterfaces)
      .reduce((r, k) => r.concat(k, networkInterfaces[k]), [])
      .filter(item => item.family === 'IPv4' && item.internal === false)
      .map(val => val.address)[0];
  }

  public static dropNullOrUndefined(obj: object): object {
    return Object.entries(obj).reduce(
      (acc, [k, v]) => (v == null ? acc : { ...acc, [k]: isObject(v) ? MeedUtils.dropNullOrUndefined(v) : v }),
      {}
    );
  }
}

export default MeedUtils;
