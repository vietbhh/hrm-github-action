import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const endorsementSchema = baseSchema("m_endorsement", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  content: {
    type: String,
    default: ""
  },
  member: {
    type: [String],
    default: []
  },
  cover: {
    type: String,
    default: ""
  },
  cover_type: {
    type: String,
    enum: ["local", "upload"],
    default: "local"
  },
  badge: {
    type: String,
    default: ""
  },
  badge_type: {
    type: String,
    enum: ["local", "upload"],
    default: "local"
  },
  date: {
    type: Date,
    default: null
  },
  id_post: {
    type: String,
    default: ""
  }
})

const endorsementMongoModel = model("endorsementMongoModel", endorsementSchema)
export default endorsementMongoModel
