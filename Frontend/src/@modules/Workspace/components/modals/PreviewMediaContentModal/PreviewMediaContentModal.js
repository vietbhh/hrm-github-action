// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
// ** Components

const PreviewMediaContentModal = (props) => {
  const {
    // ** props
    modal,
    // ** methods
    handleModal
  } = props

  // ** render
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="preview-workspace-media-modal"
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}></ModalHeader>
      <ModalBody></ModalBody>
    </Modal>
  )
}

export default PreviewMediaContentModal
