import express from "express"
import { getWorkspace, saveWorkspace, getListWorkspace } from "../controllers/workspace.js"
const router = express.Router()

router.get("/list", getListWorkspace)
router.get("/:workspaceId", getWorkspace)
router.post("/save", saveWorkspace)


export default router
