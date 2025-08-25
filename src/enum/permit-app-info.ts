/**
 * This enum represents a subset of commonly-used paths and
 * other information in permit applications which may be
 * referenced from within source code.
 */
export enum PermitAppInfo {
  AxleConfiguration = '$.vehicleConfiguration.axleConfiguration',
  CompanyName = '$.companyName',
  Commodity = '$.permittedCommodity.commodityType',
  PermitData = 'permitData',
  PermitDateFormat = 'YYYY-MM-DD',
  PermitDuration = '$.permitDuration',
  PermitStartDate = '$.startDate',
  PermitType = 'permitType',
  PowerUnitType = '$.vehicleDetails.vehicleSubType',
  TotalDistance = '$.permittedRoute.manualRoute.totalDistance',
  TrailerList = '$.vehicleConfiguration.trailers',
  VehicleConfiguration = '$.vehicleConfiguration',
  VehicleDetails = '$.vehicleDetails',
}
