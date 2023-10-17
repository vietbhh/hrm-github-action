import express from "express"
import {
    stickerList,
    stickerCreate,
    uploadFileSticker,
    stickerUpdate,
    stickerGetOne,
    stickerDelete,
    stickerChange
} from "#code/hrm/modules/sticker/controllers/stickerController.js";

const router = express.Router()

router.get('/', stickerList)
router.get('/:id', stickerGetOne)
router.post('/create', stickerCreate)
router.put('/update/:id', stickerUpdate)
router.delete('/delete/:id', stickerDelete)
router.get('/update-status/:id', stickerChange)
router.post('/upload', uploadFileSticker)

export default router
