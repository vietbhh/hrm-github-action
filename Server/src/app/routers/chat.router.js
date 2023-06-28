import {
  addGroupMember,
  createGroup,
  deleteGroup,
  removeGroupMember,
  sendMessageGroup
} from "#app/controllers/chat.js"
import express from "express"
const chatRouter = express.Router()

chatRouter.post("/create-group", createGroup)
chatRouter.post("/add-group-member", addGroupMember)
chatRouter.post("/remove-group-member", removeGroupMember)
chatRouter.post("/delete-group", deleteGroup)
chatRouter.post("/send-message-group", sendMessageGroup)

export default chatRouter
