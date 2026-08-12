import { convertToTimezone, TIMEZONE_IDS, getUtcDatetime } from "./date.helper";

describe('Date Helper Tests', () => {
  it('should have correct local datetime components when converting datetime string', () => {
    const localDtStr = '2026-08-10';
    const localTzId = TIMEZONE_IDS.PACIFIC;
    const localDt = convertToTimezone(localDtStr, localTzId);
    expect(localDt.year()).toBe(2026);
    expect(localDt.month()).toBe(7);
    expect(localDt.date()).toBe(10);
    expect(localDt.hour()).toBe(0);
    expect(localDt.minute()).toBe(0);
    expect(localDt.second()).toBe(0);
  });

  it('should have correct local datetime components when converting UTC datetime', () => {
    const utcDtStr = '2026-08-10 22:00:00';
    const utcDt = getUtcDatetime(utcDtStr);
    const localTzId = TIMEZONE_IDS.PACIFIC;
    const localConvertedDt = convertToTimezone(utcDt, localTzId);
    
    expect(utcDt.hour()).toBe(22);
    expect(localConvertedDt.hour()).toBe(15);
    expect(localConvertedDt.date()).toBe(utcDt.date());
    expect(utcDt.diff(localConvertedDt)).toBe(0);
  });
});
