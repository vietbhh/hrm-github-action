import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"
import { Tabs } from "antd"
import { useEffect } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Modal, ModalBody } from "reactstrap"

const ReactionDetailModal = (props) => {
  const { modal, toggleModal, dataReaction } = props
  const [state, setState] = useMergedState({
    items: []
  })
  const redux_list_user = useSelector((state) => state.users.list)
  const listReaction = ["like", "love", "care", "smile", "sad", "wow"]

  // ** function
  const renderImageReact = (type) => {
    switch (type) {
      case "like":
        return img_like

      case "love":
        return img_love

      case "care":
        return img_care

      case "smile":
        return img_smile

      case "sad":
        return img_sad

      case "wow":
        return img_wow

      default:
        return useFormatMessage("modules.feed.post.text.other")
    }
  }

  const renderListUserReact = (value, image) => {
    return _.map(
      _.filter(value, (item_filter) => {
        return redux_list_user[item_filter]
      }),
      (item, key) => {
        return (
          <div
            key={key}
            className="mb-1 d-flex align-items-center list-user-react">
            <Avatar className="img me-1" src={redux_list_user[item]?.avatar} />
            <div
              className="image-react-avatar"
              style={{
                backgroundImage: `url("${renderImageReact(image)}")`
              }}></div>
            <span className="name">{redux_list_user[item]?.full_name}</span>
            <Link
              to={`/chat/${redux_list_user[item]?.username}`}
              className="ms-auto">
              <button className="btn-chat">
                {useFormatMessage("modules.feed.post.text.chat")}
              </button>
            </Link>
          </div>
        )
      }
    )
  }

  const renderOtherAll = () => {
    let other = 0
    _.forEach(dataReaction, (value) => {
      _.forEach(value, (item) => {
        if (!redux_list_user[item]) {
          other++
        }
      })
    })
    if (other === 0) {
      return ""
    }

    return (
      <div className="mb-1">
        <span>
          {useFormatMessage("modules.feed.post.text.and")} {other}{" "}
          {useFormatMessage(
            `modules.feed.post.text.${other === 1 ? "other" : "others"}`
          )}
        </span>
      </div>
    )
  }

  const renderOtherReact = (value) => {
    let other = 0
    _.forEach(value, (item) => {
      if (!redux_list_user[item]) {
        other++
      }
    })
    if (other === 0) {
      return ""
    }

    return (
      <div className="mb-1">
        <span>
          {useFormatMessage("modules.feed.post.text.and")} {other}{" "}
          {useFormatMessage(
            `modules.feed.post.text.${other === 1 ? "other" : "others"}`
          )}
        </span>
      </div>
    )
  }

  // ** useEffect
  useEffect(() => {
    const items = [
      {
        key: "all",
        label: useFormatMessage("modules.feed.post.text.all"),
        children: (
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            {_.map(
              _.filter(listReaction, (item_filter) => {
                return dataReaction[item_filter]
              }),
              (value) => {
                return renderListUserReact(dataReaction[value], value)
              }
            )}

            {renderOtherAll()}
          </PerfectScrollbar>
        )
      }
    ]

    _.forEach(listReaction, (value_react) => {
      if (dataReaction[value_react]) {
        items.push({
          key: value_react,
          label: (
            <div className="d-flex align-items-center">
              <img src={renderImageReact(value_react)} />
              <span className="ms-50">{dataReaction[value_react].length}</span>
            </div>
          ),
          children: (
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              {renderListUserReact(dataReaction[value_react], value_react)}
              {renderOtherReact(dataReaction[value_react])}
            </PerfectScrollbar>
          )
        })
      }
    })

    setState({ items: items })
  }, [dataReaction])

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        toggleModal()
      }}
      className="modal-md feed modal-reaction-detail"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody>
        <button
          type="button"
          className="btn-close-modal"
          onClick={() => toggleModal()}>
          <i className="fa-sharp fa-solid fa-xmark"></i>
        </button>
        <Tabs defaultActiveKey="1" items={state.items} />
      </ModalBody>
    </Modal>
  )
}

export default ReactionDetailModal
