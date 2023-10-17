import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { renderImageReact } from "@modules/Feed/common/common"
import { Tabs } from "antd"
import { useEffect } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Modal, ModalBody } from "reactstrap"
const ReactionDetailModal = (props) => {
  const { modal, toggleModal, dataReaction, defaultActiveKey } = props
  const [state, setState] = useMergedState({
    items: []
  })
  const redux_list_user = useSelector((state) => state.users.list)
  const listReaction = ["like", "love", "care", "smile", "sad", "wow"]
  const maxHeightScreen = "50vh" //screen.height
  // ** function
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
            <Link to={`/u/${redux_list_user[item]?.username}`}>
              <span className="name">{redux_list_user[item]?.full_name}</span>
            </Link>
            <Link
              to={`/chat/${redux_list_user[item]?.username}`}
              className="ms-auto">
              <button className="d-flex align-items-center direct-message-button">
                <i className="fab fa-facebook-messenger me-50" />
                {useFormatMessage("modules.workspace.buttons.messenge")}
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
      _.forEach(value.reaction, (item) => {
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
        <small>
          +{other}{" "}
          {useFormatMessage(
            `modules.feed.post.text.${other === 1 ? "other" : "others"}`
          )}
        </small>
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
        <small>
          +{other}{" "}
          {useFormatMessage(
            `modules.feed.post.text.${other === 1 ? "other" : "others"}`
          )}
        </small>
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
          <PerfectScrollbar
            style={{
              maxHeight: maxHeightScreen
            }}
            options={{ wheelPropagation: false }}>
            {_.map(dataReaction, (value_react) => {
              return renderListUserReact(
                value_react?.reaction,
                value_react?.type
              )
            })}
            {renderOtherAll()}
          </PerfectScrollbar>
        )
      }
    ]

    _.forEach(dataReaction, (value_react) => {
      items.push({
        key: value_react?.type,
        label: (
          <div className="d-flex align-items-center">
            <img src={renderImageReact(value_react?.type)} />
            <span className="ms-50">{value_react?.reaction.length}</span>
          </div>
        ),
        children: (
          <PerfectScrollbar
            style={{
              maxHeight: maxHeightScreen
            }}
            options={{ wheelPropagation: false }}>
            {renderListUserReact(value_react?.reaction, value_react?.type)}
            {renderOtherReact(value_react?.reaction)}
          </PerfectScrollbar>
        )
      })
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
        <Tabs defaultActiveKey={defaultActiveKey} items={state.items} />
      </ModalBody>
    </Modal>
  )
}

export default ReactionDetailModal
