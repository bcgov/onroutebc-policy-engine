import { Operator } from 'json-rules-engine';
import { CustomOperator, PermitAppInfo } from 'onroute-policy-engine/enum';
import dayjs from 'dayjs';

function stringValidator(a: any): boolean {
  return typeof a === 'string';
}

function dateStringValidator(a: any): boolean {
  const d = dayjs(a, PermitAppInfo.PermitDateFormat.toString());
  return d.isValid();
}

function arrayValidator(a: any): boolean {
  return Array.isArray(a);
}

const CustomOperators: Array<Operator> = [];

CustomOperators.push(
  new Operator(
    CustomOperator.StringMinimumLength,
    (a: string, b: number) => {
      if (!a) return false;

      return a.trim().length >= b;
    },
    stringValidator,
  ),
);

CustomOperators.push(
  new Operator(
    CustomOperator.DateLessThan,
    (a: string, b: string) => {
      const firstDate = dayjs(a, PermitAppInfo.PermitDateFormat.toString());
      const secondDate = dayjs(b, PermitAppInfo.PermitDateFormat.toString());
      return firstDate.diff(secondDate) < 0;
    },
    dateStringValidator,
  ),
);

CustomOperators.push(
  new Operator(
    CustomOperator.Regex,
    (a: string, b: string) => RegExp(b).exec(a) !== null,
    stringValidator,
  ),
);

CustomOperators.push(
  new Operator(
    CustomOperator.IsEmptyArray,
    (arr) => arr.length === 0,
    arrayValidator,
  ),
);

export { CustomOperators };
