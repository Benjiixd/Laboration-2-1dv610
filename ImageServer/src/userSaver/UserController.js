/**
 * @file Defines the ShiftController class.
 * @module ShiftController
 * @author Mats Loock
 */

import { UserModel } from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { ShiftModel } from '../models/shiftModel.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Creates a new shift.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - redirect to the index page.
   */
  async create (req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send('Missing required fields');
        }

        const newUser = new UserModel({
            username,
            email,
            password
        })

        console.log(`newUser: ${newUser}`)

        await newUser.save()

        // Process the data (e.g., save to the database)
        // For demonstration, we are just sending a success message

        res.send(`User created: ${newUser}`);
    } catch (error) {
        res.status(500).send(error);
    }
  }

 

  async login (req, res) {
    try {
        const { username, password } = req.body;
        console.log(`username: ${username}`)
        console.log(`password: ${password}`)
        const privateKey = fs.readFileSync('private.pem');
        if (!username || !password) {
            return res.status(400).send('Missing required fields');
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.password !== password) {
            return res.status(401).send('Invalid password');
        }

        const signedUser = await jwt.sign({ username, email: user.email }, privateKey, { algorithm: 'RS256' });
        
        res.json({ token: signedUser});
    } catch (error) {
        res.status(500).send(error);
    }
  }
  /**
   * Deletes the specified shift.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - redirect to the index page.
   */
  async deletePost (req, res) {
  }

  /**
   * Retrieves shifts for a specific user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - Shifts data sent in the response.
   */
  async get (req, res) {
    console.log('ShiftController.get was called')
    const user = req.query.user
    console.log(`user: ${JSON.stringify(user)}`)
    const shifts = await ShiftModel.find({ owner: user })
    console.log(`shifts: ${JSON.stringify(shifts)}`)
    console.log(`shifts: ${shifts}`)
    res.send(shifts)
  }

  async verify (req, res) {
    const token = req.body.token
    const publicKey = fs.readFileSync('public.pem')
    try {
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      res.status(200).send(decoded)
    } catch (error) {
      res.status(401).send(error)
    }
  }
}
