import mongoose from 'mongoose'
import fs from 'fs'
import { GridFSBucket, ObjectId } from 'mongodb'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

/**
 *
 */
class imageController {
  /**
   *
   * @param dbString
   * @param model
   */
  constructor (model) {
    this.Model = model
  }

  /**
   *
   */
  async initializeApp () {
    const app = express()
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(helmet())

    app.use(bodyParser.json())
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

    return app
  }

  /**
   *
   * @param image
   * @param file
   * @param model
   */
  async saveImage (file) {
    if (!file) {
      throw new Error('No image provided')
    }

    console.log('file', file)

    const newImage = new this.Model({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date()
    })

    console.log('newImage', newImage)

    const saved = await newImage.save()

    const uploadStream = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'images'
    }).openUploadStreamWithId(newImage._id, file.originalname, {
      contentType: file.mimetype
    })

    const fileStream = fs.createReadStream(file.path)
    fileStream.pipe(uploadStream)
      .on('error', function (error) {
        console.error('Error uploading to GridFS:', error)
      })
      .on('finish', async function () {
        console.log('File uploaded to GridFS with id:', newImage._id.toString())
        newImage.fileId = newImage._id.toString()
        await newImage.save()
      })
    return saved
  }

  /**
   *
   * @param fileId
   * @param model
   */
  async getImage (fileId) {
    if (!fileId) {
      throw new Error('No image provided')
    }

    const image = this.Model.findOne({ fileId: fileId.toString() })
    if (!image) {
      throw new Error('Image not found')
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'images'
    })

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))

    const image2 = await this.Model.findOne({ fileId })

    if (image2) {
      const metadata = {
        filename: image2.filename,
        mimetype: image2.mimetype,
        size: image2.size,
        uploadedAt: image2.uploadedAt,
        id: image2._id,
        createdAt: image2.createdAt,
        updatedAt: image2.updatedAt,
        __v: image2.__v
      }

      console.log('Image found:', metadata)

      const data = {
        image: downloadStream,
        metadata: metadata
      }

      console.log('data:', data)
      return data
    } else {
      console.log('Image not found')
      return null
    }

    return null
  }
}

export { imageController }
