import { ImageModel } from '../models/imageModel.js'
import { imageController } from '../imageSaver/imageController.js'
import express from 'express'
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
      const saver = new imageController(ImageModel)
      await saver.saveImage(file, ImageModel)
      const data = await saver.getImage("66fbe1a08093e3d13982bd30", ImageModel)
      console.log('data in req:', data)
      res.setHeader('Content-Type', data.metadata.mimetype)
      res.setHeader('metadata', JSON.stringify(data.metadata))

      data.image.pipe(res)

      

    } catch (err) {
      console.error(err)
    }
  }
}
