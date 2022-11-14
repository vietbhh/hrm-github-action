// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { DashboardApi } from "../../../../common/api"
// ** Styles
import { CardBody } from "reactstrap"
// ** Components
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"
import AttendanceTimer from "./AttendanceTimer"
import AttendanceClock from "./AttendanceClock"

const ClockInOutProgress = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    infoAttendance: {},
    listAttendanceDetail: [],
    attendanceToday: {},
    workScheduleToday: {}
  })

  const getAttendanceData = () => {
    setState({
      loading: true
    })
    DashboardApi.getAttendanceToday()
      .then((res) => {
        setState({
          infoAttendance: res.data.info_attendance,
          listAttendanceDetail: res.data.list_attendance_detail,
          attendanceToday: res.data.attendance_today,
          workScheduleToday: res.data.work_schedule_today,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          infoAttendance: {},
          listAttendanceDetail: [],
          attendanceToday: {},
          workScheduleToday: {},
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    getAttendanceData()
  }, [])

  // ** render
  const renderLoading = () => {
    return (
      <div>
        <div
          className="ant-spin ant-spin-spinning"
          aria-live="polite"
          aria-busy="true">
          <span className="ant-spin-dot ant-spin-dot-spin">
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
          </span>
        </div>
      </div>
    )
  }

  const renderAttendanceTimer = () => {
    return (
      <AttendanceTimer
        renderTimeOnly={false}
        attendanceToday={state.attendanceToday}
        workScheduleToday={state.workScheduleToday}
      />
    )
  }

  const renderAttendanceClock = () => {
    return <AttendanceClock attendanceToday={state.attendanceToday} />
  }

  const renderBody = () => {
    if (state.loading) {
      return <Fragment>{renderLoading()}</Fragment>
    }

    return (
      <Fragment>
        <div className="">
          <div>
            <Fragment>{renderAttendanceTimer()}</Fragment>
          </div>
          <div className="mt-2">
            <Fragment>{renderAttendanceClock()}</Fragment>
          </div>
        </div>
      </Fragment>
    )
  }

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
        <CardBody className="min-height-50">
          <div className="mt-2 ps-0 content-body attendance-progress">
            <Fragment>{renderBody()}</Fragment>
          </div>
        </CardBody>
      </LayoutDashboard>
    </Fragment>
  )
}

export default ClockInOutProgress
