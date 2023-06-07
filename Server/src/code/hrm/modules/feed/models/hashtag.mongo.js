import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const hashtagSchema = baseSchema("m_hashtag", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  hashtag: {
    type: String,
    default: ""
  },
  post_id: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  }
})

const hashtagMongoModel = model("hashtagMongoModel", hashtagSchema)
export default hashtagMongoModel
