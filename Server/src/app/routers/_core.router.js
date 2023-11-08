import {
  homeController,
  sendMailPending
} from "#app/controllers/app.js"
import { sendNotificationController } from "#app/controllers/notifications.js"
import express from "express"
const coreRouter = express.Router()

coreRouter.get("/", homeController)
coreRouter.get("/send-mail-pending", sendMailPending)
coreRouter.post("/notification/send", sendNotificationController)
export default coreRouter
