import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const feedSchema = baseSchema("m_feed", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  workspace: {
    type: [
      {
        id: [String],
        type: {
          type: String,
          enum: ["default", "workspace", "employee", "only_me"]
        }
      }
    ],
    required: true
  }
})

const feedMongoModel = model("feedMongoModel", feedSchema)
export default feedMongoModel
