import express from "express"
import { addWorkgroupForDepartment } from "../controllers/org-chart.js"
const router = express.Router()
router.get("/create-department-workgroup/:id", addWorkgroupForDepartment)
export default router
