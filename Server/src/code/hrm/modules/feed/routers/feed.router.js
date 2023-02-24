import express from "express"
import {
  getAllEmployeeActive,
  uploadTempAttachmentController,
  submitPostController,
  loadFeedController,
  getUserPost
} from "../controllers/feed.js"
const router = express.Router()

router.post("/upload-temp-attachment", uploadTempAttachmentController)
router.get("/get-all-employee-active", getAllEmployeeActive)
router.post("/submit-post", submitPostController)
router.get("/load-feed", loadFeedController)
router.get("/get-user-post/:id", getUserPost)

export default router
