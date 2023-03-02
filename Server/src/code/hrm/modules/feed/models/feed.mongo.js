import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const feedSchema = baseSchema("m_feed", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  permission_ids: {
    type: [String],
    default: []
  },
  permission: {
    type: String,
    enum: ["default", "workspace", "employee", "only_me"],
    default: "default"
  },
  content: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: ["post", "image", "video"],
    default: "post"
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
    default: "approved"
  },
  reaction: {
    type: [
      {
        react_type: {
          type: String
        },
        react_user: {
          type: [String]
        }
      }
    ],
    default: []
  },
  comment_ids: {
    type: [String],
    default: []
  },

  // ** source child / post: 1 image/video
  source: {
    type: String,
    default: null
  },
  thumb: {
    type: String,
    default: null
  },
  // **

  // ** feed child
  ref: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  sort_number: {
    type: Number,
    default: 0
  }
  // **
})

const feedMongoModel = model("feedMongoModel", feedSchema)
export default feedMongoModel
