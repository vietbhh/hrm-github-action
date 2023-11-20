import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

export const feedPrioritySchema = baseSchema("m_feed_priorities", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  feed_id: {
    type: String
  },
  points: {
    type: Number
  }
})

const feedPriorityMongoModel = model(
  "feedPriorityMongoModel",
  feedPrioritySchema
)
export default feedPriorityMongoModel
