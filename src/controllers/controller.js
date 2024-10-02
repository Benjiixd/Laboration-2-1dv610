import { ImageModel } from '../models/imageModel.js'
import { imageController } from '../imageSaver/imageController.js'
import express from 'express'
/**
 * Controller class for the server.
 */
export class Controller {
  saver = new imageController(ImageModel)
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

  async get (req, res) {
    if(!req.params.id) {
      res.status(400).send('No image ID provided')
    }
    const data = await this.saver.getImage(req.params.id)
    if (data==undefined || data == null) {
      res.status(404).send('Image not found')
    }
      res.setHeader('Content-Type', data.metadata.mimetype)
      res.setHeader('metadata', JSON.stringify(data.metadata))
      data.image.pipe(res)
  }

  async delete (req, res) {
    const data = this.saver.deleteImage(req.params.id)
    if (data == 1) {
      res.status(200).send('Image deleted')
    }
    res.status(404).send('Image not found')
    
  }

}
