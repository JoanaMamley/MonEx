export interface HistData {
    success: boolean;
    terms: string;
    privacy: string,
    historical: boolean,
    date: string,
    timestamp: number,
    source: string,
    quotes: {
    [key: string]: number;
  }
}

export interface HistRateData {
  id: number;
  date: string;
  currency: string;
  rate: number;
}

export interface HistRateDataWithSource extends HistRateData {
  sourceCode: string;
  name: string;
}