// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { Link } from "react-router-dom"
import classNames from "classnames"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components

const ModalButton = (props) => {
  const {
    // ** props
    mediaInfo,
    showViewPost,
    hideBackGround,
    // ** methods
    handleModal,
    handleClickDownload
  } = props

  // ** render
  const renderViewPostButton = () => {
    if (showViewPost === false) {
      return ""
    }

    return (
      <Link to={`/posts/${mediaInfo._id}`}>
        <Button.Ripple color="secondary">
          <i className="fal fa-newspaper me-50" />
          {useFormatMessage("modules.workspace.buttons.view_post")}
        </Button.Ripple>
      </Link>
    )
  }

  return (
    <div
      className={classNames(
        "w-100 d-flex align-items-center justify-content-end p-50 pe-1 action-container",
        {
          "action-container-bg":
            hideBackGround === undefined || hideBackGround === false
        }
      )}>
      <Space>
        <Button.Ripple color="secondary" onClick={() => handleClickDownload()}>
          <i className="far fa-cloud-download-alt me-50" />
          {useFormatMessage("modules.workspace.buttons.download")}
        </Button.Ripple>
        <Fragment>{renderViewPostButton()}</Fragment>

        <Button.Ripple
          color="secondary"
          className="btn-icon"
          onClick={() => handleModal()}>
          <i className="far fa-times" />
        </Button.Ripple>
      </Space>
    </div>
  )
}

export default ModalButton
