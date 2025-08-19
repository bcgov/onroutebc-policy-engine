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
  
  next()
}
