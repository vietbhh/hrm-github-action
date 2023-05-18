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
  updateSubComment,
  loadFeedProfile,
  deletePost,
  updateContentMedia,
  deleteComment,
  updatePostPollVote,
  updatePostPollVoteAddMoreOption
} from "../controllers/feed.js"
import { getPostInteractiveMember } from "../controllers/management.js"
import {
  getEventById,
  submitEvent,
  submitEventAttachment
} from "../controllers/event.js"
import {
  getAnnouncementById,
  submitAnnouncement,
  submitAnnouncementAttachment
} from "../controllers/announcement.js"

const router = express.Router()

router.post("/upload-temp-attachment", uploadTempAttachmentController)
router.post("/submit-post", submitPostController)
router.get("/load-feed", loadFeedController)
router.get("/get-feed-child/:id", getFeedChild)
router.get("/get-feed/:id", getFeedById)
router.get("/get-feed-and-comment/:id", getFeedByIdAndViewAllComment)
router.post("/update-post", updatePost)
router.post("/update-content-media", updateContentMedia)
router.post("/delete-post", deletePost)
router.post("/update-post-poll-vote", updatePostPollVote)
router.post(
  "/update-post-poll-vote-add-more-option",
  updatePostPollVoteAddMoreOption
)
router.post("/submit-comment", submitComment)
router.post("/submit-comment-reply", submitCommentReply)
router.post("/update-comment", updateComment)
router.post("/update-sub-comment", updateSubComment)
router.post("/delete-comment", deleteComment)
router.get("/load-feed-profile", loadFeedProfile)

router.get("/get-post-interactive-member/:id", getPostInteractiveMember)

router.post("/submit-event", submitEvent)
router.post("/submit-event-attachment", submitEventAttachment)
router.get("/get-event-by-id/:id", getEventById)

router.post("/submit-announcement", submitAnnouncement)
router.post("/submit-announcement-attachment", submitAnnouncementAttachment)
router.get("/get-announcement-by-id/:id", getAnnouncementById)

export default router
