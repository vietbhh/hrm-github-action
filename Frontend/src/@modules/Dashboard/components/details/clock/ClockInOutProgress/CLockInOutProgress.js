// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { DashboardApi } from "../../../../common/api"
// ** Styles
// ** Components
import AttendanceClock from "./AttendanceClock"
import AttendanceTimer from "./AttendanceTimer"

const ClockInOutProgress = (props) => {
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
        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
      .catch((err) => {
        setState({
          infoAttendance: {},
          listAttendanceDetail: [],
          attendanceToday: {},
          workScheduleToday: {},
          loading: false
        })
        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
  }

  // ** effect
  useEffect(() => {
    getAttendanceData()
  }, [])

  // ** render
  const renderBody = () => {
    if (state.loading) {
      return (
        <div>
          <div
            className="ant-spin ant-spin-spinning text-center d-flex align-items-center justify-content-center"
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

    return (
      <Fragment>
        <AttendanceTimer
          renderTimeOnly={false}
          attendanceToday={state.attendanceToday}
          workScheduleToday={state.workScheduleToday}
          {...props}
        />
        <div className="mt-2">
          <AttendanceClock attendanceToday={state.attendanceToday} />
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div className="ps-0 content-body attendance-progress">
        <Fragment>{renderBody()}</Fragment>
      </div>
    </Fragment>
  )
}

export default ClockInOutProgress
