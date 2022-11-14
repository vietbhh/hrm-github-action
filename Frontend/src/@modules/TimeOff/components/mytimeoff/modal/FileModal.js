import { useFormatMessage } from "@apps/utility/common"
import { Button, Input, Modal, ModalBody } from "reactstrap"

const FileModal = ({ modal_file, toggleAddModalFile, changeFile }) => {
  return (
    <Modal
      isOpen={modal_file}
      toggle={() => toggleAddModalFile()}
      className="modal-sm"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody className="modal-body">
        <h6>
          {useFormatMessage("modules.time_off_requests.replace_the_attachment")}
        </h6>
        <p>
          {useFormatMessage(
            "modules.time_off_requests.replace_the_attachment_body"
          )}
        </p>
        <Button.Ripple
          color="primary"
          tag="label"
          className="btn-change-file"
          style={{ cursor: "pointer" }}>
          {useFormatMessage("modules.time_off_requests.button.replace")}
          <Input
            type="file"
            hidden
            onChange={(e) => {
              changeFile(e)
            }}
          />
        </Button.Ripple>
        <Button.Ripple
          color="flat-danger"
          onClick={() => {
            toggleAddModalFile()
          }}>
          {useFormatMessage("modules.time_off_requests.button.keep_previous")}
        </Button.Ripple>
      </ModalBody>
    </Modal>
  )
}

export default FileModal
