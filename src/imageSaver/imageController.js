import mongoose from 'mongoose'
import fs from 'fs'
import { GridFSBucket, ObjectId } from 'mongodb'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { ImageModel } from '../models/imageModel.js' 

/**
 *
 */
class imageController {
  /**
   * Constructor for the imageController.
   *
   * @param { object } model The model to use for saving images, if set to undefined, there's a default model.
   */
  constructor (model = new ImageModel()) {
    this.Model = model // the model to use for images
  }

  /**
   * Creates a app with all the correct settings for ease of use.
   *
   * @returns { object } A express app object.
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
   * Method to save a image to a mongoDB database.
   * TODO: add a file type checker.
   *
   * @param { File } file the file to upload.
   * @returns { object } The saved image in the DB.
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
      uploadedAt: new Date(),
      updatedAt: new Date()
    })

    console.log('newImage', newImage)

    const saved = await newImage.save()

    const uploadStream = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'images'
    }).openUploadStreamWithId(newImage._id, file.originalname, {
      contentType: file.mimetype
    })

    console.log('newImage' + newImage)

    const fileStream = fs.createReadStream(file.path)
    fileStream.pipe(uploadStream)
      .on('error', function (error) {
        console.error('Error uploading to GridFS:', error)
      })
      .on('finish', async function () {
        console.log('File uploaded to GridFS with id:', newImage._id.toString())
        newImage.fileId = newImage._id.toString()
        await newImage.save()
        fs.unlink(file.path, (err) => {
          if (err) {
            console.log('Error deleting local file:', err)
          } else {
            console.log('Local file deleted:', file.path)
          }
        })
      })

    return saved
  }

  /**
   * Function to retrive a image from the DB.
   * TODO: remove console logs.
   *
   * @param { string } fileId The fileID of the image.
   * @returns { file } the image file.
   */
  async getImage (fileId) {
    if (!fileId) {
      throw new Error('No image provided')
    }

    const image = await this.Model.findOne({ fileId: fileId.toString() })
    if (!image) {
      throw new Error('Image not found')
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'images'
    })

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))

    if (image) {
      const metadata = {
        filename: image.filename,
        mimetype: image.mimetype,
        size: image.size,
        uploadedAt: image.uploadedAt,
        id: image._id,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
        __v: image.__v
      }

      console.log('Image found:', metadata)

      const data = {
        image: downloadStream,
        metadata
      }

      console.log('data:', data)

      return data
    } else {
      console.log('Image not found')
      return null
    }
  }

  /**
   * Function to update a image by replacing it.
   * TODO: fix the not found issue, add a file type checker.
   *
   * @param { string } fileId the fileID of the saved image.
   * @param {file} file the new file to upload.
   * @returns { object } the updated and saved image.
   */
  async updateImage (fileId, file) {
    if (!fileId || !file) {
      throw new Error('No image or file ID provided')
    }
    const existingImage = await this.Model.findOne({ fileId: fileId.toString() })
    if (!existingImage) {
      throw new Error('Image not found')
    }
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'images'
    })
    bucket.delete(new ObjectId(fileId), (error) => {
      if (error) {
        console.error('Error deleting old image from gridfs:', error)
        throw new Error('Failed to delete old image')
      }
      console.log('Old image deleted from gridfs:', fileId)
    })
    const uploadStream = bucket.openUploadStreamWithId(existingImage.fileId, file.originalname, {
      contentType: file.mimetype
    })

    const fileStream = fs.createReadStream(file.path)
    fileStream.pipe(uploadStream)
      .on('error', (error) => {
        console.error('Error uploading new image to gridfs:', error)
      })
      .on('finish', async () => {
        console.log('New image uploaded to GridFS with id:', existingImage._id.toString())
        existingImage.filename = file.originalname
        existingImage.mimetype = file.mimetype
        existingImage.size = file.size
        existingImage.updatedAt = new Date()
        await existingImage.save()
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Error deleting local file:', err)
          } else {
            console.log('Local file deleted:', file.path)
          }
        })
      })
    return existingImage
  }
}

export { imageController }
