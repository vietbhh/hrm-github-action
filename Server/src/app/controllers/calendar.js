import calendarMongoModel from "#app/models/calendar.mongo.js"
import {
  getCalendar,
  addCalendar,
  getDetailEvent,
  getListEvent
} from "#app/libraries/calendar/Calendar.js"
import { map } from "lodash-es"
import dayjs from "dayjs"

const handleGetCalendar = async (req, res) => {
  const query = req.query
  const listCalendar = await getCalendar(calendarMongoModel, query)
  const arrAllDay = map(listCalendar.allDayEvent, (item) => {
    return item
  })
  const resultFilter = listCalendar.result
  .map((item) => {
    const owner = item.owner
    if (parseInt(owner) === parseInt(req.userId)) {
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

  return res.respond({
    data: data
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
  const arrAllDay = map(listCalendar.allDayEvent, (item) => {
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
  const resultAdd = await addCalendar(calendarMongoModel, req.userId, req)
  if (resultAdd.success === false) {
    return res.fail(resultAdd.err)
  }

  return res.respond({
    result: resultAdd.result
  })
}

export {
  handleGetCalendar,
  handleAddCalendar,
  handleGetDetailEvent,
  handleGetListEvent
}