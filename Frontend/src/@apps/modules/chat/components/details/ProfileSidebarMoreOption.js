import { useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { arrayRemove } from "firebase/firestore"
import { Fragment } from "react"
import { handleDeleteGroup } from "../../common/firebaseCommon"
import { workspaceApi } from "../../../../../@modules/Workspace/common/api"

const ProfileSidebarMoreOption = (props) => {
  const {
    handleShowMoreOption,
    selectedGroup,
    handleUpdateGroup,
    userId,
    settingUser,
    setActive,
    setActiveFullName,
    setDataUnseenDetail,
    isAdminSystem,
    sendMessage,
    setSelectedGroup
  } = props

  const handleUpdateLeaveChat = (props) => {
    const timestamp = Date.now()
    const docData = {
      last_message: `${settingUser.full_name} ${useFormatMessage(
        "modules.chat.text.left_group_chat"
      )}`,
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
    sendMessage(
      selectedGroup.id,
      `${settingUser.full_name} ${useFormatMessage(
        "modules.chat.text.left_group_chat"
      )}`,
      {
        type: "notification"
      }
    )
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

  const handleDeleteConversation = () => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.chat.text.warning_delete_conversation.title"
      ),
      text: useFormatMessage(
        "modules.chat.text.warning_delete_conversation.text"
      ),
      confirmButtonText: useFormatMessage("button.confirm"),
      html: ""
    }).then((res) => {
      if (res.isConfirmed) {
        handleDeleteGroup(selectedGroup.id).then((resDelete) => {
          workspaceApi
            .removeGroupChatId({
              group_chat_id: selectedGroup.id
            })
            .then((resUpdate) => {
              window.history.replaceState(null, "", "/chat")
              setActive(0)
              setActiveFullName("")
            })
            .catch((err) => {
              notification.showWarning({
                text: useFormatMessage(
                  "modules.chat.notification.delete_conversation_error"
                )
              })
            })
        })
      }
    })
  }

  // ** render
  const renderLeaveChat = () => {
    if (isAdminSystem) {
      return (
        <Fragment>
          <div className="more-option-body-div-child more-option-body-div-bg">
            <div
              className="more-option-body-div-content"
              onClick={() => handleLeaveChat()}>
              <span className="text-left text-color-red">
                {useFormatMessage("modules.chat.text.leave_chat")}
              </span>
            </div>
          </div>
          <div className="more-option-body-div-child more-option-body-div-bg">
            <div
              className="more-option-body-div-content"
              onClick={() => handleDeleteConversation()}>
              <span className="text-left text-color-red">
                {useFormatMessage("modules.chat.text.delete_conversation")}
              </span>
            </div>
          </div>
        </Fragment>
      )
    }

    return ""
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
      <div className="file-view-body more-option-body">{renderLeaveChat()}</div>
    </Fragment>
  )
}

export default ProfileSidebarMoreOption
