import express from "express"
import {
  getWorkspace,
  saveWorkspace,
  updateWorkspace,
  getListWorkspace,
  saveCoverImage,
  sortGroupRule,
  loadDataMember,
  loadDataMedia
} from "../controllers/workspace.js"
const router = express.Router()

router.get("/list", getListWorkspace)
router.get("/:workspaceId", getWorkspace)
router.post("/save", saveWorkspace)
router.post("/update/:id", updateWorkspace)
router.post("/save-cover-image", saveCoverImage)
router.post("/sort-group-rule/:id", sortGroupRule)
router.get("/load-data-member/:id", loadDataMember)
router.get("/load-data-media/:id", loadDataMedia)


export default router
