// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** redux
import { showModalCreatePost } from "@modules/Workspace/common/reducer/workspace"
import { useDispatch } from "react-redux"
// ** Styles
import { Button } from "reactstrap"
// ** Components

const MediaHeader = (props) => {
  const {
    // ** props
    isMember,
    mediaTabActive
    // ** methods
  } = props

  let strDisplay = ""
  if (mediaTabActive === 1) {
    strDisplay = "uploaded_document"
  } else if (mediaTabActive === 2) {
    strDisplay = "uploaded_photo"
  } else if (mediaTabActive === 3) {
    strDisplay = "uploaded_video"
  } else if (mediaTabActive === 4) {
    strDisplay = "group_link_posted"
  }

  const dispatch = useDispatch()

  const handleClickUpload = () => {
    dispatch(showModalCreatePost())
  }

  // ** render
  const renderUploadButton = () => {
    if (isMember === false) {
      return ""
    }

    if (strDisplay !== "group_link_posted") {
      return (
        <Button.Ripple
          className="btn-icon custom-secondary align-items-center"
          onClick={() => handleClickUpload()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ marginRight: "12px" }}
            fill="none">
            <path
              d="M16.4405 8.90039C20.0405 9.21039 21.5105 11.0604 21.5105 15.1104V15.2404C21.5105 19.7104 19.7205 21.5004 15.2505 21.5004H8.74047C4.27047 21.5004 2.48047 19.7104 2.48047 15.2404V15.1104C2.48047 11.0904 3.93047 9.24039 7.47047 8.91039"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15.0001V3.62012"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.3504 5.85L12.0004 2.5L8.65039 5.85"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{useFormatMessage("modules.workspace.buttons.upload")}</span>
        </Button.Ripple>
      )
    }

    return ""
  }

  return (
    <div className="d-flex align-items-center justify-content-between">
      <h4 className="title">
        {useFormatMessage(`modules.workspace.display.media`)}
      </h4>
      <Fragment>{renderUploadButton()}</Fragment>
    </div>
  )
}

export default MediaHeader
