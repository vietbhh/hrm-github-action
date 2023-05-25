import express from "express"
import {
  deleteBadgeSetting,
  getBadgeSettingById,
  getListDataBadgeSetting,
  submitCreateBadge
} from "../controllers/manage_endorsement.js"

const router = express.Router()

router.post("/submit-create-badge", submitCreateBadge)
router.get("/get-list-data-badge-setting", getListDataBadgeSetting)
router.get("/delete-badge-setting/:id", deleteBadgeSetting)
router.get("/get-badge-setting-by-id/:id", getBadgeSettingById)

export default router
