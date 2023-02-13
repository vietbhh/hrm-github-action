import express from "express"
import { uploadAttachmentController } from "../controllers/feed.js"
const router = express.Router()

router.post("/upload-attachment", uploadAttachmentController)

export default router
