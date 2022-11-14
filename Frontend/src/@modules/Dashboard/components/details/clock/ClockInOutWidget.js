// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { DashboardApi } from "../../../common/api"
// ** Styles
// ** Components
import ClockInOut from "./ClockInOut"
import ClockInOutProgress from "./ClockInOutProgress/CLockInOutProgress"

const ClockInOutWidget = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    isAttendanceDoorIntegrate: false
  })

  const loadAttendanceSetting = () => {
    setState({
      loading: true
    })
    DashboardApi.getAttendanceSetting()
      .then((res) => {
        setState({
          isAttendanceDoorIntegrate: res.data.data.attendance_door_integrate,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          isAttendanceDoorIntegrate: null,
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadAttendanceSetting()
  }, [])

  // ** render
  const renderClockInOut = () => {
    return <ClockInOut {...props} />
  }

  const renderClockInOutProgress = () => {
    return <ClockInOutProgress {...props} />
  }

  const renderComponent = () => {
    if (!state.loading) {
      if (state.isAttendanceDoorIntegrate) {
        return <Fragment>{renderClockInOutProgress()}</Fragment>
      } else if (!state.isAttendanceDoorIntegrate) {
        return <Fragment>{renderClockInOut()}</Fragment>
      }

      return ""
    }

    return ""
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ClockInOutWidget
