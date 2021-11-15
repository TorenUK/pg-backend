import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import config from '../../../../config'
import {IUserAuth, UserAuthSchema} from './user.auth'

export interface UserModel extends mongoose.Model<UserDocument> {
  checkExists(email: string): Promise<UserDocument>
  findByEmailWithAuth(email: string): Promise<UserDocument>
  _update(user: UserDocument): unknown
}

export interface UserDocument extends mongoose.Document {
  email: string
  name: string
  auth: IUserAuth[]
  password: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    auth: [UserAuthSchema]
  },
  {timestamps: true}
)

// hooks

userSchema.pre('save', async function (next: Function) {
  let user = this as UserDocument

  if (!user.isModified) {
    return next()
  }

  const salt = await bcrypt.genSalt(config.saltWorkFactor)

  const hash = await bcrypt.hashSync(user.password, salt)

  user.password = hash

  return next()
})

userSchema.statics = {
  checkExists(email: string) {
    return this.findOne({email})
      .lean()
      .then((user) => user)
  },
  findByEmailWithAuth(email: string) {
    return this.findOne({email}).lean()
  },
  _update(user) {
    return this.replaceOne({email: user.email}, user)
  }
}

// schema methods

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false)
}

const UserModelSchema = mongoose.model<UserDocument, UserModel>(
  'User',
  userSchema
)
export default UserModelSchema
