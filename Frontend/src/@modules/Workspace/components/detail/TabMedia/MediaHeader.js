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
    if (strDisplay !== "group_link_posted") {
      return (
        <Button.Ripple
          className="btn-icon custom-secondary d-flex align-items-center"
          onClick={() => handleClickUpload()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="16px"
            height="16px"
            viewBox="0 0 16 16"
            enableBackground="new 0 0 16 16"
            xmlSpace="preserve"
            className="me-50">
            {" "}
            <image
              id="image0"
              width="16"
              height="16"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAATlBMVEUAAAAwQEwwQk0wQ1Ew Qk4yQ08xQ04yQk8wQlAyQ08xQ08wRVAzQ04wQFAwRE4yQk4yQlAyQlAxQ08yQk4wRFAwSFAzQU40 RFAyQ0////8xNEbBAAAAGHRSTlMAQGBff++gn2CfzzCwEICAcIC/kEAgoEB5Nk/7AAAAAWJLR0QZ 7G61iAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cHBQkvB8HCO/kAAABaSURBVBjTdc/R DoAgCAVQyoSy0tIs/v9Ly61Qt7wPjHs2HgBopOvrrpiHumtdimJEGnkSMAhIMC8CKySoU4B1GSzJ uu3C5XUDfAYTnnGwoTeeY+IYzi/Xz9s3dpoDw+hcxhcAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMt MDctMDVUMDk6NDc6MDcrMDA6MDAVtMFyAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA3LTA1VDA5 OjQ3OjA3KzAwOjAwZOl5zgAAAABJRU5ErkJggg=="
            />
          </svg>
          {useFormatMessage("modules.workspace.buttons.upload")}
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
