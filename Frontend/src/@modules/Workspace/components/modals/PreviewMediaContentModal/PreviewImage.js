// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components
import Photo from "@apps/modules/download/pages/Photo"
import ModalButton from "./ModalButton"

const PreviewImage = (props) => {
  const {
    // ** props
    mediaInfo,
    // ** methods
    handleModal,
    handleClickDownload
  } = props

  const url = mediaInfo.source === undefined ? mediaInfo.path : mediaInfo.source

  // ** render
  return (
    <div className="d-flex align-items-center justify-content-center preview-image">
      <Photo src={url} preview={false} />
      <ModalButton
        mediaInfo={mediaInfo}
        hideBackGround={true}
        handleModal={handleModal}
        handleClickDownload={handleClickDownload}
      />
    </div>
  )
}

export default PreviewImage
