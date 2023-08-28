import {
  getCalendar,
  getDetailEvent
} from "#app/libraries/calendar/Calendar.js"
import calendarMongoModel from "#code/hrm/modules/calendar/models/calendar.mongo.js"
import { map, isArray } from "lodash-es"
import { addEvent } from "#code/hrm/modules/feed/libraries/event/Event.js"
import dayjs from "dayjs"
// ** models
import { Op } from "sequelize"
import { timeOffHolidaysModel } from "#code/hrm/modules/timeOff/models/timeOffHolidays.mysql.js"
import { timeOffRequestsModel } from "#code/hrm/modules/timeOff/models/timeOffRequests.mysql.js"
import { timeOffTypesModel } from "#code/hrm/modules/timeOff/models/timeOffTypes.mysql.js"
import { getUser, getUsers, usersModel } from "#app/models/users.mysql.js"
import { getOptionValue } from "#app/helpers/appOptionsHelper"

const handleGetCalendar = async (req, res) => {
  const query = req.query
  const listCalendar = await getCalendar(calendarMongoModel, req.__user, query)
  const allDayEvent = await _getListAllDayEvent(
    listCalendar.allDayEvent,
    query,
    req.__user
  )
  const arrAllDay = map(allDayEvent, (item) => {
    return item
  })

  const resultFilter = listCalendar.result
    .map((item) => {
      const owner = item.owner
      const employee = isArray(item.employee) ? item.employee : []

      if (parseInt(owner) === parseInt(req.__user)) {
        return item
      } else if (
        employee.some((itemSome) => {
          return parseInt(itemSome.id) === parseInt(req.__user)
        })
      ) {
        return item
      }
    })
    .filter((item) => {
      return item !== undefined
    })
  const result = resultFilter.concat(arrAllDay)

  return res.respond({
    results: result
  })
}

const handleGetDetailEvent = async (req, res) => {
  const id = req.params.id
  const data = await getDetailEvent(calendarMongoModel, id)
  const owner = data.owner
  const employee = isArray(data.employee) ? data.employee : []
  let isEditable = false
  let isOwner = false
  if (parseInt(owner) === parseInt(req.__user)) {
    isEditable = true
    isOwner = true
  } else if (
    employee.some((itemSome) => {
      return parseInt(itemSome.id) === parseInt(req.__user)
    })
  ) {
    isEditable = false
  }

  const ownerInfo = await getUser(data.owner)

  return res.respond({
    data: {
      ...data._doc,
      is_editable: isEditable,
      is_owner: isOwner,
      info_owner: {
        label: ownerInfo?.full_name,
        username: ownerInfo?.username,
        avatar: ownerInfo?.avatar,
        email: ownerInfo?.email
      }
    }
  })
}

const handleGetListEvent = async (req, res) => {
  const from =
    req.query.from !== undefined ? req.query.from : dayjs().format("YYYY-MM-DD")
  const query = {
    created_at_from: from,
    created_at_to:
      req.query.to !== undefined
        ? req.query.to
        : dayjs(from).add(1, "day").format("YYYY-MM-DD")
  }

  const listCalendar = await getCalendar(calendarMongoModel, req.__user, query)
  const allDayEvent = await _getListAllDayEvent(
    listCalendar.allDayEvent,
    query,
    req.__user
  )
  const arrAllDay = map(allDayEvent, (item) => {
    return item
  })
  const result = listCalendar.result.concat(arrAllDay)

  const listEvent = {
    today: [],
    tomorrow: []
  }

  result.map((item) => {
    const startDate = item.start
      ? item.start
      : dayjs(item.start_time_date).format("YYYY-MM-DD")

    if (startDate === query.created_at_from) {
      listEvent.today.push(item)
    } else if (dayjs(startDate).diff(query.created_at_from) > 0) {
      listEvent.tomorrow.push(item)
    }
  })

  return res.respond({
    results: listEvent
  })
}

const handleAddCalendar = async (req, res) => {
  const resultAdd = await addEvent(req, false)
  if (resultAdd.success === false) {
    return res.fail(resultAdd.err)
  }

  return res.respond({
    result: resultAdd.result
  })
}

// ** support function
const _getListAllDayEvent = async (arrAllDay = {}, query = {}, userId = 1) => {
  const createdAtFrom =
    query["created_at_from"] !== undefined ? query["created_at_from"] : ""
  const createdAtTo =
    query["created_at_to"] !== undefined ? query["created_at_to"] : ""

  const dateTimeFrom = new Date(createdAtFrom).getTime()
  const dateTimeTo = new Date(createdAtTo).getTime()

  const userInfo = await getUser(userId)
  const userOffice = userInfo.office

  // get list employee dob
  const listEmployee = await usersModel.findAll()
  map(listEmployee, (item) => {
    const dob = item.dob
    if (dob !== undefined && dob !== null) {
      const dateMonth = dayjs(dob).format("MM-DD")
      const currentDate = dayjs().format("YYYY") + "-" + dateMonth
      const employeeInfo = {
        color: "5398ff",
        name: "Birthday " + item.full_name,
        id: item.id,
        full_name: item.full_name,
        email: item.email,
        avatar: item.avatar,
        start_time_date: currentDate,
        end_time_date: currentDate
      }
      const currentDateTime = new Date(currentDate).getTime()
      if (currentDateTime <= dateTimeTo && currentDateTime >= dateTimeFrom) {
        const pushItem = {
          start: currentDate,
          end: currentDate,
          allday: true,
          is_dob: true,
          title: "birthday",
          is_editable: false,
          is_viewable: true,
          employee_info: [employeeInfo]
        }

        if (arrAllDay[currentDate] === undefined) {
          arrAllDay[currentDate] = pushItem
        } else if (arrAllDay[currentDate]["is_dob"] === undefined) {
          arrAllDay[currentDate]["is_dob"] = true
          arrAllDay[currentDate]["employee_info"] = [employeeInfo]
        } else {
          arrAllDay[currentDate]["employee_info"].push(employeeInfo)
        }
      }
    }
  })

  // get list holiday
  const listHoliday = await timeOffHolidaysModel.findAll({
    where: {
      office_id: userOffice,
      from_date: {
        [Op.lte]: createdAtTo
      },
      to_date: {
        [Op.gte]: dayjs(createdAtFrom).subtract(1, "days").format("YYYY-MM-DD")
      }
    }
  })

  listHoliday.map((item) => {
    const fromDate = item.from_date
    const toDate = item.to_date

    const holidayInfo = {
      color: "5398ff",
      id: item.id,
      from_date: dayjs(fromDate).format("YYYY MMMM DD"),
      to_date: dayjs(toDate).format("YYYY MMMM DD"),
      start_time_date: dayjs(fromDate).format("YYYY-MM-DD"),
      end_time_date: dayjs(toDate).format("YYYY-MM-DD"),
      name: item.name
    }

    const begin = new Date(fromDate)
    const end = new Date(toDate)

    for (let d = begin; d <= end; d.setDate(d.getDate() + 1)) {
      const date = dayjs(d).format("YYYY-MM-DD")

      const pushItem = {
        start: date,
        end: date,
        allday: true,
        is_holiday: true,
        title: "holiday",
        is_editable: false,
        is_viewable: false,
        holiday_info: [holidayInfo]
      }

      if (arrAllDay[date] === undefined) {
        arrAllDay[date] = pushItem
      } else if (arrAllDay[date]["is_holiday"] === undefined) {
        arrAllDay[date]["is_holiday"] = true
        arrAllDay[date]["holiday_info"] = [holidayInfo]
      } else {
        arrAllDay[date]["holiday_info"].push(holidayInfo)
      }
    }
  })

  // get list time off
  const approvedStatus = await getOptionValue(
    "time_off_requests",
    "status",
    "approved"
  )
  const pendingStatus = await getOptionValue(
    "time_off_requests",
    "status",
    "pending"
  )

  const listTimeOffType = await timeOffTypesModel.findAll()
  const arrTimeOffType = {}
  map(listTimeOffType, (item) => {
    arrTimeOffType[item.id] = item.name
  })

  const listTimeOff = await timeOffRequestsModel.findAll({
    attributes: [
      "id",
      "note",
      "status",
      "date_from",
      "time_from",
      "date_to",
      "time_to",
      "is_full_day",
      "type"
    ],
    where: {
      status: {
        [Op.in]: [approvedStatus, pendingStatus]
      },
      date_from: {
        [Op.lte]: createdAtTo
      },
      date_to: {
        [Op.gte]: dayjs(createdAtFrom).subtract(1, "days").format("YYYY-MM-DD")
      },
      owner: userId
    }
  })

  map(listTimeOff, (item) => {
    const fromDate = item.date_from
    const toDate = item.date_to

    const timeOffInfo = {
      color: "5398ff",
      name:
        arrTimeOffType[item.type] !== undefined
          ? arrTimeOffType[item.type]
          : "Time off ",
      id: item.id,
      note: item.note,
      status: item.status,
      is_pending: item.status === pendingStatus,
      from_date: dayjs(fromDate, "DD MMMM YYYY HH:mm A"),
      to_date: dayjs(toDate, "DD MMMM YYYY HH:mm A"),
      start_time_date: dayjs(fromDate, "YYYY-MM-DD HH:mm:ss"),
      end_time_date: dayjs(fromDate, "YYYY-MM-DD HH:mm:ss"),
      type_name:
        arrTimeOffType[item.type] !== undefined ? arrTimeOffType[item.type] : ""
    }

    const begin = new Date(fromDate)
    const end = new Date(toDate)

    for (let d = begin; d <= end; d.setDate(d.getDate() + 1)) {
      const date = dayjs(d).format("YYYY-MM-DD")
      const pushItem = {
        start: date,
        end: date,
        allday: item.is_full_day,
        is_time_off: true,
        title: "time_off",
        is_editable: false,
        is_viewable: false,
        time_off_info: [timeOffInfo]
      }

      if (arrAllDay[date] === undefined) {
        arrAllDay[date] = pushItem
      } else if (arrAllDay[date]["is_time_off"] === undefined) {
        arrAllDay[date]["is_time_off"] = true
        arrAllDay[date]["time_off_info"] = [timeOffInfo]
      } else {
        arrAllDay[date]["time_off_info"].push(timeOffInfo)
      }
    }
  })

  return arrAllDay
}

export {
  handleGetCalendar,
  handleAddCalendar,
  handleGetDetailEvent,
  handleGetListEvent
}
