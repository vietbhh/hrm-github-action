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
    type: [
      {
        value: {
          type: String,
          default: "no_repeat"
        },
        week_day: {
          type: Number,
          default: ""
        },
        date_in_month: {
          type: Number,
          default: ""
        },
        order_week_date_in_month: {
          type: Number,
          default: ""
        },
        // ** custom
        end_time: {
          type: [
            {
              type_option: { type: String, default: "never" },
              on_date: { type: Date, default: "" },
              after: { type: Number, default: "" }
            }
          ]
        },
        repeat_at: {
          type: [
            {
              weekDay: {
                type: String,
                default: ""
              },
              date: {
                type: Date,
                default: ""
              },
              order_week_date_in_month: {
                type: Number,
                default: ""
              }
            }
          ]
        },
        repeat_every: {
          type: [
            {
              after: {
                type: Number,
                default: ""
              },
              type_option: {
                type: String,
                default: ""
              }
            }
          ]
        }
      }
    ]
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
  reminder_date: {
    type: Date,
    default: null
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
  },
  id_post: {
    type: String,
    default: ""
  }
})

const calendarMongoModel = model("calendarMongoModelHRM", calendarSchema)
export default calendarMongoModel
