// ** React Imports
import { Fragment } from "react"
import moment from "moment"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components

const AttendanceClock = (props) => {
  const {
    // ** props
    attendanceToday
    // ** methods
  } = props

  const handleShowTime = (time) => {
    if (
      time === "" ||
      time === "0000-00-00 00:00:00" ||
      time === undefined ||
      time === null
    ) {
      return <Fragment>--:--:--</Fragment>
    }

    return moment(time).format("hh:mm:ss A")
  }

  // ** render
  return (
    <Fragment>
      <div className="attendance-clock">
        <div className="clock-time first_in_row">
          <div className="d-flex align-items-center detail-clock-time">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 8V13"
                stroke="#403F3A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25"
                stroke="#403F3A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 2H15"
                stroke="#403F3A"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.8999 18.5V17.34C14.8999 15.91 15.9199 15.32 17.1599 16.04L18.1599 16.62L19.1599 17.2C20.3999 17.92 20.3999 19.09 19.1599 19.81L18.1599 20.39L17.1599 20.97C15.9199 21.69 14.8999 21.1 14.8999 19.67V18.5Z"
                stroke="#403F3A"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="mb-0 clock-time-type">
              {useFormatMessage("modules.attendance.text.first_in")}:
            </p>
          </div>
          <div className="clock-time-item">
            {handleShowTime(attendanceToday.clock_in)}
          </div>
        </div>
        <div className="clock-time last_check_row">
          <div className="d-flex align-items-center detail-clock-time">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25"
                stroke="#8C8A82"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8V13"
                stroke="#8C8A82"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 2H15"
                stroke="#8C8A82"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 17V21"
                stroke="#8C8A82"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17V21"
                stroke="#8C8A82"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="mb-0 clock-time-type">
              {useFormatMessage("modules.attendance.text.last_check")}:
            </p>
          </div>
          <div className="clock-time-item">
            {handleShowTime(attendanceToday.clock_out)}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AttendanceClock
