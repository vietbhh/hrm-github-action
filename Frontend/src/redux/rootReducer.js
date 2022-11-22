// ** Reducers Imports
import navbar from "./navbar"
import layout from "./layout"
import auth from "./authentication"
import notification from "./notification"

// ** Custom Import
import app from "./app/app"
import calendar from "@apps/modules/calendar/common/reducer/calendar"
import * as modules from "./modules"

const rootReducer = {
  app,
  auth,
  notification,
  navbar,
  layout,
  calendar,
  ...modules
}

export default rootReducer
