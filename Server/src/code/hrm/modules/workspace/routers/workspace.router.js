import express from "express"
import {
  getWorkspace,
  saveWorkspace,
  updateWorkspace,
  saveCoverImage,
  sortGroupRule,
  loadDataMember,
  loadDataMedia,
  getPostWorkspace,
  approvePost,
  loadFeed,
  addMemberByDepartment,
  loadGCSObjectLink
} from "../controllers/workspace.js"
const router = express.Router()

router.get("/pending-posts", getPostWorkspace)
router.get("/load-feed", loadFeed)
router.get("/load-gcs-object-link", loadGCSObjectLink)
router.get("/:workspaceId", getWorkspace)
router.post("/save", saveWorkspace)
router.post("/save-cover-image", saveCoverImage)
router.post("/sort-group-rule/:id", sortGroupRule)
router.get("/load-data-member/:id", loadDataMember)
router.get("/load-data-media/:id", loadDataMedia)
router.post("/update/:id", updateWorkspace)
router.post("/approvePost", approvePost)
router.post("/add-member", addMemberByDepartment)
router.post("/load-data-media", addMemberByDepartment)
export default router
