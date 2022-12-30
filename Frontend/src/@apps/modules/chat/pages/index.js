// ** Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classnames from "classnames"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { IdleTimerProvider } from "react-idle-timer"
import { useDispatch, useSelector } from "react-redux"
import { handleChats } from "redux/chat"
import { ChatApi } from "../common/api"
import { triGram } from "../common/common"
import SocketContext from "utility/context/Socket"
import { useParams } from "react-router-dom"
import notification from "@apps/utility/notification"

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

    // ** idleTimer
    chatAppHidden: false,
    chatAppFocus: false,

    // ** params url
    checkLoadUrlActiveId: true
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

  // ** params
  const { id } = useParams()
  useEffect(() => {
    if (
      id !== "" &&
      id !== undefined &&
      !_.isEmpty(store.groups) &&
      state.checkLoadUrlActiveId === true
    ) {
      setState({ checkLoadUrlActiveId: false })
      const index_group = store.groups.findIndex((item) => item.id === id)
      if (index_group !== -1) {
        setActive(id)
        setActiveFullName(store.groups[index_group].username)
      } else {
        const index_group = store.groups.findIndex(
          (item) => item.username === id
        )
        if (index_group !== -1) {
          setActive(store.groups[index_group].id)
          setActiveFullName(store.groups[index_group].username)
        } else {
          const index_employee = state.dataEmployees.findIndex(
            (item) => item.username === id
          )
          if (index_employee !== -1) {
            setActive("")
            setActiveFullName(state.dataEmployees[index_employee].username)
          } else {
            notification.showWarning({
              text: useFormatMessage(
                "modules.chat.notification.user_is_not_active"
              )
            })
            window.history.replaceState(null, "", "/chat")
          }
        }
      }
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

  // ** redux
  const dispatch = useDispatch()
  const chat = useSelector((state) => state.chat)
  const chats = chat.chats
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
                    forward: data.forward
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
      ...docData,
      mute: [],
      pin: [],
      avatar: "",
      background: "",
      file_count: {}
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

  const handleCountFile = (groupId, type) => {
    const index_groups = store.groups.findIndex((item) => item.id === groupId)
    let file_count = {}
    if (index_groups !== 1) {
      const group_file_count = store.groups[index_groups]?.file_count || {}
      if (type === "link") {
        const count_link = group_file_count?.link
          ? group_file_count?.link + 1
          : 1
        file_count = { ...group_file_count, link: count_link }
      } else if (type === "image" || type === "image_gif") {
        const count_image = group_file_count?.image
          ? group_file_count?.image + 1
          : 1
        file_count = { ...group_file_count, image: count_image }
      } else if (type === "file" || type === "audio" || type === "video") {
        const count_file = group_file_count?.file
          ? group_file_count?.file + 1
          : 1
        file_count = { ...group_file_count, file: count_file }
      }
    }

    return file_count
  }

  const sendMessage = (groupId = "", msg, dataAddFile = {}) => {
    setState({ checkAddMessage: true })

    const file_count = handleCountFile(groupId, dataAddFile.type)

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
        const timestamp = Date.now()

        const docData = {
          message: msg,
          sender_id: userId,
          timestamp: timestamp,
          type: "text",
          ...dataAddFile
        }
        if (docData.type === "text") {
          docData["_smeta"] = triGram(msg.slice(0, 500))
        }
        setDoc(
          doc(collection(db, `${firestoreDb}/chat_messages/${groupId}`)),
          docData
        )

        // ** noti
        /* socket.emit("send_data_to_users", {
          receiver: 1,
          key: "chat_notification",
          data: {
            title: "Trịnh Hải Long 111",
            body: msg,
            senderType: "user",
            sender: userId,
            link: "#"
          }
        }) */

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
      const timestamp = Date.now()
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
          ...dataAddFile
        }
        if (docDataMessage.type === "text") {
          docDataMessage["_smeta"] = triGram(msg.slice(0, 500))
        }

        setDoc(
          doc(collection(db, `${firestoreDb}/chat_messages/${newGroupId}`)),
          docDataMessage
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
          updateDoc(
            doc(db, `${firestoreDb}/chat_messages/${groupId}`, docId),
            dataUpdate
          )
          if (dataUpdate.status === "success") {
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
              forward: data.forward
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
                  forward: data.forward
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
                  forward: data.forward
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
    }
  }, [store.groups, active])

  useEffect(() => {
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
          if (change.type === "modified") {
            const group_new = [...listGroup]
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
          personalInfo: employee.personalInfo
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
          file_count: employee?.file_count || {}
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
                forward: data.forward
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
                forward: data.forward
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

  // ** idleTimer
  const onIdle = () => {
    // Close Modal Prompt
    // Do some idle action like log out your user
  }

  const onActive = (event) => {
    // Close Modal Prompt
    // Do some active action
  }

  const onAction = (event) => {
    // Do something when a user triggers a watched event
    if (event.type !== "mousemove") {
      let checkIssetDiv = false
      let checkFocusFormChat = false
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
      localStorage.setItem("chatAppHidden", event.target.hidden)
      localStorage.setItem("chatAppFocus", checkIssetDiv)
      localStorage.setItem("formChatFocus", checkFocusFormChat)
    }
  }

  return (
    <Fragment>
      <IdleTimerProvider
        timeout={1000 * 60}
        onIdle={onIdle}
        onActive={onActive}
        onAction={onAction}>
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
              />
            </div>
          </div>
        </div>
      </IdleTimerProvider>
    </Fragment>
  )
}

export default AppChat
