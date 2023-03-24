import { homeController, testFn, testUpload, testCopy, testCopyToGCS } from "#app/controllers/app.js"
import { downloadFile } from "#app/controllers/download.js"
import { sendNotificationController } from "#app/controllers/notifications.js"
import express from "express"
const coreRouter = express.Router()

coreRouter.get("/", homeController)
coreRouter.post("/test", testFn)
coreRouter.post("/notification/send", sendNotificationController)
coreRouter.post("/test3", testUpload)
coreRouter.post("/test4", testCopyToGCS)
coreRouter.post("/test-copy", testCopy)
coreRouter.get("/download/file", downloadFile)
export default coreRouter
