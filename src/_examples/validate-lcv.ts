import { Policy } from 'onroute-policy-engine';
import { PermitAppInfo } from 'onroute-policy-engine/enum';

import trosOnly from '../_test/policy-config/tros-only.sample.json';
import specialAuth from '../_test/policy-config/special-auth-lcv.sample.json';
import validTros30Day from '../_test/permit-app/valid-tros-30day.json';
import {
  convertToTimezone,
  getUtcDatetime,
  TIMEZONE_IDS,
} from '../helper/date.helper';
import { POWER_UNIT_CODES } from '../constants/power-unit-codes';

async function start() {
  const policy: Policy = new Policy(trosOnly, specialAuth);

  // Set startDate to today
  validTros30Day.permitData.startDate = convertToTimezone(
    getUtcDatetime(),
    TIMEZONE_IDS.PACIFIC,
  ).format(PermitAppInfo.PermitDateFormat.toString());

  // Set an LCV vehicle type
  validTros30Day.permitData.vehicleDetails.vehicleSubType =
    POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES;

  const validationResult2 = await policy.validate(validTros30Day);
  console.log(JSON.stringify(validationResult2, null, '   '));
}

start();
