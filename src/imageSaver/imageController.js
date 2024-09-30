/**
 *
 */
import { ImageModel } from '../models/imageModel.js'

class imageController {
  /**
   *
   * @param dbString
   * @param model
   */
  constructor (model) {
    this.Model2 = model
  }

  /**
   *
   * @param image
   */
  async saveImage (file, model) {
    if (!file) {
      throw new Error('No image provided')
    }
    if (!file.mimetype) {
        throw new Error('No mimetype provided')
        }

    console.log("file", file)

    const newImage = new model({
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
    })

    console.log("newImage", newImage)

    const saved = await newImage.save()
    return saved
  }

  /**
   *
   */
  getImage () {
    return this.imageSaver.getImage()
  }
}

export { imageController }
