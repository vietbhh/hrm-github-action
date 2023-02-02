import mongoose, { model } from "mongoose"
import baseSchema from "./base.mongo.js"

const smartSheetSchema = baseSchema("m_smartsheet", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const smartSheetModelMongo = model("smartSheetModelMongo", smartSheetSchema)
export default smartSheetModelMongo
