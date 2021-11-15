import {Request, Response, NextFunction} from 'express'
import {ApiError} from '../errors/api.error'
import UserModel, {UserDocument} from '../models/user/user.model'
import * as _ from 'lodash'
import * as moment from 'moment'
import {getRandomString, hashPassword} from '../helpers/crypt'
import {userCreateValidation} from '../../validation/user.validation'
import UserAuth from '../models/user/user.auth'

export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = _.get(req.body, 'email', '')

  try {
    const existingUser = await UserModel.checkExists(email)

    if (existingUser) {
      return next(ApiError.badRequest('User with that email already exists!'))
    }

    const {error} = userCreateValidation.validate(req.body)

    if (error) {
      return next(
        ApiError.validation(`${error.details.map((e) => e.message).join(', ')}`)
      )
    }

    const newUser = await UserModel.create(req.body)

    res.status(201).json(newUser)
  } catch (e) {
    return next(e)
  }
}

export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = _.get(req.body, 'email', '')

    const userAndToken = await Promise.all([
      UserModel.findByEmailWithAuth(email),
      getRandomString(30)
    ])

    const [user, token] = userAndToken

    if (!user) {
      return next(ApiError.notFound('User not found'))
    }

    user.auth = user.auth.filter((a) => a.type !== 'password-reset')

    const newAuth = new UserAuth({
      type: 'password-reset',
      auth: token,
      expiry: moment().add(1, 'days').toDate()
    })

    user.auth.push(newAuth)

    await UserModel._update(user)

    // Todo - email service
    const {auth} = user.auth.filter((a) => a.type === 'password-reset')[0]

    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
}
