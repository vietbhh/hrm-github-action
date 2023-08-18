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
        strokeWidth={8}
        size={progressWidth ?? "default"}
        strokeColor="#69dca1"
      />
    </Fragment>
  )
}

export default AttendanceProgress
