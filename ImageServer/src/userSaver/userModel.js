/**
 * @file Defines the Shift model.
 * @module ShiftModel
 * @author Benjamin Karlsson
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from '../imageSaver/baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },

  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  images: {
    type: Array,
    required: false
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const UserModel = mongoose.model('Users', schema)
