// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import moment from "moment"
// ** Styles
// ** Components

const AttendanceWorkingTime = (props) => {
  const {
    // ** props
    renderTimeOnly,
    totalSeconds,
    totalWorkingHours,
    canRunTimer
    // ** methods
  } = props

  const duration = moment.duration(totalSeconds)
  const hoursProp = duration.isValid() ? duration.hours() : undefined
  const minutesProp = duration.isValid() ? duration.minutes() : undefined
  const secondsProp = duration.isValid() ? duration.seconds() : undefined
  const hoursWorkSchedule = Math.floor(totalWorkingHours)
  const minutesWorkSchedule = (totalWorkingHours - hoursWorkSchedule) * 60

  // ** render
  const renderTime = () => {
    if (
      hoursProp !== undefined &&
      minutesProp !== undefined &&
      secondsProp !== undefined
    ) {
      if (
        hoursProp >= hoursWorkSchedule &&
        minutesProp >= minutesWorkSchedule
      ) {
        return (
          <Fragment>{`${
            hoursWorkSchedule < 10 ? "0" + hoursWorkSchedule : hoursWorkSchedule
          }h ${
            minutesWorkSchedule < 10
              ? "0" + minutesWorkSchedule
              : minutesWorkSchedule
          }m 00s`}</Fragment>
        )
      }

      return (
        <Fragment>{`${hoursProp < 10 ? "0" + hoursProp : hoursProp}h ${
          minutesProp < 10 ? "0" + minutesProp : minutesProp
        }m ${secondsProp < 10 ? "0" + secondsProp : secondsProp}s`}</Fragment>
      )
    }

    return <Fragment>00h 00m 00s</Fragment>
  }

  const renderInfinityTime = () => {
    if (
      hoursProp !== undefined &&
      minutesProp !== undefined &&
      secondsProp !== undefined
    ) {
      return (
        <Fragment>{`${hoursProp < 10 ? "0" + hoursProp : hoursProp}h ${
          minutesProp < 10 ? "0" + minutesProp : minutesProp
        }m ${secondsProp < 10 ? "0" + secondsProp : secondsProp}s`}</Fragment>
      )
    }

    return <Fragment>00h 00m 00s</Fragment>
  }

  const renderIcon = () => {
    if (canRunTimer) {
      return <i className="fal fa-pause" />
    }

    return <i className="far fa-play" />
  }

  const renderComponent = () => {
    if (renderTimeOnly) {
      return <Fragment>{renderInfinityTime()}</Fragment>
    }

    return (
      <div className="d-flex align-items-center attendance-working-time">
        <div className="attendance-status d-flex">
          <div className="w-100 d-flex justify-content-center align-items-center">
            <Fragment>{renderIcon()}</Fragment>
          </div>
        </div>
        <div className="attendance-time">
          <h4 className="mb-25">
            <Fragment>{renderInfinityTime()}</Fragment>
          </h4>
          <small>
            {useFormatMessage("modules.attendance.text.total_working_time")}
          </small>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default AttendanceWorkingTime
