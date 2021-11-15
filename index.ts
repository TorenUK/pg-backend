import * as express from 'express'
import config from './config'
import routes from './src/server/routes/routes'
import {connect} from './src/server/utils/connect'
import {handleApiError} from './src/server/middleware/handle.api.error'
import * as dotenv from 'dotenv'

const app = express()
dotenv.config()

const PORT = config.port

app.use(express.json())

routes(app)

app.use(handleApiError)

app.listen(PORT, async () => {
  console.log(`SERVER LISTENING ON PORT ${PORT}`)

  await connect()
})

export default app
