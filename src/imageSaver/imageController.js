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
    await this.model.save(image)
    return "Image saved"
  }

  /**
   *
   */
  getImage () {
    return this.imageSaver.getImage()
  }
}

export { imageController }
