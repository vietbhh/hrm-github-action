import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const feedSchema = baseSchema("m_feed", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  workspace: {
    type: {
      ids: [mongoose.Schema.Types.ObjectId],
      permission: {
        type: String,
        enum: ["default", "workspace", "employee", "only_me"]
      }
    },
    default: {}
  },
  content: {
    type: String
  },
  type: {
    type: String,
    enum: ["post", "image", "video"]
  },

  // ** source child / post: 1 image/video
  source: {
    type: String
  },
  thumb: {
    type: String
  },
  // **

  // ** feed child
  ref: {
    type: mongoose.Schema.Types.ObjectId
  },
  medias: {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId
        },
        type: {
          type: String,
          enum: ["image", "video"]
        },
        source: {
          type: String
        },
        thumb: {
          type: String
        }
      }
    ],
    default: []
  },
  // **

  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

const feedMongoModel = model("feedMongoModel", feedSchema)
export default feedMongoModel
