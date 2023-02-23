import express from "express"
import {
  getWorkspace,
  saveWorkspace,
  updateWorkspace,
  getListWorkspace,
  saveCoverImage,
  sortGroupRule
} from "../controllers/workspace.js"
const router = express.Router()

router.get("/list", getListWorkspace)
router.get("/:workspaceId", getWorkspace)
router.post("/save", saveWorkspace)
router.post("/update/:id", updateWorkspace)
router.post("/save-cover-image", saveCoverImage)
router.post("/sort-group-rule/:id", sortGroupRule)


export default router
