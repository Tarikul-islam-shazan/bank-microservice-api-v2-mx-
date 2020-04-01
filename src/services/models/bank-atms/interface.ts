export enum AtmLocationType {
  Atm = 'Atm',
  BranchAtm = 'BranchAtm',
  BranchCSO = 'BranchCSO'
}

export interface IAtmHours {
  lobbyHours: string;
  dayOfWeek: string;
}

export interface IGeoLocation {
  type: string;
  coordinates: number[];
}

export interface ILatLng {
  latitude: number;
  longitude: number;
}

export interface IBankAtm {
  bank?: string;
  distance?: number;
  locationType?: string;
  city?: string;
  phoneNumber?: string;
  state?: string;
  latitude?: string;
  longitude?: string;
  zipCode?: string;
  streetAddress?: string;
  locationName?: string;
  serviceType?: string;
  hours?: IAtmHours[];
  location?: ILatLng;
}
