// ** Reducers Imports
import navbar from "./navbar"
import layout from "./layout"
import auth from "./authentication"
import notification from "./notification"

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
<<<<<<< HEAD
  drive,
=======
  users,
>>>>>>> 6fa4e8c16c439201db3133cb47b39486c3f88202
  ...modules
}

export default rootReducer
