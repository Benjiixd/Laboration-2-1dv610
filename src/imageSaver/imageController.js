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
    this.model = model
  }

  /**
   *
   * @param image
   */
  async saveImage (image) {
    if (!image) {
      throw new Error('No image provided')
    }
    if (!image.mimetype) {
        throw new Error('No mimetype provided')
        }

    const newImage = {
        filename: image.originalName,
        mimetype: image.mimetype,
        size: image.size,
        uploadedAt: new Date()
    }
    const saved = await this.model.save(newImage)
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
