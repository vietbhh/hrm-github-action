import express from "express"
import {
  uploadTempAttachmentController,
  submitPostController,
  loadFeedController,
  getFeedChild,
  getFeedById,
  updatePost,
  submitComment,
  getFeedByIdAndViewAllComment,
  updateComment,
  submitCommentReply,
  updateSubComment
} from "../controllers/feed.js"
const router = express.Router()

router.post("/upload-temp-attachment", uploadTempAttachmentController)
router.post("/submit-post", submitPostController)
router.get("/load-feed", loadFeedController)
router.get("/get-feed-child/:id", getFeedChild)
router.get("/get-feed/:id", getFeedById)
router.get("/get-feed-and-comment/:id", getFeedByIdAndViewAllComment)
router.post("/update-post", updatePost)
router.post("/submit-comment", submitComment)
router.post("/submit-comment-reply", submitCommentReply)
router.post("/update-comment", updateComment)
router.post("/update-sub-comment", updateSubComment)

export default router
