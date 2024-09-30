import express from 'express'
import dotenv from 'dotenv'
import { router } from './routes/router.js'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connectToDatabase } from './config/mongoose.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(helmet())
// parse application/json
app.use(bodyParser.json())

app.use('/', router)

const server = app.listen(2020, async () => {
  try {
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
  } catch (err) {
    console.error(err)
  }
  console.log(`Server running on port ${server.address().port}`)
})
