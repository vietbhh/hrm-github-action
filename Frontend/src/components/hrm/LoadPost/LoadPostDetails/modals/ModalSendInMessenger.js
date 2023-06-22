import { ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { Modal, ModalBody, ModalHeader } from "reactstrap"
import { useSelector } from "react-redux"
import ReactHtmlParser from "react-html-parser"
import { useEffect, useRef } from "react"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "firebase"

const ModalSendInMessenger = (props) => {
  const { modal, toggleModal, data, title = "", typeChat = "" } = props
  const [state, setState] = useMergedState({
    dataChat: []
  })

  const firestoreDb = process.env.REACT_APP_FIRESTORE_DB
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const avatar = userData.avatar
  const dataEmployee = useSelector((state) => state.users.list)

  const useEffectWasCalled = useRef(false)

  // ** useEffect
  useEffect(() => {
    if (modal) {
      if (useEffectWasCalled.current) return
      useEffectWasCalled.current = true

      if (firestoreDb) {
        const q = query(
          collection(db, `${firestoreDb}/chat_groups/groups`),
          where("user", "array-contains", userId),
          orderBy("timestamp", "desc")
        )
        console.log("zxc")

        getDocs(q).then((res) => {
          const dataChat = []
          res.forEach((docData) => {
            const dataGroup = docData.data()
            const idChat = docData.id
            if (dataGroup.type === "employee") {
              const index = dataGroup.user.findIndex((item) => item !== userId)
              const employeeId = dataGroup.user[index]
                ? dataGroup.user[index]
                : 0
              const employee = dataEmployee[employeeId]
                ? dataEmployee[employeeId]
                : dataEmployee[userId]

              if (!_.isEmpty(employee)) {
                dataGroup["idChat"] = idChat
                dataGroup["idEmployee"] = employee.id
                dataGroup["username"] = employee.username
                dataGroup["avatar"] = employee.avatar
                dataGroup["full_name"] = employee.full_name
                dataChat.push(dataGroup)
              }
            } else {
              dataGroup["idChat"] = idChat
              dataGroup["idEmployee"] = ""
              dataGroup["username"] = ""
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
          <div
            className="div-btn-close"
            onClick={() => toggleModalCreatePost()}>
            <i className="fa-regular fa-xmark"></i>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="div-content-post">
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
        <div className="div-input-editor">
          <Avatar className="img" src={avatar} />
          <ErpInput
            nolabel
            placeholder={useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.say_something"
            )}
          />
        </div>
        <div className="div-send-to">
          <ErpInput
            label={useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.send_to"
            )}
            placeholder={useFormatMessage(
              "modules.feed.post.modal_send_in_messenger.enter_email_or_username"
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

          <div className="recent-item">
            <Avatar className="img" src={""} />
            <span className="recent-item__text">Life. HR</span>
            <button className="recent-item__button">Send</button>
          </div>
          <div className="recent-item">
            <Avatar className="img" src={""} />
            <span className="recent-item__text">Life. HR</span>
            <button className="recent-item__button">Send</button>
          </div>
          <div className="recent-item">
            <Avatar className="img" src={""} />
            <span className="recent-item__text">Life. HR</span>
            <button className="recent-item__button">Send</button>
          </div>
          <div className="recent-item">
            <Avatar className="img" src={""} />
            <span className="recent-item__text">Life. HR</span>
            <button className="recent-item__button">Send</button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalSendInMessenger
