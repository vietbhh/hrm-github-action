// ** Reducers Imports
import navbar from "./navbar"
import layout from "./layout"
import auth from "./authentication"
import notification from "./notification"
/* import todo from '@src/views/apps/todo/store'
import chat from '@src/views/apps/chat/store'
import users from '@src/views/apps/user/store'
import email from '@src/views/apps/email/store'
import kanban from '@src/views/apps/kanban/store'
import invoice from '@src/views/apps/invoice/store'
import calendar from '@src/views/apps/calendar/store'
import ecommerce from '@src/views/apps/ecommerce/store'
import dataTables from '@src/views/tables/data-tables/store'
import permissions from '@src/views/apps/roles-permissions/store' */

// ** Custom Import
import app from "./app/app"
import calendar from "@apps/modules/calendar/common/reducer/calendar"
import errors from "./app/errors"
import loadings from "./app/loadings"
import * as modules from "./modules"

const rootReducer = {
  app,
  errors,
  loadings,
  auth,
  notification,
  navbar,
  layout,
  calendar,
  ...modules
}

export default rootReducer
