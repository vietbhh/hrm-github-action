import express from "express"
import {
  getWorkspace,
  saveWorkspace,
  updateWorkspace,
  saveCoverImage,
  getPostWorkspace,
  approvePost,
  loadFeed,
  addMemberByDepartment,
  loadPinned
} from "../controllers/workspace.js"
const router = express.Router()

router.get("/pending-posts", getPostWorkspace)
router.get("/load-feed", loadFeed)
router.get("/:workspaceId", getWorkspace)
router.post("/save", saveWorkspace)
router.post("/save-cover-image", saveCoverImage)
router.post("/update/:id", updateWorkspace)
router.post("/approvePost", approvePost)
router.post("/add-member", addMemberByDepartment)
router.get("/load-pinned", loadPinned)

export default router
