// ** React Imports

// ** Custom Components
import { ErpCheckbox } from "@apps/components/common/ErpField"

// ** Third Party Components
import { Paperclip } from "react-feather"

// ** Reactstrap Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Row
} from "reactstrap"
import { ChatApi } from "../../common/api"
import { useEffect } from "react"

const UpFile = (props) => {
  const { updateMessage, selectedUser, setReplyingDefault } = props

  const [state, setState] = useMergedState({
    linkPreview: "",
    file: null,
    modal: false,
    compress_images: true
  })

  const toggleModal = () => {
    if (state.modal) {
      document.getElementById("attach-doc").value = null
    }
    setState({ modal: !state.modal })
  }

  const handleFile = (file) => {
    const _checkFile = []
    let dem_image = 0
    _.forEach(file, (val) => {
      const type = val.type
      let _checkType = "file"
      if (type.includes("image/")) {
        dem_image++
        _checkType = "image"
        if (type.includes("gif")) {
          dem_image--
          _checkType = "image_gif"
        }
      } else if (type.includes("video/")) {
        _checkType = "video"
      } else if (type.includes("audio/")) {
        _checkType = "audio"
      }
      _checkFile.push({ type: _checkType, file: val })
    })
    let file_type = "file"
    if (_checkFile.length === 1) {
      file_type = _checkFile[0].type
    } else {
      if (dem_image === _checkFile.length) {
        file_type = "image"
      }
    }

    return { file_type: file_type, arr_file: _checkFile }
  }

  const handleSaveFile = (file) => {
    const _file = handleFile(file)
    if (_file.file_type === "image") {
      handleSubmitSaveFile(_file.arr_file)
    } else {
      _.forEach(_file.arr_file, (val) => {
        handleSubmitSaveFile([val])
      })
    }
    setReplyingDefault()
  }

  const handleSubmitSaveFile = (file) => {
    const data = {
      groupId: selectedUser.chat.id,
      file: file,
      compress_images: state.compress_images,
      file_type: file[0].type
    }
    const timestamp = Date.now()
    updateMessage(selectedUser.chat.id, timestamp, {
      message: "",
      status: "loading",
      type: file[0].type,
      timestamp: timestamp,
      file: []
    })
    ChatApi.postUpFile(data)
      .then((res) => {
        document.getElementById("attach-doc").value = null
        updateMessage(selectedUser.chat.id, timestamp, {
          message: "",
          status: "success",
          type: file[0].type,
          timestamp: timestamp,
          file: res.data
        })
      })
      .catch((err) => {
        document.getElementById("attach-doc").value = null
        updateMessage(selectedUser.chat.id, timestamp, {
          message: "",
          status: "error",
          type: file[0].type,
          timestamp: timestamp,
          file: []
        })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const changeFile = (e) => {
    if (!_.isUndefined(e.target.files[0])) {
      setState({ file: e.target.files })
      const file = e.target.files
      const _file = handleFile(file)

      if (_file.file_type === "image") {
        const _linkPreview = []
        _.forEach(file, (val) => {
          _linkPreview.push(URL.createObjectURL(val))
        })
        setState({ linkPreview: _linkPreview })
        toggleModal()
      } else {
        handleSaveFile(e.target.files)
      }
    }
  }

  // ** listen paste image
  useEffect(() => {
    const handlePaste = (event) => {
      const clipboardItems = event.clipboardData.items
      const items = [].slice.call(clipboardItems).filter(function (item) {
        // Filter the image items only
        return /^image\//.test(item.type)
      })
      if (items.length === 0) {
        return
      }
      const item = items[0]
      const blob = item.getAsFile()
    }
    window.addEventListener("paste", handlePaste)

    return () => {
      window.removeEventListener("paste", handlePaste)
    }
  }, [])

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
        isOpen={state.modal}
        toggle={toggleModal}
        className="modal-dialog-centered">
        <ModalBody>
          <Row>
            <Col sm="12" className={`avtCustomize text-center`}>
              {_.map(state.linkPreview, (val, index) => {
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
                checked={state.compress_images}
                onChange={() => {
                  setState({ compress_images: !state.compress_images })
                }}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button.Ripple
            color="primary"
            onClick={() => {
              handleSaveFile(state.file)
              toggleModal()
            }}>
            {useFormatMessage("modules.chat.text.send")}
          </Button.Ripple>
          <Button.Ripple
            color="flat-danger"
            onClick={() => {
              toggleModal()
            }}>
            {useFormatMessage("button.cancel")}
          </Button.Ripple>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default UpFile
