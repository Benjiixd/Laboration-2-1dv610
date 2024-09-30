import express from 'express'
import { Controller } from '../controllers/controller.js'
import multer from 'multer'

export const router = express.Router()
const upload = multer({ dest: 'uploads/' })

const controller = new Controller()

router.post('/', upload.single('image'), controller.post)
