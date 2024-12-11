import { Policy } from 'onroute-policy-engine';
import { PermitAppInfo } from 'onroute-policy-engine/enum';
import completePolicyConfig from '../_test/policy-config/_current-config.json';
import testStos from '../_test/permit-app/test-stos.json';
import dayjs from 'dayjs';

async function start() {
  const policy: Policy = new Policy(completePolicyConfig);

  // Set startDate to today
  testStos.permitData.startDate = dayjs().format(
    PermitAppInfo.PermitDateFormat.toString(),
  );

  const validationResult2 = await policy.validate(testStos);
  console.log(JSON.stringify(validationResult2, null, '   '));
}

start();
