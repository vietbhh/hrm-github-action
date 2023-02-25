import React, { Fragment, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import "../assets/scss/feed.scss"
import { Skeleton } from "antd"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import { Card, CardBody } from "reactstrap"
import LoadPost from "../components/LoadFeedDetails/LoadPost"
import { downloadApi } from "@apps/modules/download/common/api"
import { handleLoadAttachmentMedias } from "../common/common"

const PostDetail = (props) => {
  const {} = props
  const [state, setState] = useMergedState({
    dataPost: {},
    dataMedia: [],
    loadingPost: true
  })
  const { idPost, idMedia } = useParams()

  console.log(idPost, idMedia)
  const current_url =
    window.location.pathname.split("/")[0] +
    "/" +
    window.location.pathname.split("/")[1] +
    "/" +
    window.location.pathname.split("/")[2]

  // ** useEffect
  useEffect(() => {
    setState({ loadingPost: true })
    feedApi
      .getGetFeed(idPost)
      .then(async (res) => {
        if (!_.isEmpty(res.data)) {
          const data = res.data
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
              <LoadPost data={state.dataPost} current_url={current_url} />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default PostDetail
