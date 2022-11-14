import { useFormatMessage } from "@apps/utility/common"
import { Button, Modal, ModalBody, Spinner } from "reactstrap"

const ApproveModal = ({
  modal_approve,
  toggleAddModalApprove,
  clickApprove,
  loading
}) => {
  return (
    <Modal
      isOpen={modal_approve}
      toggle={() => toggleAddModalApprove()}
      className="modal-sm"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody className="modal-body">
        <h6>
          {useFormatMessage("modules.time_off_requests.modal_approve.title")}
        </h6>
        <p>
          {useFormatMessage("modules.time_off_requests.modal_approve.body")}
        </p>
        <Button.Ripple
          color="primary"
          className="btn-change-file"
          onClick={() => {
            clickApprove()
          }}
          disabled={loading}>
          {loading && <Spinner size="sm" className="me-50" />}
          {useFormatMessage("modules.time_off_requests.button.approve")}
        </Button.Ripple>
        <Button.Ripple
          color="flat-danger"
          onClick={() => {
            toggleAddModalApprove()
          }}>
          {useFormatMessage("button.close")}
        </Button.Ripple>
      </ModalBody>
    </Modal>
  )
}

export default ApproveModal
