// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import AttendanceButton from "./AttendanceButton"
import BreakTimeAttendance from "./BreakTimeAttendance"
import TimeClockToday from "./TimeClockToday"
import AttendanceTimer from "@modules/Dashboard/components/details/clock/ClockInOutProgress/AttendanceTimer"
import { Button } from "reactstrap"
import { Clock } from "react-feather"

const AttendanceHeader = (props) => {
  const {
    // ** props
    infoAttendance,
    attendanceToDay,
    totalTimeAttendance,
    loadingApi,
    geofencing,
    clockOutside,
    googlePlace,
    radius,
    webapp,
    employeeOffice,
    isBreakTime,
    optionsAttendanceLog,
    // ** methods
    toggleLogModal,
    setAttendanceLocation,
    setIsOutsideAttendance,
    setIsNAAttendance,
    setIsBreakTime,
    loadData
  } = props

  // ** render
  const renderMyAttendanceButton = () => {
    if (webapp) {
      return (
        <AttendanceButton
          showTimer={true}
          showIcon={true}
          infoAttendance={infoAttendance}
          totalTimeAttendance={totalTimeAttendance}
          loadingApi={loadingApi}
          attendanceToDay={attendanceToDay}
          geofencing={geofencing}
          clockOutside={clockOutside}
          googlePlace={googlePlace}
          radius={radius}
          webapp={webapp}
          employeeOffice={employeeOffice}
          isBreakTime={isBreakTime}
          optionsAttendanceLog={optionsAttendanceLog}
          toggleLogModal={toggleLogModal}
          setAttendanceLocation={setAttendanceLocation}
          setIsOutsideAttendance={setIsOutsideAttendance}
          setIsNAAttendance={setIsNAAttendance}
          loadData={loadData}
        />
      )
    }

    return (
      <Button.Ripple color="primary">
        <Clock size={19} />{" "}
        {useFormatMessage("modules.attendance.buttons.clock_in")}{" "}
        <AttendanceTimer
          renderTimeOnly={true}
          attendanceToday={attendanceToDay}
          workScheduleToday={attendanceToDay?.work_schedule}
        />
      </Button.Ripple>
    )
  }

  const renderClockToday = () => {
    return (
      <TimeClockToday loading={loadingApi} attendanceToDay={attendanceToDay} />
    )
  }

  const renderBreakTime = () => {
    return (
      <BreakTimeAttendance
        loadingApi={loadingApi}
        attendanceToDay={attendanceToDay}
        isBreakTime={isBreakTime}
        setIsBreakTime={setIsBreakTime}
      />
    )
  }

  return (
    <Fragment>
      <div className="left-content">
        <h4 className="mb-0">
          <span className="title-icon">
            <i className="fal fa-clock" />
          </span>
          {useFormatMessage("modules.attendance.title.my")}
        </h4>
      </div>
      <div className="right-content">
        <Fragment>{renderClockToday()}</Fragment>
        <Fragment>{renderBreakTime()}</Fragment>
        <div className="clock-info">
          <Fragment>{renderMyAttendanceButton()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default AttendanceHeader
