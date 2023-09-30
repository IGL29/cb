import {
  TCurrencies,
  ELocals,
  ECurrencySymbols,
  TValue
} from '~types/filters/transformCurrencyFilter';

const isLocal = (currency: TCurrencies): currency is keyof typeof ECurrencySymbols =>
  currency in ECurrencySymbols;

export function transformCurrencyFilter(
  value: TValue,
  currency: TCurrencies = 'RUB',
  isShowCurrencySymbol: boolean = true
): string {
  const numberValue = typeof value === 'string' ? Number(value) : value;
  let result: null | string = null;

  if (isNaN(numberValue)) {
    return String(value);
  }

  if (!ELocals[currency]) {
    return String(value);
  }

  result = numberValue.toLocaleString(ELocals[currency]);

  if (isLocal(currency) && isShowCurrencySymbol) {
    result = `${result} ${ECurrencySymbols[currency]}`;
  }
  return result;
}
