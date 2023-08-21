// ** React Imports
import { useMergedState, useFormatMessage } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { DashboardApi } from "../../../common/api"
// ** Styles
// ** Components
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"
import ClockInOut from "./ClockInOut"
import ClockInOutProgress from "./ClockInOutProgress/CLockInOutProgress"
import { CardBody } from "reactstrap"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"

const ClockInOutWidget = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    isAttendanceDoorIntegrate: null
  })

  const loadAttendanceSetting = () => {
    setState({
      loading: true
    })
    DashboardApi.getAttendanceSetting()
      .then((res) => {
        setState({
          isAttendanceDoorIntegrate: res.data.data.attendance_door_integrate,
          loading: false
        })

        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
      .catch((err) => {
        setState({
          isAttendanceDoorIntegrate: null,
          loading: false
        })

        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
  }

  // ** effect
  useEffect(() => {
    loadAttendanceSetting()
  }, [])

  // ** render
  return (
    <Fragment>
      <LayoutDashboard
        className="card-user-timeline dashboard-clock-in-out"
        headerProps={{
          id: "clock_in_out",
          title: useFormatMessage("modules.attendance.title.clock_in_out"),
          isRemoveWidget: true,
          classIconBg: "new-clock-icon",
          icon: (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="icon">
              <path
                d="M16.5 9C16.5 13.14 13.14 16.5 9 16.5C4.86 16.5 1.5 13.14 1.5 9C1.5 4.86 4.86 1.5 9 1.5C13.14 1.5 16.5 4.86 16.5 9Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.7825 11.385L9.4575 9.99751C9.0525 9.75751 8.7225 9.18001 8.7225 8.70751V5.63251"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          ...props
        }}>
        <CardBody className="profile-suggestion min-height-50">
          {state.loading || state.isAttendanceDoorIntegrate === null ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
              }}>
              <DefaultSpinner />
            </div>
          ) : state.isAttendanceDoorIntegrate ? (
            <ClockInOutProgress {...props} />
          ) : (
            <ClockInOut {...props} />
          )}
        </CardBody>
      </LayoutDashboard>
    </Fragment>
  )
}

export default ClockInOutWidget
