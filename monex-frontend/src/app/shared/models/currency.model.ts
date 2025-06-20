// src/app/interfaces/currency.interface.ts (or wherever you prefer to define interfaces)

export interface CurrencyData {
  success: boolean;
  terms: string;
  privacy: string;
  currencies: {
    [key: string]: string; // This defines an object where keys are strings (currency codes) and values are strings (currency names)
  };
}

export interface Currency {
  currencyCode: string;
  name: string;
}