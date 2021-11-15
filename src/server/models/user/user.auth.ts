import * as mongoose from 'mongoose'

export interface IUserAuth {
  type: string
  auth: string
  expiry: Date
  salt?: string
}

export const UserAuthSchema = new mongoose.Schema<IUserAuth>(
  {
    type: {
      type: String,
      required: true,
      enum: ['password', 'password-reset', 'jwt']
    },
    auth: {
      type: String,
      required: true
    },
    expiry: {
      type: Date,
      required: true
    },
    salt: {
      type: String,
      required: false
    }
  },
  {_id: false}
)

export default mongoose.model('user_auth', UserAuthSchema)
