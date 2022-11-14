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
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="30"
          viewBox="0 0 15 22"
          fill="none">
          <path
            d="M8.875 17.5175V4.4825C8.875 3.245 8.4 2.75 7.2 2.75H4.175C2.975 2.75 2.5 3.245 2.5 4.4825V17.5175C2.5 18.755 2.975 19.25 4.175 19.25H7.2C8.4 19.25 8.875 18.755 8.875 17.5175Z"
            fill="white"
          />
          <path
            d="M17.5 17.5175V4.4825C17.5 3.245 17.025 2.75 15.825 2.75H12.8C11.6083 2.75 11.125 3.245 11.125 4.4825V17.5175C11.125 18.755 11.6 19.25 12.8 19.25H15.825C17.025 19.25 17.5 18.755 17.5 17.5175Z"
            fill="white"
          />
        </svg>
      )
    }

    return (
      <div>
        <i className="far fa-play" />
      </div>
    )
  }

  const renderComponent = () => {
    if (renderTimeOnly) {
      return <Fragment>{renderInfinityTime()}</Fragment>
    }

    return (
      <div className="d-flex align-items-center attendance-working-time">
        <div className="attendance-time me-2">
          <h4 className="mb-25">
            <Fragment>{renderInfinityTime()}</Fragment>
          </h4>
          <small>
            {useFormatMessage("modules.attendance.text.total_working_time")}
          </small>
        </div>
        <div>
          <div className="attendance-status d-flex align-items-center">
            <Fragment>{renderIcon()}</Fragment>
          </div>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default AttendanceWorkingTime
