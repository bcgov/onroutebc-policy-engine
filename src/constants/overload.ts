export const BASE_OVERLOAD_LIMIT = 28000;
export const EXTRA_WEIGHT_INTERVAL = 900;
export const EXTRA_RATE_INCREMENT = 1.85;
export const DEFAULT_MAX_RATE = 21.4;
export const MINIMUM_OVERLOAD_FEE = 25;

// Overload permit fee rate table mapping up to 28,000 kg
export const OVERLOAD_RATES_PER_10KM = [
  { max: 2000, rate: 0.95 },
  { max: 3000, rate: 1.15 },
  { max: 4000, rate: 1.4 },
  { max: 5000, rate: 1.6 },
  { max: 6000, rate: 1.85 },
  { max: 7000, rate: 2.15 },
  { max: 8000, rate: 2.45 },
  { max: 9000, rate: 2.95 },
  { max: 10000, rate: 3.35 },
  { max: 11000, rate: 3.75 },
  { max: 12000, rate: 4.25 },
  { max: 13000, rate: 4.95 },
  { max: 14000, rate: 5.6 },
  { max: 15000, rate: 6.25 },
  { max: 16000, rate: 7.25 },
  { max: 17000, rate: 8.25 },
  { max: 18000, rate: 9.15 },
  { max: 19000, rate: 10.1 },
  { max: 20000, rate: 10.9 },
  { max: 21000, rate: 11.85 },
  { max: 22000, rate: 12.7 },
  { max: 23000, rate: 13.95 },
  { max: 24000, rate: 14.95 },
  { max: 25000, rate: 16.1 },
  { max: 26000, rate: 17.85 },
  { max: 27000, rate: 19.85 },
  { max: 28000, rate: 21.4 },
];
