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
      const saver = new imageController(ImageModel)
      await saver.saveImage(file)
      const data = await saver.getImage("66fd04a21c160d11e853619f")
      console.log('data in req:', data)
      res.setHeader('Content-Type', data.metadata.mimetype)
      res.setHeader('metadata', JSON.stringify(data.metadata))

      //const data2 = await saver.updateImage("66fd04a21c160d11e853619f", file)

      const data3 = await saver.getImage("66fd04a21c160d11e853619f")

      data.image.pipe(res)

      

    } catch (err) {
      console.error(err)
    }
  }
}
