import express from "express"
import {
  getAllEmployee,
  uploadTempAttachmentController
} from "../controllers/feed.js"
const router = express.Router()

router.post("/upload-temp-attachment", uploadTempAttachmentController)
router.get("/get-all-employee", getAllEmployee)

export default router
