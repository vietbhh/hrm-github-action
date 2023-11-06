import {
  homeController,
  testSendNotification,
  testCreateTemplate,
  sendMailPending
} from "#app/controllers/app.js"
import { sendNotificationController } from "#app/controllers/notifications.js"
import express from "express"
const coreRouter = express.Router()

coreRouter.get("/", homeController)
coreRouter.get("/send-mail-pending", sendMailPending)
coreRouter.get("/test/send-mail", testSendNotification)
coreRouter.get("/test/create-template", testCreateTemplate)
coreRouter.post("/notification/send", sendNotificationController)
export default coreRouter
