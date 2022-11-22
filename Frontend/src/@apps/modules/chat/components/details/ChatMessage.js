import { Fragment } from "react"

import Avatar from "@apps/modules/download/pages/Avatar"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import AudioComponent from "./Audio"
import Photo from "./Photo"
import VideoComponent from "./Video"

import classnames from "classnames"
import { Link2 } from "react-feather"

import { useFormatMessage } from "@apps/utility/common"
import { Dropdown, Image, Menu, Tooltip } from "antd"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { Badge, Spinner } from "reactstrap"
import { formatTime } from "../../common/common"

const ChatMessage = (props) => {
  const {
    handleUserSidebarRight,
    handleSidebar,
    store,
    userSidebarLeft,
    settingChat,
    userId,
    sendMessage,
    loadingMessage,
    chats,
    chatHistory,
    getChatHistory,
    active,
    hasMoreHistory,
    chatArea,
    scrollToBottom,
    unread,
    handleSeenMessage,
    handleUnSeenMessage,
    updateMessage,
    userSidebarRight,
    windowWidth,
    setUserSidebarRight,
    dataEmployees
  } = props
  const { userProfile, selectedUser } = store

  // ** reaction
  const reaction = [
    {
      value: "react_like",
      label: "👍"
    },
    {
      value: "react_heart",
      label: "❤️"
    },
    {
      value: "react_smile",
      label: "😂"
    },
    {
      value: "react_cry",
      label: "😭"
    },
    {
      value: "react_angry",
      label: "😡"
    },
    {
      value: "react_party",
      label: "🎉"
    }
  ]

  const handleGetReaction = (value) => {
    const index = reaction.findIndex((item) => item.value === value)
    if (index > -1) {
      return reaction[index].label
    }
    return ""
  }

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog = []
    if (!_.isEmpty(chats)) {
      chatLog = chats
      if (!_.isEmpty(chatHistory)) {
        const _chatHistory = [...chatHistory]
        _chatHistory.pop()
        chatLog = [..._chatHistory, ...chats]
      }
    }

    const formattedChatLog = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          msg: msg.message,
          time: msg.time,
          ...msg
        })
      } else {
        chatMessageSenderId = msg.senderId
        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              msg: msg.message,
              time: msg.time,
              ...msg
            }
          ]
        }
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })
    return formattedChatLog
  }

  // ** Renders user chat
  const renderChats = () => {
    const renderHasReaction = (chat) => {
      const renderItemReactionDropdown = (react, time) => {
        const items = []
        if (react) {
          _.forEach(react, (val_react, index_react) => {
            _.forEach(val_react, (val, index) => {
              const index_employee = dataEmployees.findIndex(
                (item_employee) => item_employee.id === index
              )
              if (index_employee > -1) {
                items.push({
                  key: index,
                  label: (
                    <>
                      <Avatar
                        imgWidth={38}
                        imgHeight={38}
                        className="box-shadow-1 cursor-pointer"
                        src={dataEmployees[index_employee].avatar}
                      />
                      <div
                        className="react-dropdown-name ms-1 me-2"
                        onClick={() => {
                          if (index === userId) {
                            updateMessage(selectedUser.chat.id, time, {
                              react: arrayRemove({ [userId]: val })
                            })
                          }
                        }}>
                        <span>{dataEmployees[index_employee].full_name}</span>
                        {index === userId && (
                          <small>
                            {useFormatMessage(
                              "modules.chat.text.click_to_remove"
                            )}
                          </small>
                        )}
                      </div>
                      <span className="ms-auto">{handleGetReaction(val)}</span>
                    </>
                  )
                })
              }
            })
          })
        }
        return items
      }

      let data_react = {}
      _.forEach(chat.react, (val_react, index_react) => {
        _.forEach(val_react, (val) => {
          data_react = { ...data_react, [val]: val }
        })
      })

      return (
        <Dropdown
          overlay={
            <Menu items={renderItemReactionDropdown(chat.react, chat.time)} />
          }
          placement="top"
          overlayClassName="chat-content-reaction-dropdown-more dropdown-react"
          arrow={{
            pointAtCenter: true
          }}>
          <div className="has-reaction-react">
            {_.map(data_react, (val_react) => {
              return handleGetReaction(val_react)
            })}
            {chat.react.length > 1 && (
              <small className="ms-25 me-25">{chat.react.length}</small>
            )}
          </div>
        </Dropdown>
      )
    }

    const renderFile = (data, className, chat, index2) => {
      if (data.type === "image" || data.type === "image_gif") {
        return (
          <div className="chat-content chat-content-img">
            <Photo
              className="chat-img"
              src={`/modules/chat/${selectedUser.chat.id}/other/${data.file}`}
            />
            {!_.isEmpty(chat.react) &&
              index2 === chat.file.length - 1 &&
              renderHasReaction(chat)}
          </div>
        )
      } else if (data.type === "video") {
        return (
          <div className="chat-content chat-content-video">
            <VideoComponent
              src={`/modules/chat/${selectedUser.chat.id}/other/${data.file}`}
            />
            {!_.isEmpty(chat.react) &&
              index2 === chat.file.length - 1 &&
              renderHasReaction(chat)}
          </div>
        )
      } else if (data.type === "audio") {
        return (
          <div className="chat-content chat-content-audio">
            <AudioComponent
              src={`/modules/chat/${selectedUser.chat.id}/other/${data.file}`}
            />
            {!_.isEmpty(chat.react) &&
              index2 === chat.file.length - 1 &&
              renderHasReaction(chat)}
          </div>
        )
      } else {
        return (
          <div className={`chat-content chat-content-file ${className}`}>
            <DownloadFile
              className="align-items-center"
              src={`/modules/chat/${selectedUser.chat.id}/other/${data.file}`}
              fileName={data.file}>
              <Badge color="light-secondary" pill>
                <Link2 size={12} />
                <span className="align-middle ms-50">{data.file}</span>
              </Badge>
            </DownloadFile>
            <p className="time">{formatTime(chat.time)}</p>
            {!_.isEmpty(chat.react) &&
              index2 === chat.file.length - 1 &&
              renderHasReaction(chat)}
          </div>
        )
      }
    }

    const renderMessage = (data) => {
      if (data.type === "text") {
        return (
          <>
            <p className="text">{data.msg}</p>
            <p className="time">{formatTime(data.time)}</p>
          </>
        )
      } else {
        if (data.status === "loading") {
          if (data.type === "image" || data.type === "image_gif") {
            return (
              <>
                {useFormatMessage("modules.chat.text.sending")} image...{" "}
                <Spinner size="sm" />
              </>
            )
          }
          if (data.type === "video") {
            return (
              <>
                {useFormatMessage("modules.chat.text.sending")} video...{" "}
                <Spinner size="sm" />
              </>
            )
          }
          if (data.type === "audio") {
            return (
              <>
                {useFormatMessage("modules.chat.text.sending")} audio...{" "}
                <Spinner size="sm" />
              </>
            )
          }
          if (data.type === "file") {
            return (
              <>
                {useFormatMessage("modules.chat.text.sending")} file...{" "}
                <Spinner size="sm" />
              </>
            )
          } else {
            return (
              <>
                {useFormatMessage("modules.chat.text.sending")}...{" "}
                <Spinner size="sm" />
              </>
            )
          }
        } else if (data.status === "error") {
          if (data.type === "image" || data.type === "image_gif") {
            return (
              <p>Image {useFormatMessage("modules.chat.text.sent_error")}</p>
            )
          }
          if (data.type === "video") {
            return (
              <p>Video {useFormatMessage("modules.chat.text.sent_error")}</p>
            )
          }
          if (data.type === "audio") {
            return (
              <p>Audio {useFormatMessage("modules.chat.text.sent_error")}</p>
            )
          }
          if (data.type === "file") {
            return (
              <p>File {useFormatMessage("modules.chat.text.sent_error")}</p>
            )
          } else {
            return <p>{useFormatMessage("modules.chat.text.sent_error")}</p>
          }
        } else {
          return <p>{data.msg}</p>
        }
      }
    }

    return formattedChatData().map((item, index) => {
      const renderChatContent = (chat, className) => {
        if (
          chat.type === "text" ||
          chat.status === "loading" ||
          chat.status === "error"
        ) {
          return (
            <div className={`chat-content ${className}`}>
              {renderMessage(chat)}
              {!_.isEmpty(chat.react) && renderHasReaction(chat)}
            </div>
          )
        } else if (chat.type === "gif") {
          return (
            <div key={index} className={`chat-content chat-content-gif`}>
              <img src={chat.msg} />
              {!_.isEmpty(chat.react) && renderHasReaction(chat)}
            </div>
          )
        } else if (chat.type === "image" || chat.type === "image_gif") {
          return (
            <div key={index} className={`chat-content chat-content-img`}>
              <Image.PreviewGroup>
                {_.map(chat.file, (val, index2) => {
                  return (
                    <Photo
                      key={index2}
                      src={`/modules/chat/${selectedUser.chat.id}/other/${val.file}`}
                    />
                  )
                })}
              </Image.PreviewGroup>
              {!_.isEmpty(chat.react) && renderHasReaction(chat)}
            </div>
          )
        } else {
          return _.map(chat.file, (val, index2) => {
            return (
              <Fragment key={index2}>
                {renderFile(val, className, chat, index2)}
              </Fragment>
            )
          })
        }
      }

      const renderReaction = (chat) => {
        let key_react_user = -1
        if (chat.react) {
          key_react_user = chat.react.findIndex(
            (item_react) => !_.isUndefined(item_react[userId])
          )
        }
        const items_react = [
          {
            key: "1",
            label: (
              <>
                {_.map(reaction, (val_react, index_react) => {
                  let key_react = -1
                  if (key_react_user > -1) {
                    if (chat.react) {
                      key_react = chat.react.findIndex(
                        (item_react) => item_react[userId] === val_react.value
                      )
                    }
                  }

                  return (
                    <button
                      key={index_react}
                      className={`react_icon ${key_react > -1 ? "active" : ""}`}
                      onClick={(e) => {
                        if (key_react > -1) {
                          updateMessage(selectedUser.chat.id, chat.time, {
                            react: arrayRemove({ [userId]: val_react.value })
                          })
                        } else {
                          if (key_react_user > -1) {
                            updateMessage(selectedUser.chat.id, chat.time, {
                              react: arrayRemove(
                                ..._.map(
                                  _.filter(
                                    reaction,
                                    (val_react_remove_filter) => {
                                      return (
                                        val_react.value !==
                                        val_react_remove_filter.value
                                      )
                                    }
                                  ),
                                  (val_react_remove) => {
                                    return { [userId]: val_react_remove.value }
                                  }
                                )
                              )
                            })
                          }
                          updateMessage(selectedUser.chat.id, chat.time, {
                            react: arrayUnion({ [userId]: val_react.value })
                          })
                        }
                      }}>
                      {val_react.label}
                    </button>
                  )
                })}
              </>
            )
          }
        ]

        const items_more = [
          {
            key: "1",
            label: (
              <>
                <a
                  href=""
                  className="react_more"
                  onClick={(e) => {
                    e.preventDefault()
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none">
                    <path
                      d="M10.9463 10.6667L15.4243 6.00008L10.9463 1.33341"
                      stroke="#14142B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.4243 6L10.7576 6C5.97118 6 2.09098 9.8802 2.09098 14.6667V14.6667"
                      stroke="#14142B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{useFormatMessage("modules.chat.text.forward")}</span>
                </a>
              </>
            )
          },
          {
            key: "2",
            label: (
              <>
                <a
                  href=""
                  className="react_more"
                  onClick={(e) => {
                    e.preventDefault()
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none">
                    <path
                      d="M13.5077 10.05V12.3C13.5077 15.3 12.3077 16.5 9.30769 16.5H6.45769C3.45769 16.5 2.25769 15.3 2.25769 12.3V9.45C2.25769 6.45 3.45769 5.25 6.45769 5.25H8.70769"
                      stroke="#292D32"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.5076 10.05H11.1076C9.30764 10.05 8.70764 9.45 8.70764 7.65V5.25L13.5076 10.05Z"
                      stroke="#292D32"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.45764 1.5H12.4576"
                      stroke="#292D32"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.00769 3.75C6.00769 2.505 7.01269 1.5 8.25769 1.5H10.2227"
                      stroke="#292D32"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.2576 6V10.6425C17.2576 11.805 16.3126 12.75 15.1501 12.75"
                      stroke="#292D32"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.2577 6H15.0077C13.3202 6 12.7577 5.4375 12.7577 3.75V1.5L17.2577 6Z"
                      stroke="#292D32"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{useFormatMessage("modules.chat.text.copy_text")}</span>
                </a>
              </>
            )
          }
        ]

        return (
          <div className="chat-content-reaction">
            <Dropdown
              overlay={<Menu items={items_react} />}
              placement="top"
              trigger={["click"]}
              overlayClassName="chat-content-reaction-dropdown-react"
              arrow={{
                pointAtCenter: true
              }}>
              <svg
                className="reaction"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none">
                <g clipPath="url(#clip0_885_2584)">
                  <circle
                    cx="9"
                    cy="9"
                    r="8.25"
                    stroke="#C3C3C6"
                    strokeWidth="2"
                  />
                  <path
                    d="M6 11.25C6 11.25 7.28571 12.375 9 12.375C10.7143 12.375 12 11.25 12 11.25"
                    stroke="#C3C3C6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6.75H6.1875"
                    stroke="#C3C3C6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 6.75H12.1875"
                    stroke="#C3C3C6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_885_2584">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Dropdown>

            <Tooltip title={useFormatMessage("modules.chat.text.reply")}>
              <svg
                className="reaction"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none">
                <path
                  d="M8.97989 7.14725V5.68975C8.97989 4.87392 7.98989 4.46142 7.41239 5.03892L3.20489 9.24642C2.84739 9.60392 2.84739 10.1814 3.20489 10.5389L7.41239 14.7464C7.98989 15.3239 8.97989 14.9206 8.97989 14.1048V12.5556C13.5632 12.5556 16.7716 14.0223 19.0632 17.2306C18.1466 12.6473 15.3966 8.06392 8.97989 7.14725Z"
                  fill="#C3C3C6"
                />
              </svg>
            </Tooltip>

            <Dropdown
              overlay={<Menu items={items_more} />}
              placement="top"
              trigger={["click"]}
              overlayClassName="chat-content-reaction-dropdown-more"
              arrow={{
                pointAtCenter: true
              }}>
              <svg
                className="reaction"
                xmlns="http://www.w3.org/2000/svg"
                width="3"
                height="14"
                viewBox="0 0 3 14"
                fill="none">
                <path
                  d="M2.54545 1.27273C2.54545 1.97564 1.97563 2.54545 1.27273 2.54545C0.569819 2.54545 0 1.97564 0 1.27273C0 0.569819 0.569819 0 1.27273 0C1.97563 0 2.54545 0.569819 2.54545 1.27273Z"
                  fill="#C3C3C6"
                />
                <path
                  d="M2.54545 7C2.54545 7.70291 1.97563 8.27273 1.27273 8.27273C0.569819 8.27273 0 7.70291 0 7C0 6.29709 0.569819 5.72727 1.27273 5.72727C1.97563 5.72727 2.54545 6.29709 2.54545 7Z"
                  fill="#C3C3C6"
                />
                <path
                  d="M2.54545 12.7273C2.54545 13.4302 1.97563 14 1.27273 14C0.569819 14 0 13.4302 0 12.7273C0 12.0244 0.569819 11.4545 1.27273 11.4545C1.97563 11.4545 2.54545 12.0244 2.54545 12.7273Z"
                  fill="#C3C3C6"
                />
              </svg>
            </Dropdown>
          </div>
        )
      }

      const index_avatar = dataEmployees.findIndex(
        (item_employee) => item_employee.id === item.senderId
      )
      let _avatar = ""
      if (index_avatar > -1) {
        _avatar = dataEmployees[index_avatar].avatar
      }

      return (
        <div
          key={index}
          className={classnames("chat", {
            "chat-left": item.senderId !== userId
          })}>
          <div className="chat-avatar">
            <Avatar
              imgWidth={36}
              imgHeight={36}
              className="box-shadow-1 cursor-pointer"
              src={_avatar}
            />
          </div>

          <div className="chat-body">
            {item.messages.map((chat, index) => {
              return (
                <div
                  key={index}
                  className={`chat-content-parent ${
                    !_.isEmpty(chat.react) ? "has-reaction" : ""
                  }`}>
                  {item.senderId === userId && renderReaction(chat)}
                  {renderChatContent(
                    chat,
                    item.messages.length > 1
                      ? index === 0
                        ? "chat-content-first"
                        : index === item.messages.length - 1
                        ? "chat-content-last"
                        : "chat-content-middle"
                      : "chat-content-one"
                  )}
                  {item.senderId !== userId && renderReaction(chat)}
                </div>
              )
            })}
          </div>
        </div>
      )
    })
  }
  return renderChats()
}

export default ChatMessage
