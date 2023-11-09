// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { Fragment, useEffect } from "react"
import { notificationApi } from "../common/api"
// ** redux
import { useDispatch, useSelector } from "react-redux"
import {
  handleSeenNotification,
  handleReadNotification
} from "@store/notification"
// ** Styles
import { Pagination } from "antd"
import { Card, CardBody, CardHeader } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"
import ListNotification from "layouts/_components/vertical/navbar/ListNotification"

const NotificationIndex = (props) => {
  const [state, setState] = useMergedState({
    loading: "",
    page: 1,
    notifications: [],
    numberNotification: 0,
    submitting: false
  })

  const settingState = useSelector((state) => state.auth.settings)
  const notificationDB =
    settingState?.notification_db === undefined
      ? "mysql"
      : settingState.notification_db
  const dispatch = useDispatch()

  const numberItemPerPage = 10

  const setNotificationData = (data, type = "update") => {
    const idField = notificationDB === "mongo" ? "_id" : "id"
    if (type === "update") {
      const newNotification = [...state.notifications].map((item) => {
        if (item[idField] === data[idField]) {
          return { ...data }
        }

        return item
      })

      setState({
        notifications: newNotification
      })
    } else if (type === "remove") {
      const newNotification = [...state.notifications].filter((item) => {
        return item[idField] !== data[idField]
      })

      setState({
        notifications: newNotification,
        numberNotification: state.numberNotification - 1
      })
    } else if (type === "renew") {
      setState({
        notifications: data
      })
    }
  }

  const loadNotification = () => {
    setState({
      loading: true
    })
    notificationApi
      .loadCalendar({
        page: state.page
      })
      .then((res) => {
        setState({
          notifications: res.data.results,
          numberNotification: res.data.number_notification,
          loading: false
        })
      })
      .catch((err) => {
        notification.showError()
        setState({
          notifications: [],
          numberNotification: 0,
          loading: false
        })
      })
  }

  const onChange = (page) => {
    setState({
      page: page
    })
  }

  const seenNotification = () => {
    defaultModuleApi
      .get(
        `/notification/seen?page=${state.page}&per_page=${numberItemPerPage}`
      )
      .then((res) => {
        dispatch(
          handleSeenNotification({
            listNotificationSeen: res.data.list_notification_seen,
            numberNotificationSeen: res.data.number_notification_seen
          })
        )
      })
      .catch((err) => {})
  }

  const handleClickReadAll = () => {
    setState({
      submitting: true
    })

    notificationApi
      .readNotification("all")
      .then((res) => {
        dispatch(
          handleReadNotification({
            listNotificationRead: res.data.list_notification_read,
            numberNotificationRead: res.data.number_notification_read
          })
        )

        const newDataNotification = [...state.notifications].map((item) => {
          return {
            ...item,
            read: true
          }
        })

        setState({
          notifications: newDataNotification,
          submitting: false
        })
      })
      .catch((err) => {
        setState({
          submitting: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadNotification()
  }, [state.page])

  useEffect(() => {
    if (state.loading === false) {
      seenNotification()
    }
  }, [state.loading])

  // ** render
  const renderListNotification = () => {
    if (state.notifications.length > 0) {
      return (
        <Fragment>
          <div className="">
            <ListNotification
              listNotification={state.notifications}
              showDropdownAction={true}
              setNotificationData={setNotificationData}
            />
          </div>
          <div className="ms-2">
            <Pagination
              current={state.page}
              onChange={onChange}
              total={state.numberNotification}
              defaultPageSize={numberItemPerPage}
            />
          </div>
        </Fragment>
      )
    }

    return (
      <p className="ps-2">{useFormatMessage("notification.no_notification")}</p>
    )
  }

  const renderComponent = () => {
    return (
      <Fragment>
        <div className="notification-page">
          <Card>
            <CardHeader>
              <div className="d-flex align-items-center justify-content-between w-100">
                <h3 className="mb-0 page-title">
                  {useFormatMessage("modules.notification.title")}
                </h3>
                <p
                  className="mb-0 mt-0 read-all-text"
                  onClick={() => handleClickReadAll()}>
                  {useFormatMessage(
                    "modules.notification.text.mark_all_as_read"
                  )}
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <Fragment>{renderListNotification()}</Fragment>
            </CardBody>
          </Card>
        </div>
      </Fragment>
    )
  }

  return !state.loading && renderComponent()
}

export default NotificationIndex
