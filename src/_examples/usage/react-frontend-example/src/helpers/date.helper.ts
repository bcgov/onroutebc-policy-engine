import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(quarterOfYear);

export const TIMEZONE_IDS = {
  PACIFIC: 'Canada/Pacific',
};

export const DATE_FORMATS = {
  DATE_ONLY: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
};

/**
 * Convert a datetime to a specified timezone.
 * 
 * @param datetime Datetime to be converted
 * @param timezoneId Timezone identifier (eg. 'Canada/Pacific')
 * @returns Dayjs object in the specified timezone
 */
export const convertToTimezone = (
  datetime: string | Dayjs | Date,
  timezoneId: string,
) => {
  return dayjs.tz(datetime, timezoneId);
};

/**
 * Get UTC datetime.
 * 
 * @returns Dayjs object representing datetime in UTC
 */
export const getUtcDatetime = (datetime?: Dayjs | Date | string) => {
  return dayjs.utc(datetime);
};

/**
 * Get datetime representing the end of the quarter for a given datetime.
 * @param datetime Datetime being used for reference
 * @returns Dayjs object representing the end of the quarter for the inputted datetime
 */
export const getEndOfQuarter = (datetime: Dayjs) => {
  return datetime.endOf('quarter');
};
