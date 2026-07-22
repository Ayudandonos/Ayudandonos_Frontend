export interface Country {
  iso2: string;
  name: string;
  phonecode: string | null;
  emoji: string | null;
  flag: string | null;
}

export interface State {
  iso2: string;
  name: string;
  countryIso2: string;
}

export interface City {
  name: string;
  stateIso2: string;
  countryIso2: string;
}

export interface LocationValue {
  country: Country | null;
  state: State | null;
  city: City | null;
}

export const EMPTY_LOCATION_VALUE: LocationValue = {
  country: null,
  state: null,
  city: null,
};
