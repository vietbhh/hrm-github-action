import express from "express"
import {
    getAnnouncementById,
    submitAnnouncement
} from "../controllers/announcement.js"
import {
    deleteComment,
    submitComment,
    submitCommentReply,
    updateCommentReaction,
    updateSubCommentReaction
} from "../controllers/comment.js"
import {
    getEndorsementById,
    submitEndorsement
} from "../controllers/endorsement.js"
import {
    getEventById,
    submitEvent,
    updateEventStatus,
    removeEvent,
    removeFile
} from "../controllers/event.js"
import {
    deletePost,
    getDataEditHistory,
    getFeedById,
    getFeedByIdAndViewAllComment,
    getFeedChild,
    loadFeedController,
    loadFeedProfile,
    sendNotificationUnseen,
    submitPostController,
    turnOffCommenting,
    turnOffNotification,
    updateContentMedia,
    updatePostReaction,
    updateSeenPost,
    uploadTempAttachmentController,
    getPostPending
} from "../controllers/feed.js"
import {getDataHashtag, loadFeedHashtag} from "../controllers/hashtag.js"
import {getPostInteractiveMember} from "../controllers/management.js"
import {
    updatePostPollVote,
    updatePostPollVoteAddMoreOption
} from "../controllers/poll_vote.js"
import {saveSaved, listPostSaved} from "../controllers/saved.js"

const router = express.Router()

router.post("/upload-temp-attachment", uploadTempAttachmentController)
router.post("/submit-post", submitPostController)
router.get("/load-feed", loadFeedController)
router.get("/get-feed-child/:id", getFeedChild)
router.get("/get-feed/:id", getFeedById)
router.get("/get-feed-and-comment/:id", getFeedByIdAndViewAllComment)
router.post("/update-post-reaction", updatePostReaction)
router.post("/update-content-media", updateContentMedia)
router.post("/delete-post", deletePost)
router.post("/update-post-poll-vote", updatePostPollVote)
router.post(
    "/update-post-poll-vote-add-more-option",
    updatePostPollVoteAddMoreOption
)
router.post("/submit-comment", submitComment)
router.post("/submit-comment-reply", submitCommentReply)
router.post("/update-comment-reaction", updateCommentReaction)
router.post("/update-sub-comment-reaction", updateSubCommentReaction)
router.post("/delete-comment", deleteComment)
router.get("/load-feed-profile", loadFeedProfile)
router.get("/update-seen-post/:post_id", updateSeenPost)
router.get("/send-noti-unseen/:post_id", sendNotificationUnseen)
router.post("/turn-off-notification", turnOffNotification)
router.post("/turn-off-commenting", turnOffCommenting)
router.get("/get-data-edit-history/:post_id", getDataEditHistory)

router.get("/get-post-interactive-member/:id", getPostInteractiveMember)

router.post("/submit-event", submitEvent)
router.get("/get-event-by-id/:id", getEventById)
router.post("/update-event-status", updateEventStatus)
router.post("/remove-event", removeEvent)
router.post("/remove-file/:id", removeFile)

router.post("/submit-announcement", submitAnnouncement)
router.get("/get-announcement-by-id/:id", getAnnouncementById)

router.post("/submit-endorsement", submitEndorsement)
router.get("/get-endorsement-by-id/:id", getEndorsementById)

router.get("/get-data-hashtag/:hashtag", getDataHashtag)
router.get("/get-load-feed-hashtag", loadFeedHashtag)

router.post("/save-saved", saveSaved)

router.get("/pending-posts", getPostPending)
router.get("/post-saved", listPostSaved)

// **

export default router
