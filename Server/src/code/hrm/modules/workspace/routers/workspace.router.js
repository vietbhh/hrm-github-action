import express from "express"
import {
  getWorkspace,
  saveWorkspace,
  saveCoverImage
} from "../controllers/workspace.js"
const router = express.Router()

router.get("/:workspaceId", getWorkspace)
router.post("/save", saveWorkspace)
router.post("/save-cover-image", saveCoverImage)

export default router
