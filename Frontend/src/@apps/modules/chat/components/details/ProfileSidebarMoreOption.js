import { useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { arrayRemove } from "firebase/firestore"
import { Fragment } from "react"

const ProfileSidebarMoreOption = (props) => {
  const {
    handleShowMoreOption,
    selectedGroup,
    handleUpdateGroup,
    userId,
    setActive,
    setActiveFullName,
    setDataUnseenDetail
  } = props

  const handleUpdateLeaveChat = (props) => {
    const timestamp = Date.now()
    const docData = {
      last_message: useFormatMessage("modules.chat.text.leave_chat"),
      last_user: userId,
      timestamp: timestamp,
      user: arrayRemove(userId),
      admin: arrayRemove(userId),
      mute: arrayRemove(userId),
      pin: arrayRemove(userId),
      unseen: arrayRemove(userId),
      unseen_detail: setDataUnseenDetail(
        "delete_member",
        userId,
        timestamp,
        selectedGroup.chat.unseen_detail,
        [],
        [],
        userId
      ),
      ...props
    }
    handleUpdateGroup(selectedGroup.id, docData)
    window.history.replaceState(null, "", `/chat`)
    setActive(0)
    setActiveFullName("")
  }

  const handleLeaveChat = () => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.confirm"),
      html: ""
    }).then((res) => {
      if (res.value) {
        if (
          selectedGroup.admin.length === 1 &&
          selectedGroup.admin[0] === userId
        ) {
          if (selectedGroup.user.length > 1) {
            notification.showWarning({
              text: useFormatMessage(
                "modules.chat.notification.leave_group_error"
              )
            })
          } else {
            handleUpdateLeaveChat({ is_delete: 1 })
          }
        } else {
          handleUpdateLeaveChat()
        }
      }
    })
  }

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
        {selectedGroup?.type === "group" &&
          selectedGroup?.is_system !== true && (
            <div className="more-option-body-div-child more-option-body-div-bg">
              <div
                className="more-option-body-div-content"
                onClick={() => handleLeaveChat()}>
                <span className="text-left text-color-red">
                  {useFormatMessage("modules.chat.text.leave_chat")}
                </span>
              </div>
            </div>
          )}
      </div>
    </Fragment>
  )
}

export default ProfileSidebarMoreOption
