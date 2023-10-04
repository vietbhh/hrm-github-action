import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import { handleLoadAttachmentThumb } from "@modules/Feed/common/common"
import { useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import { Link } from "react-router-dom"
import { Modal, ModalBody } from "reactstrap"
import LoadPost from "../../LoadPost"

import PerfectScrollbar from "react-perfect-scrollbar"
const ModalViewEditHistory = (props) => {
  const { modal, toggleModal, post_id } = props
  const [state, setState] = useMergedState({
    loading: false,
    dataFeed: {},
    dataHistory: []
  })
  const maxHeightScreen = "50vh" // screen.height - (screen.height * 50) / 100
  // ** useEffect
  useEffect(() => {
    if (modal && post_id) {
      setState({ loading: true })
      feedApi
        .getGetDataEditHistory(post_id)
        .then(async (res) => {
          const promises = []
          _.forEach(res.data.dataHistory, async (item, index) => {
            const promise = new Promise(async (resolve, reject) => {
              const _dataPost = { ...item }
              if (_dataPost["thum"] === undefined) {
                _dataPost["thumb"] = res.data.dataFeed?.thumb
              }
              const data_attachment = await handleLoadAttachmentThumb(
                _dataPost,
                ""
              )
              _dataPost["url_thumb"] = data_attachment["url_thumb"]
              _dataPost["url_cover"] = data_attachment["url_cover"]
              _dataPost["medias"] = data_attachment["medias"]

              resolve(_dataPost)
            })

            promises.push(promise)
          })

          const dataPost = await Promise.all(promises).then((res_promise) => {
            return res_promise
          })

          setState({
            loading: false,
            dataFeed: res.data.dataFeed,
            dataHistory: dataPost
          })
        })
        .catch((err) => {
          setState({ loading: false, dataFeed: {}, dataHistory: [] })
        })
    }
  }, [modal, post_id])

  // ** render
  const renderHistory = (item) => {
    if (
      item.type === "announcement" ||
      item.type === "event" ||
      item.type === "endorsement"
    ) {
      let content = ""
      if (item.content) {
        content = "Content: " + item.content
      }
      if (item.details) {
        content = "Details: " + item.details
      }

      return (
        <div className="load-post">
          <div className="div-history-item__header">
            <div className="post-header">
              <Link
                to={``}
                onClick={(e) => {
                  e.preventDefault()
                }}>
                <Avatar className="img" src={item?.created_by?.avatar} />
              </Link>
              <div className="post-header-title">
                <div className="div-name">
                  <Link
                    to={``}
                    onClick={(e) => {
                      e.preventDefault()
                    }}>
                    <span className="name">
                      {item?.created_by?.full_name || ""}
                    </span>{" "}
                  </Link>
                  <span className="after-name">
                    {useFormatMessage(
                      "modules.feed.post.text.this_post_has_been_edited"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="div-history-item__body">
            {ReactHtmlParser(content)}
          </div>
        </div>
      )
    }

    return <LoadPost data={item} isViewEditHistory={true} />
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        toggleModal()
      }}
      className="feed modal-reaction-detail modal-member-vote modal-view-edit-history"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalBody>
        <button
          type="button"
          className="btn-close-modal"
          onClick={() => toggleModal()}>
          <i className="fa-sharp fa-solid fa-xmark"></i>
        </button>
        <div className="text-center mt-50 mb-1">
          <span className="text-title">
            {useFormatMessage(`modules.feed.post.text.history`)}
          </span>
        </div>

        {state.loading && <DefaultSpinner />}
        <PerfectScrollbar
          style={{
            maxHeight: maxHeightScreen
          }}>
          {!state.loading && (
            <div className="div-body">
              {_.map(state.dataHistory, (item, index) => {
                return (
                  <div key={index} className="div-history">
                    <div className="text-time">
                      {useFormatMessage("modules.feed.post.text.edited_at")}:{" "}
                      {timeDifference(item.edited_at)}
                    </div>
                    <div className="div-history-item">
                      <div className="load-feed">{renderHistory(item)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </PerfectScrollbar>
      </ModalBody>
    </Modal>
  )
}

export default ModalViewEditHistory
