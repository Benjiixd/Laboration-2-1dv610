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
import { imageController } from './imageSaver/imageController.js'
import { ImageModel } from './models/imageModel.js'

dotenv.config()

const controller = new imageController(ImageModel)
const app = await controller.initializeApp() 



app.use('/', router)

const server = app.listen(2020, async () => {
  try {
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
  } catch (err) {
    console.error(err)
  }
  console.log(`Server running on port ${server.address().port}`)
})
