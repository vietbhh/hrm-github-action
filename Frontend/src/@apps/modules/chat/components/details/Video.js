import { useEffect, useState } from "react"
import { Placeholder } from "rsuite"
import { downloadApi } from "@apps/modules/download/common/api"
import classNames from "classnames"
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
const CACHE = {}

function hashArgs(...args) {
  return args.reduce((acc, arg) => stringify(arg) + ":" + acc, "")
}

function stringify(val) {
  return typeof val === "object" ? JSON.stringify(val) : String(val)
}

const Video = (props) => {
  const [video, setVideo] = useState(false)
  const [modal, setModal] = useState(false)

  const handleClickPlay = () => {
    toggleModal()
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  useEffect(() => {
    let imgUrl = ""
    const cacheID = hashArgs(props.src)
    if (CACHE[cacheID] !== undefined) {
      imgUrl = CACHE[cacheID]
      setVideo(URL.createObjectURL(imgUrl))
    } else {
      downloadApi.getPhoto(props.src).then((response) => {
        imgUrl = response.data
        CACHE[cacheID] = imgUrl
        setVideo(URL.createObjectURL(response.data))
      })
    }
    return () => {
      setVideo(false)
      URL.revokeObjectURL(imgUrl)
    }
  }, [props.src])
  if (!video) return <Placeholder.Paragraph active={true} graph="image" />
  else {
    const newProps = { ...props }
    delete newProps.src
    delete newProps.alt
    return (
      <div
        className={classNames("video-container", {
          "min-size": !props.controls
        })}>
        <video
          width={props.width ? props.width : "300"}
          height={props.height ? props.height : "150"}
          controls={props.controls !== undefined ? props.controls : true}
          loop
          muted>
          <source src={video}></source>
        </video>
        {!props.controls ? (
          <i
            className="far fa-play-circle icon-play"
            onClick={() => handleClickPlay()}
          />
        ) : (
          ""
        )}

        <Modal
          isOpen={modal}
          toggle={toggleModal}
          className="modal-dialog-centered chat-application modal-play-video">
          <ModalBody>
            <video width="1200" height="675" controls autoPlay >
              <source src={video}></source>
            </video>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default Video
