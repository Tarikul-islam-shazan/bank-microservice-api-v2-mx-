import aqp from 'api-query-params';

export interface DbSearchParams {
  filter?: object;
  sort?: object;
  skip?: number;
  limit?: number;
  projection?: object;
  // NotApplicable to SQL dbs
  population?: object;
}

export class CommonUtils {
  constructor() {}

  /**
   *  Takes in a query string of type:
   *  'status=sent&timestamp>2016-01-01&author.firstName=/john/i&limit=100&skip=50&sort=-timestamp&populate=logs&fields=id,logs.ip'
   *  and returns a parsed object containing fields for a mongo search.
   *
   * {
   *    filter: {
   *     status: 'sent',
   *     timestamp: { $gt: Fri Jan 01 2016 01:00:00 GMT+0100 (CET) },
   *     'author.firstName': /john/i
   *   },
   *   sort: { timestamp: -1 },
   *   skip: 50,
   *   limit: 100,
   *   projection: { id: 1 },
   *   population: [ { path: 'v1/logs', select: { ip: 1 } } ]
   * }
   *
   * @static
   * @param {string} qs The query string to be parsed
   * @returns {DbSearchParams}
   *
   * @memberof CommonUtils
   */
  static getDbSearchParams(queryString: string): DbSearchParams {
    const { filter, skip, limit, sort, projection, population } = aqp(queryString);
    return { filter, skip, limit, sort, projection, population };

    // const retValue = ( { parsedQS: { filter, skip, limit, sort, projection, population }  = aqp(qs) } ) =>
    // ({ filter, skip, limit, sort, projection, population });
    // return retValue;
  }
}
