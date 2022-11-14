// ** React Imports
import { Fragment, useEffect, useState } from "react"
import moment from "moment"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { setCanRunTimer } from "@modules/Attendances/common/reducer/attendance"
// ** Styles
// ** Components

const AttendanceTimer = (props) => {
  const {
    // ** props
    renderType
    // ** methods
  } = props

  const [intervalState, setIntervalState] = useState(null)
  const [hoursState, setHoursState] = useState(undefined)
  const [minutesState, setMinutesState] = useState(undefined)
  const [secondsState, setSecondsState] = useState(undefined)

  const attendanceState = useSelector((state) => state.attendance)
  const { hours, minutes, seconds, canRunTimer, workSchedule } = attendanceState
  const dispatch = useDispatch()

  const handleIncreaseSeconds = () => {
    const intervalTemp = setInterval(() => {
      setSecondsState((prev) => prev + 1)
    }, 1000)
    setIntervalState(intervalTemp)
  }

  // ** effect
  useEffect(() => {
    if (hours !== 0 || minutes !== 0 || seconds !== 0) {
      setSecondsState(seconds)
      setMinutesState(minutes)
      setHoursState(hours)
    }
  }, [hours, minutes, seconds]) 

  useEffect(() => {
    if (canRunTimer === true) {
      handleIncreaseSeconds()
    }
  }, [canRunTimer])

  useEffect(() => {
    if (intervalState !== null) {
      return () => clearInterval(intervalState)
    }
  }, [intervalState, canRunTimer])

  useEffect(() => {
    if (secondsState === 60) {
      setSecondsState(0)
      setMinutesState((prev) => prev + 1)
    }

    const currentTime = moment()
    if (
      workSchedule.break_time === false &&
      currentTime.isBetween(
        moment(workSchedule.br_time_from, "hh:mm:ss"),
        moment(workSchedule.br_time_to, "hh:mm:ss")
      )
    ) {
      dispatch(setCanRunTimer(false))
    }
  }, [secondsState])

  useEffect(() => {
    if (minutesState === 60) {
      setMinutesState(0)
      setHoursState((prev) => prev + 1)
    }
  }, [minutesState])

  // ** render
  const renderComponent = () => {
    if (renderType === "hms") {
      if (
        hoursState !== undefined &&
        minutesState !== undefined &&
        secondsState !== undefined
      ) {
        return (
          <Fragment>
            {`${hoursState < 10 ? "0" + hoursState : hoursState} : ${
              minutesState < 10 ? "0" + minutesState : minutesState
            } : ${secondsState < 10 ? "0" + secondsState : secondsState}`}
          </Fragment>
        )
      }
    }

    if (
      hoursState !== undefined &&
      minutesState !== undefined &&
      secondsState !== undefined
    ) {
      return (
        <Fragment>{`${hoursState}h ${
          minutesState < 10 ? "0" + minutesState : minutesState
        }m ${
          secondsState < 10 ? "0" + secondsState : secondsState
        }s`}</Fragment>
      )
    } else {
      return <Fragment>0h 00m 00s</Fragment>
    }
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default AttendanceTimer
