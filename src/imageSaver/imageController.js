/**
 *
 */
import { ImageModel } from '../models/imageModel.js'
import mongoose from 'mongoose'
import fs from 'fs'
import { GridFSBucket, ObjectId } from 'mongodb'

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
  getImage (fileId) {
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

    return downloadStream
  }
}

export { imageController }
