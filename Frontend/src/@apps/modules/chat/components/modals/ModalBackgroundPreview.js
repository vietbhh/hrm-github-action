import { useFormatMessage, useMergedState } from "@apps/utility/common"
import Nouislider from "nouislider-react"
import AvatarEditor from "react-avatar-editor"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"

const ModalBackgroundPreview = (props) => {
  const {
    modal,
    toggleModal,
    linkPreview,
    handleSave,
    backgroundEditor,
    backgroundPreviewLoading
  } = props

  const [state, setState] = useMergedState({
    scale: 1
  })

  const handleScale = (value) => {
    const scale = parseFloat(value)
    setState({ scale })
  }

  return (
    <Modal
      isOpen={modal}
      toggle={toggleModal}
      className="modal-dialog-centered chat-application">
      <ModalHeader toggle={toggleModal}>
        {useFormatMessage("modules.chat.text.avatar_image")}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col sm="12" className={`avtCustomize text-center`}>
            <AvatarEditor
              ref={backgroundEditor}
              image={linkPreview}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={parseFloat(state.scale)}
              rotate={0}
              width={340}
              height={144}
            />
          </Col>
          <Col sm={{ size: 6, offset: 3 }}>
            <Nouislider
              value={state.scale}
              onChange={handleScale}
              step={0.01}
              start={1}
              range={{
                min: 1,
                max: 2
              }}
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={handleSave}
          disabled={backgroundPreviewLoading}>
          {backgroundPreviewLoading && <Spinner size="sm" className="me-50" />}
          {useFormatMessage("button.confirm")}
        </Button>
        {/* <Button.Ripple
          color="flat-danger"
          onClick={() => {
            toggleModal()
          }}>
          {useFormatMessage("button.cancel")}
        </Button.Ripple> */}
      </ModalFooter>
    </Modal>
  )
}

export default ModalBackgroundPreview
