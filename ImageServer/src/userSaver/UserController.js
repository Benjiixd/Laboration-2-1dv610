/**
 * @file Defines the UserController class.
 * @module UserController
 */

import { UserModel } from './userModel.js'
import jwt from 'jsonwebtoken'
import fs from 'fs'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Creates a new .
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - redirect to the index page.
   */
  async createUser (req, res) {
    try {
      const { username, password } = req.body
      if (!username || !password) {
        return res.status(400).send('Missing required fields')
      }
      const existingUser = await UserModel.findOne({ username })
      if (existingUser) {
        return res.status(400).send('User already exists')
      }
      const newUser = new UserModel({
        username,
        password
      })
      await newUser.save()
      res.status(200).send(`User created: ${newUser}`)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  /**
   * Function that logs a user in.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - redirect to the index page.
   */
  async login (req, res) {
    try {
      const { username, password } = req.body
      const privateKey = fs.readFileSync('private.pem')
      if (!username || !password) {
        return res.status(400).send('Missing required fields')
      }
      const user = await UserModel.findOne({ username })
      if (!user) {
        return res.status(404).send('User not found')
      }
      if (user.password !== password) {
        return res.status(401).send('Invalid password')
      }
      const signedUser = await jwt.sign({ username, email: user.email }, privateKey, { algorithm: 'RS256' })
      res.json({ token: signedUser })
    } catch (error) {
      res.status(500).send(error)
    }
  }

  /**
   * Function that verifies a JWT token.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async verifyJWT (req, res) {
    const token = req.body.token
    const publicKey = fs.readFileSync('public.pem')
    try {
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
      res.status(200).send(decoded)
    } catch (error) {
      res.status(401).send(error)
    }
  }

  /**
   * Function that adds an image to a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - redirect to the index page.
   */
  async addImage (req, res) {
    try {
      const { username, imageId } = req.body
      if (!username || !imageId) {
        return res.status(400).send('Missing required fields')
      }
      const user = await UserModel.findOne({ username })
      if (!user) {
        return res.status(404).send('User not found')
      }
      user.images.push(imageId)
      await user.save()
      res.send(user)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  /**
   * Function that gets all the images of a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - redirect to the index page.
   */
  async getUsersImages (req, res) {
    try {
      const user = await UserModel.findOne({ username: req.body.username })
      if (!user) {
        return res.status(404).send('User not found')
      }
      res.json(user.images)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
