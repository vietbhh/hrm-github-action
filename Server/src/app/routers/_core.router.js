import { homeController } from "#app/controllers/app.js"
import { sendNotificationController } from "#app/controllers/notifications.js"
import express from "express"
const coreRouter = express.Router()

coreRouter.get("/", homeController)
coreRouter.post("/notification/send", sendNotificationController)
export default coreRouter
