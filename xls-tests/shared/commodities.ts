import { Policy } from '../../src/policy-engine';
import { Commodity } from '../../src/types';

// Workbook commodity names that are different from the names in the policy JSON.
const WORKBOOK_COMMODITY_ALIASES: Record<string, string> = {
  'Tow Trucks and Disabled Vehicles': 'Tow Trucks And Disabled Vehicles',
  'Scrapers on Dollies': 'Scraper on Dollies',
};

/** Returns the policy commodities that have the workbook commodity name. */
export function findCommodities(
  policy: Policy,
  workbookName: string,
): Commodity[] {
  const policyName = WORKBOOK_COMMODITY_ALIASES[workbookName] || workbookName;
  return policy.policyDefinition.commodities.filter(
    (commodity) => commodity.name === policyName,
  );
}

/** Returns the one policy commodity for the workbook name, or throws. */
export function getOnlyCommodity(
  commodities: Commodity[],
  workbookName: string,
): Commodity {
  if (commodities.length !== 1) {
    throw new Error(
      `Expected one policy commodity for spreadsheet commodity '${workbookName}', found ${commodities.length}`,
    );
  }
  return commodities[0];
}
