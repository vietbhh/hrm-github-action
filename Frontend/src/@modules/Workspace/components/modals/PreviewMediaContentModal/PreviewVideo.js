// ** React Imports
// ** Styles
// ** Components
import ModalButton from "./ModalButton"

const PreviewVideo = (props) => {
  const {
    // ** props
    mediaInfo,
    // ** methods
    handleModal
  } = props

  // ** render
  return (
    <div className="d-flex align-items-center justify-content-center preview-video">
      <video width="100%" controls muted>
        <source src={mediaInfo.source}></source>
      </video>

      <ModalButton handleModal={handleModal} />
    </div>
  )
}

export default PreviewVideo
