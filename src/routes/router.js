import express from 'express'
import { Controller } from '../controllers/controller.js'
import multer from 'multer'

const upload = multer({ dest: 'uploads/' })
export const router = express.Router()

const controller = new Controller()

router.post('/', upload.single('file'), (req, res, next) => controller.post(req, res))
router.get('/:id', (req, res, next) => controller.get(req, res))
router.delete('/:id', (req, res, next) => controller.delete(req, res))
