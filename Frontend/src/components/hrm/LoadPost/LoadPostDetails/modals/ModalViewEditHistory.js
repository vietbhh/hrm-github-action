import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import { useEffect } from "react"
import { Modal, ModalBody } from "reactstrap"
import PostHeader from "../PostDetails/PostHeader"
import {
  handleLoadAttachmentThumb,
  renderContentHashtag
} from "@modules/Feed/common/common"
import ReactHtmlParser from "react-html-parser"
import LoadPostMedia from "../LoadPostMedia"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"

const ModalViewEditHistory = (props) => {
  const { modal, toggleModal, post_id } = props
  const [state, setState] = useMergedState({
    loading: false,
    dataFeed: {},
    dataHistory: []
  })

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
  const renderContent = (content, hashtag) => {
    if (content) {
      const _hashtag = hashtag ? hashtag : []
      const _content = renderContentHashtag(content, _hashtag)
      return _content
    }
    return ""
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
                    <div className="div-history-item__header">
                      <PostHeader
                        data={state.dataFeed}
                        isViewEditHistory={true}
                      />
                    </div>
                    <div className="div-history-item__body">
                      {ReactHtmlParser(
                        renderContent(item.content, item.hashtag)
                      )}

                      <LoadPostMedia data={item} isViewEditHistory={true} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default ModalViewEditHistory
