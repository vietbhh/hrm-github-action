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
    if (time === "" || time === "0000-00-00 00:00:00" || time === undefined || time === null) {
      return <Fragment>--:--:--</Fragment>
    }

    return moment(time).format("hh:mm:ss A")
  }

  // ** render
  return (
    <Fragment>
      <div className="w-100 attendance-clock">
        <div className="w-100 mb-1 p-0 clock-time ">
          <div className="d-flex align-items-center h-100 justify-content-start">
            <div className="d-flex align-items-center ms-2 w-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <g opacity="0.7">
                  <path
                    d="M12 13.75C11.59 13.75 11.25 13.41 11.25 13V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V13C12.75 13.41 12.41 13.75 12 13.75Z"
                    fill="#3BC963"
                  />
                  <path
                    d="M12 22.75C6.76 22.75 2.5 18.49 2.5 13.25C2.5 8.01 6.76 3.75 12 3.75C17.24 3.75 21.5 8.01 21.5 13.25C21.5 13.66 21.16 14 20.75 14C20.34 14 20 13.66 20 13.25C20 8.84 16.41 5.25 12 5.25C7.59 5.25 4 8.84 4 13.25C4 17.66 7.59 21.25 12 21.25C12.41 21.25 12.75 21.59 12.75 22C12.75 22.41 12.41 22.75 12 22.75Z"
                    fill="#3BC963"
                  />
                  <path
                    d="M15 2.75H9C8.59 2.75 8.25 2.41 8.25 2C8.25 1.59 8.59 1.25 9 1.25H15C15.41 1.25 15.75 1.59 15.75 2C15.75 2.41 15.41 2.75 15 2.75Z"
                    fill="#3BC963"
                  />
                  <path
                    d="M16.15 22.02C15.8 22.02 15.48 21.94 15.19 21.77C14.53 21.39 14.15 20.62 14.15 19.66V17.35C14.15 16.39 14.53 15.62 15.19 15.24C15.85 14.86 16.7 14.92 17.53 15.39L19.53 16.55C20.36 17.03 20.84 17.74 20.84 18.5C20.84 19.26 20.36 19.97 19.53 20.45L17.53 21.61C17.07 21.88 16.6 22.02 16.15 22.02ZM16.16 16.48C16.08 16.48 16 16.5 15.94 16.53C15.76 16.63 15.65 16.94 15.65 17.34V19.65C15.65 20.05 15.76 20.36 15.94 20.46C16.12 20.56 16.44 20.51 16.78 20.31L18.78 19.15C19.13 18.95 19.34 18.7 19.34 18.5C19.34 18.3 19.13 18.05 18.78 17.85L16.78 16.69C16.55 16.55 16.33 16.48 16.16 16.48Z"
                    fill="#3BC963"
                  />
                </g>
              </svg>
              <p className="mb-0 ms-1 clock-time-type">{useFormatMessage("modules.attendance.text.first_in")}:</p>
            </div>
            <div className="clock-time-item">{handleShowTime(attendanceToday.clock_in)}</div>
          </div>
        </div>
        <div className="w-100 mb-1 p-0 clock-time ">
          <div className="d-flex align-items-center h-100 justify-content-start">
            <div className="d-flex align-items-center ms-2 w-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M12 22.75C6.76 22.75 2.5 18.49 2.5 13.25C2.5 8.01 6.76 3.75 12 3.75C17.24 3.75 21.5 8.01 21.5 13.25C21.5 13.66 21.16 14 20.75 14C20.34 14 20 13.66 20 13.25C20 8.84 16.41 5.25 12 5.25C7.59 5.25 4 8.84 4 13.25C4 17.66 7.59 21.25 12 21.25C12.41 21.25 12.75 21.59 12.75 22C12.75 22.41 12.41 22.75 12 22.75Z"
                  fill="#FF754C"
                />
                <path
                  d="M12 13.75C11.59 13.75 11.25 13.41 11.25 13V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V13C12.75 13.41 12.41 13.75 12 13.75Z"
                  fill="#FF754C"
                />
                <path
                  d="M15 2.75H9C8.59 2.75 8.25 2.41 8.25 2C8.25 1.59 8.59 1.25 9 1.25H15C15.41 1.25 15.75 1.59 15.75 2C15.75 2.41 15.41 2.75 15 2.75Z"
                  fill="#FF754C"
                />
                <path
                  d="M19 21.75C18.59 21.75 18.25 21.41 18.25 21V17C18.25 16.59 18.59 16.25 19 16.25C19.41 16.25 19.75 16.59 19.75 17V21C19.75 21.41 19.41 21.75 19 21.75Z"
                  fill="#FF754C"
                />
                <path
                  d="M16 21.75C15.59 21.75 15.25 21.41 15.25 21V17C15.25 16.59 15.59 16.25 16 16.25C16.41 16.25 16.75 16.59 16.75 17V21C16.75 21.41 16.41 21.75 16 21.75Z"
                  fill="#FF754C"
                />
              </svg>
              <p className="mb-0 ms-1 clock-time-type">{useFormatMessage("modules.attendance.text.last_check")}:</p>
            </div>
            <div className="clock-time-item">{handleShowTime(attendanceToday.clock_out)}</div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AttendanceClock
