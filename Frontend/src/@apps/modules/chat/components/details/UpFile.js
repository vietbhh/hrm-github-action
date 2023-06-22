// ** React Imports

// ** Custom Components
import { ErpCheckbox } from "@apps/components/common/ErpField"

// ** Third Party Components
import { Paperclip } from "react-feather"

// ** Reactstrap Imports
import { useFormatMessage } from "@apps/utility/common"
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap"
import { useEffect } from "react"

const UpFile = (props) => {
  const {
    selectedUser,
    linkPreview,
    file,
    modal,
    compress_images,
    toggleModal,
    setCompressImages,
    handleSaveFile,
    changeFile
  } = props

  // ** listen enter image
  useEffect(() => {
    const handle = (event) => {
      if (event.keyCode === 13 && modal === true) {
        handleSaveFile(file)
        toggleModal()
      }
    }
    window.addEventListener("keydown", handle)

    return () => {
      window.removeEventListener("keydown", handle)
    }
  }, [modal, file])

  return (
    <>
      <Label
        className={`attachment-icon mb-0 ${
          _.isEmpty(selectedUser.chat.id) ? "disabled" : ""
        }`}
        for="attach-doc"
        style={{ width: "30px" }}>
        <Paperclip className="cursor-pointer text-secondary" size={20} />
        <input
          type="file"
          id="attach-doc"
          multiple
          hidden
          onChange={(e) => {
            changeFile(e)
          }}
          disabled={_.isEmpty(selectedUser.chat.id)}
        />
      </Label>

      <Modal
        isOpen={modal}
        toggle={toggleModal}
        className="modal-dialog-centered chat-application">
        <ModalHeader toggle={() => toggleModal()}>
          {useFormatMessage("modules.chat.text.image_preview")}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="12" className={`avtCustomize text-center`}>
              {_.map(linkPreview, (val, index) => {
                return (
                  <img
                    key={index}
                    src={val}
                    style={{ maxWidth: "100%", maxHeight: "450px" }}
                    className="mb-50"
                  />
                )
              })}
            </Col>
            <Col sm="12" className="mt-1 mb-1">
              <ErpCheckbox
                label="Compress images"
                checked={compress_images}
                onChange={() => {
                  setCompressImages(!compress_images)
                }}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button.Ripple
            color="primary"
            onClick={() => {
              handleSaveFile(file)
              toggleModal()
            }}>
            {useFormatMessage("modules.chat.text.send")}
          </Button.Ripple>
          {/*  <Button.Ripple
            color="flat-danger"
            onClick={() => {
              toggleModal()
            }}>
            {useFormatMessage("button.cancel")}
          </Button.Ripple> */}
        </ModalFooter>
      </Modal>
    </>
  )
}

export default UpFile
