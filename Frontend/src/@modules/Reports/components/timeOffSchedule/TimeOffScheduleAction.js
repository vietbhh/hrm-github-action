// ** React Imports
import { Fragment, useState } from "react"
import { TimeOffScheduleApi } from "../../common/TimeOffScheduleApi"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button, Spinner } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"

const TimeOffScheduleAction = (props) => {
  const {
    // ** props
    filter
    // ** methods
  } = props

  const [loading, setLoading] = useState(false)

  const handleExport = () => {
    setLoading(true)
    TimeOffScheduleApi.exportAttendance(filter)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `time_off_schedule.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        setLoading(false)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.error")
        })
        setLoading(false)
      })
  }

  // ** render
  return (
    <Button.Ripple
      size="sm"
      color="primary"
      onClick={() => handleExport()}
      className="d-flex"
      disabled={loading}>
      {!loading ? (
        <i className="far fa-download me-25" />
      ) : (
        <Spinner size="sm" className="me-25" />
      )}

      {useFormatMessage("modules.reports.time_off_schedule.buttons.export")}
    </Button.Ripple>
  )
}

export default TimeOffScheduleAction
