import baseSchema from "#app/models/base.mongo.js"
import mongoose, { model } from "mongoose"

const commentSchema = baseSchema("m_comment", {
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  content: {
    type: String,
    default: ""
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
  image_url: {
    type: String,
    default: null
  },
  sub_comment: {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
          required: true
        },
        post_id: {
          type: mongoose.Schema.Types.ObjectId,
          default: null
        },
        content: {
          type: String,
          default: ""
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
        image_url: {
          type: String,
          default: null
        },
        created_at: {
          type: Date,
          default: Date.now()
        },
        updated_at: {
          type: Date,
          default: Date.now()
        },
        created_by: {
          type: Number,
          required: true
        }
      }
    ]
  }
})

const commentMongoModel = model("commentMongoModel", commentSchema)
export default commentMongoModel