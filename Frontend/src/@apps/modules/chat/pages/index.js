// ** Imports
import ReactDOM from "react-dom"
import { Fragment, useState, useEffect, useRef } from "react"
import classnames from "classnames"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector, useDispatch } from "react-redux"
import { ChatApi } from "../common/api"
import {
  handleChats,
  handleChatHistory,
  handleLastTimeMessage,
  handleUnread
} from "redux/chat"

// ** Chat App Component Imports
import Chat from "../components/Chat"
import Sidebar from "../components/SidebarLeft"
import UserProfileSidebar from "../components/UserProfileSidebar"

// ** firebase
import { db } from "firebase"
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  updateDoc,
  limit,
  startAt,
  arrayUnion
} from "firebase/firestore"

// ** style
import "@styles/base/pages/app-chat.scss"
import "@styles/base/pages/app-chat-list.scss"
import "../assets/scss/chat.scss"

const AppChat = (props) => {
  const [state, setState] = useMergedState({
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
      status: "online",
      settings: {
        isTwoStepAuthVerificationEnabled: true,
        isNotificationsOn: false
      }
    },
    selectedUser: {}
  })
  const [dataEmployees, setDataEmployees] = useState([])
  const [loadingEmployee, setLoadingEmployee] = useState(true)

  // ** setting
  const auth = useSelector((state) => state.auth)
  const settingChat = auth.settings.chat
  const settingUser = auth.userData
  const userId = settingUser.id

  // ** redux
  const dispatch = useDispatch()
  const chat = useSelector((state) => state.chat)
  const chats = chat.chats
  const lastTimeMessage = chat.lastTimeMessage
  const chatHistory = chat.chatHistory
  const unreadStore = chat.unread
  const queryLimit = 50

  const setUnread = (num) => {
    dispatch(handleUnread({ unread: num }))
  }

  // ** States
  const [user, setUser] = useState({})
  const [sidebar, setSidebar] = useState(false)
  const [userSidebarRight, setUserSidebarRight] = useState(false)
  const [userSidebarLeft, setUserSidebarLeft] = useState(false)
  const [active, setActive] = useState(0)
  const [activeFullName, setActiveFullName] = useState("")
  const [loadingGroup, setLoadingGroup] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState(true)
  const [hasMoreHistory, setHasMoreHistory] = useState(true)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }
  //** Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener("resize", handleWindowWidth)
    }

    if (!_.isEmpty(state.selectedUser)) {
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

  // ** Refs & Dispatch
  const chatArea = useRef(null)

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
  }

  // ** Set user function for Right Sidebar
  const handleUser = (obj) => setUser(obj)

  // ** handle state
  const setGroups = (data) => setState({ groups: data })
  const setSelectedUser = (data) => {
    setState({ selectedUser: data })
    handleUser(data.contact)
  }
  const setContacts = (data) => setState({ contacts: data })
  const setUserProfile = (data) => setState({ userProfile: data })

  // ** chat
  const getListEmployees = () => {
    ChatApi.getEmployees().then((res) => {
      setDataEmployees(res.data)
      setLoadingEmployee(false)
    })
  }

  const getContacts = () => {
    let dataEmployees_ = [...dataEmployees]
    _.forEach(state.groups, (value) => {
      dataEmployees_ = dataEmployees_.filter(
        (item) => item.full_name !== value.fullName
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
          role: value.job_title ? value.job_title : "",
          about: "",
          avatar: value.avatar ? value.avatar : "",
          status: "online",
          user: [userId, value.id]
        }
      ]
    })
    setContacts(contacts)
  }

  const handleAddNewGroup = async (docData) => {
    return await addDoc(collection(db, "groups"), docData)
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

  const sendMessage = (groupId = "", msg, dataAddFile = {}) => {
    if (!_.isEmpty(groupId)) {
      const docData = {
        message: msg,
        seen: [userId],
        sender_id: userId,
        timestamp: Date.now(),
        type: "text",
        ...dataAddFile
      }
      setDoc(doc(collection(db, groupId)), docData)
      updateDoc(doc(db, "groups", groupId), {
        last_message: handleLastMessage(docData.type, msg),
        last_user: userId,
        timestamp: Date.now(),
        new: 0
      })
    } else {
      const contact = state.selectedUser.contact
      const type = dataAddFile.type ? dataAddFile.type : "text"
      const docData = {
        last_message: handleLastMessage(type, msg),
        last_user: userId,
        name: "",
        timestamp: Date.now(),
        type: "employee",
        user: [userId, contact.idEmployee],
        new: 1,
        pin: [],
        avatar: "",
        background: ""
      }
      handleAddNewGroup(docData).then((res) => {
        const newGroupId = res.id
        setActive(newGroupId)
        const docDataMessage = {
          message: msg,
          seen: [userId],
          sender_id: userId,
          timestamp: Date.now(),
          type: "text",
          ...dataAddFile
        }
        setDoc(doc(collection(db, newGroupId)), docDataMessage)
      })
    }
  }

  const updateMessage = (groupId, timestamp, dataUpdate) => {
    if (!_.isEmpty(groupId)) {
      const q = query(
        collection(db, groupId),
        where("timestamp", "==", timestamp)
      )
      getDocs(q).then((res) => {
        let dem = 0
        let docId = ""
        res.forEach((docData) => {
          dem++
          docId = docData.id
        })
        if (dem === 0) {
          sendMessage(groupId, "", dataUpdate)
        } else {
          updateDoc(doc(db, groupId, docId), dataUpdate)
        }
      })
    } else {
      sendMessage(groupId, "", dataUpdate)
    }
  }

  const getChatHistory = (groupId = "") => {
    if (
      _.isEmpty(lastTimeMessage) &&
      !_.isEmpty(groupId) &&
      hasMoreHistory === true
    ) {
      setHasMoreHistory(false)
      const q = query(
        collection(db, groupId),
        orderBy("timestamp", "desc"),
        limit(30),
        startAt(lastTimeMessage)
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
              message: data.message + " - " + data.timestamp,
              time: data.timestamp,
              senderId: data.sender_id
            }
          ]
        })

        if (dem > 1) {
          const chat_reverse = chat.reverse()
          dispatch(
            handleChatHistory({
              chatHistory: [...chat_reverse, ...chatHistory]
            })
          )
          dispatch(
            handleLastTimeMessage({
              lastTimeMessage:
                chat_reverse.length > 0 ? chat_reverse[0].time : 0
            })
          )
          setHasMoreHistory(true)
        }
      })
    }
  }

  const handleSeenMessage = (groupId) => {
    if (!_.isEmpty(groupId)) {
      const q_mess = query(
        collection(db, groupId),
        orderBy("timestamp", "desc"),
        limit(10)
      )
      getDocs(q_mess).then((res) => {
        res.forEach((doc_mess) => {
          const docData = doc_mess.data()
          const dataSeen = docData.seen
          const dataSenderId = docData.sender_id
          if (dataSenderId !== userId && dataSeen.includes(userId) === false) {
            updateDoc(doc(db, groupId, doc_mess.id), {
              seen: [...dataSeen, userId]
            })
          }
        })

        const _listGroup = [...state.groups]
        _.forEach(_listGroup, (value, index) => {
          if (groupId === value.id) {
            _listGroup[index].chat.unseenMsgs = 0
          }
        })
        setGroups(_listGroup)
        setUnread(0)
      })
    }
  }

  const handleUnSeenMessage = (groupId) => {
    if (!_.isEmpty(groupId)) {
      const q_mess = query(
        collection(db, groupId),
        orderBy("timestamp", "desc"),
        limit(10)
      )
      getDocs(q_mess).then((res) => {
        let unseen = 0
        res.forEach((doc_mess) => {
          const docData = doc_mess.data()
          const dataSeen = docData.seen
          const dataSenderId = docData.sender_id
          if (dataSenderId !== userId && dataSeen.includes(userId) === false) {
            unseen = unseen + 1
          }
        })
        setUnread(unseen)
      })
    }
  }

  const handleUpdateGroup = async (groupId, dataUpdate) => {
    await updateDoc(doc(db, "groups", groupId), dataUpdate)
  }

  useEffect(() => {
    if (loadingEmployee === true) {
      getListEmployees()
    }
    if (loadingEmployee === false) {
      const q = query(
        collection(db, "groups"),
        where("user", "array-contains", userId),
        orderBy("timestamp", "asc")
      )
      let listGroup = []
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        for (const change of querySnapshot.docChanges()) {
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
            const employeeIndex = dataEmployees.findIndex(
              (item) => item.id === employeeId
            )
            const employee = dataEmployees[employeeIndex]
              ? dataEmployees[employeeIndex]
              : dataEmployees[
                  dataEmployees.findIndex((item) => item.id === userId)
                ]
            dataGroupEmployee = {
              id: id,
              idEmployee: employee.id ? employee.id : "",
              fullName: employee.full_name ? employee.full_name : "",
              role: employee.job_title ? employee.job_title : "",
              about: "",
              avatar: employee.avatar ? employee.avatar : "",
              status: "online",
              user: data.user,
              pin: pin,
              type: data.type,
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
              fullName: data.name,
              role: "",
              about: "",
              avatar: "",
              status: "online",
              user: data.user,
              pin: pin,
              type: data.type,
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
            const indexLastUser = dataEmployees.findIndex(
              (item) => item.id === data.last_user
            )

            if (indexLastUser > -1) {
              const employeeLastUser = dataEmployees[indexLastUser]
              const fullNameSplit = employeeLastUser.full_name.split(" ")
              lastUser = fullNameSplit[fullNameSplit.length - 1]
            }
          }

          // ** get count unseen
          let unseen = 0
          const q_mess = query(
            collection(db, id),
            orderBy("timestamp", "desc"),
            limit(10)
          )
          await getDocs(q_mess).then((res) => {
            let dem = 0
            let check_dem_unseen = true
            res.forEach((doc_mess) => {
              dem++
              const docData = doc_mess.data()
              const dataSeen = docData.seen
              const dataSenderId = docData.sender_id
              if (
                dem === 1 &&
                dataSenderId === userId &&
                dataSeen.includes(userId) === true
              ) {
                unseen = 0
                check_dem_unseen = false
              }

              if (
                check_dem_unseen === true &&
                dataSenderId !== userId &&
                dataSeen.includes(userId) === false
              ) {
                unseen = unseen + 1
              }
            })

            if (dem === 0 && unseen === 0) {
              if (data.new === 1 && data.last_user !== userId) {
                unseen = 1
              }
            }
          })

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
                  lastUser: lastUser
                }
              },
              ...listGroup
            ]

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
                  lastUser: lastUser
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
          }
        }

        setLoadingGroup(false)
      })

      return () => {
        if (_.isFunction(unsubscribe)) {
          unsubscribe()
        }
      }
    }
  }, [loadingEmployee])

  useEffect(() => {
    getContacts()
  }, [state.groups, loadingEmployee])

  useEffect(() => {
    dispatch(
      handleChats({
        chats: [],
        lastTimeMessage: 0
      })
    )
    dispatch(handleChatHistory({ chatHistory: [] }))
    setUnread(0)
    if (!_.isEmpty(active)) {
      setLoadingMessage(true)
      const _listGroup = [...state.groups]
      _.forEach(_listGroup, (value, index) => {
        if (active === value.id) {
          _listGroup[index].chat.unseenMsgs = 0
        }
      })
      setGroups(_listGroup)

      const employeeIndex = state.groups.findIndex((item) => item.id === active)
      let employeeIndexContact = -1
      if (employeeIndex === -1) {
        employeeIndexContact = state.contacts.findIndex(
          (item) => item.fullName === activeFullName
        )
      }
      const employee = state.groups[employeeIndex]
        ? state.groups[employeeIndex]
        : state.contacts[employeeIndexContact]
        ? state.contacts[employeeIndexContact]
        : {}
      const selectedUser = {
        chat: {
          id: active
        },
        contact: {
          id: employee.id,
          idEmployee: employee.idEmployee,
          fullName: employee.fullName,
          role: employee.role,
          about: employee.about,
          avatar: employee.avatar,
          status: employee.status,
          user: employee.user,
          type: employee.type,
          personalInfo: employee.personalInfo
        }
      }
      setSelectedUser(selectedUser)

      const q_mess = query(
        collection(db, active),
        orderBy("timestamp", "desc"),
        limit(queryLimit)
      )
      let chat = []
      const unsubscribe = onSnapshot(q_mess, (querySnapshot) => {
        let _chat = []
        let check_add = false
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            check_add = true
            const docData = change.doc
            const data = docData.data()

            // ** seen message
            const chatContainer = ReactDOM.findDOMNode(chatArea.current)
            const dataSeen = data.seen
            const dataSenderId = data.sender_id
            if (
              dataSenderId !== userId &&
              dataSeen.includes(userId) === false &&
              (chatContainer.scrollHeight -
                chatContainer.scrollTop -
                chatContainer.clientHeight <=
                200 ||
                chatContainer.scrollTop === 0)
            ) {
              updateDoc(doc(db, active, docData.id), {
                seen: arrayUnion(userId)
              })
            }

            _chat = [
              ..._chat,
              {
                message: data.message,
                time: data.timestamp,
                seen: data.seen,
                senderId: data.sender_id,
                type: data.type,
                status: data.status,
                file: data.file,
                react: data.react
              }
            ]
          }
          if (change.type === "modified") {
            const docData = change.doc
            const data = docData.data()
            const timestamp = data.timestamp
            const chat_new = [...chat]
            const index_chat = chat_new.findIndex(
              (item) => item.time === timestamp
            )
            if (index_chat > -1) {
              chat_new[index_chat] = {
                message: data.message,
                time: data.timestamp,
                seen: data.seen,
                senderId: data.sender_id,
                type: data.type,
                status: data.status,
                file: data.file,
                react: data.react
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
          }
        })

        if (check_add === true) {
          const chat_reverse = _chat.reverse()
          chat = [...chat, ...chat_reverse]
          dispatch(
            handleChats({
              chats: chat,
              lastTimeMessage:
                chat_reverse.length > 0 ? chat_reverse[0].time : 0
            })
          )
        }
        setLoadingMessage(false)
      })
      return () => {
        if (_.isFunction(unsubscribe)) {
          unsubscribe()
        }
      }
    }
  }, [active])

  useEffect(() => {
    if (_.isEmpty(active) && !_.isEmpty(activeFullName)) {
      const employeeIndex = state.contacts.findIndex(
        (item) => item.fullName === activeFullName
      )
      const employee = state.contacts[employeeIndex]
        ? state.contacts[employeeIndex]
        : {}
      const selectedUser = {
        chat: {
          id: ""
        },
        contact: {
          id: employee.id,
          idEmployee: employee.idEmployee,
          fullName: employee.fullName,
          role: employee.role,
          about: employee.about,
          avatar: employee.avatar,
          status: employee.status,
          user: employee.user,
          type: employee.type,
          personalInfo: employee.personalInfo
        }
      }
      setSelectedUser(selectedUser)
      setLoadingMessage(false)
    }
  }, [active, activeFullName])

  return (
    <Fragment>
      <Sidebar
        store={state}
        sidebar={sidebar}
        handleSidebar={handleSidebar}
        userSidebarLeft={userSidebarLeft}
        handleUserSidebarLeft={handleUserSidebarLeft}
        active={active}
        setActive={setActive}
        setActiveFullName={setActiveFullName}
        loadingGroup={loadingGroup}
        setHasMoreHistory={setHasMoreHistory}
        handleAddNewGroup={handleAddNewGroup}
        userId={userId}
        setSelectedUser={setSelectedUser}
        handleUpdateGroup={handleUpdateGroup}
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
              store={state}
              handleSidebar={handleSidebar}
              userSidebarLeft={userSidebarLeft}
              handleUserSidebarRight={handleUserSidebarRight}
              settingChat={settingChat}
              userId={userId}
              sendMessage={sendMessage}
              loadingMessage={loadingMessage}
              chats={chats}
              chatHistory={chatHistory}
              getChatHistory={getChatHistory}
              active={active}
              hasMoreHistory={hasMoreHistory}
              chatArea={chatArea}
              scrollToBottom={scrollToBottom}
              unread={unreadStore}
              handleSeenMessage={handleSeenMessage}
              handleUnSeenMessage={handleUnSeenMessage}
              updateMessage={updateMessage}
              userSidebarRight={userSidebarRight}
              windowWidth={windowWidth}
              setUserSidebarRight={setUserSidebarRight}
              dataEmployees={dataEmployees}
            />
            <UserProfileSidebar
              user={user}
              userSidebarRight={userSidebarRight}
              handleUserSidebarRight={handleUserSidebarRight}
              dataEmployees={dataEmployees}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AppChat
