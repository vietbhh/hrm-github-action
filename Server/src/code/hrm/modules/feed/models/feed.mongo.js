import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const feedSchema = baseSchema("m_feed", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  permission_ids: {
    type: [mongoose.Schema.Types.ObjectId]
  },
  permission: {
    type: String,
    enum: ["default", "workspace", "employee", "only_me"]
  },
  content: {
    type: String
  },
  type: {
    type: String,
    enum: ["post", "image", "video"]
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
  approve_status: {
    type: String,
    enum: ["approved", "rejected"],
    default: "approve"
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
  sort_number: {
    type: Number
  }
  // **
})

const feedMongoModel = model("feedMongoModel", feedSchema)
export default feedMongoModel
