import dotenv from 'dotenv'
import { router } from './routes/router.js'
import { connectToDatabase } from './config/mongoose.js'
import { ImageController } from './imageSaver/imageController.js'
import { ImageModel } from './imageSaver/imageModel.js'

dotenv.config()

const controller = new ImageController(ImageModel)
const app = await controller.initializeApp()

app.use('/', router)

const server = app.listen(3020, async () => {
  try {
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
  } catch (err) {
    console.error(err)
  }
  console.log(`Server running on port ${server.address().port}`)
})
