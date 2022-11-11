// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState, useFormatMessage } from "@apps/utility/common"
import { notificationApi } from "../common/api"
import { defaultModuleApi } from "@apps/utility/moduleApi"
// ** Styles
import { Card, CardHeader, CardBody } from "reactstrap"
import { Pagination } from "antd"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
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
        `/notification/seen-notification?page=${state.page}&per_page=${numberItemPerPage}`
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

  // ** render
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[{ title: useFormatMessage("modules.notification.title") }]}
      />
    )
  }

  const renderListNotification = () => {
    return <ListNotification listNotification={state.notifications} />
  }

  const renderPagination = () => {
    return (
      <Pagination
        current={state.page}
        onChange={onChange}
        total={state.numberNotification}
        defaultPageSize={numberItemPerPage}
      />
    )
  }

  const renderComponent = () => {
    return (
      <Fragment>
        <div className="notification-page">
          <Fragment>{renderBreadcrumb()}</Fragment>
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
                <Fragment>{renderListNotification()}</Fragment>
              </div>
              <div className="ms-2">
                <Fragment>{renderPagination()}</Fragment>
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
