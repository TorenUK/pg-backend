import * as mongoose from 'mongoose'

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI)
    console.log('mongoose connected')
  } catch (e) {
    console.log(e)
  }
}
