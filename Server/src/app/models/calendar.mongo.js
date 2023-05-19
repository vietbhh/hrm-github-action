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
  repeat: {
    type: String,
    default: "no_repeat"
  },
  // ** employee: bao gồm employee được chọn và employee trong department được chọn
  employee: {
    type: [
      {
        id: {
          type: String,
          default: ""
        },
        status: {
          type: String,
          default: ""
        },
        dateUpdate: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    default: []
  },
  // ** attendees: lưu lại dùng để edit
  attendees: {
    type: [
      {
        value: {
          type: String,
          default: ""
        },
        label: {
          type: String,
          default: ""
        },
        avatar: {
          type: String,
          default: ""
        }
      }
    ],
    default: []
  },
  meeting_room: {
    type: {
      value: {
        type: String,
        default: ""
      },
      label: {
        type: String,
        default: ""
      }
    },
    default: {}
  },
  reminder: {
    type: String,
    default: ""
  },
  online_meeting: {
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
          type: String
        },
        source: {
          type: String,
          default: null
        },
        source_attribute: {
          type: {},
          default: {}
        }
      }
    ],
    default: []
  },
  id_post: {
    type: String,
    default: ""
  }
})

const calendarMongoModel = model("calendarMongoModel", calendarSchema)
export default calendarMongoModel
