import { IBank, ICountry } from '../../../models/meedservice';
import { IBankAtm } from '../../../models/bank-atms/interface';
import { Locales } from '../../../meedservice/models/bank';
import { BankIdentifier } from '../../../../interfaces/MeedRequest';

// 5ab159487fabb066abb60025
export const CountryMock: ICountry = {
  countryAbv: 'USA',
  countryName: 'United States of America',
  unitOfMeasure: 'Imperial'
};

// 5c1d47586ab7a4a7f6ef9d39
export const BankMock: IBank = {
  country: '5ab159487fabb066abb60025',
  currency: 'USD',
  shortName: 'USA001',
  name: 'Valley National Bank',
  identifier: BankIdentifier.Invex,
  supportedLocales: [Locales.EN_US, Locales.ES_MX],
  banksSharingAtms: []
};

// 5da57ae7a5fbf84a9e202a08
export const AtmMock = {
  bank: '5c1d47586ab7a4a7f6ef9d39',
  locationType: 'Atm',
  city: 'Utuado',
  state: 'PR',
  latitude: '18.2667065',
  longitude: '-66.70904',
  zipCode: '641',
  streetAddress: 'Carr 111 Km 8.3 Barrio Caguana',
  locationName: 'Super Farmacia Caguana',
  serviceType: 'BranchAtm',
  location: {
    type: 'Point',
    coordinates: [-66.70904, 18.2667065]
  }
};

export const AtmByAddressQuery = {
  distance: 100,
  locationType: 'Atm',
  unitOfMeasure: 'Metric',
  address: AtmMock.streetAddress
};

export const AtmByLatlngQuery = {
  distance: 100,
  locationType: 'Atm',
  unitOfMeasure: 'Metric',
  latitude: String(AtmMock.location.coordinates[1]),
  longitude: String(AtmMock.location.coordinates[0])
};

export const mockGeocodeData = {
  json: {
    results: [
      {
        geometry: {
          location: {
            lat: AtmMock.location.coordinates[1],
            lng: AtmMock.location.coordinates[0]
          }
        }
      }
    ]
  }
};

export const mockMapNoResult = {
  json: {
    results: []
  }
};

export const mockMapError = {
  status: 429,
  json: {
    error_message: 'Map request limit exceeded',
    status: 429
  }
};

export const mockAtmResponse = {
  ...AtmMock,
  location: {
    latitude: AtmMock.location.coordinates[1],
    longitude: AtmMock.location.coordinates[0]
  }
};
