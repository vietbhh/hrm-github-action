import express from "express"
import { uploadTempAttachmentController } from "../controllers/feed.js"
const router = express.Router()

router.post("/upload-temp-attachment", uploadTempAttachmentController)

export default router
