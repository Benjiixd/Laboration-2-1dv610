import express from 'express'
import dotenv from 'dotenv'
import { router } from './routes/router.js'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connectToDatabase } from './config/mongoose.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(helmet())
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.json())
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

app.use('/', router)

const server = app.listen(2020, async () => {
  try {
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
  } catch (err) {
    console.error(err)
  }
  console.log(`Server running on port ${server.address().port}`)
})
