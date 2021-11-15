import * as httpStatus from 'http-status'

export class ApiError {
  status: number
  message: string

  constructor(status: number, message: string) {
    this.status = status
    this.message = message
  }

  static badRequest(msg) {
    return new ApiError(httpStatus.BAD_REQUEST, msg)
  }

  static validation(msg) {
    return new ApiError(httpStatus.BAD_REQUEST, msg)
  }

  static unauthorized(msg) {
    return new ApiError(httpStatus.UNAUTHORIZED, msg)
  }

  static notFound(msg) {
    return new ApiError(httpStatus.NOT_FOUND, msg)
  }

  static internal(msg) {
    return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, msg)
  }
}
