import baseSchema from "#app/models/base.mongo.js"
import mongoose, {Schema} from "mongoose"

const listStickerSchema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
            required: true
        },
        url: String,
        default: Boolean,
        upload_at: Date
    }
)

const schema = baseSchema('m_sticker', {
    id: String,
    name: String,
    list: [listStickerSchema],
    default: Boolean
}, {
    _id: false
})

const StickerMongoModel = mongoose.model('StickerMongoModel', schema)

export default StickerMongoModel
