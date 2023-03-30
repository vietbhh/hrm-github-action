// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
// ** Components

const MediaHeader = (props) => {
  const {
    // ** props
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

  // ** render
  const renderUploadButton = () => {
    if (strDisplay !== "group_link_posted") {
      return (
        <Button.Ripple size="sm" className="btn-icon">
          <i className="fas fa-plus-circle me-50" />
          {useFormatMessage("modules.workspace.buttons.upload")}
        </Button.Ripple>
      )
    }

    return ""
  }

  return (
    <div className="d-flex align-items-center justify-content-between">
      <h4>{useFormatMessage(`modules.workspace.display.${strDisplay}`)}</h4>
      <Fragment>{renderUploadButton()}</Fragment>
    </div>
  )
}

export default MediaHeader
