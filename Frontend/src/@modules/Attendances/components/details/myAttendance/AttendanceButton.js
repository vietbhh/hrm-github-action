// ** React Imports
import { useFormatMessage, getOptionValue } from "@apps/utility/common"
import { Fragment, useEffect, useState } from "react"
import {
  getDistanceFromCoordinate,
  getCurrentCoordinate
} from "@modules/Attendances/common/common"
import { MyAttendanceApi } from "@modules/Attendances/common/api"
import notification from "@apps/utility/notification"
// ** redux
import { useDispatch } from "react-redux"
import {
  setCanRunTimer,
  setHours,
  setMinutes,
  setSeconds
} from "../../../common/reducer/attendance"
// ** Styles
import { Button } from "reactstrap"
import { Clock } from "react-feather"
// ** Components
import SwAlert from "@apps/utility/SwAlert"
import AttendanceTimer from "./AttendanceTimer"

const AttendanceButton = (props) => {
  const {
    // ** props
    showTimer,
    showIcon,
    infoAttendance,
    totalTimeAttendance,
    loadingApi,
    attendanceToDay,
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
    loadData
  } = props

  const [clockLat, setClockLat] = useState("")
  const [clockLng, setClockLng] = useState("")
  const [isOutside, setIsOutside] = useState(false)
  const [isNALocation, setIsNALocation] = useState(false)
  const [state, setState] = useState({
    disableButton: false,
    clockType: ""
  })

  const dispatch = useDispatch()

  const _isNALocation = (currentLat, currentLng) => {
    if (
      currentLat === "" ||
      currentLng === "" ||
      currentLat === undefined ||
      currentLng === undefined
    ) {
      return true
    }

    return false
  }

  const showOutsideWarning = () => {
    return SwAlert.showWarning({
      title: useFormatMessage(
        "modules.attendance_logs.text.warning.outside.title"
      ),
      text: useFormatMessage(
        "modules.attendance_logs.text.warning.outside.message"
      ),
      showCancelButton: false,
      confirmButtonText: useFormatMessage("modules.attendance_logs.buttons.ok")
    })
  }

  const showLocationNotFoundWarning = () => {
    return SwAlert.showWarning({
      title: useFormatMessage(
        "modules.attendance_logs.text.warning.location_not_found.title"
      ),
      text: useFormatMessage(
        "modules.attendance_logs.text.warning.location_not_found.message"
      ),
      showCancelButton: false,
      confirmButtonText: useFormatMessage("modules.attendance_logs.buttons.ok")
    })
  }

  const handleClockInside = () => {
    const values = {
      attendance_id: infoAttendance.id,
      type: getOptionValue(optionsAttendanceLog, "type", "attendance"),
      clock_type: state.clockType,
      attendance_detail:
        attendanceToDay.id === undefined ? 0 : attendanceToDay.id,
      work_schedule_today: attendanceToDay.work_schedule,
      clock_location: clockLat + "," + clockLng,
      clock_location_type: isOutside
        ? getOptionValue(optionsAttendanceLog, "clock_location_type", "outside")
        : getOptionValue(optionsAttendanceLog, "clock_location_type", "inside"),
      note: useFormatMessage(
        "modules.attendance_details.text.default_note_clock_in"
      ),
      is_break_time: isBreakTime,
      office_id: employeeOffice
    }
    MyAttendanceApi.addNewAttendanceLog(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        loadData()
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const handleClickAttendanceButton = () => {
    if (!state.disableButton) {
      if (webapp === false) {
        return SwAlert.showWarning({
          title: useFormatMessage(
            "modules.attendance_logs.text.warning.web_app.title"
          ),
          text: useFormatMessage(
            "modules.attendance_logs.text.warning.web_app.message"
          ),
          showCancelButton: false,
          confirmButtonText: useFormatMessage(
            "modules.attendance_logs.buttons.ok"
          )
        })
      }

      if (!geofencing) {
        setIsNAAttendance(true)
        setIsNALocation(true)
        toggleLogModal()
      } else if (geofencing && !("geolocation" in navigator)) {
        showLocationNotFoundWarning()
      } else {
        getCurrentCoordinate().then((res) => {
          const { currentLat, currentLng } = res
          setClockLat(currentLat)
          setClockLng(currentLng)
          setAttendanceLocation(`${currentLat}, ${currentLng}`)
          const settingLat = googlePlace !== null ? googlePlace.LatLng.lat : ""
          const settingLng = googlePlace !== null ? googlePlace.LatLng.lng : ""
          const distance =
            getDistanceFromCoordinate(
              currentLat,
              currentLng,
              settingLat,
              settingLng
            ) * 1000
          if (
            clockOutside === false &&
            (_isNALocation(currentLat, currentLng) || distance > radius)
          ) {
            showOutsideWarning()
          } else if (
            distance <= radius &&
            !_isNALocation(currentLat, currentLng)
          ) {
            setIsOutsideAttendance(false)
            setIsOutside(false)
            if (
              parseInt(state.clockType) ===
              getOptionValue(optionsAttendanceLog, "clock_type", "clockin")
            ) {
              handleClockInside()
            } else {
              toggleLogModal()
            }
          } else if (clockOutside === true) {
            if (distance > radius && !_isNALocation(currentLat, currentLng)) {
              setIsOutsideAttendance(true)
              setIsOutside(true)
            } else if (_isNALocation(currentLat, currentLng)) {
              setIsNAAttendance(true)
              setIsNALocation(true)
            }
            toggleLogModal()
          }
        })
      }
    }
  }

  // ** effect
  useEffect(() => {
    if (
      loadingApi === false &&
      infoAttendance !== undefined &&
      infoAttendance !== null &&
      Object.keys(infoAttendance).length > 0
    ) {
      if (
        attendanceToDay !== undefined &&
        attendanceToDay !== null &&
        Object.keys(attendanceToDay).length > 1
      ) {
        dispatch(setHours(totalTimeAttendance.hours))
        dispatch(setMinutes(totalTimeAttendance.minutes))
        dispatch(setSeconds(totalTimeAttendance.seconds))
        if (
          attendanceToDay?.is_edit_paid_time === true ||
          attendanceToDay?.is_edit_overtime === true
        ) {
          dispatch(setCanRunTimer(false))
          setState({
            disableButton: true,
            clockType: getOptionValue(
              optionsAttendanceLog,
              "clock_type",
              "clockin"
            )
          })
        } else {
          if (
            attendanceToDay.is_clock_in_attendance === true ||
            parseInt(attendanceToDay.is_clock_in_attendance) === 1
          ) {
            dispatch(setCanRunTimer(true))
            setState({
              clockType: getOptionValue(
                optionsAttendanceLog,
                "clock_type",
                "clockout"
              )
            })
          } else {
            dispatch(setCanRunTimer(false))
            setState({
              clockType: getOptionValue(
                optionsAttendanceLog,
                "clock_type",
                "clockin"
              )
            })
          }
        }
      } else {
        dispatch(setCanRunTimer(false))
        setState({
          disableButton: false,
          clockType: getOptionValue(
            optionsAttendanceLog,
            "clock_type",
            "clockin"
          )
        })
      }
    }
  }, [loadingApi])

  // ** render
  const renderTimer = () => {
    if (showTimer) {
      return <AttendanceTimer renderType="hms" />
    }

    return ""
  }

  const renderComponent = () => {
    return (
      <Button.Ripple
        color={
          parseInt(state.clockType) ===
            getOptionValue(optionsAttendanceLog, "clock_type", "clockin") ||
          state.clockType === ""
            ? "primary"
            : "danger"
        }
        onClick={() => handleClickAttendanceButton()}
        disabled={state.disableButton}
        block>
        {showIcon && <Clock size={19} />}{" "}
        {parseInt(state.clockType) ===
          getOptionValue(optionsAttendanceLog, "clock_type", "clockin") ||
        state.clockType === ""
          ? useFormatMessage("modules.attendance.buttons.clock_in")
          : useFormatMessage("modules.attendance.buttons.clock_out")}{" "}
        {renderTimer()}
      </Button.Ripple>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default AttendanceButton
