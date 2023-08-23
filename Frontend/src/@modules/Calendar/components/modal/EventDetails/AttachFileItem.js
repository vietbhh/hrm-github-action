// ** React Imports
import { Fragment } from "react"
import { eventApi } from "@modules/Feed/common/api"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"

const AttachFileItem = (props) => {
  const {
    // ** props
    infoEvent,
    listAttachment,
    file,
    isOwner,
    // ** methods
    setListAttachment
  } = props

  const handleClickRemoveButton = () => {
    SwAlert.showWarning({
      text: useFormatMessage("modules.feed.create_event.text.remove_event", {
        name: file.name
      })
    }).then((resSw) => {
      if (resSw.isConfirmed) {
        eventApi
          .removeAttachment(infoEvent._id, { ...file })
          .then((res) => {
            const newListAttachment = [...listAttachment].filter((item) => {
              return item.src !== file.src
            })

            setListAttachment(newListAttachment)
          })
          .catch((err) => {})
      }
    })
  }

  // ** render
  const renderRemoveButton = () => {
    if (isOwner === false) {
      return ""
    }

    return (
      <Button.Ripple
        className="remove-file-btn"
        onClick={() => handleClickRemoveButton()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none">
          <path
            d="M9 1L1 9M9 9L1 1"
            stroke="#4F4D55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Button.Ripple>
    )
  }

  return (
    <div className="d-flex align-items-center justify-content-between me-50 mb-25 p-75 attach-file-item">
      <div className="d-flex align-items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="me-50">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 18H6C4.89543 18 4 17.1046 4 16V4C4 2.89543 4.89543 2 6 2L12.1716 2C12.702 2 13.2107 2.21071 13.5858 2.58579L15.4142 4.41421C15.7893 4.78929 16 5.29799 16 5.82843V16C16 17.1046 15.1046 18 14 18ZM14.2929 6.49988H12C11.7239 6.49988 11.5 6.27602 11.5 5.99988V3.70699C11.5 3.26153 12.0386 3.03845 12.3536 3.35343L14.6464 5.64633C14.9614 5.96131 14.7383 6.49988 14.2929 6.49988Z"
            fill="#019939"
          />
        </svg>
        {file.name}
      </div>
      <div>
        <Fragment>{renderRemoveButton()}</Fragment>
      </div>
    </div>
  )
}

export default AttachFileItem
