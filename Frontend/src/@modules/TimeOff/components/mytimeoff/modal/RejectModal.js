import { useFormatMessage } from "@apps/utility/common"
import { Button, Modal, ModalBody, Spinner } from "reactstrap"

const RejectModal = ({
  modal_reject,
  toggleAddModalReject,
  clickReject,
  loading
}) => {
  return (
    <Modal
      isOpen={modal_reject}
      toggle={() => toggleAddModalReject()}
      className="modal-sm"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody className="modal-body">
        <h6>
          {useFormatMessage("modules.time_off_requests.modal_reject.title")}
        </h6>
        <p>{useFormatMessage("modules.time_off_requests.modal_reject.body")}</p>
        <Button.Ripple
          color="danger"
          className="btn-change-file"
          onClick={() => {
            clickReject()
          }}
          disabled={loading}>
          {loading && (
            <Spinner
              size="sm"
              className="mr-50"
              style={{ marginRight: "4px" }}
            />
          )}
          {useFormatMessage("modules.time_off_requests.button.reject")}
        </Button.Ripple>
        <Button.Ripple
          color="flat-danger"
          onClick={() => {
            toggleAddModalReject()
          }}>
          {useFormatMessage("button.close")}
        </Button.Ripple>
      </ModalBody>
    </Modal>
  )
}

export default RejectModal
