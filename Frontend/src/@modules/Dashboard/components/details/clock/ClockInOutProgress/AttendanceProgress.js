// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Progress } from "antd"
// ** Components

const AttendanceProgress = (props) => {
  const {
    // ** props
    progress,
    progressWidth
    // ** methods
  } = props
  // ** render
  return (
    <Fragment>
      <Progress
        type="circle"
        percent={progress}
        strokeWidth={20}
        strokeColor="#4986FF"
        size={progressWidth ?? "default"}
        trailColor={"#DBE7FF"}
      />
    </Fragment>
  )
}

export default AttendanceProgress
