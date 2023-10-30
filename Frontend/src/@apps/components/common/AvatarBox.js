import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import noAvatar from "@src/assets/images/erp/noavt.png"
import { isEmpty } from "lodash-es"
import Nouislider from "nouislider-react"
import { Fragment, useEffect, useRef } from "react"
import AvatarEditor from "react-avatar-editor"
import ContentLoader from "react-content-loader"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap"
import cameraBtn from "@src/assets/images/erp/icons/camera.svg"
import { Image } from "antd"
import classNames from "classnames"
const AvatarBox = (props) => {
  const [state, setState] = useMergedState({
    avatarPreview: noAvatar,
    linkPreview: "",
    modal: false,
    preview: null,
    scale: 1,
    loading: true
  })
  const { currentAvatar, buttonComponent = undefined } = props
  const avatarUploader = useRef()
  const avatarEditor = useRef()

  const handleAvtClick = (e) => {
    if (avatarUploader.current) {
      avatarUploader.current.click()
    }
  }

  const handleAvtChange = (file) => {
    if (!isEmpty(file)) {
      if (!["image/jpeg", "image/png"].includes(file[0].type)) {
        notification.showError({
          text: useFormatMessage("notification.wrong_avatar_file_type")
        })
      } else {
        const linkPreview = URL.createObjectURL(file[0])
        setState({ linkPreview: linkPreview, modal: true })
      }
    }
  }

  const handleSave = () => {
    if (avatarEditor.current) {
      const img = avatarEditor.current.getImageScaledToCanvas().toDataURL()
      setState({
        avatarPreview: img
      })

      props.handleSave(img)
      toggleModal()
    }
  }

  const handleScale = (value) => {
    const scale = parseFloat(value)
    setState({ scale })
  }

  const toggleModal = () => {
    setState({
      modal: !state.modal
    })
  }

  useEffect(() => {
    setState({
      loading: true
    })
    downloadApi.getAvatar(currentAvatar).then((response) => {
      const imgUrl = response.data
      setState({
        avatarPreview: URL.createObjectURL(imgUrl),
        loading: false
      })
    })
  }, [currentAvatar])

  const renderButton = () => {
    if (buttonComponent !== undefined) {
      return buttonComponent
    }

    return (
      <div className={`cameraBtn`}>
        <img src={cameraBtn} />
      </div>
    )
  }

  if (state.loading)
    return (
      <ContentLoader viewBox="0 0 208 208" height={208} width={208}>
        <circle cx="100" cy="100" r="100" width="208" height="208" />
      </ContentLoader>
    )
  else
    return (
      <Fragment>
        <div
          onClick={() => {
            handleAvtClick()
          }}
          className={classNames("employeeAvatar rounded-circle", {
            "overflow-hidden": props.readOnly
          })}>
          {!props.readOnly && (
            <Fragment>
              <img
                src={state.avatarPreview}
                alt="Avatar"
                className={`img-fluid w-100`}
              />
              <Fragment>{renderButton()}</Fragment>
              <input
                type="file"
                ref={avatarUploader}
                style={{ display: "none" }}
                onChange={(e) => handleAvtChange(e.target.files)}
              />
            </Fragment>
          )}
          {props.readOnly && (
            <Image
              src={state.avatarPreview}
              alt="Avatar"
              className={`img-fluid w-100`}
            />
          )}
        </div>
        <Modal
          isOpen={state.modal}
          toggle={toggleModal}
          className="modal-dialog-centered">
          <ModalHeader toggle={toggleModal}>
            {useFormatMessage("modules.users.display.profilePicture")}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12" className={`avtCustomize text-center`}>
                <AvatarEditor
                  ref={avatarEditor}
                  image={state.linkPreview}
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
            <Button color="primary" onClick={handleSave}>
              {useFormatMessage("button.confirm")}
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    )
}

export default AvatarBox
