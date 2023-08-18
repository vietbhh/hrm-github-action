// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { MyAttendanceApi } from "@modules/Attendances/common/api"
import moment from "moment"
import { Fragment, useEffect } from "react"
// ** redux
import { setWorkSchedule } from "@modules/Attendances/common/reducer/attendance"
import { useDispatch, useSelector } from "react-redux"
// ** Styles
// ** Components
import AttendanceButton from "@modules/Attendances/components/details/myAttendance/AttendanceButton"
import AttendanceTimer from "@modules/Attendances/components/details/myAttendance/AttendanceTimer"
import AttendanceLogModal from "@modules/Attendances/components/modals/AttendanceLogModal"

const ClockInOut = (props) => {
  const [state, setState] = useMergedState({
    loadingAttendance: false,
    infoAttendance: {},
    attendanceToDay: {},
    geofencing: false,
    clockOutside: false,
    googlePlace: {},
    radius: 0,
    webapp: false,
    employeeOffice: 0,
    isOutsideAttendance: false,
    isNAAttendance: false,
    attendanceLocation: "",
    isBreakTime: false
  })

  const moduleAttendanceLogData = useSelector(
    (state) => state.app.modules.attendance_logs
  )
  const moduleAttendanceLog = moduleAttendanceLogData.config
  const moduleNameAttendanceLog = moduleAttendanceLog.name
  const metasAttendanceLog = moduleAttendanceLogData.metas
  const optionsAttendanceLog = moduleAttendanceLogData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const dispatch = useDispatch()

  const loadData = () => {
    setState({ loadingAttendance: true })
    MyAttendanceApi.getMyAttendance()
      .then((res) => {
        dispatch(
          setWorkSchedule(res.data.info_attendance_detail_today?.work_schedule)
        )
        setState({
          infoAttendance: res.data.info_attendance,
          attendanceToDay: res.data.info_attendance_detail_today,
          totalTimeAttendance: res.data.total_time_attendance,
          geofencing: res.data.geofencing,
          clockOutside: res.data.clock_outside,
          googlePlace: res.data.google_places,
          radius: res.data.radius,
          webapp: res.data.webapp,
          employeeOffice: res.data.employee_office,
          loadingAttendance: false
        })
        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
      .catch((err) => {
        setState({
          infoAttendance: {},
          attendanceToDay: {},
          totalTimeAttendance: {},
          loadingAttendance: false
        })
        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
  }

  const toggleLogModal = () => {
    setState({
      addLogModal: !state.addLogModal
    })
  }

  const setAttendanceLocation = (data) => {
    setState({
      attendanceLocation: data
    })
  }

  const setIsOutsideAttendance = (status) => {
    setState({
      isOutsideAttendance: status
    })
  }

  const setIsNAAttendance = (status) => {
    setState({
      isNAAttendance: status
    })
  }

  // ** effect
  useEffect(() => {
    loadData()
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

  const renderMyAttendanceButton = () => {
    return (
      <AttendanceButton
        showTimer={false}
        showIcon={false}
        infoAttendance={state.infoAttendance}
        totalTimeAttendance={state.totalTimeAttendance}
        optionsAttendanceLog={optionsAttendanceLog}
        loadingApi={state.loadingAttendance}
        attendanceToDay={state.attendanceToDay}
        geofencing={state.geofencing}
        clockOutside={state.clockOutside}
        googlePlace={state.googlePlace}
        radius={state.radius}
        webapp={state.webapp}
        employeeOffice={state.employeeOffice}
        isBreakTime={state.isBreakTime}
        toggleLogModal={toggleLogModal}
        setAttendanceLocation={setAttendanceLocation}
        setIsOutsideAttendance={setIsOutsideAttendance}
        setIsNAAttendance={setIsNAAttendance}
        loadData={loadData}
      />
    )
  }

  const renderAttendanceTimer = () => {
    return <AttendanceTimer renderType="normal" />
  }

  const renderBreakTime = (workScheduleToday) => {
    if (workScheduleToday?.break_time === true) {
      const breakTimeTo = parseInt(workScheduleToday?.br_time_to)
      return (
        <Fragment>
          {workScheduleToday?.br_time_from} - {workScheduleToday?.br_time_to}{" "}
          {breakTimeTo > 12 ? "PM" : "AM"}
        </Fragment>
      )
    }

    return (
      <Fragment>
        {useFormatMessage("modules.attendance.text.no_break_time")}
      </Fragment>
    )
  }

  const renderBody = () => {
    const workScheduleToday = state.attendanceToDay?.work_schedule
    return (
      <div className="">
        <div className="clock-time mb-1">
          <div className="d-flex align-items-center justify-content-between">
            <p className="font-weight-bold">
              {useFormatMessage("modules.attendance.text.office_break")}
            </p>
            <p className="mt-0 font-weight-bold text-primary">
              <Fragment>{renderBreakTime(workScheduleToday)}</Fragment>
            </p>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-25">
            <p className="mb-0 font-weight-bold">
              {useFormatMessage("modules.attendance.text.target_working_hours")}
            </p>
            <p className="mt-0 mb-0 font-weight-bold">{`${
              workScheduleToday?.total
            }h/${useFormatMessage("modules.attendance.text.days")}`}</p>
          </div>
        </div>
        <div className="clock-button text-center">
          {renderMyAttendanceButton()}
        </div>
      </div>
    )
  }

  const renderAttendanceLogModal = () => {
    return (
      <AttendanceLogModal
        modal={state.addLogModal}
        infoAttendance={state.infoAttendance}
        attendanceToDay={state.attendanceToDay}
        attendanceLocation={state.attendanceLocation}
        isOutsideAttendance={state.isOutsideAttendance}
        isNAAttendance={state.isNAAttendance}
        employeeOffice={state.employeeOffice}
        isBreakTime={state.isBreakTime}
        moduleName={moduleNameAttendanceLog}
        metas={metasAttendanceLog}
        options={optionsAttendanceLog}
        optionsAttendanceLog={optionsAttendanceLog}
        optionsModules={optionsModules}
        handleModal={toggleLogModal}
        loadData={loadData}
      />
    )
  }

  return (
    <Fragment>
      <div className="content-body">
        <div className="time-attendance">
          <div className="time text-center">
            <Fragment>{renderAttendanceTimer()}</Fragment>
          </div>
          <div className="day text-center">
            {moment().format("DD MMMM YYYY")}
          </div>
        </div>
        <div className="ant-spin-nested-loading">
          {state.loadingAttendance ? renderLoading() : renderBody()}
        </div>
      </div>
      {state.addLogModal && renderAttendanceLogModal()}
    </Fragment>
  )
}

export default ClockInOut
