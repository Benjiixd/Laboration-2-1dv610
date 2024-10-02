import { ImageModel } from '../imageSaver/imageModel.js'
import { ImageController } from '../imageSaver/imageController.js'
/**
 * Controller class for the server.
 */
export class Controller {
  saver = new ImageController(ImageModel)
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
      const data = await this.saver.saveImage(file)
      console.log(`Saved data: ${JSON.stringify(data)}`)
      res.status(200).send('File uploaded with id: ' + data._id)
    } catch (err) {
      console.error(err)
      res.status(500).send('Internal server error')
    }
  }

  /**
   * Function to get an image.
   *
   * @param { object } req request object.
   * @param { object } res response object.
   */
  async get (req, res) {
    if (!req.params.id) {
      res.status(400).send('No image ID provided')
    }
    try {
      const data = await this.saver.getImage(req.params.id)
      res.setHeader('Content-Type', data.metadata.mimetype)
      res.setHeader('metadata', JSON.stringify(data.metadata))
      data.image.pipe(res)
    } catch (err) {
      console.error(err)
      res.status(404).send('Image not found')
    }
  }

  /**
   * Function to delete an image.
   *
   * @param { object } req request object.
   * @param { object } res response object.
   * @returns { object } response object
   */
  async delete (req, res) {
    try {
      const fileId = req.params.id
      if (!fileId) {
        return res.status(400).send('No image ID provided')
      }

      const result = await this.saver.deleteImage(fileId)
      if (result === 1) {
        return res.status(200).send('Image deleted successfully')
      } else {
        return res.status(404).send('Image not found')
      }
    } catch (err) {
      console.error('Error in delete:', err.message)
      return res.status(404).send(err.message)
    }
  }

  /**
   * Function to update an image.
   *
   * @param {object} req request object.
   * @param {object} res response object.
   */
  async update (req, res) {
    try {
      const fileId = req.params.id
      const file = req.file
      if (!fileId) {
        res.status(400).send('No image ID provided')
      }
      const data = await this.saver.updateImage(fileId, file)
      res.status(200).send('Image updated with id: ' + data._id)
    } catch (err) {
      console.error(err)
      res.status(500).send('Internal server error')
    }
  }
}
