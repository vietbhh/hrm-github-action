import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const workspaceSchema = baseSchema("m_workspace", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  cover_image: {
    type: String,
    required: false
  },
  rules: {
    type: String
  },
  type: {
    type: String,
    enum: ["public", "private"],
    required: true
  },
  mode: {
    type: String,
    enum: ["visible", "hidden"],
    required: true
  },
  members: [Number],
  administrators: [Number],
  pinPosts: {
    type: [
      {
        post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "feedPostMongoModel"
        },
        stt: { type: Number }
      }
    ],
    default: [],
    cover_image: String
  },
  introduction: String,
  group_rules: [
    {
      title: String,
      description: String
    }
  ],
  request_joins: [Number],
  notification: { type: Boolean, default: true },
  review_post: { type: Boolean, default: false },
  membership_approval: { type: String, enum: ["approver", "auto"] }
})

const workspaceMongoModel = model("workspaceMongoModel", workspaceSchema)
export default workspaceMongoModel
