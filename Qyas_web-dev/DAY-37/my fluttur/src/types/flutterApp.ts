export interface City {
  name: string;
  population: string;
  isCapital?: boolean;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  capital: string;
  continent: string;
  currency: string;
  population: string;
  cities: City[];
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRatesResponse {
  result: string;
  provider: string;
  base_code: string;
  time_last_update_utc: string;
  rates: Record<string, number>;
}

export type UnitCategory = 'Length' | 'Weight' | 'Temperature' | 'Area' | 'Volume';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratioToBase: number; // For linear conversion relative to base unit of category
  offset?: number;    // For temperature or non-linear offsets if needed
}

export interface CodeFile {
  filename: string;
  language: string;
  description: string;
  content: string;
}
