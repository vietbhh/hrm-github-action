import calendarMongoModel from "#code/hrm/modules/calendar/models/calendar.mongo.js"
import { getUser, getUserActivated } from "#app/models/users.mysql.js"
import { forEach, isEmpty } from "lodash-es"
import moment from "moment"
import feedMongoModel from "../../models/feed.mongo.js"
import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import { _uploadServices } from "#app/services/upload.js"
import { handleDataHistory } from "../../controllers/feed.js"
import path from "path"

const addEvent = async (req, insertFeed = true) => {
  const file = req.files
  const body = JSON.parse(req.body.body)
  const idEdit = body.idEvent
  const idPost = body.idPost
  const arrEmployeeAttendeesCheck = []
  const employee = []
  const employeeId = []
  const employee_arr_id = []
  const department = []
  const workspace = body?.workspace
  let checkIsAll = false
  forEach(body.dataAttendees, (item) => {
    if (item.value === "all") {
      checkIsAll = true
      return
    }
  })

  const isEventImportant = body.switch_important

  if (checkIsAll) {
    const listEmployee = await getUserActivated()
    forEach(listEmployee, (item) => {
      arrEmployeeAttendeesCheck.push(item.id.toString())
      employee.push({
        id: item.id,
        status: isEventImportant ? "yes" : "",
        dateUpdate: Date.now()
      })

      if (req.__user.toString() !== item.id.toString()) {
        employee_arr_id.push(item.id)
      }
    })
  } else {
    forEach(body.dataAttendees, (item) => {
      const value = item.value
      const value_arr = value.split("_")
      if (value_arr[1] === "employee") {
        arrEmployeeAttendeesCheck.push(value_arr[0].toString())

        employeeId.push(value_arr[0])
        employee.push({
          id: value_arr[0],
          status: isEventImportant ? "yes" : "",
          dateUpdate: Date.now()
        })

        if (req.__user.toString() !== value_arr[0].toString()) {
          employee_arr_id.push(value_arr[0])
        }
      }
      if (value_arr[1] === "department") {
        department.push(value_arr[0])
      }
    })

    if (!isEmpty(department)) {
      const dataEmployeeDepartment = await getUserActivated({
        department_id: department
      })
      forEach(dataEmployeeDepartment, (item) => {
        const index = employee.findIndex((val) => val.id === item.id)
        if (
          index === -1 &&
          arrEmployeeAttendeesCheck.indexOf(item.id.toString()) === -1
        ) {
          employee.push({
            id: item.id,
            status: isEventImportant ? "yes" : "",
            dateUpdate: Date.now()
          })

          if (req.__user.toString() !== item.id.toString()) {
            employee_arr_id.push(item.id)
          }
        }
      })
    }
  }

  try {
    const reminder_date = handleReminderDate(
      body.start_time_date,
      body.start_time_time,
      body.reminder.value
    )

    const userId = req.__user
    const dataInsert = {
      __user: userId,
      name: body.event_name,
      color: body.color,
      start_time_date: body.start_time_date,
      start_time_time: body.switch_all_day ? null : body.start_time_time,
      end_time_date: body.end_time_date,
      end_time_time: body.switch_all_day ? null : body.end_time_time,
      all_day_event: body.switch_all_day,
      important: isEventImportant,
      repeat: body.valueRepeat,
      employee: employee,
      attendees: body.dataAttendees,
      meeting_room: body.meeting_room,
      reminder: body.reminder.value,
      reminder_date: reminder_date,
      online_meeting: body.switch_online_meeting,
      details: body.details
    }

    let data_old = {}
    let _id = idEdit
    let result = {
      dataFeed: {},
      dataLink: {}
    }

    if (!idEdit) {
      const eventModel = new calendarMongoModel(dataInsert)
      const saveEvent = await eventModel.save()
      const idEvent = saveEvent._id

      // ** insert feed
      let out = undefined
      if (insertFeed) {
        const linkPermission = {
          is_all: false,
          employee: [],
          department: []
        }

        if (checkIsAll) {
          linkPermission["is_all"] = true
          linkPermission["employee"] = []
          linkPermission["department"] = []
        } else {
          linkPermission["is_all"] = false
          linkPermission["employee"] = employeeId
          linkPermission["department"] = department
        }
        let permission = "default"
        let permission_id = []
        console.log("workspace", workspace)
        console.log("const body", body)

        if (workspace && workspace.length > 0) {
          permission = "workspace"
          permission_id = [workspace]
        }

        const feedModel = new feedMongoModel({
          __user: req.__user,
          type: "event",
          link_id: idEvent,
          link_permission: linkPermission,
          permission: permission,
          permission_ids: permission_id
        })
        out = await feedModel.save()

        await calendarMongoModel.updateOne(
          { _id: idEvent },
          { id_post: out._id }
        )
      }

      // ** send notification
      await _handleSendNotification(
        userId,
        employee_arr_id,
        body.event_name,
        out,
        idEvent,
        isEventImportant
      )

      _id = idEvent
      const _out = out !== undefined ? await handleDataBeforeReturn(out) : {}
      result = { dataFeed: _out, dataLink: {} }
    } else {
      data_old = await calendarMongoModel.findById(idEdit)
      const oldEmployee = data_old.employee
      await calendarMongoModel.updateOne({ _id: idEdit }, dataInsert)
      const newEmployeeUpdate = []
      employee.map((itemNew) => {
        if (
          !oldEmployee.some(
            (itemSome) => parseInt(itemSome.id) === parseInt(itemNew.id)
          )
        ) {
          newEmployeeUpdate.push(itemNew.id)
        }
      })

      const postData = !isEmpty(data_old.id_post)
        ? { _id: data_old.id_post }
        : undefined
      await _handleSendNotification(
        userId,
        newEmployeeUpdate,
        dataInsert.name,
        postData,
        idEdit,
        isEventImportant,
        isEventImportant
      )

      let _dataFeed = {}
      if (idPost && insertFeed) {
        const dataFeed = await feedMongoModel.findById(idPost)
        _dataFeed = await handleDataBeforeReturn(dataFeed)
      }

      result = {
        dataFeed: _dataFeed,
        dataLink: {}
      }
    }

    // attachment
    const storePath = path.join("modules", "event", _id.toString())
    const promises = []
    forEach(body.file, (item, index) => {
      const type = item.type
      const promise = new Promise(async (resolve, reject) => {
        if (item.new) {
          const resultUpload = await _uploadServices(storePath, [
            file[`file[${index}][file]`]
          ])
          const result = {
            type: type,
            name: resultUpload.uploadSuccess[0].name,
            size: resultUpload.uploadSuccess[0].size,
            src: resultUpload.uploadSuccess[0].path
          }
          resolve(result)
        } else {
          const result = {
            type: type,
            name: item.name,
            size: item.size,
            src: item.src
          }
          resolve(result)
        }
      })
      promises.push(promise)
    })
    const attachment = await Promise.all(promises).then((res) => {
      return res
    })
    await calendarMongoModel.updateOne(
      { _id: _id },
      {
        attachment: attachment
      }
    )

    const dataEvent = await calendarMongoModel.findById(_id)

    if (idEdit && idPost && insertFeed) {
      // update history
      const field_compare = [
        "name",
        "color",
        "start_time_date",
        "start_time_time",
        "end_time_date",
        "end_time_time",
        "all_day_event",
        "repeat",
        "attendees",
        "meeting_room",
        "reminder",
        "online_meeting",
        "details",
        "attachment"
      ]
      const data_edit_history = handleDataHistory(
        req.__user,
        dataEvent,
        data_old,
        field_compare,
        { type: "event" }
      )

      if (!isEmpty(data_edit_history)) {
        await feedMongoModel.updateOne(
          { _id: idPost },
          {
            edited: true,
            $push: { edit_history: data_edit_history }
          }
        )
      }
    }

    result.dataLink = dataEvent
    result.dataFeed.dataLink = dataEvent
    return {
      success: true,
      result: result
    }
  } catch (err) {
    return {
      success: false,
      err: err.message
    }
  }
}

const _handleSendNotification = async (
  userId,
  employee_arr_id,
  event_name,
  out,
  idEvent,
  isEventImportant
) => {
  if (employee_arr_id.length === 0) {
    return false
  }

  const userInfo = await getUser(userId)

  const receivers = employee_arr_id
  const bodyNotification = `<strong>${userInfo.full_name}</strong> {{modules.feed.create_post.text.invited_you_to}} <strong>${event_name}</strong> {{modules.network.notification.event}}`
  const link = out === undefined ? `/calendar` : `/posts/${out._id}`
  const notificationAction =
    out === undefined || isEventImportant === true
      ? null
      : [
          {
            status: "",
            message: "",
            contents: [
              {
                key: "accepted",
                type: "api_button",
                text: "Accept",
                color: "success",
                api_url: "/feed/update-event-status",
                api_type: "node",
                api_methods: "post",
                api_post_data: {
                  id: idEvent,
                  status: "yes"
                },
                api_option: {
                  disableLoading: true
                }
              },
              {
                key: "declined",
                type: "api_button",
                text: "Decline",
                color: "danger",
                api_url: "/feed/update-event-status",
                api_type: "node",
                api_methods: "post",
                api_post_data: {
                  id: idEvent,
                  status: "no"
                },
                api_option: {
                  disableLoading: true
                }
              },
              {
                key: "maybe",
                type: "api_button",
                text: "Maybe",
                color: "warning",
                api_url: "/feed/update-event-status",
                api_type: "node",
                api_methods: "post",
                api_post_data: {
                  id: idEvent,
                  status: "maybe"
                },
                api_option: {
                  disableLoading: true
                }
              }
            ]
          }
        ]

  sendNotification(
    userId,
    receivers,
    {
      title: "",
      body: bodyNotification,
      link: link,
      actions: notificationAction,
      icon: parseInt(userId)
      //icon: icon
      //image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
    },
    {
      skipUrls: ""
    }
  )
}

const handleReminderDate = (date, time, reminder) => {
  let date_reminder = null

  if (time) {
    const _date = `${moment(date).format("YYYY-MM-DD")} ${moment(time).format(
      "HH:mm:ss"
    )}`

    if (reminder === "just_in_time") {
      date_reminder = date
    }

    if (reminder === "5_minutes_before") {
      date_reminder = moment(_date).subtract(5, "minutes")
    }

    if (reminder === "10_minutes_before") {
      date_reminder = moment(_date).subtract(10, "minutes")
    }

    if (reminder === "15_minutes_before") {
      date_reminder = moment(_date).subtract(15, "minutes")
    }

    if (reminder === "30_minutes_before") {
      date_reminder = moment(_date).subtract(30, "minutes")
    }

    if (reminder === "1_hour_before") {
      date_reminder = moment(_date).subtract(1, "hours")
    }

    if (reminder === "1_day_before") {
      date_reminder = moment(_date).subtract(1, "days")
    }
  }

  return date_reminder
}

export { addEvent }
