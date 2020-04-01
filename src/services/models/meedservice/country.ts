export interface ICountry {
  id?: any;
  countryName?: string;
  countryAbv?: string;
  unitOfMeasure?: string;
}

export enum UnitOfMeasureType {
  Imperial = 'Imperial',
  Metric = 'Metric'
}
