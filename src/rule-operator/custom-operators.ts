/**
 * Custom Operators for JSON Rules Engine
 * 
 * This module defines custom operators that extend the functionality of the json-rules-engine
 * library. These operators provide specialized validation and comparison logic for the
 * onRouteBC policy engine.
 */

import { Operator } from 'json-rules-engine';
import { CustomOperator, PermitAppInfo } from 'onroute-policy-engine/enum';
import dayjs from 'dayjs';

/**
 * Validates that the input is a string type
 * @param a - The value to validate
 * @returns True if the value is a string, false otherwise
 */
function stringValidator(a: any): boolean {
  return typeof a === 'string';
}

/**
 * Validates that the input is a valid date string in the permit application format
 * @param a - The date string to validate
 * @returns True if the date string is valid, false otherwise
 */
function dateStringValidator(a: any): boolean {
  const d = dayjs(a, PermitAppInfo.PermitDateFormat.toString());
  return d.isValid();
}

/**
 * Validates that the input is an array
 * @param a - The value to validate
 * @returns True if the value is an array, false otherwise
 */
function arrayValidator(a: any): boolean {
  return Array.isArray(a);
}

// Array to store all custom operators
const CustomOperators: Array<Operator> = [];

/**
 * String Minimum Length Operator
 * 
 * Checks if a string has a minimum length after trimming whitespace.
 * Returns false if the input is falsy (null, undefined, empty string).
 */
CustomOperators.push(
  new Operator(
    CustomOperator.StringMinimumLength,
    (a: string, b: number) => {
      // Return false for falsy values
      if (!a) return false;

      // Check if trimmed string length meets minimum requirement
      return a.trim().length >= b;
    },
    stringValidator,
  ),
);

/**
 * Date Less Than Operator
 * 
 * Compares two date strings in permit application format.
 * Returns true if the first date is before the second date.
 */
CustomOperators.push(
  new Operator(
    CustomOperator.DateLessThan,
    (a: string, b: string) => {
      // Parse both dates using the permit application date format
      const firstDate = dayjs(a, PermitAppInfo.PermitDateFormat.toString());
      const secondDate = dayjs(b, PermitAppInfo.PermitDateFormat.toString());
      
      // Return true if first date is before second date (difference is negative)
      return firstDate.diff(secondDate) < 0;
    },
    dateStringValidator,
  ),
);

/**
 * Regular Expression Operator
 * 
 * Tests if a string matches a regular expression pattern.
 * Uses RegExp.exec() to check for matches.
 */
CustomOperators.push(
  new Operator(
    CustomOperator.Regex,
    (a: string, b: string) => RegExp(b).exec(a) !== null,
    stringValidator,
  ),
);

/**
 * Is Empty Array Operator
 * 
 * Checks if an array is empty (has length 0).
 */
CustomOperators.push(
  new Operator(
    CustomOperator.IsEmptyArray,
    (arr) => arr.length === 0,
    arrayValidator,
  ),
);

export { CustomOperators };
