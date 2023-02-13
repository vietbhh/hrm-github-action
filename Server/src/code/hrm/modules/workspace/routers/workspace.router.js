import express from "express"
import { getWorkspace, saveWorkspace } from "../controllers/workspace.js"
const router = express.Router()

router.get("/:workspaceId", getWorkspace)
router.post("/save", saveWorkspace)

export default router
