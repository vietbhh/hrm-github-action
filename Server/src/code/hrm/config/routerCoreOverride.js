import express from "express"
import { getListWorkspaceGet } from "../controllers/workspace"
const routerCoreOverride = express.Router()
//Add override route here
//routerCoreOverride.get("/", (req,res,next) => {})

coreRouter.get("/workspace/get-list-workspace", getListWorkspaceGet)

export default routerCoreOverride
