export type TCurrencies = keyof typeof ELocals;

export enum ELocals {
  'RUB' = 'ru-RU',
  'AUD' = 'en-AU',
  'BTC' = 'ru-RU',
  'BYR' = 'be-BY',
  'CAD' = 'en-CA',
  'CHF' = 'en-CH',
  'CNH' = 'en-CN',
  'ETH' = 'ru-RU',
  'EUR' = 'en-EN',
  'GBP' = 'en-GB',
  'HKD' = 'en-HK',
  'JPY' = 'ja-JP',
  'NZD' = 'en-NZ',
  'UAH' = 'uk-UA',
  'USD' = 'en-US'
}

export enum ECurrencySymbols {
  'RUB' = '₽'
}

export type TValue = string | number;
