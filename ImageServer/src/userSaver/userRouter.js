/**
 * @file Defines the shift router.
 * @module shiftRouter
 */
// src/routes/ShiftRouter.js
import express from 'express'
import { UserController } from './UserController.js'

export const router = express.Router()

const controller = new UserController()

router.post('/images', (req, res, next) => controller.getUsersImages(req, res, next))

router.post('/create', (req, res, next) => controller.createUser(req, res, next))

router.post('/login', (req, res, next) => controller.login(req, res, next))

router.post('/verify', (req, res, next) => controller.verifyJWT(req, res, next))

router.post('/addImage', (req, res, next) => controller.addImage(req, res, next))
