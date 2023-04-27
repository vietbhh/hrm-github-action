// ** React Imports
import { Fragment, useEffect, useState } from "react"
import moment from "moment"
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
        width={progressWidth === undefined ? 80 : progressWidth}
        strokeColor="#69dca1"
      />
    </Fragment>
  )
}

export default AttendanceProgress
