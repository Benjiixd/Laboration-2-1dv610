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
      const file = req.file
      console.log(`Received image: ${JSON.stringify(file)}`)
      const imageModel = new ImageModel()
      const saver = new imageController(imageModel)
      await saver.saveImage(file, ImageModel)
      const image = await saver.getImage("66fba1c5c7da1df066a2abb3", ImageModel)
      image.pipe(res)

      

    } catch (err) {
      console.error(err)
    }
  }
}
