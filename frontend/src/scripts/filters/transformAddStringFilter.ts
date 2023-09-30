import { TValue, TAddingValue, TPosition } from '~types/filters/transformAddStringFilter';

function transformAddStringFilter(
  value: TValue,
  addingValue: TAddingValue,
  pos: TPosition = 'end'
): string {
  if (pos === 'end') {
    return value + addingValue;
  }
  if (pos === 'begin') {
    return addingValue + value;
  }
  return value;
}

export { transformAddStringFilter };
