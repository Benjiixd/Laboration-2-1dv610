import { ImageModel } from '../models/imageModel.js'
import { imageController } from '../imageSaver/imageController.js'

/**
 * Controller class for the server.
 */
export class Controller {
  /**
   * Function for handling a post.
   *
   * @param {object} req request object.
   * @param {object} res response object.
   */
  async post (req, res) {
    try {
      console.log(`Received data: ${JSON.stringify(req.body)}`)
      const { image } = req.image
      const imageModel = new ImageModel()
      const saver = new imageController(imageModel)
      await saver.saveImage(image)

      

    } catch (err) {
      console.error(err)
    }
  }
}
