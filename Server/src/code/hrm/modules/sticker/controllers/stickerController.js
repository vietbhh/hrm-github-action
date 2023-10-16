import StickerMongoModel from "#code/hrm/modules/sticker/models/sticker.mongo.js"
import {_uploadServices} from "#app/services/upload.js"
import path from "path"
import {
    convertImageToWebp,
    removeDirInUpload
} from "#app/services/handleFile.js"

export const uploadFileSticker = async (req, res, next) => {
    try {
        let files = req.files.images
        const stickerId = req.query?.id ? req.query.id : "other"
        const storePath = path.join("modules", "stickers", stickerId)
        removeDirInUpload(storePath)

        if (!files?.length) {
            files = [files]
        }

        const newFiles = await convertImageToWebp(files)
        const result = await _uploadServices(storePath, newFiles, true)

        return res.respond(result)
    } catch (error) {
        next(error)
    }
}

export const stickerList = async (req, res, next) => {
    try {
        const filters = {}
        let skip = 0
        let limit = 0

        if (req.query.search) {
            filters.name = {$regex: req.query.search.trim(), $options: "i"}
        }

        if (req.query.page) {
            const perPage = 9 // items in page
            skip = (req.query.page - 1) * perPage
            limit = perPage
        }

        const results = await StickerMongoModel.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({created_at: "desc"})

        return res.respond({
            data: results,
            total: await StickerMongoModel.find(filters).count()
        })
    } catch (error) {
        next(error)
    }
}

export const stickerCreate = async (req, res, next) => {
    try {
        const data = req.body
        if (Object.keys(data).length === 0) {
            return res.respondNoContent([])
        }

        const created = await StickerMongoModel.create({
            ...data,
            __user: req.__user
        })

        return res.respondCreated(created)
    } catch (error) {
        next(error)
    }
}

export const stickerUpdate = async (req, res, next) => {
    try {
        const data = req.body
        const id = req.params.id

        if (Object.keys(data).length === 0) {
            return res.respondNoContent([])
        }

        const updated = await StickerMongoModel.updateOne(
            {
                id
            },
            data
        )

        if (!updated?.modifiedCount) {
            return res.failServerError()
        }

        return res.respond(
            await StickerMongoModel.findOne({
                id
            })
        )
    } catch (error) {
        next(error)
    }
}

export const stickerGetOne = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.respondNoContent([])
        }

        const sticker = await StickerMongoModel.findOne({
            id
        })

        return res.respond(sticker)
    } catch (error) {
        next(error)
    }
}

export const stickerDelete = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.respondNoContent([])
        }

        const deleted = await StickerMongoModel.deleteOne({
            id
        })

        if (!deleted?.deletedCount) {
            return res.failServerError()
        }

        removeDirInUpload(path.join("modules", "stickers", id))

        return res.respond(deleted)
    } catch (error) {
        next(error)
    }
}

export const stickerChange = async (req, res, next) => {
    try {
        const id = req.params.id

        if (!id) {
            return res.respondNoContent([])
        }

        let updated
        if (req.query.sub_id) {
            await StickerMongoModel.updateOne(
                {
                    id
                },
                {
                    $set: {
                        "list.$[].default": false
                    }
                }
            )

            updated = await StickerMongoModel.updateOne(
                {
                    id,
                    list: {
                        $elemMatch: {
                            _id: req.query.sub_id
                        }
                    }
                },
                {
                    $set: {
                        "list.$.default": true
                    }
                }
            )
        } else {
            const sticker = await StickerMongoModel.findOne({id})
            updated = await StickerMongoModel.updateOne(
                {
                    id
                },
                {
                    default: !sticker?.default
                }
            )
        }

        if (!updated?.modifiedCount) {
            return res.failServerError()
        }

        return res.respond(
            await StickerMongoModel.findOne({
                id
            })
        )
    } catch (error) {
        next(error)
    }
}
