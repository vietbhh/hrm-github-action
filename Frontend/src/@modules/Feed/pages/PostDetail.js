import { EmptyContent } from "@apps/components/common/EmptyContent"
import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import LoadPost from "@src/components/hrm/LoadPost/LoadPost"
import { Skeleton } from "antd"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import {
  handleDataMention,
  handleLoadAttachmentMedias,
  handleLoadAttachmentThumb
} from "../common/common"

const PostDetail = (props) => {
  const {
    customAction = {} // custom dropdown post header
  } = props
  const [state, setState] = useMergedState({
    dataPost: {},
    dataMedia: [],
    loadingPost: true,
    _idMedia: "",
    dataMention: []
  })
  const { idPost, idMedia } = useParams()

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const cover = userData?.cover || ""
  const dataEmployee = useSelector((state) => state.users.list)
  const current_url = `/posts/${idPost}`

  // ** useEffect
  useEffect(() => {
    setState({ loadingPost: true })
    feedApi
      .getGetFeed(idPost)
      .then(async (res) => {
        if (!_.isEmpty(res.data)) {
          const data = res.data
          if (idPost === idMedia) {
            setState({ _idMedia: idMedia })
          } else {
            setState({ _idMedia: "" })
            window.history.replaceState(null, "", current_url)
          }

          const data_attachment = await handleLoadAttachmentThumb(data, cover)
          data["url_thumb"] = data_attachment["url_thumb"]
          data["url_cover"] = data_attachment["url_cover"]
          data["medias"] = data_attachment["medias"]

          if (!_.isEmpty(data.medias)) {
            const check_index_media = data.medias.findIndex(
              (item) => item._id === idMedia
            )
            if (check_index_media !== -1) {
              setState({ _idMedia: idMedia })
            } else {
              setState({ _idMedia: "" })
              window.history.replaceState(null, "", current_url)
            }
          }

          setState({ loadingPost: false, dataPost: data })
        } else {
          setState({ loadingPost: false, dataPost: {} })
        }
      })
      .catch((err) => {
        setState({ loadingPost: false })
      })
  }, [idPost, idMedia])

  useEffect(() => {
    const data_mention = handleDataMention(dataEmployee, userId)
    setState({ dataMention: data_mention })
  }, [dataEmployee])

  return (
    <Fragment>
      <div className="div-content div-posts">
        <div className="div-left feed">
          <div className="load-feed">
            {state.loadingPost && (
              <div className="div-loading">
                <Skeleton avatar active paragraph={{ rows: 2 }} />
              </div>
            )}

            {!state.loadingPost && _.isEmpty(state.dataPost) && (
              <div className="load-post">
                <EmptyContent
                  title={useFormatMessage(
                    "modules.feed.post.text.post_not_found"
                  )}
                />
              </div>
            )}

            {!state.loadingPost && !_.isEmpty(state.dataPost) && (
              <LoadPost
                data={state.dataPost}
                current_url={current_url}
                idMedia={state._idMedia}
                setIdMedia={(value) => setState({ _idMedia: value })}
                dataMention={state.dataMention}
                setData={(data, empty = false, dataCustom = {}) => {
                  if (empty) {
                    setState({ dataPost: {} })
                  } else {
                    setState({
                      dataPost: {
                        ...data,
                        url_thumb: state.dataPost.url_thumb,
                        url_source: state.dataPost.url_source,
                        medias: state.dataPost.medias,
                        ...dataCustom
                      }
                    })
                  }
                }}
                customAction={customAction}
              />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default PostDetail
