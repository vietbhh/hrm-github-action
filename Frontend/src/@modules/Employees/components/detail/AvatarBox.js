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
import cameraBtn from "../../assets/images/camera.svg"
const AvatarBox = (props) => {
  const [state, setState] = useMergedState({
    avatarPreview: noAvatar,
    linkPreview: "",
    modal: false,
    preview: null,
    scale: 1,
    loading: true
  })
  //useSelector((state) => state.auth.userData.avatar)
  const { currentAvatar, isDirect } = props
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
    if (isDirect) {
      setState({
        avatarPreview: currentAvatar,
        loading: false
      })
    } else {
      downloadApi.getAvatar(currentAvatar).then((response) => {
        const imgUrl = response.data
        setState({
          avatarPreview: URL.createObjectURL(imgUrl),
          loading: false
        })
      })
    }
  }, [currentAvatar])
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
          className={`employeeAvatar rounded-circle`}>
          <img
            src={state.avatarPreview}
            alt="Avatar"
            className={`img-fluid w-100`}
          />
          <div className={`cameraBtn`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="17px"
              height="15px"
              viewBox="0 0 17 15"
              enableBackground="new 0 0 17 15"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="17"
                height="15"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAMAAAA1b9QjAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAVFBMVEUAAAAwQFAxQ08xQk8w QFAxQU4yQk4xQ08yQ080RFAzQ1AwQk4xQ08yQk4wQk4wRFAyQ08wQEwyRFAyQk4wQ0wyQ04zRE8w SFAyQk4yQk4yQ0////8/Pqr4AAAAGnRSTlMAIM/fEKCAv99AUH/vj49A70CAkFCQzyDQwMqZIVkA AAABYktHRBsCYNSkAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wcNCxcnKwNbSwAAAGxJ REFUGNNVzUkSwyAMRNEGdQKeEjw7uv9BbUNVhP9CiLcA4Mp5vRLi30tz73JzQau8A7w+CkA+Y0O0 Ma9FIru+HxhN2k9++GuCdM9EExaByTjdc15MhGtKE8VEZQFHqX6vA8ITNmA/avjtOAHotBLMA0pp UAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wNy0xM1QwOToyMzozOSswMjowMFRkvdkAAAAldEVY dGRhdGU6bW9kaWZ5ADIwMjMtMDctMTNUMDk6MjM6MzkrMDI6MDAlOQVlAAAAAElFTkSuQmCC"
              />
            </svg>
          </div>
          <input
            type="file"
            ref={avatarUploader}
            style={{ display: "none" }}
            onChange={(e) => handleAvtChange(e.target.files)}
          />
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
