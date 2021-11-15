import * as Joi from '@hapi/joi'

const userCreateValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  passwordConfirmation: Joi.string().required().valid(Joi.ref('password'))
})

export {userCreateValidation}
