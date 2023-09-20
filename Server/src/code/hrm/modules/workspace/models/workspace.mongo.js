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
  avatar: {
    type: String,
    required: false
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
  members: {
    type: [
      {
        id_user: String,
        joined_at: String
      }
    ],
    default: []
  },
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
  group_rules: [
    {
      title: String,
      description: String
    }
  ],
  request_joins: {
    type: [
      {
        id_user: String,
        requested_at: String
      }
    ],
    default: []
  },
  notification: {
    type: [
      {
        id_user: String,
        status: Boolean
      }
    ],
    default: []
  },
  review_post: { type: Boolean, default: false },
  membership_approval: { type: String, enum: ["approver", "auto"] },
  status: {
    type: String,
    enum: ["active", "disable"],
    required: true,
    default: "active"
  },
  all_member: Boolean,
  group_chat_id: {
    type: String
  },
  is_system: {
    type: Boolean,
    default: false
  },
  system: { type: Boolean, default: false },
})

const workspaceMongoModel = model("workspaceMongoModel", workspaceSchema)
export default workspaceMongoModel
