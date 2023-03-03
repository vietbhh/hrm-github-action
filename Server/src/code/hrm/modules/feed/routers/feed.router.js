import express from "express"
import {
  getAllEmployeeActive,
  uploadTempAttachmentController,
  submitPostController,
  loadFeedController,
  getFeedChild,
  getFeedById,
  updatePost
} from "../controllers/feed.js"
const router = express.Router()

router.post("/upload-temp-attachment", uploadTempAttachmentController)
router.get("/get-all-employee-active", getAllEmployeeActive)
router.post("/submit-post", submitPostController)
router.get("/load-feed", loadFeedController)
router.get("/get-feed-child/:id", getFeedChild)
router.get("/get-feed/:id", getFeedById)
router.post("/update-post", updatePost)

export default router