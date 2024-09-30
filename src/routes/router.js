import express from 'express'
import { Controller } from '../controllers/controller.js'

export const router = express.Router()

const controller = new Controller()

router.post('/', controller.post)
