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
    handleModal
  } = props

  // ** render
  return (
    <div className="d-flex align-items-center justify-content-center preview-image">
      <Photo src={mediaInfo.source} preview={false} />
      <ModalButton handleModal={handleModal} />
    </div>
  )
}

export default PreviewImage
