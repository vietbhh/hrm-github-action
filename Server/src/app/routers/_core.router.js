import {
  homeController,
  testSendNotification,
  testCreateTemplate
} from "#app/controllers/app.js"
import { sendNotificationController } from "#app/controllers/notifications.js"
import express from "express"
const coreRouter = express.Router()

coreRouter.get("/", homeController)
coreRouter.get("/test/send-mail", testSendNotification)
coreRouter.get("/test/create-template", testCreateTemplate)
coreRouter.post("/notification/send", sendNotificationController)
export default coreRouter
