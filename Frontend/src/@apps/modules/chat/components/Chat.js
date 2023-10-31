// ** React Imports
import { Fragment, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"

// ** Custom Components
import ChatMessage from "./details/ChatMessage"
import SearchMessage from "./details/SearchMessage"
import ModalForward from "./modals/ModalForward"

// ** Third Party Components
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classnames from "classnames"
import { MessageSquare, MoreVertical } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"

import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import notification from "@apps/utility/notification"
import { validateFile } from "@apps/utility/validate"
import { FormProvider, useForm } from "react-hook-form"
import ReactHtmlParser from "react-html-parser"
import { useSelector } from "react-redux"
import { ChatApi } from "../common/api"
import { decodeHTMLEntities, detectUrl, renderAvatar } from "../common/common"
import InputMessage from "./details/InputMessage"
import Typing from "./details/Typing"

const ChatLog = (props) => {
  // ** Props & Store
  const {
    handleUserSidebarRight,
    sidebar,
    userSidebarRight,
    handleSidebar,
    store,
    userSidebarLeft,
    userId,
    sendMessage,
    loadingMessage,
    chats,
    getChatHistory,
    active,
    hasMoreHistory,
    chatArea,
    scrollToBottom,
    unread,
    handleSeenMessage,
    updateMessage,
    windowWidth,
    dataEmployees,
    queryLimit,
    checkAddMessage,
    setCheckAddMessage,
    handleSearchMessage,
    hasMoreChat,
    getChatScrollBottom,
    selectedGroup,
    keyEncrypt,
    handleUpdateGroup
  } = props


  const { selectedUser, groups } = store

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

  const msgRef = useRef(null)
  const divChatRef = useRef(null)

  const setRefMessage = (ref) => {
    msgRef.current = ref
  }

  const focusInputMsg = () => {
    if (msgRef.current) {
      msgRef.current.focus()
      localStorage.setItem("chatAppFocus", true)
      localStorage.setItem("formChatFocus", true)
    }
  }

  const isMinWidth = windowWidth < 767.98

  // ** redux
  const typing = useSelector((state) => state.chat.typing)
  const usersRedux = useSelector((state) => state.users)
  const onlineRedux = usersRedux.online
  useEffect(() => {
    if (selectedUser?.contact?.type === "group") {
      const online = _.filter(onlineRedux, (item) => {
        const index = selectedUser?.contact?.user.findIndex(
          (val) => val === item.id.toString() && item.online_status === "online"
        )
        return index > -1
      })
      const status =
        !_.isEmpty(online) && online.length >= 2 ? "online" : "offline"
      setState({ status: status })
    } else {
      const status = !_.isUndefined(
        onlineRedux?.[selectedUser?.contact?.idEmployee]
      )
        ? onlineRedux?.[selectedUser?.contact?.idEmployee].online_status
        : "offline"
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

  const scrollToTopAfterGetHistory = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = 800
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  const setMsg = (msg) => {
    setValue("message", msg)
  }

  const handleHeight = (replying, isScroll = true, height = 0) => {
    let heightEditor =
      document.getElementsByClassName("DraftEditor-root")?.[0]?.offsetHeight
    if (replying && !_.isEmpty(typing)) {
      heightEditor = heightEditor + 55 + 35 + 10
      if (document.getElementById("div-typing")) {
        document.getElementById("div-typing").style.marginBottom = "-15px"
      }
    } else {
      if (replying) {
        heightEditor = heightEditor + 55
      }
      if (!_.isEmpty(typing)) {
        heightEditor = heightEditor + 35
        if (document.getElementById("div-typing")) {
          document.getElementById("div-typing").style.marginBottom = "-25px"
        }
      }
    }
    if (height !== 0) {
      heightEditor = height
    }
    if (heightEditor) {
      document.getElementById("form-chat").style.height =
        "calc(100% - 85px - 40px - " + heightEditor + "px)"
    }

    if (isScroll === true) {
      scrollToBottom()
    } else {
      if (replying) {
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
    }
  }

  // ** listen esc
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setReplyingDefault()
        handleHeight(false, false)
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
        (unread === 0 &&
          chatContainer.scrollHeight -
            chatContainer.scrollTop -
            chatContainer.clientHeight <=
            200) ||
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
    setState({ show_btn_to_bottom: false })
    if (unread > 0) {
      setState({ show_btn_to_bottom: true })
    }
  }, [unread])

  useEffect(() => {
    setMsg("")
    setReplyingDefault()
    //focusInputMsg()
    localStorage.setItem("chatAppFocus", true)
    localStorage.setItem("formChatFocus", true)
  }, [selectedUser, loadingMessage])

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (
      !Object.keys(selectedUser).length &&
      !userSidebarLeft &&
      (window.innerWidth < 992)
    ) {
      handleSidebar()
    }
  }
  // ** Sends New Msg
  const handleSendMsg = (values) => {
    let msg = decodeHTMLEntities(values.message)
    if (loadingMessage) return
    if (msg.trim().length) {
      const mention = []
      _.forEach(values.mentions, (value) => {
        msg = msg.replace(value.name, function (val) {
          mention.push(value.id)
          return (
            '<a href="' +
            value.link +
            '" target="_blank">@' +
            value.name +
            "</a>"
          )
        })
      })

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
      const arr_link = detectUrl(msg, true)
      if (!_.isEmpty(arr_link)) {
        dataAddLink = { type: "link", file: arr_link }
      }
      const dataAdd = { ...reply, ...dataAddLink, mention: mention }

      sendMessage(selectedUser.chat.id, msg, dataAdd)
      setMsg("")
      setReplyingDefault()
    }
  }

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
    if (state.replying_type !== "text" && state.replying_type !== "link") {
      replying_content = state.replying_type
    }

    return (
      <>
        <div className="form-reply-title">
          <svg
            className="me-50"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none">
            <path
              d="M17.3667 11.9332H5.83331C4.44998 11.9332 3.33331 10.8165 3.33331 9.43318V6.6665"
              stroke="#696760"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.7333 14.5665L17.3667 11.9332L14.7333 9.2998"
              stroke="#696760"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {useFormatMessage("modules.chat.text.replying_to")} {replying_to}
        </div>
        <div className="form-reply-content">
          {ReactHtmlParser(replying_content)}
        </div>
      </>
    )
  }

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
      if (_file.arr_file.length > 2) {
        let start = 0
        for (let i = 0; i < Math.ceil(_file.arr_file.length / 2); i++) {
          const check_break_type = i === 0
          if (_file.arr_file[start] && _file.arr_file[start + 1]) {
            handleSubmitSaveFile(
              [_file.arr_file[start], _file.arr_file[start + 1]],
              check_break_type
            )
          } else {
            handleSubmitSaveFile([_file.arr_file[start]], check_break_type)
          }
          start = start + 2
        }
      } else {
        handleSubmitSaveFile(_file.arr_file)
      }
    } else {
      _.forEach(_file.arr_file, (val, key) => {
        const check_break_type = key === 0
        handleSubmitSaveFile([val], check_break_type)
      })
    }
    setReplyingDefault()
  }

  const handleSubmitSaveFile = (file, check_break_type = true) => {
    let validateFile_ = true
    if (file.length > 0) {
      _.forEach(file, (item) => {
        validateFile_ = validateFile(item.file)
        if (validateFile_ === false) {
          return false
        }
      })
    }
    if (validateFile_ === false) {
      return false
    }
    const data = {
      groupId: selectedUser.chat.id,
      file: file,
      compress_images: state.compress_images,
      file_type: file[0].type
    }
    const timestamp = Date.now()
    sendMessage(selectedUser.chat.id, "", {
      message: "",
      status: "loading",
      type: file[0].type,
      timestamp: timestamp,
      file: [],
      ...(!check_break_type ? { break_type: "" } : {})
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

  // drag state
  const [dragActive, setDragActive] = useState(null)

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.effectAllowed === "all") {
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

  // ** scroll to bottom when replying
  useEffect(() => {
    if (state.replying) {
      const chatContainer = ReactDOM.findDOMNode(chatArea.current)
      if (chatContainer) {
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
    }
  }, [state.replying])

  // ** listen paste image
  useEffect(() => {
    const handleClick = (event) => {
      if (
        divChatRef.current &&
        divChatRef.current.contains(event.target) &&
        unread > 0
      ) {
        handleSeenMessage(selectedUser.chat.id)
      }
    }

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
    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("paste", handlePaste)
      window.removeEventListener("click", handleClick)
    }
  }, [divChatRef, unread])

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper =
    Object.keys(selectedUser).length && selectedUser.chat
      ? PerfectScrollbar
      : "div"

  return (
    <Fragment>
      <div
        ref={divChatRef}
        className={classnames("chat-app-window", {
          hide: userSidebarRight === true
        })}>
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
              <header
                className={classnames("chat-header", {
                  "sidebar-hided": !sidebar
                })}>
                <div className="d-flex align-items-center">
                  <div
                    className="sidebar-toggle d-block d-lg-none me-1"
                    onClick={handleSidebar}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none">
                      <path
                        d="M15 19.9201L8.48 13.4001C7.71 12.6301 7.71 11.3701 8.48 10.6001L15 4.08008"
                        stroke="#696760"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {renderAvatar(selectedGroup, "me-1", "36", "36")}
                  <div className="chat-header-name">
                    <h6
                      className="mb-0 cursor-pointer"
                      onClick={() => handleUserSidebarRight()}>
                      {selectedUser.contact.fullName}
                    </h6>
                    <span
                      className={classnames("chat-header-name-status", {
                        "text-muted": state.status === "offline",
                        "status-away": state.status === "away"
                      })}>
                      {state.status}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  {!isMinWidth ? (
                    <SearchMessage
                      isMini={false}
                      handleSearchMessage={handleSearchMessage}
                      selectedUser={selectedUser}
                      setSearchMessageHighlight={setSearchMessageHighlight}
                      scrollToMessage={props.scrollToMessage}
                      keyEncrypt={keyEncrypt}
                    />
                  ) : (
                    ""
                  )}

                  <button
                    className="chat-header-btn-border left"
                    onClick={() =>
                      notification.showWarning({
                        text: useFormatMessage(
                          "errors.common.function_contruction"
                        )
                      })
                    }>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="vuesax/bold/call">
                      <g id="call">
                      <path id="Vector" d="M9.20832 12.4582L7.66666 13.9998C7.34166 14.3248 6.82499 14.3248 6.49166 14.0082C6.39999 13.9165 6.30832 13.8332 6.21666 13.7415C5.35832 12.8748 4.58332 11.9665 3.89166 11.0165C3.20832 10.0665 2.65832 9.1165 2.25832 8.17484C1.86666 7.22484 1.66666 6.3165 1.66666 5.44984C1.66666 4.88317 1.76666 4.3415 1.96666 3.8415C2.16666 3.33317 2.48332 2.8665 2.92499 2.44984C3.45832 1.92484 4.04166 1.6665 4.65832 1.6665C4.89166 1.6665 5.12499 1.7165 5.33332 1.8165C5.54999 1.9165 5.74166 2.0665 5.89166 2.28317L7.82499 5.00817C7.97499 5.2165 8.08332 5.40817 8.15832 5.5915C8.23332 5.7665 8.27499 5.9415 8.27499 6.09984C8.27499 6.29984 8.21666 6.49984 8.09999 6.6915C7.99166 6.88317 7.83332 7.08317 7.63332 7.28317L6.99999 7.9415C6.90832 8.03317 6.86666 8.1415 6.86666 8.27484C6.86666 8.3415 6.87499 8.39984 6.89166 8.4665C6.91666 8.53317 6.94166 8.58317 6.95832 8.63317C7.10832 8.90817 7.36666 9.2665 7.73332 9.69984C8.10832 10.1332 8.50832 10.5748 8.94166 11.0165C9.02499 11.0998 9.11666 11.1832 9.19999 11.2665C9.53332 11.5915 9.54166 12.1248 9.20832 12.4582Z" fill="#F2F1ED"/>
                      <path id="Vector_2" d="M18.3083 15.2752C18.3083 15.5085 18.2667 15.7502 18.1833 15.9835C18.1583 16.0502 18.1333 16.1169 18.1 16.1835C17.9583 16.4835 17.775 16.7669 17.5333 17.0335C17.125 17.4835 16.675 17.8085 16.1667 18.0169C16.1583 18.0169 16.15 18.0252 16.1417 18.0252C15.65 18.2252 15.1167 18.3335 14.5417 18.3335C13.6917 18.3335 12.7833 18.1335 11.825 17.7252C10.8667 17.3169 9.90833 16.7669 8.95833 16.0752C8.63333 15.8335 8.30833 15.5919 8 15.3335L10.725 12.6085C10.9583 12.7835 11.1667 12.9169 11.3417 13.0085C11.3833 13.0252 11.4333 13.0502 11.4917 13.0752C11.5583 13.1002 11.625 13.1085 11.7 13.1085C11.8417 13.1085 11.95 13.0585 12.0417 12.9669L12.675 12.3419C12.8833 12.1335 13.0833 11.9752 13.275 11.8752C13.4667 11.7585 13.6583 11.7002 13.8667 11.7002C14.025 11.7002 14.1917 11.7335 14.375 11.8085C14.5583 11.8835 14.75 11.9919 14.9583 12.1335L17.7167 14.0919C17.9333 14.2419 18.0833 14.4169 18.175 14.6252C18.2583 14.8335 18.3083 15.0419 18.3083 15.2752Z" fill="#F2F1ED"/>
                      </g>
                      </g>
                    </svg>
                  </button>
                  <button
                    className="chat-header-btn-border right"
                    onClick={() =>
                      notification.showWarning({
                        text: useFormatMessage(
                          "errors.common.function_contruction"
                        )
                      })
                    }>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="vuesax/bold/video">
                      <g id="video">
                      <path id="Vector" d="M17.625 5.14183C17.2833 4.9585 16.5667 4.76683 15.5917 5.45016L14.3667 6.31683C14.275 3.72516 13.15 2.7085 10.4167 2.7085H5.41668C2.56668 2.7085 1.45834 3.81683 1.45834 6.66683V13.3335C1.45834 15.2502 2.50001 17.2918 5.41668 17.2918H10.4167C13.15 17.2918 14.275 16.2752 14.3667 13.6835L15.5917 14.5502C16.1083 14.9168 16.5583 15.0335 16.9167 15.0335C17.225 15.0335 17.4667 14.9418 17.625 14.8585C17.9667 14.6835 18.5417 14.2085 18.5417 13.0168V6.9835C18.5417 5.79183 17.9667 5.31683 17.625 5.14183ZM9.16668 9.4835C8.30834 9.4835 7.60001 8.7835 7.60001 7.91683C7.60001 7.05016 8.30834 6.35016 9.16668 6.35016C10.025 6.35016 10.7333 7.05016 10.7333 7.91683C10.7333 8.7835 10.025 9.4835 9.16668 9.4835Z" fill="#F2F1ED"/>
                      </g>
                    </g>
                    </svg>
                  </button>
                  {isMinWidth ? (
                    <SearchMessage
                      isMini={true}
                      handleSearchMessage={handleSearchMessage}
                      selectedUser={selectedUser}
                      setSearchMessageHighlight={setSearchMessageHighlight}
                      scrollToMessage={props.scrollToMessage}
                      keyEncrypt={keyEncrypt}
                    />
                  ) : (
                    ""
                  )}
                  <button
                    className={`btn-icon-more`}
                    onClick={() =>
                      notification.showWarning({
                        text: useFormatMessage(
                          "errors.common.function_contruction"
                        )
                      })
                    }>
                    {!isMinWidth ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 20C14 18.8954 13.1046 18 12 18C10.8954 18 10 18.8954 10 20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20Z" fill="#292D32"/>
                          <path d="M14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12Z" fill="#292D32"/>
                          <path d="M14 4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6C13.1046 6 14 5.10457 14 4Z" fill="#292D32"/>
                        </svg> 
                     ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="vuesax/linear/info-circle">
                        <g id="info-circle">
                        <path id="Vector" d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path id="Vector_2" d="M12 8V13" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path id="Vector_3" d="M11.9945 16H12.0035" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        </g>
                      </svg>
                     )}
                  </button>
                </div>
              </header>
            </div>

            <div
              id="form-chat"
              onDragEnter={handleDrag}
              className={`${state.replying ? "replying" : ""}`}>
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
                        handleHeight={handleHeight}
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
                      {/* {unread && unread > 0 ? (
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
                      )} */}
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

            <Typing
              selectedGroup={selectedGroup}
              dataEmployees={dataEmployees}
              replying={state.replying}
              unread={unread}
              scrollToBottom={scrollToBottom}
              typing={typing}
              handleHeight={handleHeight}
              chatArea={chatArea}
              userId={userId}
            />

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
                  <InputMessage
                    replying={state.replying}
                    replying_timestamp={state.replying_timestamp}
                    handleHeight={handleHeight}
                    handleSendMsg={handleSendMsg}
                    sendMessage={sendMessage}
                    selectedUser={selectedUser}
                    focusInputMsg={focusInputMsg}
                    setReplyingDefault={setReplyingDefault}
                    msgRef={msgRef}
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
                    renderFormReply={renderFormReply}
                    selectedGroup={selectedGroup}
                    userId={userId}
                    handleUpdateGroup={handleUpdateGroup}
                    groups={groups}
                    typing={typing}
                    dataEmployees={dataEmployees}
                  />
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
