import { testFn } from "#app/controllers/app.js"
import { sendNotificationController } from "#app/controllers/notifications.js"
import express from "express"
const coreRouter = express.Router()

coreRouter.get("/", testFn)
coreRouter.post("/notification/send", sendNotificationController)
export default coreRouter
