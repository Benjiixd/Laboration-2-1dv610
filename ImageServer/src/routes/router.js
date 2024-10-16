import express from 'express'
import { router as imageRouter } from '../imageSaver/imageRouter.js'
import { router as userRouter } from '../userSaver/userRouter.js'
import http from 'http'

export const router = express.Router()

router.use('/images', imageRouter)
router.use('/users', userRouter)

router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})

