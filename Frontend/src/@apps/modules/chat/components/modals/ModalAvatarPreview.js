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

const ModalAvatarPreview = (props) => {
  const {
    modal,
    toggleModal,
    linkPreview,
    handleSave,
    avatarEditor,
    avatarPreviewLoading
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
      className="modal-dialog-centered">
      <ModalHeader toggle={toggleModal}>
        {useFormatMessage("modules.chat.text.avatar_image")}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col sm="12" className={`avtCustomize text-center`}>
            <AvatarEditor
              ref={avatarEditor}
              image={linkPreview}
              border={50}
              borderRadius={200}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={parseFloat(state.scale)}
              rotate={0}
              width={350}
              height={350}
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
          disabled={avatarPreviewLoading}>
          {avatarPreviewLoading && <Spinner size="sm" className="me-50" />}
          {useFormatMessage("button.confirm")}
        </Button>
        <Button.Ripple
          color="flat-danger"
          onClick={() => {
            toggleModal()
          }}>
          {useFormatMessage("button.cancel")}
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  )
}

export default ModalAvatarPreview
