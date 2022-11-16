// ** React Imports
import { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"

// ** Custom Components
import Avatar from "@apps/modules/download/pages/Avatar"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import AudioComponent from "./Audio"
import EmotionsComponent from "./emotions/index"
import Photo from "./Photo"
import UpFile from "./UpFile"
import VideoComponent from "./Video"

// ** Third Party Components
import classnames from "classnames"
import {
  Link2,
  Menu,
  MessageSquare,
  MoreVertical,
  PhoneCall,
  Search,
  Send,
  Video
} from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"

// ** Reactstrap Imports
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage } from "@apps/utility/common"
import { Image } from "antd"
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
  UncontrolledDropdown
} from "reactstrap"

const ChatLog = (props) => {
  // ** Props & Store
  const {
    handleUser,
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
    updateMessage
  } = props
  const { userProfile, selectedUser } = store

  // ** State
  const [msg, setMsg] = useState("")
  const msgRef = useRef(null)

  const focusInputMsg = () => {
    msgRef.current.focus()
  }

  const scrollToMessage = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = 1000
  }

  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length
    if (selectedUserLen) {
      if (!_.isEmpty(chats)) {
        const chatContainer = ReactDOM.findDOMNode(chatArea.current)
        const senderId = chats.length > 0 ? chats[chats.length - 1].senderId : 0
        if (
          chatContainer.scrollHeight -
            chatContainer.scrollTop -
            chatContainer.clientHeight <=
            200 ||
          chatContainer.scrollTop === 0 ||
          senderId === userId
        ) {
          scrollToBottom()
        } else {
          handleUnSeenMessage(selectedUser.chat.id)
        }
      }
    }
    setMsg("")
  }, [selectedUser, loadingMessage, chats])

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
    const renderFile = (data) => {
      if (data.type === "image" || data.type === "image_gif") {
        return (
          <Photo
            className="chat-img"
            src={`/modules/chat/${selectedUser.chat.id}/other/${data.file}`}
          />
        )
      } else if (data.type === "video") {
        return (
          <VideoComponent
            src={`/modules/chat/${selectedUser.chat.id}/other/${data.file}`}
          />
        )
      } else if (data.type === "audio") {
        return (
          <AudioComponent
            src={`/modules/chat/${selectedUser.chat.id}/other/${data.file}`}
          />
        )
      } else {
        return (
          <DownloadFile
            className="align-items-center"
            src={`/modules/chat/${selectedUser.chat.id}/other/${data.file}`}
            fileName={data.file}>
            <Badge color="light-secondary" pill>
              <Link2 size={12} />
              <span className="align-middle ms-50">{data.file}</span>
            </Badge>
          </DownloadFile>
        )
      }
    }

    const renderMessage = (data) => {
      if (data.type === "text") {
        return <p>{data.msg}</p>
      } else if (data.type === "gif") {
        return <img className="chat-img" src={data.msg} />
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
          }
          return (
            <>
              {useFormatMessage("modules.chat.text.sending")}...{" "}
              <Spinner size="sm" />
            </>
          )
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
          }
          return <p>{useFormatMessage("modules.chat.text.sent_error")}</p>
        } else {
          if (data.type === "image" || data.type === "image_gif") {
            return (
              <div style={{ minHeight: "120px" }}>
                <Image.PreviewGroup>
                  {_.map(data.file, (val, index) => {
                    return (
                      <Photo
                        key={index}
                        className="chat-img"
                        src={`/modules/chat/${selectedUser.chat.id}/other/${val.file}`}
                      />
                    )
                  })}
                </Image.PreviewGroup>
              </div>
            )
          }
        }
      }
    }

    return formattedChatData().map((item, index) => {
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
              img={
                item.senderId === 11
                  ? userProfile.avatar
                  : selectedUser.contact.avatar
              }
            />
          </div>

          <div className="chat-body">
            {item.messages.map((chat, index) => {
              if (
                chat.type === "text" ||
                chat.type === "image" ||
                chat.type === "gif" ||
                chat.status === "loading" ||
                chat.status === "error"
              ) {
                return (
                  <div key={index} className="chat-content">
                    {renderMessage(chat)}
                  </div>
                )
              } else {
                return _.map(chat.file, (val, index2) => {
                  return (
                    <div key={index2} className="chat-content">
                      {renderFile(val)}
                    </div>
                  )
                })
              }
            })}
          </div>
        </div>
      )
    })
  }

  // ** Opens right sidebar & handles its data
  const handleAvatarClick = (obj) => {
    handleUserSidebarRight()
    handleUser(obj)
  }

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (
      !Object.keys(selectedUser).length &&
      !userSidebarLeft &&
      window.innerWidth < 992
    ) {
      handleSidebar()
    }
  }
  // ** Sends New Msg
  const handleSendMsg = (e) => {
    e.preventDefault()
    if (msg.trim().length) {
      sendMessage(selectedUser.chat.id, msg)
      setMsg("")
    }
  }

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper =
    Object.keys(selectedUser).length && selectedUser.chat
      ? PerfectScrollbar
      : "div"

  return (
    <>
      <div className="chat-app-window">
        <div
          className={classnames("start-chat-area", {
            "d-none": Object.keys(selectedUser).length
          })}>
          <div className="start-chat-icon mb-1">
            <MessageSquare />
          </div>
          <h4
            className="sidebar-toggle start-chat-text"
            onClick={handleStartConversation}>
            Start Conversation
          </h4>
        </div>
        {Object.keys(selectedUser).length ? (
          <div
            className={classnames("active-chat", {
              "d-none": selectedUser === null
            })}>
            <div className="chat-navbar">
              <header className="chat-header">
                <div className="d-flex align-items-center">
                  <div
                    className="sidebar-toggle d-block d-lg-none me-1"
                    onClick={handleSidebar}>
                    <Menu size={21} />
                  </div>
                  <Avatar
                    imgHeight="36"
                    imgWidth="36"
                    img={selectedUser.contact.avatar}
                    status={selectedUser.contact.status}
                    className="avatar-border user-profile-toggle m-0 me-1"
                    onClick={() => handleAvatarClick(selectedUser.contact)}
                  />
                  <h6 className="mb-0">{selectedUser.contact.fullName}</h6>
                </div>
                <div className="d-flex align-items-center">
                  <PhoneCall
                    size={18}
                    className="cursor-pointer d-sm-block d-none me-1"
                  />
                  <Video
                    size={18}
                    className="cursor-pointer d-sm-block d-none me-1"
                  />
                  <Search
                    size={18}
                    className="cursor-pointer d-sm-block d-none"
                  />
                  <UncontrolledDropdown className="more-options-dropdown">
                    <DropdownToggle
                      className="btn-icon"
                      color="transparent"
                      size="sm">
                      <MoreVertical size="18" />
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem
                        href="/"
                        onClick={(e) => e.preventDefault()}>
                        View Contact
                      </DropdownItem>
                      <DropdownItem
                        href="/"
                        onClick={(e) => e.preventDefault()}>
                        Mute Notifications
                      </DropdownItem>
                      <DropdownItem
                        href="/"
                        onClick={(e) => e.preventDefault()}>
                        Block Contact
                      </DropdownItem>
                      <DropdownItem
                        href="/"
                        onClick={(e) => e.preventDefault()}>
                        Clear Chat
                      </DropdownItem>
                      <DropdownItem
                        href="/"
                        onClick={(e) => e.preventDefault()}>
                        Report
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </header>
            </div>

            <ChatWrapper
              id="div-chats"
              onScrollY={(container) => {
                if (container.scrollTop === 0) {
                  getChatHistory(active)
                  if (hasMoreHistory === true) {
                    scrollToMessage()
                  }
                }
                if (
                  container.scrollHeight -
                    container.scrollTop -
                    container.clientHeight ===
                  0
                ) {
                  if (unread > 0) {
                    handleSeenMessage(selectedUser.chat.id)
                  }
                }
              }}
              ref={chatArea}
              className="user-chats"
              options={{ wheelPropagation: false }}>
              {loadingMessage && (
                <DefaultSpinner className="class-default-spinner" />
              )}
              {!loadingMessage && selectedUser.chat ? (
                <div className="chats">{renderChats()}</div>
              ) : null}
              {unread > 0 && (
                <div
                  className="scroll-top d-block"
                  style={{ right: "60px", bottom: "100px" }}>
                  <button
                    className="btn-icon btn btn-primary"
                    onClick={() => {
                      const chatContainer = ReactDOM.findDOMNode(
                        chatArea.current
                      )
                      chatContainer.scrollTo({
                        top: Number.MAX_SAFE_INTEGER
                      })
                    }}>
                    <i className="fa-sharp fa-solid fa-arrow-down"></i>
                  </button>
                  <Badge
                    pill
                    color="success"
                    className="badge-up"
                    style={{ right: "0.4rem" }}>
                    {unread && unread > 9 ? (
                      <>
                        9
                        <sup style={{ fontSize: "1rem", top: "-0.1rem" }}>
                          +
                        </sup>
                      </>
                    ) : (
                      unread
                    )}
                  </Badge>
                </div>
              )}
            </ChatWrapper>

            <Form className="chat-app-form" onSubmit={(e) => handleSendMsg(e)}>
              <InputGroup className="input-group-merge me-1 form-send-message">
                <InputGroupText>
                  <EmotionsComponent
                    setMsg={setMsg}
                    msg={msg}
                    sendMessage={sendMessage}
                    selectedUser={selectedUser}
                    focusInputMsg={focusInputMsg}
                  />
                </InputGroupText>
                <input
                  className="form-control"
                  ref={msgRef}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Type your message or use speech to text"
                />
                <InputGroupText>
                  <UpFile
                    updateMessage={updateMessage}
                    selectedUser={selectedUser}
                  />
                </InputGroupText>
              </InputGroup>

              <Button className="send" color="primary">
                <Send size={14} className="d-lg-none" />
                <span className="d-none d-lg-block">Send</span>
              </Button>
            </Form>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default ChatLog
