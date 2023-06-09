import express from "express"
import {
  deleteBadgeSetting,
  getBadgeSettingById,
  getListDataBadgeSetting,
  submitCreateBadge
} from "../controllers/manage_endorsement.js"
import {
  getEmployeeEndorsement,
  loadFeedEndorsement
} from "../../feed/controllers/endorsement.js"

const router = express.Router()

router.post("/submit-create-badge", submitCreateBadge)
router.get("/get-list-data-badge-setting", getListDataBadgeSetting)
router.get("/delete-badge-setting/:id", deleteBadgeSetting)
router.get("/get-badge-setting-by-id/:id", getBadgeSettingById)

router.get("/get-employee-endorsement/:id", getEmployeeEndorsement)
router.get("/get-feed-endorsement", loadFeedEndorsement)

export default router
