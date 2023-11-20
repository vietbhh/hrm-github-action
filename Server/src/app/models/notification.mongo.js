import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const notificationSchema = baseSchema("notifications", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  sender_id: {
    type: Number
  },
  recipient_id: {
    type: [String],
    defaultValue: []
  },
  type: {
    type: String,
    enum: ["system", "other"],
    defaultValue: "other"
  },
  title: {
    type: String
  },
  body: {
    type: String
  },
  link: {
    type: String
  },
  icon: {
    type: String
  },
  actions: {
    type: String,
    defaultValue: "[]"
  },
  seen_by: {
    type: [String],
    defaultValue: []
  },
  read_by: {
    type: [String],
    defaultValue: []
  },
  custom_fields: {
    type: {}
  }
})

const notificationMongoModel = model("notificationMongoModel", notificationSchema)
export default notificationMongoModel
