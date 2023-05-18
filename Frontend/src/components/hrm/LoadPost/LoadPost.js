import LinkPreview from "@apps/components/link-preview/LinkPreview"
import { useMergedState } from "@apps/utility/common"
import { arrImage } from "@modules/Feed/common/common"
import classNames from "classnames"
import React, { useEffect } from "react"
import LoadPostMedia from "./LoadPostDetails/LoadPostMedia"
import ButtonReaction from "./LoadPostDetails/PostDetails/ButtonReaction"
import PostComment from "./LoadPostDetails/PostDetails/PostComment"
import PostHeader from "./LoadPostDetails/PostDetails/PostHeader"
import PostShowReaction from "./LoadPostDetails/PostDetails/PostShowReaction"
import RenderContentPost from "./LoadPostDetails/PostDetails/RenderContentPost"
import RenderPollVote from "./LoadPostDetails/PostDetails/RenderPollVote"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { eventApi } from "@modules/Feed/common/api"
import RenderPostEvent from "./LoadPostDetails/PostDetails/RenderPostEvent"

const LoadPost = (props) => {
  const {
    data, // data post
    current_url, // current url (vd: /feed)
    dataMention, // data arr user tag [{id: id, name: name,link: "#", avatar: getAvatarUrl(value.id * 1)}]
    offReactionAndComment = false, // tắt div reaction, comment: true / false
    setData, // function set lại data khi react, comment
    customAction = {}, // custom dropdown post header
    offPostHeaderAction = false, // hide Post header action
    renderAppendHeaderComponent,
    // only page post details
    idMedia = "",
    setIdMedia = null // function set idMedia
  } = props
  const [state, setState] = useMergedState({
    comment_more_count_original: data.comment_more_count,
    focusCommentForm: false,
    loadingDataLink: false,
    dataLink: {}
  })

  // ** function
  const setCommentMoreCountOriginal = (value = 0) => {
    setState({ comment_more_count_original: value })
  }
  const setFocusCommentForm = (value) => setState({ focusCommentForm: value })

  // ** useEffect
  useEffect(() => {
    if (data?.type === "event" && data?.link_id !== null) {
      setState({ loadingDataLink: true })
      eventApi
        .getGetEventById(data?.link_id)
        .then((res) => {
          setState({ loadingDataLink: false, dataLink: res.data })
        })
        .catch((err) => {
          setState({ loadingDataLink: false, dataLink: {} })
        })
    }
  }, [])

  // ** render
  const renderBody = () => {
    if (state.loadingDataLink) {
      return <DefaultSpinner />
    }

    if (data.type === "link" && data.link[0]) {
      return (
        <LinkPreview
          url={data.link[0]}
          maxLine={2}
          minLine={2}
          showGraphic={true}
          defaultImage={`${process.env.REACT_APP_URL}/assets/images/link.png`}
        />
      )
    }

    if (data.source !== null || !_.isEmpty(data.medias)) {
      return (
        <LoadPostMedia
          data={data}
          current_url={current_url}
          idMedia={idMedia}
          setIdMedia={setIdMedia}
          dataMention={dataMention}
          setData={setData}
          setCommentMoreCountOriginal={setCommentMoreCountOriginal}
          customAction={customAction}
        />
      )
    }

    if (data.type === "event") {
      return <RenderPostEvent dataLink={state.dataLink} />
    }

    return ""
  }

  const renderStyleBackgroundImage = () => {
    if (
      data.type === "background_image" &&
      data.background_image &&
      arrImage[data.background_image - 1]
    ) {
      return {
        backgroundImage: `url("${arrImage[data.background_image - 1].image}")`,
        color: arrImage[data.background_image - 1].color
      }
    }

    return {}
  }

  return (
    <div className="load-post">
      <PostHeader
        data={data}
        customAction={customAction}
        setData={setData}
        offPostHeaderAction={offPostHeaderAction}
        renderAppendHeaderComponent={renderAppendHeaderComponent}
      />
      <div
        className={classNames("post-body", {
          "post-body__background-image": data.type === "background_image",
          "post-post": data.source === null && _.isEmpty(data.medias),
          "post-media": data.source !== null || !_.isEmpty(data.medias)
        })}
        style={renderStyleBackgroundImage()}>
        <div id={`post-body-content-${data._id}`} className="post-body-content">
          <RenderContentPost data={data} />
        </div>

        {renderBody()}

        {data.has_poll_vote === true && (
          <RenderPollVote
            data={data}
            setData={setData}
            comment_more_count_original={state.comment_more_count_original}
          />
        )}
      </div>
      {!offReactionAndComment && (
        <>
          <div className="post-footer">
            <PostShowReaction data={data} />
            <div className="post-footer-button">
              <ButtonReaction
                data={data}
                setData={setData}
                comment_more_count_original={state.comment_more_count_original}
                setCommentMoreCountOriginal={setCommentMoreCountOriginal}
                setFocusCommentForm={setFocusCommentForm}
              />
            </div>
          </div>
          <PostComment
            data={data}
            dataMention={dataMention}
            setData={setData}
            comment_more_count_original={state.comment_more_count_original}
            setCommentMoreCountOriginal={setCommentMoreCountOriginal}
            focusCommentForm={state.focusCommentForm}
            setFocusCommentForm={setFocusCommentForm}
          />
        </>
      )}
    </div>
  )
}

export default LoadPost
