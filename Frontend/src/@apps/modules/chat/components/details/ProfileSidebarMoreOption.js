import { useFormatMessage } from "@apps/utility/common"
import React, { Fragment } from "react"

const ProfileSidebarMoreOption = (props) => {
  const { handleShowMoreOption } = props

  const handleDeleteChat = () => {}

  return (
    <Fragment>
      <div className="file-view-header">
        <div
          className="header-icon"
          onClick={() => handleShowMoreOption(false)}>
          <i className="fa-regular fa-arrow-left"></i>
        </div>
        <div className="header-text">
          {useFormatMessage("modules.chat.text.more_options")}
        </div>
      </div>
      <div className="file-view-body more-option-body">
        <div className="more-option-body-div-child more-option-body-div-bg">
          <div className="more-option-body-div-content">
            <span className="text-left">
              {useFormatMessage("modules.chat.text.leave_chat")}
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ProfileSidebarMoreOption
