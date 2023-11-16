import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

export const feedPrioritySchema = baseSchema("m_feed_priorities", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  priority_detail: {
    type: [
      {
        feed_id: {
          type: String
        },
        rank: {
          type: Number
        },
        created_time: {
          type: Number
        },
        total_comment: {
          type: Number
        },
        total_react: {
          type: Number
        }
      }
    ]
  }
})

const feedPriorityMongoModel = model(
  "feedPriorityMongoModel",
  feedPrioritySchema
)
export default feedPriorityMongoModel
