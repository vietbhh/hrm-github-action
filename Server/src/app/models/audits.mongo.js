import mongoose, { model } from "mongoose"

const Schema = mongoose.Schema
const Types = Schema.Types

const auditsSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      auto: true,
      required: true
    },
    source: {
      type: Types.String
    },
    source_id: {
      type: Types.ObjectId
    },
    user_id: {
      type: Types.Number
    },
    event: {
      type: Types.String,
      enum: ["insert", "update", "delete"]
    },
    summary: {
      type: Types.String
    },
    created_at: {
      type: Types.Date
    }
  },
  {
    collection: "audits"
  }
)
const auditsModelMongo = model("auditsModelMongo", auditsSchema)
export default auditsModelMongo
