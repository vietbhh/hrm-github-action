import mongoose from "mongoose"

const Schema = mongoose.Schema
const Types = Schema.Types
const baseSchema = (collection, definition, options = {}) => {
  const schema = new Schema(
    {
      _id: {
        type: Types.ObjectId,
        auto: true,
        required: true
      },
      owner: {
        type: Types.Number
      },
      created_by: {
        type: Types.Number
      },
      updated_by: {
        type: Types.Number
      },
      deleted_at: {
        type: Types.Date
      },
      ...definition
    },
    {
      collection,
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      ...options
    }
  )

  schema.virtual("__user").set(function (__user) {
    if (!__user) {
      throw new Error("missing_user_id")
    }
    if (this.$isNew) {
      this.owner = __user
      this.created_by = __user
    } else {
      this.updated_by = __user
    }
  })

  schema.pre("save", function (next) {
    if (this.$isNew && (!this.owner || !this.created_by)) {
      throw new Error("missing_user_id")
    }
    if (!this.$isNew && !this.updated_by) {
      throw new Error("missing_user_id")
    }
    next()
  })

  return schema
}
export default baseSchema
