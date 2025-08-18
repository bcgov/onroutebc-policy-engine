import { Request, Response, NextFunction } from 'express'
import { createError } from './errorHandler'

export const validatePermitRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { permitType, permitData } = req.body
  
  if (!permitType) {
    return next(createError('permitType is required', 400))
  }
  
  if (!permitData) {
    return next(createError('permitData is required', 400))
  }
  
  if (typeof permitType !== 'string') {
    return next(createError('permitType must be a string', 400))
  }
  
  if (typeof permitData !== 'object' || permitData === null) {
    return next(createError('permitData must be an object', 400))
  }
  
  // Basic validation for required permit data fields
  const requiredFields = ['companyName', 'clientNumber', 'vehicleConfiguration']
  for (const field of requiredFields) {
    if (!permitData[field]) {
      return next(createError(`${field} is required in permitData`, 400))
    }
  }
  
  // Validate vehicle configuration
  const { vehicleConfiguration } = permitData
  if (!vehicleConfiguration.overallLength || !vehicleConfiguration.overallWidth) {
    return next(createError('Vehicle dimensions are required', 400))
  }
  
  next()
}
