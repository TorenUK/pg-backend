import * as crypto from 'crypto'

export const getRandomString = (length: number): Promise<Error | string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buffer) => {
      if (err) {
        return reject(err)
      }

      return resolve(buffer.toString('hex').slice(0, length))
    })
  })
}

export function hashPassword(password, salt) {
  return crypto.createHmac('sha512', salt).update(password).digest('hex')
}
