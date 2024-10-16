/**
 * @file Defines the shift router.
 * @module shiftRouter
 * @author Mats Loock
 */
// src/routes/ShiftRouter.js
import express from 'express'
import { UserController } from '../controllers/UserController.js'

export const router = express.Router()

const controller = new UserController()

router.get('/', (req, res, next) => controller.get(req, res, next))

router.post('/create', (req, res, next) => controller.create(req, res, next))

router.post('/login', (req, res, next) => controller.login(req, res, next))

router.post('/delete', (req, res, next) => controller.deletePost(req, res, next))

router.post('/verify', (req, res, next) => controller.verify(req, res, next))
