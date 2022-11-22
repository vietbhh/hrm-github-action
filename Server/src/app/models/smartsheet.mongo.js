import mongoose from "mongoose"

mongoose.Promise = global.Promise

const smartSheetSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  { collection: "m_smartsheet" }
)

export default mongoose.model("smartSheet", smartSheetSchema)
