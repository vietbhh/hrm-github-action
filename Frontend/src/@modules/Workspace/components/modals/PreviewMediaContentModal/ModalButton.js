// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { Link } from "react-router-dom"
import classNames from "classnames"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
import { isMobileView } from "../../../common/common"
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
          {!isMobileView() ? (
            <>
              <i className="fal fa-newspaper me-50" />
              {useFormatMessage("modules.workspace.buttons.view_post")}
            </>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M15.5799 11.9999C15.5799 13.9799 13.9799 15.5799 11.9999 15.5799C10.0199 15.5799 8.41992 13.9799 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C13.9799 8.41992 15.5799 10.0199 15.5799 11.9999Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9998 20.2697C15.5298 20.2697 18.8198 18.1897 21.1098 14.5897C22.0098 13.1797 22.0098 10.8097 21.1098 9.39973C18.8198 5.79973 15.5298 3.71973 11.9998 3.71973C8.46984 3.71973 5.17984 5.79973 2.88984 9.39973C1.98984 10.8097 1.98984 13.1797 2.88984 14.5897C5.17984 18.1897 8.46984 20.2697 11.9998 20.2697Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
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
          {!isMobileView() ? (
            <>
              <i className="far fa-cloud-download-alt me-50" />
              {useFormatMessage("modules.workspace.buttons.download")}
            </>
          ) : (
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.44 8.90039C20.04 9.21039 21.51 11.0604 21.51 15.1104V15.2404C21.51 19.7104 19.72 21.5004 15.25 21.5004H8.73998C4.26998 21.5004 2.47998 19.7104 2.47998 15.2404V15.1104C2.47998 11.0904 3.92998 9.24039 7.46998 8.91039"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2V14.88"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.3499 12.6504L11.9999 16.0004L8.6499 12.6504"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </Button.Ripple>
        <Fragment>{renderViewPostButton()}</Fragment>

        <Button.Ripple
          color="secondary"
          className="btn-icon"
          onClick={() => handleModal()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            style={{ left: "8px" }}
            fill="none">
            <path
              d="M6 18L18 6"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 18L6 6"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button.Ripple>
      </Space>
    </div>
  )
}

export default ModalButton
