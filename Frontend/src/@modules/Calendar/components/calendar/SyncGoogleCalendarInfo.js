// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Tag } from "antd"
// ** Components

const SyncGoogleCalendarInfo = (props) => {
  const {
    // ** props
    syncGoogleInfo
    // ** methods
  } = props

  // ** render
  const renderTag = () => {
    if (
      syncGoogleInfo?.sync_calendar_status &&
      syncGoogleInfo?.synced
    ) {
      return (
        <div className="mt-2 d-flex justify-content-center">
          <Tag color="red">
            <i className="fab fa-google me-50" />
            {useFormatMessage("modules.calendar.text.event_sync")}
          </Tag>
        </div>
      )
    }

    return ""
  }

  return <Fragment>{renderTag()}</Fragment>
}

export default SyncGoogleCalendarInfo