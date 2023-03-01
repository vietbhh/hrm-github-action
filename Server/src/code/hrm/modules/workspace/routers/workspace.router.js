import express from "express"
import {
  getWorkspace,
  saveWorkspace,
  updateWorkspace,
  saveCoverImage,
  getPostWorkspace
} from "../controllers/workspace.js"
const router = express.Router()

router.get("/pending-posts", getPostWorkspace)
router.get("/:workspaceId", getWorkspace)
router.post("/save", saveWorkspace)
router.post("/save-cover-image", saveCoverImage)
router.post("/update", updateWorkspace)

export default router
