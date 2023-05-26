import express from "express"
import {
  getAnnouncementById,
  submitAnnouncement,
  submitAnnouncementAttachment
} from "../controllers/announcement.js"
import {
  deleteComment,
  submitComment,
  submitCommentReply,
  updateComment,
  updateSubComment
} from "../controllers/comment.js"
import {
  getEndorsementById,
  submitEndorsement,
  submitEndorsementCover
} from "../controllers/endorsement.js"
import {
  getEventById,
  submitEvent,
  submitEventAttachment,
  updateEventStatus
} from "../controllers/event.js"
import {
  deletePost,
  getFeedById,
  getFeedByIdAndViewAllComment,
  getFeedChild,
  loadFeedController,
  loadFeedProfile,
  submitPostController,
  updateContentMedia,
  updatePost,
  uploadTempAttachmentController
} from "../controllers/feed.js"
import { getPostInteractiveMember } from "../controllers/management.js"
import {
  updatePostPollVote,
  updatePostPollVoteAddMoreOption
} from "../controllers/poll_vote.js"

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
router.post("/update-event-status", updateEventStatus)

router.post("/submit-announcement", submitAnnouncement)
router.post("/submit-announcement-attachment", submitAnnouncementAttachment)
router.get("/get-announcement-by-id/:id", getAnnouncementById)

router.post("/submit-endorsement", submitEndorsement)
router.post("/submit-endorsement-cover", submitEndorsementCover)
router.get("/get-endorsement-by-id/:id", getEndorsementById)

export default router
