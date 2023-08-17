import express from "express"
import {
  handleGetCalendar,
  handleAddCalendar,
  handleGetDetailEvent,
  handleGetListEvent
} from "../controllers/calendar.js"

const router = express.Router()

router.get("/load", handleGetCalendar)
router.post("/add", handleAddCalendar)
router.get("/get-detail-event/:id", handleGetDetailEvent)
router.get("/get-list-event", handleGetListEvent)

export default router
