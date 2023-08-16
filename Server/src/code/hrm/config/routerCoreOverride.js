import express from "express"
import {
  handleGetCalendar,
  handleAddCalendar,
  handleGetDetailEvent,
  handleGetListEvent
} from "../modules/calendar/controllers/calendar.js"

const routerCoreOverride = express.Router()
//Add override route here
//routerCoreOverride.get("/", (req,res,next) => {})

// ** override calendar router
routerCoreOverride.get("/calendar/load", handleGetCalendar)
routerCoreOverride.post("/calendar/add", handleAddCalendar)
routerCoreOverride.get("/calendar/get-detail-event/:id", handleGetDetailEvent)
routerCoreOverride.get("/calendar/get-list-event", handleGetListEvent)

export default routerCoreOverride
