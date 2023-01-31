// ** Imports
import {
  getPublicDownloadUrl,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import classnames from "classnames"
import moment from "moment"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { IdleTimerProvider } from "react-idle-timer"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { handleChats, handleTitleChat } from "redux/chat"
import SocketContext from "utility/context/Socket"
import { ChatApi } from "../common/api"
import { replaceHtmlMessage, triGram } from "../common/common"

// ** Chat App Component Imports
import Chat from "../components/Chat"
import Sidebar from "../components/SidebarLeft"
import UserProfileSidebar from "../components/UserProfileSidebar"

// ** firebase
import { db } from "firebase"
import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAt,
  updateDoc,
  where
} from "firebase/firestore"

// ** style
import "@styles/base/pages/app-chat-list.scss"
import "@styles/base/pages/app-chat.scss"
import "../assets/scss/chat.scss"

const AppChat = (props) => {
  const [store, setStore] = useMergedState({
    groups: [],
    contacts: [],
    userProfile: {
      id: 1,
      fullName: "Felecia Rower",
      role: "Frontend Developer",
      about:
        "Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing",
      avatar:
        "/demo/vuexy-react-admin-dashboard-template/demo-1/static/media/avatar-s-2.d21f2121.jpg",
      settings: {
        isTwoStepAuthVerificationEnabled: true,
        isNotificationsOn: false
      }
    },
    selectedUser: {}
  })

  // ** handle store
  const setGroups = (data) => setStore({ groups: data })
  const setSelectedUser = (data) => {
    setStore({ selectedUser: data })
    handleUser(data.contact)
  }
  const setContacts = (data) => setStore({ contacts: data })
  const setUserProfile = (data) => setStore({ userProfile: data })

  const [state, setState] = useMergedState({
    unread: 0,
    dataEmployees: [],
    loadingEmployee: true,
    loadingGroup: true,
    loadingMessage: true,
    hasMoreHistory: true,
    checkAddMessage: false,
    lastTimeMessageChat: 0,
    chatHistory: [],
    lastTimeMessageHistory: 0,
    dataChatScrollBottom: [],
    hasMoreChat: false,
    lastMessageChatScrollBottom: 0,
    checkShowDataChat: true,

    // ** params url
    checkLoadUrlActiveId: true,

    // **
    selectedGroup: {}
  })

  // ** State
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [user, setUser] = useState({})
  const [sidebar, setSidebar] = useState(false)
  const [userSidebarRight, setUserSidebarRight] = useState(false)
  const [userSidebarLeft, setUserSidebarLeft] = useState(false)
  const [active, setActive] = useState(0)
  const [activeFullName, setActiveFullName] = useState("")
  const socket = useContext(SocketContext)

  const imageGroup =
    process.env.REACT_APP_URL + "/assets/images/default_chat_group.webp"

  // ** params
  const { id } = useParams()
  useEffect(() => {
    if (
      id !== "" &&
      id !== undefined &&
      !_.isEmpty(store.groups) &&
      state.checkLoadUrlActiveId === true
    ) {
      setTimeout(() => {
        setState({ checkLoadUrlActiveId: false })
        const index_group = store.groups.findIndex((item) => item.id === id)
        if (index_group !== -1) {
          setActive(id)
          setActiveFullName(store.groups[index_group].username)
          window.history.replaceState(null, "", `/chat/${id}`)
        } else {
          const index_group = store.groups.findIndex(
            (item) => item.username === id
          )
          if (index_group !== -1) {
            setActive(store.groups[index_group].id)
            setActiveFullName(store.groups[index_group].username)
            window.history.replaceState(null, "", `/chat/${id}`)
          } else {
            const index_employee = state.dataEmployees.findIndex(
              (item) => item.username === id
            )
            if (index_employee !== -1) {
              setActive("")
              setActiveFullName(state.dataEmployees[index_employee].username)
              window.history.replaceState(null, "", `/chat/${id}`)
            } else {
              /* notification.showWarning({
                text: useFormatMessage(
                  "modules.chat.notification.user_is_not_active"
                )
              }) */
              window.history.replaceState(null, "", "/chat")
            }
          }
        }
      }, 500)
    }
  }, [id, store.groups, state.checkLoadUrlActiveId])

  // ** env
  const firestoreDb = process.env.REACT_APP_FIRESTORE_DB
  if (_.isUndefined(firestoreDb) || firestoreDb === "") {
    return <>env: not found firestore db</>
  }

  // ** setting
  const auth = useSelector((state) => state.auth)
  const settingChat = auth.settings.chat
  const settingUser = auth.userData
  const userId = settingUser.id
  const userFullName = settingUser.full_name

  // ** redux
  const dispatch = useDispatch()
  const chat = useSelector((state) => state.chat)
  const chats = chat.chats
  const reduxUnseen = chat.unseen
  const queryLimit = 50

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener("resize", handleWindowWidth)
    }

    if (!_.isEmpty(store.selectedUser)) {
      if (windowWidth > 1366) {
        setUserSidebarRight(true)
      } else {
        setUserSidebarRight(false)
      }
    }
  }, [windowWidth])

  // ** Sidebar & overlay toggle functions
  const handleSidebar = () => setSidebar(!sidebar)
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft)
  const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight)
  const handleOverlayClick = () => {
    setSidebar(false)
    setUserSidebarRight(false)
    setUserSidebarLeft(false)
  }

  // ** Set user function for Right Sidebar
  const handleUser = (obj) => setUser(obj)

  const handleDefault = () => {
    setStore({ selectedUser: {} })
    handleUser({})
    handleOverlayClick()
  }

  // ** function
  const setUnread = (num) => {
    setState({ unread: num })
  }
  const setEmptyHistory = () => {
    setState({
      chatHistory: [],
      lastTimeMessageHistory: chats.length > 0 ? chats[0].time : 0,
      hasMoreHistory: true
    })
  }
  const setEmptyDataScrollBottom = () => {
    setState({
      dataChatScrollBottom: [],
      hasMoreChat: false,
      lastMessageChatScrollBottom: 0,
      checkShowDataChat: true
    })
  }

  // ** Refs & Dispatch
  const chatArea = useRef(null)

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
  }
  // ** Scroll to chat top offset
  const scrollToMessage = (timestamp, groupId) => {
    const section = document.getElementById(timestamp)
    if (section) {
      const chatContainer = ReactDOM.findDOMNode(chatArea.current)
      chatContainer.scrollTop = section.offsetTop
      section.classList.add("highlight")
      setTimeout(() => {
        section.classList.remove("highlight")
      }, 1000)
    } else {
      if (!_.isEmpty(groupId) && state.hasMoreHistory === true) {
        setState({ hasMoreHistory: false })
        setEmptyHistory()
        const q = query(
          collection(db, `${firestoreDb}/chat_messages/${groupId}`),
          orderBy("timestamp", "asc"),
          where("timestamp", ">=", timestamp),
          limit(30)
        )

        getDocs(q).then((res) => {
          let chat = []
          let dem_chat = 0
          res.forEach((docData) => {
            const data = docData.data()
            if (data.timestamp < state.lastTimeMessageChat) {
              dem_chat++
              chat = [
                ...chat,
                {
                  message: data.message,
                  time: data.timestamp,
                  senderId: data.sender_id,
                  type: data.type,
                  status: data.status,
                  file: data.file,
                  react: data.react,
                  reply: data.reply,
                  forward: data.forward
                }
              ]
            }
          })

          if (dem_chat > 1) {
            const q = query(
              collection(db, `${firestoreDb}/chat_messages/${groupId}`),
              orderBy("timestamp", "desc"),
              where("timestamp", "<", timestamp),
              limit(20)
            )

            getDocs(q).then((res) => {
              let dem = 0
              res.forEach((docData) => {
                dem++
                const data = docData.data()
                chat = [
                  {
                    message: data.message,
                    time: data.timestamp,
                    senderId: data.sender_id,
                    type: data.type,
                    status: data.status,
                    file: data.file,
                    react: data.react,
                    reply: data.reply,
                    forward: data.forward,
                    unsent: data.unsent
                  },
                  ...chat
                ]
              })

              setState({
                lastTimeMessageHistory: chat.length > 0 ? chat[0].time : 0,
                dataChatScrollBottom: chat
              })

              setTimeout(() => {
                const section = document.getElementById(timestamp)
                if (section) {
                  setState({ hasMoreHistory: true })
                  if (dem_chat === 30) {
                    setState({
                      hasMoreChat: true,
                      lastMessageChatScrollBottom:
                        chat.length > 0 ? chat[chat.length - 1].time : 0,
                      checkShowDataChat: false
                    })
                  } else {
                    setState({
                      hasMoreChat: false,
                      lastMessageChatScrollBottom: 0,
                      checkShowDataChat: true
                    })
                  }

                  const chatContainer = ReactDOM.findDOMNode(chatArea.current)
                  chatContainer.scrollTop = section.offsetTop
                  section.classList.add("highlight")
                  setTimeout(() => {
                    section.classList.remove("highlight")
                  }, 1000)
                } else {
                  setState({
                    hasMoreHistory: true,
                    hasMoreChat: false,
                    lastMessageChatScrollBottom: 0,
                    checkShowDataChat: true
                  })
                }
              }, 200)
            })
          } else {
            setState({
              hasMoreHistory: true,
              hasMoreChat: false,
              lastMessageChatScrollBottom: 0,
              checkShowDataChat: true
            })
          }
        })
      }
    }
  }

  const getListEmployees = () => {
    ChatApi.getEmployees().then((res) => {
      setState({ dataEmployees: res.data, loadingEmployee: false })
    })
  }

  const getContacts = () => {
    let dataEmployees_ = [...state.dataEmployees]
    _.forEach(store.groups, (value) => {
      dataEmployees_ = dataEmployees_.filter(
        (item) => item.username !== value.username
      )
    })
    let contacts = []
    _.forEach(dataEmployees_, (value) => {
      contacts = [
        ...contacts,
        {
          id: "",
          idEmployee: value.id ? value.id : "",
          fullName: value.full_name ? value.full_name : "",
          username: value.username ? value.username : "",
          role: value.job_title ? value.job_title : "",
          about: "",
          avatar: value.avatar ? value.avatar : "",
          user: [userId, value.id]
        }
      ]
    })
    setContacts(contacts)
  }

  const handleAddNewGroup = async (docData) => {
    docData = {
      mute: [],
      pin: [],
      avatar: "",
      background: "",
      file_count: {},
      des: "",
      ...docData
    }
    return await addDoc(
      collection(db, `${firestoreDb}/chat_groups/groups`),
      docData
    )
  }

  const handleUpdateGroup = async (groupId, dataUpdate) => {
    await updateDoc(
      doc(db, `${firestoreDb}/chat_groups/groups`, groupId),
      dataUpdate
    )
  }

  const handleDeleteGroup = (groupId) => {
    deleteDoc(doc(db, `${firestoreDb}/chat_groups/groups`, groupId))
  }

  const handleLastMessage = (type, msg) => {
    let last_message = msg
    if (type === "image" || type === "image_gif") {
      last_message = useFormatMessage("modules.chat.text.send") + " image"
    } else if (type === "video") {
      last_message = useFormatMessage("modules.chat.text.send") + " video"
    } else if (type === "audio") {
      last_message = useFormatMessage("modules.chat.text.send") + " audio"
    } else if (type === "file") {
      last_message = useFormatMessage("modules.chat.text.send") + " file"
    } else if (type === "gif") {
      last_message = useFormatMessage("modules.chat.text.send") + " gif"
    }

    return last_message
  }

  const setDataUnseenDetail = (
    action,
    user_id,
    timestamp,
    unseen_detail,
    user,
    member_add = [],
    member_remove = ""
  ) => {
    if (action === "add") {
      const _unseen_detail = []
      _.forEach(user, (item) => {
        if (user_id === item) {
          _unseen_detail.push({
            user_id: item,
            timestamp_from: 0,
            timestamp_to: 0,
            unread_count: 0
          })
        } else {
          _unseen_detail.push({
            user_id: item,
            timestamp_from: timestamp,
            timestamp_to: timestamp,
            unread_count: 1
          })
        }
      })

      return _unseen_detail
    }

    if (action === "update") {
      const _unseen_detail = []
      _.forEach(unseen_detail, (item) => {
        if (user_id === item.user_id) {
          _unseen_detail.push({
            user_id: item.user_id,
            timestamp_from: 0,
            timestamp_to: 0,
            unread_count: 0
          })
        } else {
          let timestamp_from = 0
          let timestamp_to = 0
          let unread_count = 0
          if (item.unread_count === 0) {
            timestamp_from = timestamp
            timestamp_to = timestamp
            unread_count = 1
          } else {
            timestamp_from = item.timestamp_from
            timestamp_to = timestamp
            unread_count = item.unread_count + 1
          }
          _unseen_detail.push({
            user_id: item.user_id,
            timestamp_from: timestamp_from,
            timestamp_to: timestamp_to,
            unread_count: unread_count
          })
        }
      })

      return _unseen_detail
    }

    if (action === "seen") {
      const _unseen_detail = []
      _.forEach(unseen_detail, (item) => {
        if (user_id === item.user_id) {
          _unseen_detail.push({
            user_id: item.user_id,
            timestamp_from: 0,
            timestamp_to: 0,
            unread_count: 0
          })
        } else {
          _unseen_detail.push(item)
        }
      })

      return _unseen_detail
    }

    if (action === "add_member") {
      const _unseen_detail = [...unseen_detail]
      _.forEach(member_add, (item) => {
        _unseen_detail.push({
          user_id: item,
          timestamp_from: timestamp,
          timestamp_to: timestamp,
          unread_count: 1
        })
      })

      return _unseen_detail
    }

    if (action === "delete_member") {
      const _unseen_detail = unseen_detail.filter(
        (item) => item.user_id !== member_remove
      )

      return _unseen_detail
    }

    return []
  }

  const handleCountFile = (groupId, type, action = "plus") => {
    const index_groups = store.groups.findIndex((item) => item.id === groupId)
    let file_count = {}
    if (index_groups !== 1) {
      const group_file_count = store.groups[index_groups]?.file_count || {}
      if (type === "link") {
        const count_link = group_file_count?.link
          ? action === "plus"
            ? group_file_count?.link + 1
            : group_file_count?.link - 1
          : 1
        file_count = { ...group_file_count, link: count_link }
      } else if (type === "image" || type === "image_gif") {
        const count_image = group_file_count?.image
          ? action === "plus"
            ? group_file_count?.image + 1
            : group_file_count?.image - 1
          : 1
        file_count = { ...group_file_count, image: count_image }
      } else if (type === "file" || type === "audio" || type === "video") {
        const count_file = group_file_count?.file
          ? action === "plus"
            ? group_file_count?.file + 1
            : group_file_count?.file - 1
          : 1
        file_count = { ...group_file_count, file: count_file }
      }
    }

    return file_count
  }

  const handleSendNotification = (groupId, msg, dataGroups, receivers) => {
    let notification_name = dataGroups.name
    let icon = dataGroups.avatar
      ? getPublicDownloadUrl(
          `modules/chat/${groupId}/avatar/${dataGroups.avatar}`
        )
      : imageGroup
    const link = `/chat/${groupId}`
    const skipUrls = `/chat`
    if (dataGroups.type === "employee") {
      icon = userId * 1
      notification_name = userFullName
    }
    let _msg = replaceHtmlMessage(msg)

    if (dataGroups.type === "group") {
      const fullNameSplit = userFullName.split(" ")
      const fullNameSplitGroupMsg = fullNameSplit[fullNameSplit.length - 1]
      const dot = msg.length > 25 ? "..." : ""
      _msg = _msg.slice(0, 25) + dot
      _msg = fullNameSplitGroupMsg + ": " + _msg
    } else {
      const dot = msg.length > 30 ? "..." : ""
      _msg = _msg.slice(0, 30) + dot
    }
    socket.emit("chat_notification", {
      receivers: receivers,
      payload: {
        title: notification_name,
        body: _msg,
        link: link,
        icon: icon
        //image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
      },
      data: {
        skipUrls: skipUrls
      }
    })
  }

  const handleBreakType = async (groupId, timestamp, data) => {
    const calculate_time_break = (timestamp, pre_timestamp, senderId) => {
      let break_type = ""
      const minute_diff = moment(timestamp).diff(
        moment(pre_timestamp),
        "minutes"
      )

      if (0 < minute_diff && minute_diff < 20) {
        if (senderId === userId) {
          break_type = "minute"
        }
      } else if (minute_diff >= 20) {
        break_type = "line_time"
      }

      return break_type
    }

    let break_type = ""
    // ** check forward
    if (data.forward && !_.isEmpty(data.forward)) {
      if (groupId === "") {
        break_type = "line_time"
      } else {
        const q = query(
          collection(db, `${firestoreDb}/chat_messages/${groupId}`),
          orderBy("timestamp", "desc"),
          limit(1)
        )
        await getDocs(q).then((res) => {
          let dem = 0
          res.forEach((docData) => {
            dem++
            if (dem === 1) {
              const data_message = docData.data()
              const pre_timestamp = data_message.timestamp
              const senderId = data_message.sender_id
              break_type = calculate_time_break(
                timestamp,
                pre_timestamp,
                senderId
              )
            }
          })
          if (dem === 0) {
            break_type = "line_time"
          }
        })
      }
    } else {
      if (!_.isEmpty(chats)) {
        const _chat = chats[chats.length - 1]
        const pre_timestamp = _chat.time
        const senderId = _chat.senderId
        break_type = calculate_time_break(timestamp, pre_timestamp, senderId)
      } else {
        break_type = "line_time"
      }
    }

    return break_type
  }

  const handleTimestampFile = (data) => {
    let timestamp_link = 0
    let timestamp_image = 0
    let timestamp_file = 0
    if (data.status && (data.status === "loading" || data.status === "error")) {
      return { timestamp_link, timestamp_image, timestamp_file }
    }

    if (data.type === "link") {
      timestamp_link = data.timestamp
    }
    if (data.type === "image" || data.type === "image_gif") {
      timestamp_image = data.timestamp
    }
    if (
      data.type === "file" ||
      data.type === "video" ||
      data.type === "audio"
    ) {
      timestamp_file = data.timestamp
    }

    return { timestamp_link, timestamp_image, timestamp_file }
  }

  const sendMessage = async (groupId = "", msg, dataAddFile = {}) => {
    setState({ checkAddMessage: true })
    const timestamp = Date.now()
    const file_count = handleCountFile(groupId, dataAddFile.type)
    const break_type = await handleBreakType(groupId, timestamp, dataAddFile)

    if (!_.isEmpty(groupId)) {
      delete dataAddFile.contact_id

      const docGroups = doc(db, `${firestoreDb}/chat_groups/groups`, groupId)
      getDoc(docGroups).then((res) => {
        const dataGroups = res.data()
        const unseen = dataGroups.user
        const index = unseen.indexOf(userId)
        if (index !== -1) {
          unseen.splice(index, 1)
        }
        const unseen_detail = dataGroups.unseen_detail

        const docData = {
          message: msg,
          sender_id: userId,
          timestamp: timestamp,
          type: "text",
          break_type: break_type,
          ...dataAddFile
        }
        if (docData.type === "text") {
          docData["_smeta"] = triGram(msg)
        }
        setDoc(doc(collection(db, `${firestoreDb}/chat_messages/${groupId}`)), {
          ...docData,
          ...handleTimestampFile(docData)
        })

        // ** notification
        const mute = dataGroups.mute.filter((item) => item !== userId)
        const receivers = mute
          .filter((x) => !unseen.includes(x))
          .concat(unseen.filter((x) => !mute.includes(x)))
        if (!_.isEmpty(receivers)) {
          handleSendNotification(
            groupId,
            handleLastMessage(docData.type, msg),
            dataGroups,
            receivers
          )
        }
        let dataGroup = {
          last_message: handleLastMessage(docData.type, msg),
          last_user: userId,
          timestamp: timestamp,
          new: 0,
          unseen: unseen,
          unseen_detail: setDataUnseenDetail(
            "update",
            userId,
            timestamp,
            unseen_detail,
            []
          )
        }
        if (!_.isEmpty(file_count)) {
          dataGroup = { ...dataGroup, file_count: file_count }
        }
        handleUpdateGroup(groupId, dataGroup)
      })
    } else {
      const contact = store.selectedUser.contact
      let idEmployee = contact.idEmployee
      let checkSetActive = true

      if (dataAddFile.forward) {
        if (
          !_.isUndefined(dataAddFile.contact_id) &&
          dataAddFile.contact_id !== ""
        ) {
          idEmployee = dataAddFile.contact_id
          delete dataAddFile.contact_id
          checkSetActive = false
        } else {
          return
        }
      }

      setState({ loadingMessage: true })
      const type = dataAddFile.type ? dataAddFile.type : "text"
      let docData = {
        last_message: handleLastMessage(type, msg),
        last_user: userId,
        name: "",
        timestamp: timestamp,
        type: "employee",
        user: [userId, idEmployee],
        new: 1,
        unseen: [idEmployee],
        unseen_detail: setDataUnseenDetail(
          "add",
          userId,
          timestamp,
          [],
          [userId, idEmployee]
        )
      }
      if (!_.isEmpty(file_count)) {
        docData = { ...docData, file_count: file_count }
      }
      handleAddNewGroup(docData).then((res) => {
        const newGroupId = res.id
        if (checkSetActive) {
          setActive(newGroupId)
        }
        const docDataMessage = {
          message: msg,
          sender_id: userId,
          timestamp: timestamp,
          type: "text",
          break_type: break_type,
          ...dataAddFile
        }
        if (docDataMessage.type === "text") {
          docDataMessage["_smeta"] = triGram(msg)
        }

        // ** notification
        handleSendNotification(
          newGroupId,
          handleLastMessage(type, msg),
          docData,
          idEmployee
        )

        setDoc(
          doc(collection(db, `${firestoreDb}/chat_messages/${newGroupId}`)),
          {
            ...docDataMessage,
            ...handleTimestampFile(docDataMessage)
          }
        )
        setState({ loadingMessage: false })
      })
    }

    setEmptyHistory()
    setEmptyDataScrollBottom()
  }

  const updateMessage = (groupId, timestamp, dataUpdate) => {
    if (!_.isEmpty(groupId)) {
      const q = query(
        collection(db, `${firestoreDb}/chat_messages/${groupId}`),
        where("timestamp", "==", timestamp)
      )
      getDocs(q).then((res) => {
        let dem = 0
        let docId = ""
        res.forEach((docData) => {
          dem++
          docId = docData.id
        })
        if (dem > 0) {
          updateDoc(doc(db, `${firestoreDb}/chat_messages/${groupId}`, docId), {
            ...dataUpdate,
            ...handleTimestampFile(dataUpdate)
          })
          if (dataUpdate.status && dataUpdate.status === "success") {
            const file_count = handleCountFile(groupId, dataUpdate.type)
            if (!_.isEmpty(file_count)) {
              handleUpdateGroup(groupId, {
                file_count: file_count
              })
            }
          }
        }
      })
    } else {
      sendMessage(groupId, "", dataUpdate)
    }
  }

  const getChatHistory = (groupId = "") => {
    if (!_.isEmpty(groupId) && state.hasMoreHistory === true) {
      setState({ hasMoreHistory: false })
      const q = query(
        collection(db, `${firestoreDb}/chat_messages/${groupId}`),
        orderBy("timestamp", "desc"),
        limit(30),
        startAt(state.lastTimeMessageHistory)
      )

      getDocs(q).then((res) => {
        let chat = []
        let dem = 0
        res.forEach((docData) => {
          dem++
          const data = docData.data()

          chat = [
            ...chat,
            {
              message: data.message,
              time: data.timestamp,
              senderId: data.sender_id,
              type: data.type,
              status: data.status,
              file: data.file,
              react: data.react,
              reply: data.reply,
              forward: data.forward,
              unsent: data.unsent
            }
          ]
        })

        if (dem > 1) {
          const chat_reverse = chat.reverse()
          chat_reverse.pop()

          setState({
            chatHistory: [...chat_reverse, ...state.chatHistory],
            hasMoreHistory: true,
            lastTimeMessageHistory:
              chat_reverse.length > 0 ? chat_reverse[0].time : 0
          })
        }
      })
    }
  }

  const getChatScrollBottom = (groupId = "", checkFull = false) => {
    if (
      !_.isEmpty(groupId) &&
      state.hasMoreChat === true &&
      state.lastMessageChatScrollBottom !== 0
    ) {
      setState({ hasMoreChat: false })
      if (checkFull === false) {
        const q = query(
          collection(db, `${firestoreDb}/chat_messages/${groupId}`),
          orderBy("timestamp", "asc"),
          where("timestamp", ">=", state.lastMessageChatScrollBottom),
          limit(queryLimit)
        )

        getDocs(q).then((res) => {
          let chat = []
          let dem_chat = 0
          res.forEach((docData) => {
            const data = docData.data()
            if (data.timestamp < state.lastTimeMessageChat) {
              dem_chat++

              chat = [
                ...chat,
                {
                  message: data.message,
                  time: data.timestamp,
                  senderId: data.sender_id,
                  type: data.type,
                  status: data.status,
                  file: data.file,
                  react: data.react,
                  reply: data.reply,
                  forward: data.forward,
                  unsent: data.unsent
                }
              ]
            }
          })

          setState({
            dataChatScrollBottom: [...state.dataChatScrollBottom, ...chat]
          })
          if (dem_chat === queryLimit) {
            setState({
              hasMoreChat: true,
              lastMessageChatScrollBottom:
                chat.length > 0 ? chat[chat.length - 1].time : 0,
              checkShowDataChat: false
            })
          } else {
            setState({
              hasMoreChat: false,
              lastMessageChatScrollBottom: 0,
              checkShowDataChat: true
            })
          }

          const chatContainer = ReactDOM.findDOMNode(chatArea.current)
          chatContainer.scrollTop = chatContainer.scrollHeight - 500
        })
      } else {
        const q = query(
          collection(db, `${firestoreDb}/chat_messages/${groupId}`),
          orderBy("timestamp", "asc"),
          where("timestamp", ">=", state.lastMessageChatScrollBottom),
          where("timestamp", "<", state.lastTimeMessageChat)
        )

        getDocs(q).then((res) => {
          let chat = []
          let dem_chat = 0
          res.forEach((docData) => {
            const data = docData.data()
            if (data.timestamp < state.lastTimeMessageChat) {
              dem_chat++

              chat = [
                ...chat,
                {
                  message: data.message,
                  time: data.timestamp,
                  senderId: data.sender_id,
                  type: data.type,
                  status: data.status,
                  file: data.file,
                  react: data.react,
                  reply: data.reply,
                  forward: data.forward,
                  unsent: data.unsent
                }
              ]
            }
          })

          setState({
            dataChatScrollBottom: [...state.dataChatScrollBottom, ...chat],
            hasMoreChat: false,
            lastMessageChatScrollBottom: 0,
            checkShowDataChat: true
          })
          setTimeout(() => {
            const chatContainer = ReactDOM.findDOMNode(chatArea.current)
            chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
          }, 200)
        })
      }
    }
  }

  const handleSeenMessage = (groupId) => {
    if (!_.isEmpty(groupId)) {
      setUnread(0)
      const index = store.groups.findIndex((item) => item.id === groupId)
      if (index !== -1) {
        const unseen_detail = store.groups[index].chat.unseen_detail
        handleUpdateGroup(groupId, {
          unseen: arrayRemove(userId),
          unseen_detail: setDataUnseenDetail(
            "seen",
            userId,
            0,
            unseen_detail,
            []
          )
        })
      }
    }
  }

  const handleSearchMessage = async (groupId, searchTxt) => {
    const searchConstraints = []
    _.forEach(triGram(searchTxt), (name, key) => {
      searchConstraints.push(where(`_smeta.${key}`, "==", true))
    })

    const q_mess = query(
      collection(db, `${firestoreDb}/chat_messages/${groupId}`),
      ...searchConstraints
    )
    return await getDocs(q_mess)
  }

  // ** useEffect
  useEffect(() => {
    setUnread(0)
    const index = store.groups.findIndex((item) => item.id === active)
    if (index !== -1) {
      const unseen_detail = store.groups[index].chat.unseen_detail
      const index_unseen_detail = unseen_detail.findIndex(
        (item) => item.user_id === userId
      )
      const unseen = store.groups[index].chat.unseen
      if (index_unseen_detail !== -1 && unseen.indexOf(userId) !== -1) {
        setUnread(unseen_detail[index_unseen_detail].unread_count)
      }

      setState({
        selectedGroup: store.groups[index]
      })
    } else {
      setState({ selectedGroup: {} })
    }
  }, [store.groups, active])

  useEffect(() => {
    dispatch(handleTitleChat(""))
    if (state.loadingEmployee === false) {
      const q = query(
        collection(db, `${firestoreDb}/chat_groups/groups`),
        where("user", "array-contains", userId),
        orderBy("timestamp", "asc")
      )
      let listGroup = []
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const docData = change.doc
          const data = docData.data()
          const id = docData.id
          let dataGroupEmployee = {}
          let pin = 0
          const findPin = data.pin.findIndex((item) => item === userId)
          if (findPin > -1) {
            pin = 1
          }
          if (data.type === "employee") {
            const index = data.user.findIndex((item) => item !== userId)
            const employeeId = data.user[index] ? data.user[index] : 0
            const employeeIndex = state.dataEmployees.findIndex(
              (item) => item.id === employeeId
            )
            const employee = state.dataEmployees[employeeIndex]
              ? state.dataEmployees[employeeIndex]
              : state.dataEmployees[
                  state.dataEmployees.findIndex((item) => item.id === userId)
                ]
            dataGroupEmployee = {
              id: id,
              idEmployee: employee.id ? employee.id : "",
              username: employee.username ? employee.username : "",
              fullName: employee.full_name ? employee.full_name : "",
              role: employee.job_title ? employee.job_title : "",
              des: data?.des,
              about: "",
              avatar: employee.avatar ? employee.avatar : "",
              user: data.user,
              pin: pin,
              type: data.type,
              timestamp: data.timestamp,
              file_count: data.file_count,
              mute: data.mute,
              admin: data.admin,
              background: data.background,
              avatar: data.avatar,
              personalInfo: {
                email: employee.email ? employee.email : "",
                phone: employee.phone ? employee.phone : "",
                social_facebook: employee.social_facebook
                  ? employee.social_facebook
                  : "",
                social_instagram: employee.social_instagram
                  ? employee.social_instagram
                  : "",
                social_telegram: employee.social_telegram
                  ? employee.social_telegram
                  : "",
                social_twitter: employee.social_twitter
                  ? employee.social_twitter
                  : "",
                social_youtube: employee.social_youtube
                  ? employee.social_youtube
                  : ""
              }
            }
          } else {
            dataGroupEmployee = {
              id: id,
              idEmployee: "",
              username: "",
              fullName: data.name,
              role: "",
              des: data?.des,
              about: "",
              avatar: "",
              user: data.user,
              pin: pin,
              type: data.type,
              timestamp: data.timestamp,
              file_count: data.file_count,
              mute: data.mute,
              admin: data.admin,
              background: data.background,
              avatar: data.avatar,
              personalInfo: {
                email: "",
                phone: "",
                social_facebook: "",
                social_instagram: "",
                social_telegram: "",
                social_twitter: "",
                social_youtube: ""
              }
            }
          }

          let lastUser = ""
          if (data.last_user === userId) {
            lastUser = useFormatMessage("modules.chat.text.you")
          } else {
            const indexLastUser = state.dataEmployees.findIndex(
              (item) => item.id === data.last_user
            )

            if (indexLastUser > -1) {
              const employeeLastUser = state.dataEmployees[indexLastUser]
              const fullNameSplit = employeeLastUser.full_name.split(" ")
              lastUser = fullNameSplit[fullNameSplit.length - 1]
            }
          }

          // ** get count unseen
          let unseen = 0
          if (data.unseen.indexOf(userId) > -1) {
            const index_unseen_detail = data.unseen_detail.findIndex(
              (item) => item.user_id === userId
            )
            if (index_unseen_detail > -1) {
              unseen = data.unseen_detail[index_unseen_detail].unread_count
            }
          }

          if (change.type === "added") {
            if (data.is_delete !== 1) {
              listGroup = [
                {
                  ...dataGroupEmployee,
                  chat: {
                    unseenMsgs: unseen,
                    lastMessage: {
                      message: data.last_message ? data.last_message : "",
                      time: data.timestamp ? data.timestamp : ""
                    },
                    lastUser: lastUser,
                    unseen: data.unseen,
                    unseen_detail: data.unseen_detail
                  }
                },
                ...listGroup
              ]

              listGroup.sort(
                (a, b) => b.chat.lastMessage.time - a.chat.lastMessage.time
              )

              setGroups(listGroup)
            }
          }
          if (change.type === "modified") {
            const group_new = [...listGroup]
            if (data.is_delete === 1) {
              listGroup = group_new.filter((item) => item.id !== id)
              setGroups(listGroup)
            } else {
              const index_group = group_new.findIndex((item) => item.id === id)
              if (index_group > -1) {
                group_new[index_group] = {
                  ...dataGroupEmployee,
                  chat: {
                    unseenMsgs: unseen,
                    lastMessage: {
                      message: data.last_message ? data.last_message : "",
                      time: data.timestamp ? data.timestamp : ""
                    },
                    lastUser: lastUser,
                    unseen: data.unseen,
                    unseen_detail: data.unseen_detail
                  }
                }
                group_new.sort(
                  (a, b) => b.chat.lastMessage.time - a.chat.lastMessage.time
                )
                listGroup = group_new
                setGroups(listGroup)
              }
            }
          }
          if (change.type === "removed") {
            const group_new = [...listGroup]
            listGroup = group_new.filter((item) => item.id !== id)
            setGroups(listGroup)
          }
        })

        setState({ loadingGroup: false })
      })

      return () => {
        if (_.isFunction(unsubscribe)) {
          unsubscribe()
        }
      }
    }
  }, [state.loadingEmployee])

  useEffect(() => {
    getContacts()
  }, [store.groups, state.loadingEmployee])

  useEffect(() => {
    dispatch(
      handleChats({
        chats: []
      })
    )
    setEmptyHistory()
    setEmptyDataScrollBottom()
    setUnread(0)
    if (_.isEmpty(active) && _.isEmpty(activeFullName)) {
      handleDefault()
    }
    if (_.isEmpty(active) && !_.isEmpty(activeFullName)) {
      const employeeIndex = store.contacts.findIndex(
        (item) => item.username === activeFullName
      )
      const employee = store.contacts[employeeIndex]
        ? store.contacts[employeeIndex]
        : {}
      const selectedUser = {
        chat: {
          id: ""
        },
        contact: {
          id: employee.id,
          idEmployee: employee.idEmployee,
          username: employee.username,
          fullName: employee.fullName,
          role: employee.role,
          about: employee.about,
          avatar: employee.avatar,
          user: employee.user,
          admin: [],
          type: employee.type,
          personalInfo: employee.personalInfo,
          file_count: employee?.file_count || {},
          des: employee?.des
        }
      }
      setSelectedUser(selectedUser)
      setState({ loadingMessage: false })
    }
  }, [active, activeFullName])

  useEffect(() => {
    if (!_.isEmpty(active)) {
      setState({ loadingMessage: true, checkAddMessage: true })
      const _listGroup = [...store.groups]
      _.forEach(_listGroup, (value, index) => {
        if (active === value.id) {
          _listGroup[index].chat.unseenMsgs = 0
        }
      })
      setGroups(_listGroup)

      const employeeIndex = store.groups.findIndex((item) => item.id === active)
      let employeeIndexContact = -1
      if (employeeIndex === -1) {
        employeeIndexContact = store.contacts.findIndex(
          (item) => item.username === activeFullName
        )
      }
      const employee = store.groups[employeeIndex]
        ? store.groups[employeeIndex]
        : store.contacts[employeeIndexContact]
        ? store.contacts[employeeIndexContact]
        : {}
      const selectedUser = {
        chat: {
          id: active
        },
        contact: {
          id: employee.id,
          idEmployee: employee.idEmployee,
          username: employee.username,
          fullName: employee.fullName,
          role: employee.role,
          about: employee.about,
          avatar: employee.avatar,
          user: employee.user,
          admin: employee.admin,
          type: employee.type,
          personalInfo: employee.personalInfo,
          file_count: employee?.file_count || {},
          des: employee?.des
        }
      }
      setSelectedUser(selectedUser)

      // ** seen message
      handleSeenMessage(active)
      let check_seen_listener = false
      setTimeout(() => {
        check_seen_listener = true
      }, 1000)

      const q_mess = query(
        collection(db, `${firestoreDb}/chat_messages/${active}`),
        orderBy("timestamp", "desc"),
        limit(queryLimit)
      )
      let chat = []
      const unsubscribe = onSnapshot(q_mess, (querySnapshot) => {
        let _chat = []
        let check_add = false
        querySnapshot.docChanges().forEach((change) => {
          const docData = change.doc
          const data = docData.data()

          if (change.type === "added") {
            check_add = true

            // ** seen message
            const chatContainer = ReactDOM.findDOMNode(chatArea.current)
            const dataSenderId = data.sender_id
            if (
              localStorage.getItem("chatAppHidden") === "false" &&
              localStorage.getItem("chatAppFocus") === "true" &&
              check_seen_listener === true &&
              dataSenderId !== userId &&
              (chatContainer.scrollHeight -
                chatContainer.scrollTop -
                chatContainer.clientHeight <=
                200 ||
                chatContainer.scrollTop === 0)
            ) {
              handleSeenMessage(active)
            }

            _chat = [
              ..._chat,
              {
                message: data.message,
                time: data.timestamp,
                senderId: data.sender_id,
                type: data.type,
                status: data.status,
                file: data.file,
                react: data.react,
                reply: data.reply,
                forward: data.forward,
                break_type: data.break_type,
                unsent: data.unsent
              }
            ]
          }
          if (change.type === "modified") {
            const timestamp = data.timestamp
            const chat_new = [...chat]
            const index_chat = chat_new.findIndex(
              (item) => item.time === timestamp
            )
            if (index_chat > -1) {
              chat_new[index_chat] = {
                message: data.message,
                time: data.timestamp,
                senderId: data.sender_id,
                type: data.type,
                status: data.status,
                file: data.file,
                react: data.react,
                reply: data.reply,
                forward: data.forward,
                break_type: data.break_type,
                unsent: data.unsent
              }
              chat = chat_new
              dispatch(
                handleChats({
                  chats: chat
                })
              )
            }
          }
          if (change.type === "removed") {
            /* const timestamp = data.timestamp
            const chat_new = [...chat]
            chat = chat_new.filter((item) => item.time !== timestamp)
            dispatch(
              handleChats({
                chats: chat
              })
            ) */
          }
        })

        if (check_add === true) {
          const chat_reverse = _chat.reverse()
          chat = [...chat, ...chat_reverse]
          dispatch(
            handleChats({
              chats: chat
            })
          )
          setState({
            lastTimeMessageChat:
              chat_reverse.length > 0 ? chat_reverse[0].time : 0,
            lastTimeMessageHistory: chat.length > 0 ? chat[0].time : 0
          })
        }
        setState({ loadingMessage: false })
      })
      return () => {
        if (_.isFunction(unsubscribe)) {
          unsubscribe()
        }
      }
    }
  }, [active])

  useEffect(() => {
    getListEmployees()

    localStorage.setItem("chatAppHidden", false)
    localStorage.setItem("chatAppFocus", true)
    localStorage.setItem("formChatFocus", false)
  }, [])

  const onAction = (event) => {
    localStorage.setItem("chatAppHidden", event.target.hidden)
    // Do something when a user triggers a watched event
    if (event.type === "mousedown") {
    }
  }

  useEffect(() => {
    function handle(event) {
      let checkIssetDiv = false
      let checkFocusFormChat = false
      const _className_1 = event?.toElement?.offsetParent?.className
      if (!_.isUndefined(_className_1)) {
        const check_form_send_message =
          _className_1.includes("form-send-message")
        const check_form_mnw6qvm = _className_1.includes("mnw6qvm")
        if (check_form_send_message === true || check_form_mnw6qvm === true) {
          checkIssetDiv = true
          checkFocusFormChat = true
        }
      }

      const _className_2 =
        event?.toElement?.offsetParent?.offsetParent?.className
      if (!_.isUndefined(_className_2)) {
        const check_div_li_chat = _className_2.includes("div-li-chat")
        const check_list_group = _className_2.includes("list-group")
        const check_user_chats = _className_2.includes("user-chats")
        const check_chat_content_parent = _className_2.includes(
          "chat-content-parent"
        )
        const check_chat_app_form = _className_2.includes("chat-app-form")
        const check_DraftEditor_root = _className_2.includes("DraftEditor-root")
        const check_form_send_message_ =
          _className_2.includes("form-send-message")
        if (
          check_div_li_chat === true ||
          check_list_group === true ||
          check_user_chats === true ||
          check_chat_content_parent === true ||
          check_chat_app_form === true ||
          check_DraftEditor_root === true
        ) {
          checkIssetDiv = true
        }
        if (
          check_chat_app_form === true ||
          check_DraftEditor_root === true ||
          check_form_send_message_ === true
        ) {
          checkFocusFormChat = true
        }
      }

      if (!_.isUndefined(event.path)) {
        _.forEach(event.path, (item) => {
          if (
            item.className === "div-li-chat" ||
            item.className === "chat-app-window"
          ) {
            checkIssetDiv = true
          }

          if (
            item.className === "chat-app-form " ||
            item.className === "chat-app-form replying"
          ) {
            checkFocusFormChat = true
          }
        })
      }

      if (reduxUnseen > 0) {
        if (event.target.hidden === false) {
          dispatch(handleTitleChat(""))
        } else {
          dispatch(
            handleTitleChat(
              reduxUnseen > 0
                ? useFormatMessage("modules.chat.text.new_message", {
                    num: reduxUnseen
                  })
                : ""
            )
          )
        }
      }

      localStorage.setItem("chatAppFocus", checkIssetDiv)
      localStorage.setItem("formChatFocus", checkFocusFormChat)
    }

    document.addEventListener("mousedown", handle)

    return () => {
      document.addEventListener("mousedown", handle)
    }
  }, [])

  return (
    <Fragment>
      <IdleTimerProvider timeout={1000 * 60} onAction={onAction}>
        <Sidebar
          store={store}
          sidebar={sidebar}
          handleSidebar={handleSidebar}
          userSidebarLeft={userSidebarLeft}
          handleUserSidebarLeft={handleUserSidebarLeft}
          active={active}
          setActive={setActive}
          setActiveFullName={setActiveFullName}
          loadingGroup={state.loadingGroup}
          setHasMoreHistory={(value) => setState({ hasMoreHistory: value })}
          handleAddNewGroup={handleAddNewGroup}
          userId={userId}
          handleUpdateGroup={handleUpdateGroup}
          setDataUnseenDetail={setDataUnseenDetail}
          imageGroup={imageGroup}
        />
        <div className="content-right">
          <div className="content-wrapper">
            <div
              className={`content-body ${
                userSidebarRight === true ? "sidebar-right-show" : ""
              }`}>
              <div
                className={classnames("body-content-overlay", {
                  show: sidebar === true || userSidebarLeft === true
                })}
                onClick={handleOverlayClick}></div>

              <Chat
                store={store}
                handleSidebar={handleSidebar}
                userSidebarLeft={userSidebarLeft}
                handleUserSidebarRight={handleUserSidebarRight}
                settingChat={settingChat}
                userId={userId}
                sendMessage={sendMessage}
                loadingMessage={state.loadingMessage}
                chats={chats}
                chatHistory={state.chatHistory}
                getChatHistory={getChatHistory}
                active={active}
                hasMoreHistory={state.hasMoreHistory}
                chatArea={chatArea}
                scrollToBottom={scrollToBottom}
                unread={state.unread}
                handleSeenMessage={handleSeenMessage}
                updateMessage={updateMessage}
                userSidebarRight={userSidebarRight}
                windowWidth={windowWidth}
                setUserSidebarRight={setUserSidebarRight}
                dataEmployees={state.dataEmployees}
                queryLimit={queryLimit}
                scrollToMessage={scrollToMessage}
                checkAddMessage={state.checkAddMessage}
                setCheckAddMessage={(value) =>
                  setState({ checkAddMessage: value })
                }
                handleSearchMessage={handleSearchMessage}
                hasMoreChat={state.hasMoreChat}
                dataChatScrollBottom={state.dataChatScrollBottom}
                checkShowDataChat={state.checkShowDataChat}
                getChatScrollBottom={getChatScrollBottom}
                imageGroup={imageGroup}
                handleUpdateGroup={handleUpdateGroup}
                handleCountFile={handleCountFile}
                selectedGroup={state.selectedGroup}
              />

              <UserProfileSidebar
                user={user}
                userSidebarRight={userSidebarRight}
                handleUserSidebarRight={handleUserSidebarRight}
                dataEmployees={state.dataEmployees}
                userId={userId}
                groups={store.groups}
                active={active}
                handleUpdateGroup={handleUpdateGroup}
                setDataUnseenDetail={setDataUnseenDetail}
                setActive={setActive}
                setActiveFullName={setActiveFullName}
                imageGroup={imageGroup}
                selectedGroup={state.selectedGroup}
              />
            </div>
          </div>
        </div>
      </IdleTimerProvider>
    </Fragment>
  )
}

export default AppChat
