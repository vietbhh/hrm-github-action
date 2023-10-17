import { ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { Modal, ModalBody, ModalHeader, Spinner } from "reactstrap"
import { useSelector } from "react-redux"
import ReactHtmlParser from "react-html-parser"
import { Fragment, useContext, useEffect, useRef } from "react"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "@/firebase"
import { renderAvatar, detectUrl } from "@apps/modules/chat/common/common"
import PerfectScrollbar from "react-perfect-scrollbar"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import SocketContext from "utility/context/Socket"
import { handleSendMessage } from "@apps/modules/chat/common/firebaseCommon"
import notification from "@apps/utility/notification"
import Video from "@apps/modules/chat/components/details/Video"
import { arrImage } from "@modules/Feed/common/common"
import classNames from "classnames"

const ModalSendInMessenger = (props) => {
  const { modal, toggleModal, data, title = "", typeChat = "" } = props
  const [state, setState] = useMergedState({
    dataChat: [],
    dataFilter: [],
    filterChat: "",
    arrEmployee: [],
    arrSent: [],
    loading: {},
    textSaySomething: ""
  })

  const firestoreDb = import.meta.env.VITE_APP_FIRESTORE_DB
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const avatar = userData.avatar
  const userFullName = userData.full_name
  const dataEmployee = useSelector((state) => state.users.list)
  const socket = useContext(SocketContext)

  const useEffectWasCalled = useRef(false)

  // ** function
  const handleFilter = (e) => {
    setState({ filterChat: e.target.value })
    const searchFilterFunction = (item) =>
      item.full_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      item.username.toLowerCase().includes(e.target.value.toLowerCase())
    const filteredChatsArr =
      typeChat === "employee"
        ? state.arrEmployee.filter(searchFilterFunction)
        : state.dataChat.filter(searchFilterFunction)
    setState({ dataFilter: [...filteredChatsArr] })
  }

  const setArrSent = (id, idEmployee) => {
    const arrSent = [...state.arrSent]
    if (id) {
      arrSent.push(id)
    }
    if (idEmployee) {
      arrSent.push(idEmployee)
    }
    setState({ arrSent: arrSent })
  }

  const setLoading = (id, status) => {
    const loading = { ...state.loading }
    loading[id] = status
    setState({ loading: loading })
  }

  // ** useEffect
  useEffect(() => {
    if (modal) {
      setState({
        filterChat: "",
        textSaySomething: "",
        arrSent: [],
        loading: {}
      })

      if (useEffectWasCalled.current) return
      useEffectWasCalled.current = true

      const arrEmployee = []
      _.forEach(dataEmployee, (item) => {
        arrEmployee.push(item)
      })
      setState({ arrEmployee: arrEmployee })

      if (firestoreDb) {
        const q = query(
          collection(db, `${firestoreDb}/chat_groups/groups`),
          where("user", "array-contains", userId),
          orderBy("timestamp", "desc")
        )

        getDocs(q).then((res) => {
          const dataChat = []
          res.forEach((docData) => {
            const dataGroup = docData.data()
            const id = docData.id
            if (dataGroup.type === "employee") {
              const index = dataGroup.user.findIndex((item) => item !== userId)
              const employeeId = dataGroup.user[index]
                ? dataGroup.user[index]
                : 0
              const employee = dataEmployee[employeeId]
                ? dataEmployee[employeeId]
                : dataEmployee[userId]

              if (!_.isEmpty(employee)) {
                dataGroup["idChat"] = id
                dataGroup["id"] = id
                dataGroup["idEmployee"] = employee.id
                dataGroup["username"] = employee.username
                dataGroup["email"] = employee.email
                dataGroup["avatar"] = employee.avatar
                dataGroup["full_name"] = employee.full_name
                dataChat.push(dataGroup)
              }
            } else {
              dataGroup["idChat"] = id
              dataGroup["id"] = id
              dataGroup["idEmployee"] = ""
              dataGroup["username"] = ""
              dataGroup["email"] = ""
              dataGroup["avatar"] = dataGroup.avatar
              dataGroup["full_name"] = dataGroup.name
              dataChat.push(dataGroup)
            }
          })
          setState({ dataChat: dataChat })
        })
      }
    }
  }, [modal, useEffectWasCalled, dataEmployee])

  // ** render
  const renderContent = () => {
    if (data?.content) return ReactHtmlParser(data?.content)
    if (data?.dataLink?.title) return ReactHtmlParser(data?.dataLink?.title)
    if (data?.dataLink?.name) return ReactHtmlParser(data?.dataLink?.name)
    if (data?.dataLink?.content) return ReactHtmlParser(data?.dataLink?.content)

    return ""
  }

  const renderImage = () => {
    if (data.type === "video") {
      return <Video src={data.source} width="200" height="100" />
    }

    if (data?.url_thumb) {
      return (
        <div className="div-content-post__image">
          <img src={data.url_thumb} />
        </div>
      )
    }

    if (data?.medias?.[0]?.url_thumb) {
      return (
        <div className="div-content-post__image">
          <img src={data.medias[0].url_thumb} />
        </div>
      )
    }

    return ""
  }

  const renderListMessenger = () => {
    const filterType = (val) => val.type === typeChat
    const arrToMap = state.filterChat.length
      ? typeChat === "employee"
        ? state.dataFilter
        : state.dataFilter.filter(filterType)
      : state.dataChat.filter(filterType).splice(0, 5)

    if (arrToMap.length === 0) return <EmptyContent text={""} />
    return _.map(arrToMap, (item) => {
      const id = item.id ? item.id : item.idEmployee
      return (
        <div key={item.id} className="recent-item">
          {renderAvatar(item, "", "45", "45")}
          <div className="recent-item__div-name">
            <span className="recent-item__text">{item.full_name}</span>
            <span className="recent-item__username">
              {item.username && `@${item.username}`}
            </span>
          </div>
          <button
            className="recent-item__button"
            disabled={
              state.loading[id] ||
              state.arrSent.indexOf(id) !== -1 ||
              state.arrSent.indexOf(item.idEmployee) !== -1
            }
            onClick={() => {
              setLoading(id, true)
              setTimeout(async () => {
                const link_post = `${import.meta.env.VITE_APP_URL}/posts/${
                  data.ref ? data.ref : data._id
                }`
                const msg = state.textSaySomething + " <br />" + link_post
                const arr_link = detectUrl(msg, true)
                let dataAddLink = {}
                if (!_.isEmpty(arr_link)) {
                  dataAddLink = { type: "link", file: arr_link }
                }
                await handleSendMessage(
                  item.idChat ? item.idChat : "",
                  msg,
                  dataAddLink,
                  userId,
                  userFullName,
                  [],
                  item.id ? item.id : item.idEmployee,
                  socket
                )
                setArrSent(id, item.idEmployee)
                setLoading(id, false)
                notification.showSuccess({
                  text: useFormatMessage("notification.success")
                })
              }, 500)
            }}>
            {state.loading[id] && <Spinner size={"sm"} />}
            {!state.loading[id] &&
              (state.arrSent.indexOf(id) !== -1 ||
              state.arrSent.indexOf(item.idEmployee) !== -1
                ? useFormatMessage(
                    "modules.feed.post.modal_send_in_messenger.sent"
                  )
                : useFormatMessage("modules.feed.post.text.send"))}
          </button>
        </div>
      )
    })
  }

  const renderContentPost = () => {
    let style = {}
    
    if (data.type === "background_image") {
      const backgroundImage = data.background_image
      if (backgroundImage && arrImage[backgroundImage - 1]) {
        style = {
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundImage: `url("${arrImage[backgroundImage - 1].image}")`,
          color: `${arrImage[backgroundImage - 1].color}`
        }
      }
    }

    return (
      <div
          className={classNames("div-content-post", {
            "has-bg": data.type === "background_image"
          })}
          style={style}>
          <div className="div-content-post__content">
            <div className="content-header">
              <Avatar className="img" src={data?.created_by?.avatar} />
              <div className="content-header__name">
                <span className="name-title">
                  {data?.created_by?.full_name}
                </span>
                <span className="name-time">
                  {timeDifference(data.created_at)}
                </span>
              </div>
            </div>
            <div className="content-body">{renderContent()}</div>
          </div>

          {renderImage()}
        </div>
    )
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        toggleModal()
      }}
      className="modal-md feed modal-create-post modal-send-in-messenger"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <div className="div-header-title">
          <span className="text-title">{title}</span>
          <div className="div-btn-close" onClick={() => toggleModal()}>
            <i className="fa-regular fa-xmark"></i>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <Fragment>{renderContentPost()}</Fragment>
        <div className="div-input-editor">
          <Avatar className="img" src={avatar} />
          <ErpInput
            nolabel
            placeholder={useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.say_something"
            )}
            value={state.textSaySomething}
            onChange={(e) => setState({ textSaySomething: e.target.value })}
          />
        </div>
        <div className="div-send-to">
          <ErpInput
            value={state.filterChat}
            onChange={handleFilter}
            label={useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.send_to"
            )}
            placeholder={useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.enter_name_or_username"
            )}
            prepend={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none">
                <path
                  d="M9.58341 17.5C13.9557 17.5 17.5001 13.9556 17.5001 9.58334C17.5001 5.21108 13.9557 1.66667 9.58341 1.66667C5.21116 1.66667 1.66675 5.21108 1.66675 9.58334C1.66675 13.9556 5.21116 17.5 9.58341 17.5Z"
                  stroke="#969191"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3334 18.3333L16.6667 16.6667"
                  stroke="#969191"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>
        <div className="div-recent">
          <label className="form-label mb-1">
            {useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.recent"
            )}
          </label>

          <PerfectScrollbar className="" options={{ wheelPropagation: false }}>
            {renderListMessenger()}
          </PerfectScrollbar>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalSendInMessenger
