import mongoose from 'mongoose'
import fs from 'fs'
import { GridFSBucket, ObjectId } from 'mongodb'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { ImageModel } from '../imageSaver/imageModel.js'

/**
 *
 */
class ImageController {
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

    // Return the app object
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

    // Create a new image object
    const newImage = new this.Model({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
      updatedAt: new Date()
    })
    const saved = await newImage.save()

    // Based of the new image object, create a new upload stream.
    const uploadStream = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'images'
    }).openUploadStreamWithId(newImage._id, file.originalname, {
      contentType: file.mimetype
    })

    // Read the file and pipe it to the upload stream in order to store it in the DB.
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
   *
   * @param { string } fileId The fileID of the image.
   * @returns { file } the image file.
   */
  async getImage (fileId) {
    try {
      if (!fileId) {
        throw new Error('No image ID provided')
      }

      // Find the image document in MongoDB
      const image = await this.Model.findOne({ fileId: fileId.toString() })
      if (!image) {
        throw new Error('Image not found')
      }
      // Create a new GridFSBucket for the images collection
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'images'
      })
      const fileExists = await bucket.find({ _id: new ObjectId(fileId) }).hasNext()
      if (!fileExists) {
        throw new Error(`File not found in GridFS with ID: ${fileId}`)
      }
      // Open a download stream for the image file
      const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))
      if (!downloadStream) {
        throw new Error('Failed to open download stream')
      }
      // Return the download stream and metadata
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
        const data = {
          image: downloadStream,
          metadata
        }
        return data
      } else {
        console.log('Image not found')
        throw new Error('Image not found')
      }
    } catch (err) {
      console.log(err)
      throw new Error('Image not found')
    }
  }

  /**
   * Function to delete an image from the DB.
   *
   * @param {string} fileId - The fileID of the image.
   * @returns {number} - Returns 1 if the image was deleted successfully.
   */
  async deleteImage (fileId) {
    try {
      if (!fileId) {
        throw new Error('No image ID provided')
      }

      // Find the image document in MongoDB
      const image = await this.Model.findOne({ fileId: fileId.toString() })
      if (!image) {
        throw new Error('Image not found in MongoDB')
      }

      // Delete the image document from MongoDB
      await image.deleteOne()
      console.log('Image deleted from MongoDB:', fileId)

      return 1 // Return success
    } catch (err) {
      console.error('Error in deleteImage:', err.message)
      throw err
    }
  }

  /**
   * Function to update an image by replacing it.
   * TODO: Make this actually work.
   *
   * @param {string} fileId - The fileID of the saved image.
   * @param {file} file - The new file to upload.
   * @returns {object} - The updated and saved image.
   */
  async updateImage (fileId, file) {
    console.log('TEST_______________________________')

    if (!fileId || !file) {
      throw new Error('No image or file ID provided')
    }

    // Find the existing image document
    const existingImage = await this.Model.findOne({ fileId: fileId.toString() })

    if (!existingImage) {
      throw new Error('Image not found')
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'images'
    })

    // Ensure that the file exists in GridFS before attempting to delete it
    const fileExists = await bucket.find({ _id: new ObjectId(fileId) }).hasNext()

    if (!fileExists) {
      throw new Error(`File not found in GridFS with ID: ${fileId}`)
    }

    // Delete the old image file from GridFS
    await new Promise((resolve, reject) => {
      bucket.delete(new ObjectId(fileId), (error) => {
        if (error) {
          console.error('Error deleting old image from GridFS:', error)
          return reject(new Error('Failed to delete old image'))
        }
        console.log('Old image deleted from GridFS:', fileId)
        resolve()
      })
    })

    console.log('TEST2_______________________________')

    // Upload the new image using the same fileId and _id
    const uploadStream = bucket.openUploadStreamWithId(new ObjectId(fileId), file.originalname, {
      contentType: file.mimetype
    })

    console.log('TEST3_______________________________')

    const fileStream = fs.createReadStream(file.path)
    fileStream.pipe(uploadStream)
      .on('error', (error) => {
        console.error('Error uploading new image to GridFS:', error)
      })
      .on('finish', async () => {
        console.log('New image uploaded to GridFS with id:', existingImage._id.toString())

        // Update the metadata in the MongoDB document
        existingImage.filename = file.originalname
        existingImage.mimetype = file.mimetype
        existingImage.size = file.size
        existingImage.updatedAt = new Date()
        await existingImage.save()

        // Optionally delete the local file after upload
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

export { ImageController }
