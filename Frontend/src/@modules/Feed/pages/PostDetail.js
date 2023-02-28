import { EmptyContent } from "@apps/components/common/EmptyContent"
import { downloadApi } from "@apps/modules/download/common/api"
import {
  getAvatarUrl,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import { Skeleton } from "antd"
import React, { Fragment, useEffect } from "react"
import { useParams } from "react-router-dom"
import { handleLoadAttachmentMedias } from "../common/common"
import LoadPost from "@src/components/hrm/LoadPost/LoadPost"

const PostDetail = (props) => {
  const {} = props
  const [state, setState] = useMergedState({
    dataPost: {},
    dataMedia: [],
    loadingPost: true,
    _idMedia: "",
    dataMention: []
  })
  const { idPost, idMedia } = useParams()

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
          }
          await feedApi
            .getGetUserPost(data.created_by)
            .then((res) => {
              data["user_data"] = res.data
            })
            .catch((err) => {})

          if (
            data.source !== null &&
            (data.type === "image" || data.type === "video")
          ) {
            await downloadApi.getPhoto(data.source).then((response) => {
              data["url_thumb"] = URL.createObjectURL(response.data)
            })
          }

          if (!_.isEmpty(data.medias) && data.type === "post") {
            await handleLoadAttachmentMedias(data).then((res_promise) => {
              const check_index_media = res_promise.findIndex(
                (item) => item._id === idMedia
              )
              if (check_index_media !== -1) {
                setState({ _idMedia: idMedia })
              } else {
                setState({ _idMedia: "" })
                window.history.replaceState(null, "", current_url)
              }
              data["medias"] = res_promise
            })
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
    feedApi.getGetAllEmployeeActive().then((res) => {
      const data_mention = []
      _.forEach(res.data, (value) => {
        data_mention.push({
          id: value.id,
          name: value.full_name,
          link: "#",
          avatar: getAvatarUrl(value.id * 1)
        })
      })

      setState({ dataMention: data_mention })
    })
  }, [])

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
              />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default PostDetail
