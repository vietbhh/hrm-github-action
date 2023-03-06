import { useMergedState } from "@apps/utility/common"
import React from "react"
import LoadPostMedia from "./LoadPostDetails/LoadPostMedia"
import ButtonReaction from "./LoadPostDetails/PostDetails/ButtonReaction"
import PostComment from "./LoadPostDetails/PostDetails/PostComment"
import PostHeader from "./LoadPostDetails/PostDetails/PostHeader"
import PostShowReaction from "./LoadPostDetails/PostDetails/PostShowReaction"
import RenderContentPost from "./LoadPostDetails/PostDetails/RenderContentPost"

const LoadPost = (props) => {
  const {
    data, // data post
    current_url, // current url (vd: /feed)
    dataMention, // data arr user tag [{id: id, name: name,link: "#", avatar: getAvatarUrl(value.id * 1)}]
    offReactionAndComment = false, // tắt div reaction, comment: true / false
    setData, // function set lại data khi react, comment

    // only page post details
    idPost = "",
    idMedia = "",
    setIdMedia = null, // function set idMedia
    reloadPostThenCloseModal = false
  } = props
  const [state, setState] = useMergedState({})

  // ** useEffect

  // ** render

  return (
    <div className="load-post">
      <PostHeader data={data} />
      <div className="post-body">
        <div id={`post-body-content-${data._id}`} className="post-body-content">
          <RenderContentPost data={data} />
        </div>
        <LoadPostMedia
          data={data}
          current_url={current_url}
          idPost={idPost}
          idMedia={idMedia}
          setIdMedia={setIdMedia}
          dataMention={dataMention}
          setData={setData}
          reloadPostThenCloseModal={reloadPostThenCloseModal}
        />
      </div>
      {!offReactionAndComment && (
        <>
          <div className="post-footer">
            <PostShowReaction data={data} />
            <div className="post-footer-button">
              <ButtonReaction data={data} setData={setData} />
            </div>
          </div>
          <PostComment data={data} dataMention={dataMention} />
        </>
      )}
    </div>
  )
}

export default LoadPost
