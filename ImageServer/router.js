/**
 * @file Defines the main router.
 * @module router
 * @author Mats Loock
 */

import express from 'express'
import http from 'node:http'

import { router as shiftRouter } from './shiftRouter.js'
import { router as userRouter} from './userRouter.js'

export const router = express.Router()


router.use('/shifts', shiftRouter)
router.use('/users', userRouter)


// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})
