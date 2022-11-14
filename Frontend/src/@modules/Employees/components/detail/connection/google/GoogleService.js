// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { userApi } from "@modules/Employees/common/api"
// ** Styles
import { Card, CardBody, CardHeader } from "reactstrap"
// ** Components
import LoginInfo from "./LoginInfo"
import GoogleServiceCollection from "./GoogleServiceCollection"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const TabGoogleService = (props) => {
  const {
    // ** props
    employeeData,
    page
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    syncedWithGoogle: false,
    syncCalendarStatus: false,
    syncDriveStatus: false
  })

  const loadUserInfo = () => {
    setState({
      loading: true
    })
    userApi
      .getUserInfo()
      .then((res) => {
        setState({
          syncedWithGoogle: res.data.synced,
          syncCalendarStatus: res.data.sync_calendar_status,
          syncDriveStatus: res.data.sync_drive_status,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          syncedWithGoogle: false,
          syncCalendarStatus: false,
          syncDriveStatus: false,
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    if (page === "profile") {
      loadUserInfo()
    }
  }, [])

  // ** render
  const renderLoginInfo = () => {
    return (
      <LoginInfo
        page={page}
        employeeData={employeeData}
        syncedWithGoogle={state.syncedWithGoogle}
        loadUserInfo={loadUserInfo}
      />
    )
  }

  const renderSelectGoogleServiceCollection = () => {
    return (
      <GoogleServiceCollection
        syncedWithGoogle={state.syncedWithGoogle}
        syncCalendarStatus={state.syncCalendarStatus}
        syncDriveStatus={state.syncDriveStatus}
      />
    )
  }

  const renderBody = () => {
    if (state.loading) {
      return <AppSpinner />
    }

    return (
      <Fragment>
        <div>
          <div className="mb-2 mt-1">{renderLoginInfo()}</div>
          <div>{renderSelectGoogleServiceCollection()}</div>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Card className="card-inside with-border-radius life-card card-google-services">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">
                <i className="fab fa-google" />
              </span>
              <span>
                {useFormatMessage(
                  "modules.employees.tabs.connection.google_service.title"
                )}
              </span>
            </h1>
          </div>
        </CardHeader>
        <CardBody>{renderBody()}</CardBody>
      </Card>
    </Fragment>
  )
}

export default TabGoogleService
