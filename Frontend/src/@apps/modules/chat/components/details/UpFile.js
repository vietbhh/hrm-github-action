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
        <svg
          className="cursor-pointer text-secondary"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M12.3301 12.6499L9.86005 15.1199C8.49005 16.4899 8.49005 18.6999 9.86005 20.0699C11.2301 21.4399 13.4401 21.4399 14.8101 20.0699L18.7001 16.1799C21.4301 13.4499 21.4301 9.00992 18.7001 6.27992C15.9701 3.54992 11.5301 3.54992 8.80005 6.27992L4.56005 10.5199C2.22005 12.8599 2.22005 16.6599 4.56005 19.0099"
            stroke="#696760"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
