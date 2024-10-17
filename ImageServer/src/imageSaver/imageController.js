import mongoose from 'mongoose'
import fs from 'fs'
import { GridFSBucket, ObjectId } from 'mongodb'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { ImageModel } from './imageModel.js'

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
    app.use(express.json())
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
  async saveImage (file, metadata) {
    if (!file) {
      throw new Error('No image provided')
    }

    // Create a new image object
    const newImage = new this.Model({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
      updatedAt: new Date(),
      metadata: metadata
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
          __v: image.__v,
          title: image.metadata.title,
          description: image.metadata.description,
          isDirty: image.metadata.isDirty
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

async changeIsDirty(fileId) {
  try {
    console.log("changing");
    if (!fileId) {
      throw new Error('No image ID provided');
    }

    // BENEATH IS MADE WITH CHATGPT CAUSE WTF IS THAT
    const image = await this.Model.findOneAndUpdate(
      { fileId: fileId.toString() },
      [
        {
          $set: {
            'metadata.isDirty': { $not: '$metadata.isDirty' },
          },
        },
      ],
      { new: true }
    );

    if (!image) {
      throw new Error('Image not found in MongoDB');
    }

    console.log('isDirty changed:', image.metadata.isDirty);
    return 1; // Return success
  } catch (err) {
    console.error('Error in changeIsDirty:', err.message);
    throw err;
  }
}
    


}

export { ImageController }
