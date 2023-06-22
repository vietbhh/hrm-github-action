// ** Reducers Imports
import navbar from "./navbar"
import layout from "./layout"
import auth from "./authentication"
import notification from "./notification"
import chat from "./chat"

// ** Custom Import
import app from "./app/app"
import users from "./app/users"
import calendar from "@apps/modules/calendar/common/reducer/calendar"
import drive from "@apps/modules/drive/common/reducer/drive"
import * as modules from "./modules"

const rootReducer = {
  app,
  auth,
  notification,
  navbar,
  layout,
  calendar,
  chat,
  drive,
  users,
  ...modules
}

export default rootReducer
