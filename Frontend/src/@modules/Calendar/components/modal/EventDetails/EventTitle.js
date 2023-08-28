// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { eventApi } from "@modules/Feed/common/api"
// ** redux
import { useDispatch } from "react-redux"
import {
  showAddEventCalendarModal,
  hideDetailEventModal
} from "../../../../../@apps/modules/calendar/common/reducer/calendar"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
// ** Components
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import EventItem from "../../../../../@apps/modules/calendar/components/sidebar/EventItem"

const EventTitle = (props) => {
  const {
    // ** props
    infoEvent,
    // ** methods
    afterRemove
  } = props

  const dispatch = useDispatch()

  const handleClickEdit = () => {
    dispatch(
      hideDetailEventModal({
        modalDetail: "pending"
      })
    )
    dispatch(
      showAddEventCalendarModal({
        idEvent: infoEvent._id
      })
    )
  }

  const handleClickRemove = () => {
    SwAlert.showWarning({
      text: useFormatMessage("modules.feed.create_event.text.remove_event", {
        name: infoEvent.name
      })
    }).then((resSw) => {
      if (resSw.isConfirmed) {
        eventApi
          .removeEvent(infoEvent._id)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("modules.feed.create_event.text.remove_event_success")
            })
            dispatch(hideDetailEventModal())
            if (_.isFunction(afterRemove)) {
              afterRemove()
            }
          })
          .catch((err) => {})
      }
    })
  }

  // ** render
  const renderAction = () => {
    if (infoEvent.is_owner === false) {
      return ""
    }

    return (
      <Space>
        <Button.Ripple
          className="btn-icon custom-secondary"
          size="sm"
          onClick={() => handleClickEdit()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none">
            <path
              d="M9.32788 3.37223L12.6279 6.67223M1.07794 14.9222L5.08009 14.1158C5.29256 14.073 5.48764 13.9684 5.64085 13.8151L14.6001 4.85098C15.0296 4.42119 15.0293 3.72454 14.5994 3.29512L12.7015 1.39938C12.2718 0.970134 11.5755 0.970427 11.1461 1.40003L2.18597 10.3651C2.03306 10.5181 1.92865 10.7128 1.8858 10.9248L1.07794 14.9222Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button.Ripple>
        <Button.Ripple
          className="btn-icon custom-secondary"
          size="sm"
          onClick={() => handleClickRemove()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="19"
            viewBox="0 0 17 19"
            fill="none">
            <path
              d="M1.5 4.40441H15.5M6.75 13.6691V8.11029M10.25 13.6691V8.11029M12 17.375H5C4.0335 17.375 3.25 16.5454 3.25 15.5221V5.33088C3.25 4.81921 3.64175 4.40441 4.125 4.40441H12.875C13.3582 4.40441 13.75 4.81921 13.75 5.33088V15.5221C13.75 16.5454 12.9665 17.375 12 17.375ZM6.75 4.40441H10.25C10.7332 4.40441 11.125 3.98962 11.125 3.47794V2.55147C11.125 2.0398 10.7332 1.625 10.25 1.625H6.75C6.26675 1.625 5.875 2.03979 5.875 2.55147V3.47794C5.875 3.98962 6.26675 4.40441 6.75 4.40441Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button.Ripple>
      </Space>
    )
  }

  return (
    <div className="d-flex align-items-center justify-content-between mb-2 event-title-section">
      <div className="w-75">
        <EventItem item={infoEvent} showFullDateTime={true} />
      </div>
      <div className="w-25 d-flex align-items-center justify-content-end action">
        <Fragment>{renderAction()}</Fragment>
      </div>
    </div>
  )
}

export default EventTitle
