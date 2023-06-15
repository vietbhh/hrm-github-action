import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const savedSchema = baseSchema("m_saved", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  type: {
    type: String,
    enum: ["post"],
    default: ""
  },
  id: {
    type: [String],
    default: []
  },
  user_id: {
    type: String,
    default: ""
  }
})

const savedMongoModel = model("savedMongoModel", savedSchema)
export default savedMongoModel
