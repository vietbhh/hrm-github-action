import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const badgeSettingSchema = baseSchema("m_badge_setting_calendar", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: ""
  },
  badge_type: {
    type: String,
    enum: ["local", "upload"],
    default: "local"
  }
})

const badgeSettingMongoModel = model(
  "badgeSettingMongoModel",
  badgeSettingSchema
)
export default badgeSettingMongoModel
