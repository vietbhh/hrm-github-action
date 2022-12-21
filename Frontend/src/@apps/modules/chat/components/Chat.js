// ** React Imports
import { Fragment, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"

// ** Custom Components
import Avatar from "@apps/modules/download/pages/Avatar"
import ChatMessage from "./details/ChatMessage"
import SearchMessage from "./details/SearchMessage"
import UpFile from "./details/UpFile"
import EmotionsComponent from "./emotions/index"
import ModalForward from "./modals/ModalForward"

// ** Third Party Components
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classnames from "classnames"
import { Menu as MenuIcon, MessageSquare, MoreVertical } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"

import { ErpInput } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import notification from "@apps/utility/notification"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Badge, InputGroup, InputGroupText } from "reactstrap"
import { ChatApi } from "../common/api"

const ChatLog = (props) => {
  // ** Props & Store
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
    queryLimit,
    checkAddMessage,
    setCheckAddMessage,
    handleSearchMessage,
    hasMoreChat,
    getChatScrollBottom
  } = props
  const { userProfile, selectedUser } = store

  // ** State
  const [state, setState] = useMergedState({
    replying: false,
    replying_message: "",
    replying_type: "",
    replying_timestamp: 0,
    replying_file: "",
    replying_user_id: "",
    replying_forward_id: "",
    modal_forward: false,
    data_forward: {},
    show_btn_to_bottom: false,
    status: "",

    // ** search message
    search_message_highlight_timestamp: 0,
    search_message_highlight_text_search: "",

    // ** file
    linkPreview: "",
    file: null,
    modal: false,
    compress_images: true
  })

  // ** redux
  const usersRedux = useSelector((state) => state.users)
  const onlineRedux = usersRedux.online
  useEffect(() => {
    if (selectedUser?.contact?.type === "group") {
      const online = _.filter(onlineRedux, (item) => {
        const index = selectedUser?.contact?.user.findIndex(
          (val) => val === item.id.toString()
        )
        return index > -1
      })
      const status = !_.isEmpty(online) ? "online" : "offline"
      setState({ status: status })
    } else {
      const online = _.filter(onlineRedux, (item) => {
        return item.id.toString() === selectedUser?.contact?.idEmployee
      })
      const status = !_.isEmpty(online) ? "online" : "offline"
      setState({ status: status })
    }
  }, [onlineRedux, selectedUser])

  // **
  const setSearchMessageHighlight = (timestamp, text_search) => {
    setState({
      search_message_highlight_timestamp: timestamp,
      search_message_highlight_text_search: text_search
    })
  }

  const setReplying = (data) => {
    setState(data)
  }
  const setReplyingDefault = () => {
    setState({
      replying: false,
      replying_message: "",
      replying_type: "",
      replying_timestamp: 0,
      replying_file: "",
      replying_user_id: "",
      replying_forward_id: ""
    })
  }
  const setDataForward = (data) => {
    setState({ data_forward: data })
  }

  const msgRef = useRef(null)
  const divChatRef = useRef(null)

  const focusInputMsg = () => {
    if (msgRef.current) {
      msgRef.current.focus()
    }
  }

  const scrollToTopAfterGetHistory = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = 800
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue, getValues, watch } = methods

  const setMsg = (msg) => {
    setValue("message", msg)
  }

  // ** listen esc
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setReplyingDefault()
      }
    }
    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])

  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length
    if (selectedUserLen && !_.isEmpty(chats)) {
      const chatContainer = ReactDOM.findDOMNode(chatArea.current)
      const senderId = chats.length > 0 ? chats[chats.length - 1].senderId : 0
      if (
        chatContainer.scrollHeight -
          chatContainer.scrollTop -
          chatContainer.clientHeight <=
          200 ||
        chatContainer.scrollTop === 0 ||
        (senderId === userId && checkAddMessage === true)
      ) {
        scrollToBottom()
        setCheckAddMessage(false)

        setTimeout(() => {
          scrollToBottom()
        }, 700)
      }
    }
  }, [selectedUser, loadingMessage, chats])

  // ** check show btn to bottom
  useEffect(() => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    if (
      unread > 0 &&
      chatContainer.scrollHeight -
        chatContainer.scrollTop -
        chatContainer.clientHeight >
        300
    ) {
      setState({ show_btn_to_bottom: true })
    }
  }, [unread])

  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length
    if (selectedUserLen) {
      if (windowWidth > 1366) {
        setUserSidebarRight(true)
      } else {
        setUserSidebarRight(false)
      }
    }

    setMsg("")
    setReplyingDefault()
    focusInputMsg()
  }, [selectedUser])

  // ** Opens right sidebar & handles its data
  const handleAvatarClick = (obj) => {
    handleUserSidebarRight()
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
  const handleSendMsg = (values) => {
    const msg = values.message
    if (loadingMessage) return
    if (msg.trim().length) {
      const reply = state.replying
        ? {
            reply: {
              replying_message: state.replying_message,
              replying_type: state.replying_type,
              replying_timestamp: state.replying_timestamp,
              replying_file: state.replying_file,
              replying_user_id: state.replying_user_id,
              replying_forward_id: state.replying_forward_id
            }
          }
        : {}

      // ** check message type link
      let dataAddLink = {}
      const arr_link = []
      msg.replace(/(?:https?|ftp):\/\/[\n\S]+/g, function (url) {
        arr_link.push({ file: url, type: "link" })
      })
      if (!_.isEmpty(arr_link)) {
        dataAddLink = { type: "link", file: arr_link }
      }
      const dataAdd = { ...reply, ...dataAddLink }

      sendMessage(selectedUser.chat.id, msg, dataAdd)
      setMsg("")
      setReplyingDefault()
    }
  }

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper =
    Object.keys(selectedUser).length && selectedUser.chat
      ? PerfectScrollbar
      : "div"

  const renderFormReply = () => {
    let replying_to = useFormatMessage("modules.chat.text.your_self")
    if (state.replying_user_id !== userId) {
      const index_employee = dataEmployees.findIndex(
        (item_employee) => item_employee.id === state.replying_user_id
      )
      if (index_employee > -1) {
        replying_to = dataEmployees[index_employee].full_name
      } else {
        replying_to = ""
      }
    }

    let replying_content = state.replying_message
    if (state.replying_type !== "text") {
      replying_content = state.replying_type
    }

    return (
      <>
        <div className="form-reply-title">
          <svg
            className="me-50"
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
          {useFormatMessage("modules.chat.text.replying_to")} {replying_to}
        </div>
        <div className="form-reply-content">{replying_content}</div>
      </>
    )
  }

  // ** scroll to bottom when replying
  useEffect(() => {
    if (state.replying) {
      const chatContainer = ReactDOM.findDOMNode(chatArea.current)
      if (
        chatContainer.scrollHeight -
          chatContainer.scrollTop -
          chatContainer.clientHeight <=
          150 ||
        chatContainer.scrollTop === 0
      ) {
        scrollToBottom()
      }
    }
  }, [state.replying])

  // ** toggle modal forward
  const toggleModalForward = () => {
    setState({ modal_forward: !state.modal_forward })
  }

  // ** drag drop copy file
  const toggleModalFile = () => {
    if (state.modal) {
      document.getElementById("attach-doc").value = null
    }
    setState({ modal: !state.modal })
  }

  const handleFile = (file) => {
    const _checkFile = []
    let dem_image = 0
    _.forEach(file, (val) => {
      const type = val.type
      let _checkType = "file"
      if (type.includes("image/")) {
        dem_image++
        _checkType = "image"
        if (type.includes("gif")) {
          dem_image--
          _checkType = "image_gif"
        }
      } else if (type.includes("video/")) {
        _checkType = "video"
      } else if (type.includes("audio/")) {
        _checkType = "audio"
      }
      _checkFile.push({ type: _checkType, file: val })
    })
    let file_type = "file"
    if (_checkFile.length === 1) {
      file_type = _checkFile[0].type
    } else {
      if (dem_image === _checkFile.length) {
        file_type = "image"
      }
    }

    return { file_type: file_type, arr_file: _checkFile }
  }

  const handleSaveFile = (file) => {
    const _file = handleFile(file)
    if (_file.file_type === "image") {
      handleSubmitSaveFile(_file.arr_file)
    } else {
      _.forEach(_file.arr_file, (val) => {
        handleSubmitSaveFile([val])
      })
    }
    setReplyingDefault()
  }

  const handleSubmitSaveFile = (file) => {
    const data = {
      groupId: selectedUser.chat.id,
      file: file,
      compress_images: state.compress_images,
      file_type: file[0].type
    }
    const timestamp = Date.now()
    updateMessage(selectedUser.chat.id, timestamp, {
      message: "",
      status: "loading",
      type: file[0].type,
      timestamp: timestamp,
      file: []
    })
    ChatApi.postUpFile(data)
      .then((res) => {
        document.getElementById("attach-doc").value = null
        updateMessage(selectedUser.chat.id, timestamp, {
          message: "",
          status: "success",
          type: file[0].type,
          timestamp: timestamp,
          file: res.data
        })
      })
      .catch((err) => {
        document.getElementById("attach-doc").value = null
        updateMessage(selectedUser.chat.id, timestamp, {
          message: "",
          status: "error",
          type: file[0].type,
          timestamp: timestamp,
          file: []
        })
        notification.showError({
          text: useFormatMessage("modules.chat.text.sent_error")
        })
      })
  }

  const handleChangeFile = (file) => {
    setState({ file: file })
    const _file = handleFile(file)

    if (_file.file_type === "image") {
      const _linkPreview = []
      _.forEach(file, (val) => {
        _linkPreview.push(URL.createObjectURL(val))
      })
      setState({ linkPreview: _linkPreview })
      toggleModalFile()
    } else {
      handleSaveFile(file)
    }
  }

  const changeFile = (e) => {
    if (!_.isUndefined(e.target.files[0])) {
      handleChangeFile(e.target.files)
    }
  }

  // ** listen paste image
  useEffect(() => {
    const handlePaste = (event) => {
      if (divChatRef.current && divChatRef.current.contains(event.target)) {
        const clipboardItems = event.clipboardData.items
        const items = [].slice.call(clipboardItems).filter(function (item) {
          // Filter the image items only
          return /^image\//.test(item.type)
        })
        if (items.length === 0) {
          return
        }
        const item = items[0]
        const file = [item.getAsFile()]
        const _linkPreview = []
        _.forEach(file, (val) => {
          _linkPreview.push(URL.createObjectURL(val))
        })
        setState({ file: file, linkPreview: _linkPreview })
        toggleModalFile()
      }
    }
    window.addEventListener("paste", handlePaste)

    return () => {
      window.removeEventListener("paste", handlePaste)
    }
  }, [divChatRef])

  // drag state
  const [dragActive, setDragActive] = useState(null)

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.effectAllowed === "copyLink") {
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else {
        setDragActive(false)
      }
    } else {
      setDragActive(false)
    }
  }

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleChangeFile(e.dataTransfer.files)
    }
  }

  return (
    <Fragment>
      <div ref={divChatRef} className="chat-app-window">
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
            {useFormatMessage("modules.chat.text.start_conversation")}
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
                    <MenuIcon size={21} />
                  </div>
                  <Avatar
                    imgHeight="36"
                    imgWidth="36"
                    src={selectedUser.contact.avatar}
                    userId={selectedUser.contact.idEmployee}
                    className="avatar-border user-profile-toggle m-0 me-1"
                    onClick={() => handleAvatarClick(selectedUser.contact)}
                  />
                  <div className="chat-header-name">
                    <h6
                      className="mb-0 cursor-pointer"
                      onClick={() => handleAvatarClick(selectedUser.contact)}>
                      {selectedUser.contact.fullName}
                    </h6>
                    <span
                      className={`chat-header-name-status ${
                        state.status === "offline" ? "status-offline" : ""
                      }`}>
                      {state.status}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <SearchMessage
                    handleSearchMessage={handleSearchMessage}
                    selectedUser={selectedUser}
                    setSearchMessageHighlight={setSearchMessageHighlight}
                    scrollToMessage={props.scrollToMessage}
                  />

                  <button className="chat-header-btn-border left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none">
                      <path
                        d="M6.90625 9.34375L5.75 10.5C5.50625 10.7438 5.11875 10.7438 4.86875 10.5063C4.8 10.4375 4.73125 10.375 4.6625 10.3063C4.01875 9.65625 3.4375 8.975 2.91875 8.2625C2.40625 7.55 1.99375 6.8375 1.69375 6.13125C1.4 5.41875 1.25 4.7375 1.25 4.0875C1.25 3.6625 1.325 3.25625 1.475 2.88125C1.625 2.5 1.8625 2.15 2.19375 1.8375C2.59375 1.44375 3.03125 1.25 3.49375 1.25C3.66875 1.25 3.84375 1.2875 4 1.3625C4.1625 1.4375 4.30625 1.55 4.41875 1.7125L5.86875 3.75625C5.98125 3.9125 6.0625 4.05625 6.11875 4.19375C6.175 4.325 6.20625 4.45625 6.20625 4.575C6.20625 4.725 6.1625 4.875 6.075 5.01875C5.99375 5.1625 5.875 5.3125 5.725 5.4625L5.25 5.95625C5.18125 6.025 5.15 6.10625 5.15 6.20625C5.15 6.25625 5.15625 6.3 5.16875 6.35C5.1875 6.4 5.20625 6.4375 5.21875 6.475C5.33125 6.68125 5.525 6.95 5.8 7.275C6.08125 7.6 6.38125 7.93125 6.70625 8.2625C6.76875 8.325 6.8375 8.3875 6.9 8.45C7.15 8.69375 7.15625 9.09375 6.90625 9.34375Z"
                        fill="white"
                      />
                      <path
                        d="M13.7312 11.4563C13.7312 11.6313 13.7 11.8125 13.6375 11.9875C13.6187 12.0375 13.6 12.0875 13.575 12.1375C13.4687 12.3625 13.3313 12.575 13.15 12.775C12.8438 13.1125 12.5062 13.3563 12.125 13.5125C12.1187 13.5125 12.1125 13.5188 12.1063 13.5188C11.7375 13.6688 11.3375 13.75 10.9062 13.75C10.2688 13.75 9.5875 13.6 8.86875 13.2938C8.15 12.9875 7.43125 12.575 6.71875 12.0563C6.475 11.875 6.23125 11.6938 6 11.5L8.04375 9.45627C8.21875 9.58752 8.375 9.68752 8.50625 9.75627C8.5375 9.76877 8.575 9.78752 8.61875 9.80627C8.66875 9.82502 8.71875 9.83127 8.775 9.83127C8.88125 9.83127 8.9625 9.79377 9.03125 9.72502L9.50625 9.25627C9.6625 9.10002 9.8125 8.98127 9.95625 8.90627C10.1 8.81877 10.2437 8.77502 10.4 8.77502C10.5187 8.77502 10.6437 8.80002 10.7812 8.85627C10.9187 8.91252 11.0625 8.99377 11.2188 9.10002L13.2875 10.5688C13.45 10.6813 13.5625 10.8125 13.6312 10.9688C13.6937 11.125 13.7312 11.2813 13.7312 11.4563Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  <button className="chat-header-btn-border right">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none">
                      <path
                        d="M13.2188 3.85625C12.9625 3.71875 12.425 3.575 11.6937 4.0875L10.775 4.7375C10.7063 2.79375 9.8625 2.03125 7.8125 2.03125H4.0625C1.925 2.03125 1.09375 2.8625 1.09375 5V10C1.09375 11.4375 1.875 12.9688 4.0625 12.9688H7.8125C9.8625 12.9688 10.7063 12.2063 10.775 10.2625L11.6937 10.9125C12.0812 11.1875 12.4187 11.275 12.6875 11.275C12.9187 11.275 13.1 11.2063 13.2188 11.1438C13.475 11.0125 13.9062 10.6562 13.9062 9.7625V5.2375C13.9062 4.34375 13.475 3.9875 13.2188 3.85625ZM6.875 7.1125C6.23125 7.1125 5.7 6.5875 5.7 5.9375C5.7 5.2875 6.23125 4.7625 6.875 4.7625C7.51875 4.7625 8.05 5.2875 8.05 5.9375C8.05 6.5875 7.51875 7.1125 6.875 7.1125Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  <button className={`btn-icon-more`}>
                    <MoreVertical size="28" className="icon-more" />
                  </button>
                </div>
              </header>
            </div>

            <div id="form-chat" onDragEnter={handleDrag}>
              <input
                type="file"
                hidden
                id="input-file-upload-chat"
                name="input-file-upload-chat"
                multiple={true}
                onClick={(e) => e.preventDefault()}
              />
              <label
                id="label-file-upload-chat"
                className={`${dragActive ? "drag-active" : ""}`}
                htmlFor="input-file-upload-chat">
                <ChatWrapper
                  id="div-chats"
                  onScrollY={(container) => {
                    if (chats.length >= queryLimit) {
                      if (container.scrollTop === 0) {
                        getChatHistory(active)
                        if (hasMoreHistory === true) {
                          scrollToTopAfterGetHistory()
                        }
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

                    // ** check show btn to bottom
                    if (
                      container.scrollHeight -
                        container.scrollTop -
                        container.clientHeight >
                      300
                    ) {
                      setState({ show_btn_to_bottom: true })
                    } else {
                      setState({ show_btn_to_bottom: false })
                    }

                    // ** hasMoreChat
                    if (
                      hasMoreChat === true &&
                      container.scrollHeight -
                        container.scrollTop -
                        container.clientHeight ===
                        0
                    ) {
                      getChatScrollBottom(active)
                    }
                  }}
                  ref={chatArea}
                  className={`user-chats ${state.replying ? "replying" : ""}`}
                  options={{ wheelPropagation: false }}>
                  {loadingMessage && (
                    <DefaultSpinner className="class-default-spinner" />
                  )}
                  {!loadingMessage && selectedUser.chat ? (
                    <div className="chats">
                      <ChatMessage
                        {...props}
                        setReplying={setReplying}
                        focusInputMsg={focusInputMsg}
                        toggleModalForward={toggleModalForward}
                        setDataForward={setDataForward}
                        search_message_highlight_timestamp={
                          state.search_message_highlight_timestamp
                        }
                        search_message_highlight_text_search={
                          state.search_message_highlight_text_search
                        }
                      />
                    </div>
                  ) : null}
                  {state.show_btn_to_bottom && (
                    <div className="scroll-top-chat">
                      <button
                        className="btn-icon btn btn-primary"
                        onClick={() => {
                          if (hasMoreChat === true) {
                            getChatScrollBottom(active, true)
                          } else {
                            const chatContainer = ReactDOM.findDOMNode(
                              chatArea.current
                            )
                            chatContainer.scrollTo({
                              top: Number.MAX_SAFE_INTEGER
                            })
                          }
                        }}>
                        <i className="fa-sharp fa-solid fa-arrow-down"></i>
                      </button>
                      {unread && unread > 0 ? (
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
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </ChatWrapper>
              </label>
              {dragActive && (
                <div
                  className="drag-file-element-chat"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}>
                  <span>
                    {useFormatMessage("modules.chat.text.drop_your_file_here")}
                  </span>
                </div>
              )}
            </div>

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(handleSendMsg)}
                className={`chat-app-form ${state.replying ? "replying" : ""}`}
                onDragEnter={handleDrag}>
                <input
                  type="file"
                  hidden
                  id="input-file-upload-chat-form"
                  name="input-file-upload-chat-form"
                  multiple={true}
                  onClick={(e) => e.preventDefault()}
                />
                <label
                  id="label-file-upload"
                  className={`${dragActive ? "drag-active" : ""}`}
                  htmlFor="input-file-upload-chat-form">
                  <InputGroup className="input-group-merge form-send-message">
                    <InputGroupText>
                      <EmotionsComponent
                        setMsg={setMsg}
                        getValues={getValues}
                        sendMessage={sendMessage}
                        selectedUser={selectedUser}
                        focusInputMsg={focusInputMsg}
                        setReplyingDefault={setReplyingDefault}
                      />
                    </InputGroupText>
                    {state.replying && (
                      <div className="form-reply">
                        <div className="form-reply-left">
                          {renderFormReply()}
                        </div>
                        <div className="form-reply-right">
                          <i
                            className="far fa-times form-reply-right-icon"
                            onClick={() => {
                              setReplyingDefault()
                              focusInputMsg()
                            }}></i>
                        </div>
                      </div>
                    )}
                    <ErpInput
                      innerRef={msgRef}
                      useForm={methods}
                      name="message"
                      defaultValue=""
                      placeholder="Type a message ..."
                      nolabel
                      autoComplete="off"
                    />
                    <InputGroupText>
                      <UpFile
                        selectedUser={selectedUser}
                        linkPreview={state.linkPreview}
                        file={state.file}
                        modal={state.modal}
                        compress_images={state.compress_images}
                        toggleModal={toggleModalFile}
                        setCompressImages={(value) =>
                          setState({ compress_images: value })
                        }
                        handleSaveFile={handleSaveFile}
                        changeFile={changeFile}
                      />
                    </InputGroupText>
                  </InputGroup>

                  <button type="submit" className="send">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none">
                      <path
                        d="M16.586 5.09924L8.76251 6.3913C3.50182 7.27084 3.07032 9.99521 7.80305 12.4491L9.89286 13.531L10.276 15.8529C11.1473 21.1123 13.8799 21.5451 16.3339 16.8123L19.9872 9.78061C21.6181 6.62185 20.0954 4.51606 16.586 5.09924ZM16.148 9.5691L12.5223 12.2179C12.3793 12.3218 12.2138 12.3546 12.0574 12.3298C11.901 12.3051 11.7538 12.2227 11.6499 12.0797C11.449 11.8032 11.5116 11.4081 11.7881 11.2072L15.4137 8.55845C15.6902 8.35757 16.0853 8.42014 16.2862 8.69664C16.4871 8.97313 16.4245 9.36821 16.148 9.5691Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </label>
                {dragActive && (
                  <div
                    className="drag-file-element-chat"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}></div>
                )}
              </form>
            </FormProvider>
          </div>
        ) : null}
      </div>

      <ModalForward
        modal={state.modal_forward}
        toggleModal={toggleModalForward}
        store={store}
        sendMessage={sendMessage}
        setDataForward={setDataForward}
        data_forward={state.data_forward}
      />
    </Fragment>
  )
}

export default ChatLog
