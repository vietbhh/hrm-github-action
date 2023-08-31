// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import {
  hideDetailEventModal,
  showDetailEventModal
} from "../../../../../@apps/modules/calendar/common/reducer/calendar"
import { calendarNodeApi } from "../../../../../@apps/modules/calendar/common/api"
// ** Styles
import { Modal, ModalBody, ModalHeader } from "reactstrap"
// ** Components
import EventTitle from "./EventTitle"
import MembersInvited from "./MembersInvited"
import EventInfo from "./EventInfo"
import Tracking from "./Tracking"
import classNames from "classnames"
import JoinEventAction from "./JoinEventAction"
import SwAlert from "@apps/utility/SwAlert"
import TrackingDetailsModal from "../TrackingDetails/TrackingDetailsModal"

const EventDetailsModal = (props) => {
  const {
    // ** props
    // ** methods
    afterRemove,
    afterUpdateStatus
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    infoEvent: {}
    
  })

  const calendarState = useSelector((state) => state.calendar)
  const { modalDetail, modal, idEvent } = calendarState
  const modalDetailStatus = modalDetail !== "pending" ? modalDetail : false
  const currentEmployee = useSelector((state) => state.auth.userData)

  const dispatch = useDispatch()

  const toggleModal = () => {
    dispatch(hideDetailEventModal())
  }

  const loadData = () => {
    setState({
      loading: true
    })

    calendarNodeApi
      .getDetailEvent(idEvent)
      .then((res) => {
        setState({
          infoEvent: res.data.data,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          infoEvent: {},
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    if (modalDetailStatus === true && idEvent !== null) {
      loadData()
    }
  }, [modalDetail])

  useEffect(() => {
    if (modalDetail === "pending" && modal === false) {
      dispatch(
        showDetailEventModal({
          idEvent: state.infoEvent._id,
          viewOnly: false
        })
      )
    }
  }, [modalDetail, modal])

  // ** render
  const renderComponent = () => {
    if (state.loading) {
      return ""
    }

    if (state.infoEvent?.name === undefined) {
      SwAlert.showError({
        title: useFormatMessage(
          "modules.feed.create_post.text.detail_event_error"
        )
      })
    } else {
      return (
        <Modal
          isOpen={modalDetailStatus}
          toggle={() => toggleModal()}
          className="modal-dialog-centered feed modal-create-post modal-create-event modal-event-detail"
          modalTransition={{ timeout: 100 }}
          backdropTransition={{ timeout: 100 }}>
          <ModalHeader>
            <span className="text-title">
              {useFormatMessage("modules.calendar.modals.title.event_details")}
            </span>
            <div className="div-btn-close" onClick={() => toggleModal()}>
              <i className="fa-regular fa-xmark"></i>
            </div>
          </ModalHeader>
          <ModalBody>
            <div
              className={classNames("event-detail-body", {
                "event-detail-border": state.infoEvent.is_owner
              })}>
              <JoinEventAction
                infoEvent={state.infoEvent}
                currentEmployee={currentEmployee}
                afterUpdateStatus={afterUpdateStatus}
              />
              <EventTitle
                infoEvent={state.infoEvent}
                afterRemove={afterRemove}
              />
              <MembersInvited infoEvent={state.infoEvent} />
              <EventInfo infoEvent={state.infoEvent} />
            </div>
            <div>
              <Tracking infoEvent={state.infoEvent} />
            </div>
          </ModalBody>
        </Modal>
      )
    }
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default EventDetailsModal
