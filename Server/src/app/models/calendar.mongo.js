import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const calendarSchema = baseSchema("m_calendar", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  name: {
    type: String,
    default: ""
  },
  color: {
    type: String,
    default: "blue"
  },
  start_time_date: {
    type: Date,
    default: null
  },
  start_time_time: {
    type: Date,
    default: null
  },
  end_time_date: {
    type: Date,
    default: null
  },
  end_time_time: {
    type: Date,
    default: null
  },
  all_day_event: {
    type: Boolean,
    default: false
  },
  details: {
    type: String,
    default: ""
  },
  attachment: {
    type: [
      {
        type: {
          type: String,
          default: ""
        },
        name: {
          type: String,
          default: ""
        },
        src: {
          type: String,
          default: null
        },
        size: {
          type: Number,
          default: 0
        }
      }
    ],
    default: []
  }
})

const calendarMongoModel = model("calendarMongoModel", calendarSchema)
export default calendarMongoModel
