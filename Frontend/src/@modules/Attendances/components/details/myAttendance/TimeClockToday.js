// ** React Imports
import moment from "moment"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components

const TimeClockToday = (props) => {
  const {
    // ** props
    loading,
    attendanceToDay
    // ** methods
  } = props

  // ** render
  const renderFirstIn = () => {
    if (loading === false && attendanceToDay.clock_in !== undefined) {
      const firstInTime = moment(attendanceToDay.clock_in)
      if (firstInTime.isValid()) {
        return (
          <span>
            {firstInTime.hours()}:
            {firstInTime.minutes() < 10
              ? "0" + firstInTime.minutes()
              : firstInTime.minutes()}
          </span>
        )
      }
    }
    return <span>--:--</span>
  }

  const renderLastOut = () => {
    if (loading === false && attendanceToDay.clock_out !== undefined) {
      const lastOutTime = moment(attendanceToDay.clock_out)
      if (lastOutTime.isValid()) {
        return (
          <span>
            {lastOutTime.hours()}:
            {lastOutTime.minutes() < 10
              ? "0" + lastOutTime.minutes()
              : lastOutTime.minutes()}
          </span>
        )
      }
    }
    return <span>--:--</span>
  }

  return (
    <div className="int-out-info">
      <div>
        {useFormatMessage("modules.attendance.text.first_in")} {renderFirstIn()}
      </div>
      <div>
        {useFormatMessage("modules.attendance.text.last_out")} {renderLastOut()}
      </div>
    </div>
  )
}

export default TimeClockToday
