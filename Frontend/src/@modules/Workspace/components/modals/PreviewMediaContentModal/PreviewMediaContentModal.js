// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Modal, ModalBody } from "reactstrap"
// ** Components
import PreviewImage from "./PreviewImage"

const PreviewMediaContentModal = (props) => {
  const {
    // ** props
    modal,
    mediaTabActive,
    // ** methods
    handleModal
  } = props

  // ** render
  const renderModalContent = () => {
    if (mediaTabActive === 1) {
      return ""
    }

    if (mediaTabActive === 2) {
      return <PreviewImage handleModal={handleModal} />
    }
  }

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="preview-workspace-media-modal"
      size=""
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody>
        <Fragment>{renderModalContent()}</Fragment>
      </ModalBody>
    </Modal>
  )
}

export default PreviewMediaContentModal
