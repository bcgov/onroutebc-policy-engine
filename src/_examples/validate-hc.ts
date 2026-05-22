import { Policy } from 'onroute-policy-engine';
import { PermitAppInfo } from 'onroute-policy-engine/enum';
import hcOnly from '../_test/policy-config/_current-config.json';
import validHc from '../_test/permit-app/valid-hcp.json';
import dayjs from 'dayjs';

async function start() {
  const policy: Policy = new Policy(hcOnly);

  // Set startDate to today
  const today = dayjs();

  validHc.permitData.startDate = today.format(
    PermitAppInfo.PermitDateFormat.toString(),
  );

  // Set expiryDate to end of year (based on today's date)
  validHc.permitData.expiryDate = today.endOf("year").format(
    PermitAppInfo.PermitDateFormat.toString(),
  );
  
  const validationResult2 = await policy.validate(validHc);
  console.log(JSON.stringify(validationResult2, null, '   '));
}

start();
