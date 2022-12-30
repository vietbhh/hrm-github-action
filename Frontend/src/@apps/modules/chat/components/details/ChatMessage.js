import { Fragment } from "react"

import Avatar from "@apps/modules/download/pages/Avatar"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import AudioComponent from "./Audio"
import Photo from "./Photo"
import VideoComponent from "./Video"

import classnames from "classnames"
import { Link2 } from "react-feather"
import ReactHtmlParser from "react-html-parser"

import { useFormatMessage } from "@apps/utility/common"
import { Dropdown, Image, Tooltip } from "antd"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { Badge, Spinner } from "reactstrap"
import { formatTime, highlightText } from "../../common/common"

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
    updateMessage,
    userSidebarRight,
    windowWidth,
    setUserSidebarRight,
    dataEmployees,
    setReplying,
    focusInputMsg,
    toggleModalForward,
    setDataForward,
    scrollToMessage,
    search_message_highlight_timestamp,
    search_message_highlight_text_search,
    dataChatScrollBottom,
    checkShowDataChat,
    handleHeight
  } = props
  const { userProfile, selectedUser, groups } = store

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
      //chatLog = chats
      if (checkShowDataChat) {
        chatLog = [...chatHistory, ...dataChatScrollBottom, ...chats]
      } else {
        chatLog = [...chatHistory, ...dataChatScrollBottom]
      }
    }

    const index_groups = groups.findIndex((item) => item.id === active)
    let unseen_detail = []
    let user_list = []
    let unseen_list = []
    if (index_groups !== -1) {
      unseen_detail = groups[index_groups].chat.unseen_detail
      user_list = groups[index_groups].user
      unseen_list = groups[index_groups].chat.unseen
    }

    const detail = {}
    _.forEach(user_list, (value) => {
      const index_unseen_detail = unseen_detail.findIndex(
        (item) => item.user_id === value
      )
      if (index_unseen_detail !== -1) {
        detail[value] = unseen_detail[index_unseen_detail]
      } else {
        detail[value] = {
          timestamp_from: 0,
          timestamp_to: 0,
          unread_count: 0,
          user_id: value
        }
      }
    })

    const formattedChatLog = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg, index) => {
      const seen = []
      _.forEach(detail, (value) => {
        if (
          value.user_id !== msg.senderId &&
          (value.timestamp_from === 0 || msg.time < value.timestamp_from)
        ) {
          seen.push(value.user_id)
        }
      })
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          msg: msg.message,
          time: msg.time,
          seen: seen,
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
              seen: seen,
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
      if (!_.isEmpty(chat.react)) {
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
                        <span className="ms-auto">
                          {handleGetReaction(val)}
                        </span>
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
            menu={{ items: renderItemReactionDropdown(chat.react, chat.time) }}
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

      return ""
    }

    const renderReply = (chat) => {
      if (!_.isEmpty(chat.reply)) {
        let reply_from = ""
        let reply_to = ""
        let reply_content = ""
        if (chat.senderId === userId) {
          reply_from = useFormatMessage("modules.chat.text.you")
        } else {
          const index_employee = dataEmployees.findIndex(
            (item_employee) => item_employee.id === chat.senderId
          )
          if (index_employee > -1) {
            reply_from = dataEmployees[index_employee].full_name
          }
        }
        if (chat.senderId === userId) {
          if (chat.reply.replying_user_id === userId) {
            reply_to = useFormatMessage("modules.chat.text.your_self")
          } else {
            const index_employee = dataEmployees.findIndex(
              (item_employee) =>
                item_employee.id === chat.reply.replying_user_id
            )
            if (index_employee > -1) {
              reply_to = dataEmployees[index_employee].full_name
            }
          }
        } else {
          if (chat.reply.replying_user_id === userId) {
            reply_to = useFormatMessage("modules.chat.text.you_")
          } else if (chat.reply.replying_user_id === chat.senderId) {
            reply_to = useFormatMessage("modules.chat.text.your_self")
          } else {
            const index_employee = dataEmployees.findIndex(
              (item_employee) =>
                item_employee.id === chat.reply.replying_user_id
            )
            if (index_employee > -1) {
              reply_to = dataEmployees[index_employee].full_name
            }
          }
        }
        if (chat.reply.replying_type === "text") {
          reply_content = chat.reply.replying_message
        } else if (chat.reply.replying_type === "image") {
          reply_content = (
            <Photo
              className="chat-img"
              src={`/modules/chat/${
                chat.reply.replying_forward_id !== ""
                  ? chat.reply.replying_forward_id
                  : selectedUser.chat.id
              }/other/${chat.reply.replying_file}`}
            />
          )
        } else if (
          chat.reply.replying_type === "image_gif" ||
          chat.reply.replying_type === "gif"
        ) {
          reply_content = "image gif"
        } else {
          reply_content = chat.reply.replying_type
        }
        return (
          <div className="chat-content-reply">
            <div
              className="chat-content-reply-content"
              onClick={() => {
                scrollToMessage(
                  chat.reply.replying_timestamp,
                  selectedUser.chat.id
                )
              }}>
              <div className="chat-content-reply-title mb-25">
                <svg
                  className="me-25"
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
                {reply_from} {useFormatMessage("modules.chat.text.replied_to")}{" "}
                {reply_to}
              </div>
              <div className="chat-content-reply-text chat-content-img">
                {reply_content}
              </div>
            </div>
          </div>
        )
      }

      return ""
    }

    const renderSenderName = (chat, index_message) => {
      if (
        selectedUser.contact.type === "group" &&
        chat.senderId !== userId &&
        index_message === 0
      ) {
        const index_employee = dataEmployees.findIndex(
          (item_employee) => item_employee.id === chat.senderId
        )
        let senderName = ""
        if (index_employee > -1) {
          senderName = dataEmployees[index_employee].full_name
        }

        return <p className="text-sender-name">{senderName}</p>
      }

      return ""
    }

    const renderFile = (data, className, chat, index2, index_message) => {
      if (data.type === "image" || data.type === "image_gif") {
        return (
          <>
            <div className="chat-content-sender-name">
              {renderSenderName(chat, index_message)}
              <div className="chat-content chat-content-img">
                <Photo
                  className="chat-img"
                  src={`/modules/chat/${
                    data?.forward?.forward_id_from
                      ? data?.forward?.forward_id_from
                      : selectedUser.chat.id
                  }/other/${data.file}`}
                />
                {index2 === chat.file.length - 1 && renderHasReaction(chat)}
              </div>
            </div>
          </>
        )
      } else if (data.type === "video") {
        return (
          <div className="chat-content-sender-name">
            {renderSenderName(chat, index_message)}
            <div className="chat-content chat-content-video">
              <VideoComponent
                src={`/modules/chat/${
                  data?.forward?.forward_id_from
                    ? data?.forward?.forward_id_from
                    : selectedUser.chat.id
                }/other/${data.file}`}
              />
              {index2 === chat.file.length - 1 && renderHasReaction(chat)}
            </div>
          </div>
        )
      } else if (data.type === "audio") {
        return (
          <div className="chat-content-sender-name">
            {renderSenderName(chat, index_message)}
            <div className="chat-content chat-content-audio">
              <AudioComponent
                src={`/modules/chat/${
                  data?.forward?.forward_id_from
                    ? data?.forward?.forward_id_from
                    : selectedUser.chat.id
                }/other/${data.file}`}
              />
              {index2 === chat.file.length - 1 && renderHasReaction(chat)}
            </div>
          </div>
        )
      } else {
        return (
          <div
            className={`chat-content chat-content-file ${className} ${
              chat.seen.length > 0 && chat.senderId === userId ? "has-seen" : ""
            }`}>
            {renderSenderName(chat, index_message)}
            <DownloadFile
              className="align-items-center"
              src={`/modules/chat/${
                data?.forward?.forward_id_from
                  ? data?.forward?.forward_id_from
                  : selectedUser.chat.id
              }/other/${data.file}`}
              fileName={data.file}>
              <Badge color="light-secondary" pill>
                <Link2 size={12} />
                <span className="align-middle ms-50">{data.file}</span>
              </Badge>
            </DownloadFile>
            <p className="time">
              {formatTime(chat.time)}
              {chat.seen.length > 0 && chat.senderId === userId && (
                <svg
                  className="ms-25"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none">
                  <path
                    d="M15.1056 4.16496C15.3827 4.40741 15.4108 4.82859 15.1683 5.10568L9.33501 11.7723C9.21537 11.9091 9.0451 11.9911 8.8636 11.9993C8.6821 12.0076 8.50509 11.9414 8.37352 11.8161L6.69527 10.2178L5.33501 11.7723C5.21537 11.9091 5.0451 11.9911 4.8636 11.9993C4.6821 12.0076 4.50509 11.9414 4.37352 11.8161L0.873524 8.48277C0.606904 8.22884 0.596611 7.80686 0.850535 7.54024C1.10446 7.27362 1.52644 7.26333 1.79306 7.51725L4.7895 10.371L5.72889 9.29741L4.87352 8.48277C4.6069 8.22884 4.59661 7.80686 4.85054 7.54024C5.10446 7.27362 5.52644 7.26333 5.79306 7.51725L8.7895 10.371L14.1649 4.22767C14.4074 3.95058 14.8285 3.9225 15.1056 4.16496Z"
                    fill="white"
                  />
                  <path
                    d="M11.1683 5.10568C11.4108 4.82859 11.3827 4.40741 11.1056 4.16496C10.8285 3.9225 10.4074 3.95058 10.1649 4.22767L7.83158 6.89434C7.58912 7.17143 7.6172 7.59261 7.89429 7.83506C8.17138 8.07752 8.59256 8.04944 8.83501 7.77235L11.1683 5.10568Z"
                    fill="white"
                  />
                </svg>
              )}
            </p>
            {index2 === chat.file.length - 1 && renderHasReaction(chat)}
          </div>
        )
      }
    }

    const renderMessage = (data) => {
      if (data.type === "text") {
        return (
          <>
            <p
              className={`text ${
                data.seen.length > 0 && data.senderId === userId
                  ? "has-seen"
                  : ""
              }`}>
              {search_message_highlight_timestamp === data.time
                ? ReactHtmlParser(
                    highlightText(
                      data.msg,
                      search_message_highlight_text_search
                    )
                  )
                : ReactHtmlParser(data.msg)}
            </p>
            <p className="time">
              {formatTime(data.time)}
              {data.seen.length > 0 && data.senderId === userId && (
                <svg
                  className="ms-25"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none">
                  <path
                    d="M15.1056 4.16496C15.3827 4.40741 15.4108 4.82859 15.1683 5.10568L9.33501 11.7723C9.21537 11.9091 9.0451 11.9911 8.8636 11.9993C8.6821 12.0076 8.50509 11.9414 8.37352 11.8161L6.69527 10.2178L5.33501 11.7723C5.21537 11.9091 5.0451 11.9911 4.8636 11.9993C4.6821 12.0076 4.50509 11.9414 4.37352 11.8161L0.873524 8.48277C0.606904 8.22884 0.596611 7.80686 0.850535 7.54024C1.10446 7.27362 1.52644 7.26333 1.79306 7.51725L4.7895 10.371L5.72889 9.29741L4.87352 8.48277C4.6069 8.22884 4.59661 7.80686 4.85054 7.54024C5.10446 7.27362 5.52644 7.26333 5.79306 7.51725L8.7895 10.371L14.1649 4.22767C14.4074 3.95058 14.8285 3.9225 15.1056 4.16496Z"
                    fill="white"
                  />
                  <path
                    d="M11.1683 5.10568C11.4108 4.82859 11.3827 4.40741 11.1056 4.16496C10.8285 3.9225 10.4074 3.95058 10.1649 4.22767L7.83158 6.89434C7.58912 7.17143 7.6172 7.59261 7.89429 7.83506C8.17138 8.07752 8.59256 8.04944 8.83501 7.77235L11.1683 5.10568Z"
                    fill="white"
                  />
                </svg>
              )}
            </p>
          </>
        )
      } else if (data.type === "link") {
        const messageLink = data.msg.replace(
          /(?:https?|ftp):\/\/[\n\S]+/g,
          function (url) {
            return '<a href="' + url + '" target="_blank">' + url + "</a>"
          }
        )
        return (
          <>
            <p
              className={`text ${
                data.seen.length > 0 && data.senderId === userId
                  ? "has-seen"
                  : ""
              }`}>
              {ReactHtmlParser(messageLink)}
            </p>
            <p className="time">
              {formatTime(data.time)}
              {data.seen.length > 0 && data.senderId === userId && (
                <svg
                  className="ms-25"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none">
                  <path
                    d="M15.1056 4.16496C15.3827 4.40741 15.4108 4.82859 15.1683 5.10568L9.33501 11.7723C9.21537 11.9091 9.0451 11.9911 8.8636 11.9993C8.6821 12.0076 8.50509 11.9414 8.37352 11.8161L6.69527 10.2178L5.33501 11.7723C5.21537 11.9091 5.0451 11.9911 4.8636 11.9993C4.6821 12.0076 4.50509 11.9414 4.37352 11.8161L0.873524 8.48277C0.606904 8.22884 0.596611 7.80686 0.850535 7.54024C1.10446 7.27362 1.52644 7.26333 1.79306 7.51725L4.7895 10.371L5.72889 9.29741L4.87352 8.48277C4.6069 8.22884 4.59661 7.80686 4.85054 7.54024C5.10446 7.27362 5.52644 7.26333 5.79306 7.51725L8.7895 10.371L14.1649 4.22767C14.4074 3.95058 14.8285 3.9225 15.1056 4.16496Z"
                    fill="white"
                  />
                  <path
                    d="M11.1683 5.10568C11.4108 4.82859 11.3827 4.40741 11.1056 4.16496C10.8285 3.9225 10.4074 3.95058 10.1649 4.22767L7.83158 6.89434C7.58912 7.17143 7.6172 7.59261 7.89429 7.83506C8.17138 8.07752 8.59256 8.04944 8.83501 7.77235L11.1683 5.10568Z"
                    fill="white"
                  />
                </svg>
              )}
            </p>
          </>
        )
      } else {
        if (data.status === "loading") {
          return (
            <span>
              {useFormatMessage("modules.chat.text.sending")} {data.type}...
              <Spinner size="sm" className="ms-50" />
            </span>
          )
        } else if (data.status === "error") {
          return (
            <p>
              {data.type} {useFormatMessage("modules.chat.text.sent_error")}
            </p>
          )
        } else {
          return <p>{data.msg}</p>
        }
      }
    }

    return formattedChatData().map((item, index) => {
      const renderChatContent = (chat, className, index_message) => {
        if (
          chat.type === "text" ||
          chat.type === "link" ||
          chat.status === "loading" ||
          chat.status === "error"
        ) {
          return (
            <div className={`chat-content ${className}`}>
              {renderSenderName(chat, index_message)}
              {renderMessage(chat)}
              {renderHasReaction(chat)}
            </div>
          )
        } else if (chat.type === "gif") {
          return (
            <div key={index} className="chat-content-sender-name">
              {renderSenderName(chat, index_message)}
              <div className={`chat-content chat-content-gif`}>
                <img src={chat.msg} />
                {renderHasReaction(chat)}
              </div>
            </div>
          )
        } else if (chat.type === "image" || chat.type === "image_gif") {
          return (
            <Fragment key={index}>
              <div className="chat-content-sender-name">
                {renderSenderName(chat, index_message)}
                <div className={`chat-content chat-content-img`}>
                  <Image.PreviewGroup>
                    {_.map(chat.file, (val, index2) => {
                      return (
                        <Photo
                          key={index2}
                          src={`/modules/chat/${
                            chat?.forward?.forward_id_from
                              ? chat?.forward?.forward_id_from
                              : selectedUser.chat.id
                          }/other/${val.file}`}
                        />
                      )
                    })}
                  </Image.PreviewGroup>
                  {renderHasReaction(chat)}
                </div>
              </div>
            </Fragment>
          )
        } else {
          return _.map(chat.file, (val, index2) => {
            return (
              <Fragment key={index2}>
                {renderFile(val, className, chat, index2, index_message)}
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

        const items_seen = [
          ..._.map(
            _.filter(chat.seen, (val_filter) => {
              return chat.senderId === userId
                ? val_filter !== chat.senderId
                : true
            }),
            (val_map, index_map) => {
              const index_employee = dataEmployees.findIndex(
                (item_employee) => item_employee.id === val_map
              )
              let avatar = ""
              let fullName = ""
              if (index_employee > -1) {
                avatar = dataEmployees[index_employee].avatar
                fullName = dataEmployees[index_employee].full_name
              }
              return {
                key: `more-${index_map}`,
                label: (
                  <Fragment>
                    <Avatar
                      imgWidth={24}
                      imgHeight={24}
                      className="box-shadow-1 cursor-pointer"
                      src={avatar}
                    />
                    <span className="ms-1 me-1">{fullName}</span>
                  </Fragment>
                )
              }
            }
          )
        ]

        let items_more = [
          {
            key: "1",
            label: (
              <>
                <a
                  href=""
                  className="react_more"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleModalForward()
                    setDataForward({
                      message: chat.message,
                      type: chat.type,
                      status: "success",
                      contact_id: "",
                      file:
                        chat.type === "text" || chat.type === "gif"
                          ? []
                          : chat.file,
                      forward: {
                        forward_user_id_from: chat.senderId,
                        forward_id_from: chat?.forward?.forward_id_from
                          ? chat?.forward?.forward_id_from
                          : selectedUser.chat.id
                      }
                    })
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
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
                    navigator.clipboard.writeText(chat.msg)
                    focusInputMsg()
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
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

        if (chat.senderId === userId) {
          items_more = [
            ...items_more,
            {
              type: "divider"
            },
            {
              key: "3",
              label: (
                <div className="react_more">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none">
                    <path
                      d="M15.1056 4.16496C15.3827 4.40741 15.4108 4.82859 15.1683 5.10568L9.33501 11.7723C9.21537 11.9091 9.0451 11.9911 8.8636 11.9993C8.6821 12.0076 8.50509 11.9414 8.37352 11.8161L6.69527 10.2178L5.33501 11.7723C5.21537 11.9091 5.0451 11.9911 4.8636 11.9993C4.6821 12.0076 4.50509 11.9414 4.37352 11.8161L0.873524 8.48277C0.606904 8.22884 0.596611 7.80686 0.850535 7.54024C1.10446 7.27362 1.52644 7.26333 1.79306 7.51725L4.7895 10.371L5.72889 9.29741L4.87352 8.48277C4.6069 8.22884 4.59661 7.80686 4.85054 7.54024C5.10446 7.27362 5.52644 7.26333 5.79306 7.51725L8.7895 10.371L14.1649 4.22767C14.4074 3.95058 14.8285 3.9225 15.1056 4.16496Z"
                      fill="#292D32"
                    />
                    <path
                      d="M11.1683 5.10568C11.4108 4.82859 11.3827 4.40741 11.1056 4.16496C10.8285 3.9225 10.4074 3.95058 10.1649 4.22767L7.83158 6.89434C7.58912 7.17143 7.6172 7.59261 7.89429 7.83506C8.17138 8.07752 8.59256 8.04944 8.83501 7.77235L11.1683 5.10568Z"
                      fill="#292D32"
                    />
                  </svg>
                  <span>
                    {chat.seen.length}{" "}
                    {useFormatMessage("modules.chat.text.seen")}
                  </span>
                </div>
              ),
              children: items_seen
            }
          ]
        }

        return (
          <div className="chat-content-reaction">
            <Dropdown
              menu={{ items: items_react }}
              placement="top"
              trigger={["hover"]}
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
                onClick={() => {
                  let message = chat.message
                  const mapObj = {
                    "<br>": " "
                  }
                  message = message.replace(/<br>/gi, function (matched) {
                    return mapObj[matched]
                  })
                  setReplying({
                    replying: true,
                    replying_message: message,
                    replying_type: chat.type,
                    replying_timestamp: chat.time,
                    replying_file: !_.isEmpty(chat.file)
                      ? chat.file[0].file
                      : "",
                    replying_user_id: chat.senderId,
                    replying_forward_id: chat?.forward?.forward_id_from
                      ? chat?.forward?.forward_id_from
                      : ""
                  })
                  //focusInputMsg()

                  handleHeight(true, false)
                }}
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
              menu={{ items: items_more }}
              placement="top"
              trigger={["hover"]}
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
          {item.senderId !== userId && (
            <div className="chat-avatar">
              <Avatar
                imgWidth={36}
                imgHeight={36}
                className="box-shadow-1 cursor-pointer"
                src={_avatar}
              />
            </div>
          )}

          <div className="chat-body">
            {item.messages.map((chat, index) => {
              return (
                <div
                  key={index}
                  id={chat.time}
                  className={`chat-content-parent ${
                    !_.isEmpty(chat.react) ? "has-reaction" : ""
                  }`}>
                  {renderReply(chat)}
                  <div
                    className={`chat-content-message ${
                      !_.isEmpty(chat.reply) ? "has-reply" : ""
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
                        : "chat-content-one",
                      index
                    )}
                    {item.senderId !== userId && renderReaction(chat)}
                  </div>
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
