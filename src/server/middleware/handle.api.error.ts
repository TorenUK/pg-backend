import {Request, Response, NextFunction} from 'express'
import {ApiError} from '../errors/api.error'

export const handleApiError = (
  err: ApiError | Error,
  req,
  res: Response,
  next
) => {
  console.error(err)

  if (err instanceof ApiError) {
    return res.status(err.status).json(err.message)
  }

  res.status(500).json('Something went wrong')
}
