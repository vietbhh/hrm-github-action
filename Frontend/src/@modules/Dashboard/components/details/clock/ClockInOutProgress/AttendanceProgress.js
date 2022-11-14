// ** React Imports
import { Fragment, useEffect, useState } from "react"
import moment from "moment"
// ** Styles
import { Progress } from "antd"
// ** Components

const AttendanceProgress = (props) => {
  const {
    // ** props
    progress
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <Progress
        type="circle"
        percent={progress}
        strokeWidth={8}
        width={80}
        strokeColor="#69dca1"
      />
    </Fragment>
  )
}

export default AttendanceProgress
