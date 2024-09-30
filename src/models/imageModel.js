import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  fileId: {
    type: String, // Change this to String instead of ObjectId
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
  jsonDescription: {
    type: Object,
    required: true
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const ImageModel = mongoose.models.Images || mongoose.model('Images', schema)
