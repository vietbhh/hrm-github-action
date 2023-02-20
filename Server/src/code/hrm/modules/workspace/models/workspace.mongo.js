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
        }
      }
    ],
    default: [],
    cover_image: String
  }
})

const workspaceMongoModel = model("workspaceMongoModel", workspaceSchema)
export default workspaceMongoModel
