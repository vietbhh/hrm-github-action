// ** React Imports
import { Fragment } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
import { Modal, ModalBody } from "reactstrap"
// ** Components
import PreviewImage from "./PreviewImage"
import PreviewVideo from "./PreviewVideo"
import PreviewFile from "./PreviewFile"

const PreviewMediaContentModal = (props) => {
  const {
    // ** props
    modal,
    mediaInfo,
    // ** methods
    handleModal
  } = props

  console.log(mediaInfo)

  const handleClickDownload = () => {
    const path = mediaInfo.path
    workspaceApi
      .downloadMedia(path)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `${mediaInfo.name}`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      })
      .catch((err) => {})
  }

  // ** render
  const renderModalContent = () => {
    const type =
      mediaInfo.file_type !== undefined ? mediaInfo.file_type : mediaInfo.type
    if (type === undefined) {
      return ""
    }

    if (type === "image") {
      return (
        <PreviewImage
          mediaInfo={mediaInfo}
          handleModal={handleModal}
          handleClickDownload={handleClickDownload}
        />
      )
    }

    if (type === "video") {
      return (
        <PreviewVideo
          mediaInfo={mediaInfo}
          handleModal={handleModal}
          handleClickDownload={handleClickDownload}
        />
      )
    }

    if (
      type === "excel" ||
      type === "pdf" ||
      type === "word" ||
      type === "sound" ||
      type === "zip"
    ) {
      return (
        <PreviewFile
          mediaInfo={mediaInfo}
          handleModal={handleModal}
          handleClickDownload={handleClickDownload}
        />
      )
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
      <ModalBody className="p-0">
        <Fragment>{renderModalContent()}</Fragment>
      </ModalBody>
    </Modal>
  )
}

export default PreviewMediaContentModal
