import {Express, Request, Response} from 'express'
import {
  createUserHandler,
  requestPasswordReset
} from '../controllers/user.controller'
import {validator} from '../utils/validate'
import {userCreateValidation} from '../../validation/user.validation'

function routes(app: Express) {
  app.get('/healthCheck', (req: Request, res: Response) =>
    res.status(200).send('all good over here !!!!!')
  )

  app.post('/api/createUser', createUserHandler)
  app.post('/api/requestPasswordReset', requestPasswordReset)
}

export default routes
