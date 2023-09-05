// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Modal, ModalBody, ModalHeader } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import PerfectScrollbar from "react-perfect-scrollbar"
import TrackingOverView from "./TrackingOverview"

const TrackingDetailsModal = (props) => {
  const {
    // ** props
    modal,
    infoEvent,
    listEmployee,
    // ** methods
    handleModal
  } = props

  const infoEventEmployee = infoEvent.employee

  // ** render
  const renderList = () => {
    return (
      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <div className="list-employee">
          {listEmployee.map((item, index) => {
            return (
              <div
                className="d-flex align-items-center mb-75 employee-item"
                key={`employee-tracking-item-${index}`}>
                <div className="me-50">
                  <Avatar src={item.avatar} imgWidth="40" imgHeight="40" />
                </div>
                <div>
                  <p className="mb-0 employee-name">{item.label}</p>
                  <small className={`status-text text-${item.status}`}>
                    {useFormatMessage(`modules.feed.post.event.${item.status}`)}
                  </small>
                </div>
              </div>
            )
          })}
        </div>
      </PerfectScrollbar>
    )
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="modal-dialog-centered feed modal-create-post modal-create-event modal-custom-repeat modal-tracking-details"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <span className="text-title">
          {`${useFormatMessage("modules.feed.create_event.text.tracking")} (${
            listEmployee.length
          }/${infoEventEmployee.length})`}
        </span>
        <div className="div-btn-close" onClick={() => handleModal()}>
          <i className="fa-regular fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalBody>
        <TrackingOverView listEmployee={listEmployee} />
        <hr />
        <Fragment>{renderList()}</Fragment>
      </ModalBody>
    </Modal>
  )
}

export default TrackingDetailsModal
