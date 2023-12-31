import express from "express"
import {
  getWorkspace,
  getWorkspaceOverview,
  saveWorkspace,
  getListWorkspace,
  updateWorkspace,
  saveCoverImage,
  sortGroupRule,
  loadDataMember,
  loadDataMedia,
  getPostWorkspace,
  approvePost,
  loadFeed,
  addMemberByDepartment,
  loadPinned,
  loadGCSObjectLink,
  removeCoverImage,
  getListWorkspaceSeparateType,
  saveAvatar,
  deleteWorkspace,
  createGroupChat,
  updateWorkspaceMemberAndChatGroup,
  createGroupChatCompany,
  removeGroupChatId
} from "../controllers/workspace.js"
const router = express.Router()

router.get("/list", getListWorkspace)
router.get("/get-list-workspace-separate-type", getListWorkspaceSeparateType)
router.get("/overview", getWorkspaceOverview)
router.get("/pending-posts", getPostWorkspace)
router.get("/load-feed", loadFeed)
router.get("/load-pinned", loadPinned)
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
router.post("/remove-cover-image/:id", removeCoverImage)
router.post("/save-avatar", saveAvatar)
router.post("/delete", deleteWorkspace)
router.post("/create-group-chat/:id", createGroupChat)
router.post(
  "/update-workspace-member-and-chat-group",
  updateWorkspaceMemberAndChatGroup
)
router.post("/create-company-chat", createGroupChatCompany)
router.post("/remove-group-chat-id", removeGroupChatId)
export default router
