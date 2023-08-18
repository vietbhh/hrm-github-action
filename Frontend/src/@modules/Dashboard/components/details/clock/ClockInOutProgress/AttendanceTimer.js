// ** React Imports
import { Fragment, useEffect, useState } from "react"
import moment from "moment"
// ** Styles
// ** Components
import AttendanceProgress from "./AttendanceProgress"
import AttendanceWorkingTime from "./AttendanceWorkingTime"

const AttendanceTimer = (props) => {
  const {
    // ** props
    renderTimeOnly,
    attendanceToday,
    workScheduleToday
    // ** methods
  } = props

  const currentDate = moment().format("YYYY-MM-DD")
  const breakTimeFrom = moment(
    workScheduleToday.br_time_from + ":00 ",
    "hh:mm:ss"
  )
  const breakDateTimeFrom = moment(
    currentDate + " " + workScheduleToday.br_time_from,
    "YYYY-MM-DD hh:mm:ss"
  )
  const breakTimeTo = moment(workScheduleToday.br_time_to + ":00 ", "hh:mm:ss")
  const breakDateTimeTo = moment(
    currentDate + " " + workScheduleToday.br_time_to,
    "YYYY-MM-DD hh:mm:ss"
  )
  const durationBreakTime = moment.duration(breakTimeTo.diff(breakTimeFrom))
  const totalWorkingHours = workScheduleToday.total

  const [canRunTimer, setCanRunTimer] = useState(false)
  const [intervalState, setintervalState] = useState(null)
  const [secondsCurrent, setSecondsCurrent] = useState(undefined)
  const [progress, setProgress] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)

  let firstClockIn = moment(attendanceToday?.clock_in, "YYYY-MM-DD hh:mm:ss")
  if (
    firstClockIn.isBetween(
      moment(workScheduleToday.br_time_from, "hh:mm:ss"),
      moment(workScheduleToday.br_time_to, "hh:mm:ss")
    )
  ) {
    firstClockIn = breakDateTimeTo
  }

  const handleIncreaseProgress = () => {
    const intervalTemp = setInterval(() => {
      calculateTime()
    }, 1000)
    setintervalState(intervalTemp)
  }

  const calculateTime = () => {
    let currentTime = moment()
    if (currentTime.isBetween(breakDateTimeFrom, breakDateTimeTo)) {
      currentTime = firstClockIn.isSame(breakDateTimeTo)
        ? breakDateTimeTo
        : breakDateTimeFrom
    }
    const duration = moment.duration(currentTime.diff(firstClockIn))
    let hoursTemp = duration.asHours()
    let totalSeconds = duration.asMilliseconds()
    if (
      workScheduleToday.break_time &&
      firstClockIn.isBefore(breakDateTimeFrom) &&
      currentTime.isAfter(breakDateTimeTo)
    ) {
      totalSeconds =
        duration.asMilliseconds() - durationBreakTime.asMilliseconds()
      hoursTemp =
        duration.asHours() -
        (durationBreakTime.hours() + durationBreakTime.minutes() / 60)
    }
    const totalWorkingHoursTemp = parseFloat(totalWorkingHours)
    const totalProgress = Math.floor((hoursTemp / totalWorkingHoursTemp) * 100)

    setProgress(totalProgress)
    setTotalSeconds(totalSeconds)
  }

  // ** effect
  useEffect(() => {
    if (
      workScheduleToday?.working_day === true &&
      Object.keys(attendanceToday).length > 0
    ) {
      setCanRunTimer(true)
    }
  }, [workScheduleToday, attendanceToday])

  // stop timer when progress is 100 percent
  /*useEffect(() => {
    if (progress >= 100) {
      setCanRunTimer(false)
    }
  }, [intervalState, progress])*/

  useEffect(() => {
    const currentTime = moment()
    if (
      workScheduleToday.break_time === true &&
      currentTime.isBetween(breakTimeFrom, breakTimeTo)
    ) {
      setCanRunTimer(false)
    } else {
      setCanRunTimer(true)
    }
  }, [secondsCurrent])

  useEffect(() => {
    if (canRunTimer === true) {
      handleIncreaseProgress()
    }
  }, [canRunTimer])

  useEffect(() => {
    if (intervalState !== null) {
      return () => clearInterval(intervalState)
    }
  }, [intervalState, canRunTimer])

  useEffect(() => {
    calculateTime()
  }, [])

  useEffect(() => {
    const intervalTemp = setInterval(() => {
      setSecondsCurrent(moment())
    }, 1000)

    return () => clearInterval(intervalTemp)
  }, [])

  // ** render
  const renderAttendanceWorkingTime = () => {
    return (
      <AttendanceWorkingTime
        renderTimeOnly={renderTimeOnly}
        totalSeconds={totalSeconds}
        totalWorkingHours={totalWorkingHours}
        canRunTimer={canRunTimer}
      />
    )
  }

  const renderComponent = () => {
    if (renderTimeOnly) {
      return <Fragment>{renderAttendanceWorkingTime()}</Fragment>
    }

    return (
      <Fragment>
        <div className="ps-0 d-flex justify-content-between align-items-center">
          <div className="ps-0 ms-0">{renderAttendanceWorkingTime()}</div>
          <div className="me-0">
            <AttendanceProgress
              progress={progress}
              progressWidth={props?.progressWidth}
            />
          </div>
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default AttendanceTimer
