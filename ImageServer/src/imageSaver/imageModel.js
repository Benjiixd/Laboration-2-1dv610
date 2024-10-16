import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// default schema for the images module.
const schema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  fileId: {
    type: String,
    required: false
  },
  mimetype: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  size: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  metadata: {
    type: Object,
    required: false
  }

})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const ImageModel = mongoose.models.Images || mongoose.model('Images', schema)
