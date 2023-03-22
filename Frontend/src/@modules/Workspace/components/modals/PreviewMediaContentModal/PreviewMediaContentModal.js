// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Modal, ModalBody } from "reactstrap"
// ** Components
import PreviewImage from "./PreviewImage"
import PreviewVideo from "./PreviewVideo"

const PreviewMediaContentModal = (props) => {
  const {
    // ** props
    modal,
    mediaInfo,
    mediaTabActive,
    // ** methods
    handleModal
  } = props

  console.log(mediaInfo)

  // ** render
  const renderModalContent = () => {
    const [mediaType] = mediaInfo.mime.split("/")
    if (mediaType === "file") {
      return ""
    }

    if (mediaType === "image") {
      return <PreviewImage mediaInfo={mediaInfo} handleModal={handleModal} />
    }

    if (mediaType === "video") {
      return <PreviewVideo mediaInfo={mediaInfo} handleModal={handleModal} />
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
