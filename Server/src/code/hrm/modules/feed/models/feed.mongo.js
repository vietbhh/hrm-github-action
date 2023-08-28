import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const feedSchema = baseSchema("m_feed", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  permission_ids: {
    type: [String],
    default: []
  },
  permission: {
    type: String,
    enum: ["default", "workspace", "employee", "only_me"],
    default: "default"
  },
  content: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: [
      "post",
      "image",
      "video",
      "link",
      "update_avatar",
      "update_cover",
      "background_image",
      "event",
      "announcement",
      "endorsement"
    ],
    default: "post"
  },
  medias: {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId
        },
        type: {
          type: String,
          enum: ["image", "video"]
        },
        source: {
          type: String,
          default: null
        },
        source_attribute: {
          type: {},
          default: {}
        },
        thumb: {
          type: String,
          default: null
        },
        thumb_attribute: {
          type: {},
          default: {}
        },
        description: {
          type: String,
          default: ""
        },
        created_at: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    default: []
  },
  approve_status: {
    type: String,
    enum: ["approved", "rejected", "pending", "schedule"],
    default: "approved"
  },
  reaction: {
    type: [
      {
        react_type: {
          type: String
        },
        react_user: {
          type: [String]
        }
      }
    ],
    default: []
  },
  comment_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  seen: {
    type: [String],
    default: []
  },
  link: {
    type: [String],
    default: []
  },
  link_permission: {
    type: {
      is_all: {
        type: Boolean,
        default: false
      },
      employee: {
        type: [String],
        default: []
      },
      department: {
        type: [String],
        default: []
      }
    }
  },
  tag_user: {
    type: {
      mention: {
        type: [String],
        default: []
      },
      tag: {
        type: [String],
        default: []
      }
    },
    default: {}
  },
  edited: {
    type: Boolean,
    default: false
  },
  background_image: {
    type: Number,
    default: null
  },
  has_poll_vote: {
    type: Boolean,
    default: false
  },
  poll_vote_detail: {
    type: {
      question: {
        type: String,
        default: ""
      },
      options: {
        type: [
          {
            _id: {
              type: mongoose.Schema.Types.ObjectId,
              auto: true,
              required: true
            },
            option_name: {
              type: String,
              default: ""
            },
            user_vote: {
              type: [String],
              default: []
            }
          }
        ],
        default: []
      },
      setting: {
        type: {},
        default: {}
      },
      time_end: {
        type: Date,
        default: null
      }
    },
    default: {}
  },
  schedule: {
    type: Date,
    default: null
  },
  hashtag: {
    type: [String],
    default: []
  },
  user_saved: {
    type: [String], // user_id
    default: []
  },
  turn_off_notification: {
    type: [String], // user_id
    default: []
  },
  turn_off_commenting: {
    type: Boolean,
    default: false
  },
  edit_history: {
    type: [{}],
    default: []
  },

  // ** id: event / announcement / endorsement
  link_id: {
    type: String,
    default: null
  },

  // ** source child / post: 1 image/video
  source: {
    type: String,
    default: null
  },
  source_attribute: {
    type: {},
    default: {}
  },
  thumb: {
    type: String,
    default: null
  },
  thumb_attribute: {
    type: {},
    default: {}
  },
  // **

  // ** feed child
  ref: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  sort_number: {
    type: Number,
    default: 0
  }
  // **
})

const feedMongoModel = model("feedMongoModel", feedSchema)
export default feedMongoModel
