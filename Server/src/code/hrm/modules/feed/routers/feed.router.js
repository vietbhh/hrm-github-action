import express from "express"
import {
  getAllEmployee,
  uploadTempAttachmentController,
  submitPostController
} from "../controllers/feed.js"
const router = express.Router()

router.post("/upload-temp-attachment", uploadTempAttachmentController)
router.get("/get-all-employee", getAllEmployee)
router.post("/submit-post", submitPostController)

export default router
