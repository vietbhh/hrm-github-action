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
    required: true
  }
})

const badgeSettingMongoModel = model(
  "badgeSettingMongoModel",
  badgeSettingSchema
)
export default badgeSettingMongoModel
