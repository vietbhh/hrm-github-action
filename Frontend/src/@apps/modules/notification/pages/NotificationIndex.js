// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { Fragment, useEffect } from "react"
import { notificationApi } from "../common/api"
// ** Styles
import { Pagination } from "antd"
import { Card, CardBody, CardHeader } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"
import ListNotification from "../../../../layouts/components/vertical/navbar/ListNotification"

const NotificationIndex = (props) => {
  const [state, setState] = useMergedState({
    loading: "",
    page: 1,
    notifications: [],
    numberNotification: 0
  })

  const numberItemPerPage = 10

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

  const handleSeenNotification = () => {
    defaultModuleApi
      .get(
        `/notification/read?page=${state.page}&per_page=${numberItemPerPage}`
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err)
      })
  }

  // ** effect
  useEffect(() => {
    loadNotification()
  }, [state.page])

  useEffect(() => {
    if (state.loading === false) {
      handleSeenNotification()
    }
  }, [state.loading])

  const renderComponent = () => {
    return (
      <Fragment>
        <div className="notification-page">
          <Card>
            <CardHeader>
              <h3 className="ms-2">
                <span className="title-icon">
                  <i class="far fa-bells" />
                </span>
                {useFormatMessage("modules.notification.title")}
              </h3>
            </CardHeader>
            <CardBody>
              <div className="mb-4">
                <ListNotification listNotification={state.notifications} />
              </div>
              <div className="ms-2">
                <Pagination
                  current={state.page}
                  onChange={onChange}
                  total={state.numberNotification}
                  defaultPageSize={numberItemPerPage}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </Fragment>
    )
  }

  return !state.loading && renderComponent()
}

export default NotificationIndex
