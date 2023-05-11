import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { Fragment } from "react"
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap"

const ModalCreateEvent = (props) => {
  const { modal, toggleModal } = props
  const [state, setState] = useMergedState({})

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="feed modal-create-post modal-create-event"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        /* backdrop={"static"} */
      >
        <ModalHeader /* toggle={() => toggleModal()} */>
          <span className="text-title">
            {useFormatMessage("modules.feed.create_event.title")}
          </span>
          <div className="div-btn-close" onClick={() => toggleModal()}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <Button.Ripple
              color="primary"
              type="button"
              className="btn-post"
              onClick={() => submitPost()}
              disabled={state.loadingSubmit}>
              {state.loadingSubmit && <Spinner size={"sm"} className="me-50" />}
              {useFormatMessage("modules.feed.create_event.title")}
            </Button.Ripple>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default ModalCreateEvent
