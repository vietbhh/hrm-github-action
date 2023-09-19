import LinkPreview from "@apps/components/link-preview/LinkPreview"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { eventApi } from "@modules/Feed/common/api"
import { arrImage } from "@modules/Feed/common/common"
import classNames from "classnames"
import React, { Fragment } from "react"
import ModalAnnouncement from "../CreatePost/CreatePostDetails/modals/ModalAnnouncement"
import ModalCreateEvent from "../CreatePost/CreatePostDetails/modals/ModalCreateEvent"
import ModalCreatePost from "../CreatePost/CreatePostDetails/modals/ModalCreatePost"
import LoadPostMedia from "./LoadPostDetails/LoadPostMedia"
import ButtonReaction from "./LoadPostDetails/PostDetails/ButtonReaction"
import PostComment from "./LoadPostDetails/PostDetails/PostComment"
import PostHeader from "./LoadPostDetails/PostDetails/PostHeader"
import PostShowReaction from "./LoadPostDetails/PostDetails/PostShowReaction"
import RenderAnnouncement from "./LoadPostDetails/PostDetails/RenderAnnouncement"
import RenderContentPost from "./LoadPostDetails/PostDetails/RenderContentPost"
import RenderPollVote from "./LoadPostDetails/PostDetails/RenderPollVote"
import RenderPostEndorsement from "./LoadPostDetails/PostDetails/RenderPostEndorsement"
import RenderPostEvent from "./LoadPostDetails/PostDetails/RenderPostEvent"
import MemberVoteModal from "./LoadPostDetails/modals/MemberVoteModal"
// ** redux
import { showAddEventCalendarModal } from "@apps/modules/calendar/common/reducer/calendar"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

const LoadPost = (props) => {
  const {
    data, // data post
    index, // index post
    current_url, // current url (vd: /feed)
    dataMention, // data arr user tag [{id: id, name: name,link: "#", avatar: getAvatarUrl(value.id * 1)}]
    offReactionAndComment = false, // tắt div reaction, comment: true / false
    setData, // function set lại data khi react, comment
    customAction = {}, // custom dropdown post header
    offPostHeaderAction = false, // hide Post header action
    renderAppendHeaderComponent,
    setDataLink,
    isFocusCommentOnclick = false,

    // only page post details
    idMedia = "",
    setIdMedia = null, // function set idMedia

    // create event / announcement
    options_employee_department = [],
    optionsMeetingRoom = [],

    // only view edit history
    isViewEditHistory = false,
    setDataCreateNew,
    isInWorkspace = false
  } = props
  const [state, setState] = useMergedState({
    comment_more_count_original: data.comment_more_count,
    focusCommentForm: false,

    //
    modalCreatePost: false,

    //
    modalAnnouncement: false,

    // with tag
    modalWith: false,
    dataUserOtherWith: []
  })

  const dispatch = useDispatch()

  // ** function
  const setCommentMoreCountOriginal = (value = 0) => {
    setState({ comment_more_count_original: value })
  }
  const setFocusCommentForm = (value) => setState({ focusCommentForm: value })

  const toggleModalCreatePost = () =>
    setState({ modalCreatePost: !state.modalCreatePost })

  const toggleModalCreateEvent = () => {
    dispatch(
      showAddEventCalendarModal({
        idEvent: null,
        viewOnly: false
      })
    )
  }

  const toggleModalAnnouncement = () =>
    setState({ modalAnnouncement: !state.modalAnnouncement })

  const toggleModalWith = () => setState({ modalWith: !state.modalWith })
  const setDataUserOtherWith = (value) => setState({ dataUserOtherWith: value })

  // ** useEffect

  // ** render
  const renderBody = () => {
    if (data.type === "link" && data.link[0]) {
      return (
        <LinkPreview
          url={data.link[0]}
          maxLine={2}
          minLine={2}
          showGraphic={true}
          defaultImage={`${
            import.meta.env.VITE_APP_URL
          }/assets/images/link.png`}
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
          isViewEditHistory={isViewEditHistory}
        />
      )
    }

    if (data.type === "event") {
      return <RenderPostEvent dataLink={data.dataLink} index={index} />
    }

    if (data.type === "endorsement") {
      return <RenderPostEndorsement dataLink={data.dataLink} />
    }

    if (data.type === "announcement") {
      return <RenderAnnouncement dataLink={data.dataLink} />
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
  const dataEmployee = useSelector((state) => state.users.list)
  const renderWithTag = (startDlash = false) => {
    if (!_.isEmpty(data.tag_user) && !_.isEmpty(data.tag_user.tag)) {
      if (data.tag_user.tag.length > 2) {
        return (
          <span className="post__with-tags">
            {startDlash && "— "}
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.with")}
            </span>{" "}
            <Link to={`/u/${dataEmployee?.[data.tag_user.tag[0]]?.username}`}>
              <span className="name">
                {dataEmployee?.[data.tag_user.tag[0]]?.full_name}
              </span>
            </Link>{" "}
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.and")}
            </span>{" "}
            <span
              className="name cursor-pointer"
              onClick={() => {
                const data_tag = [...data.tag_user.tag]
                data_tag.shift()
                setDataUserOtherWith(data_tag)
                toggleModalWith()
              }}>
              {data.tag_user.tag.length - 1}{" "}
              {useFormatMessage(`modules.feed.post.text.others`)}
            </span>
          </span>
        )
      } else {
        return (
          <span className="post__with-tags">
            {startDlash && "— "}
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.with")}
            </span>{" "}
            <Link to={`/u/${dataEmployee?.[data.tag_user.tag[0]]?.username}`}>
              <span className="name">
                {dataEmployee?.[data.tag_user.tag[0]]?.full_name}
              </span>
            </Link>{" "}
            {data.tag_user.tag.length === 2 && (
              <>
                <span className="text-default">
                  {useFormatMessage("modules.feed.post.text.and")}
                </span>{" "}
                <Link
                  to={`/u/${dataEmployee?.[data.tag_user.tag[1]]?.username}`}>
                  <span className="name">
                    {dataEmployee?.[data.tag_user.tag[1]]?.full_name}
                  </span>
                </Link>
              </>
            )}
          </span>
        )
      }
    }

    return ""
  }

  return (
    <Fragment>
      <div className="load-post" id={`post_id_${data?._id}`}>
        <PostHeader
          data={data}
          customAction={customAction}
          setData={setData}
          offPostHeaderAction={offPostHeaderAction}
          renderAppendHeaderComponent={renderAppendHeaderComponent}
          dataLink={data.dataLink}
          toggleModalCreatePost={toggleModalCreatePost}
          toggleModalCreateEvent={toggleModalCreateEvent}
          toggleModalAnnouncement={toggleModalAnnouncement}
          toggleModalWith={toggleModalWith}
          setDataUserOtherWith={setDataUserOtherWith}
          isViewEditHistory={isViewEditHistory}
          isInWorkspace={isInWorkspace}
          renderWithTag={renderWithTag}
        />
        <div
          className={classNames("post-body", {
            "post-body__background-image": data.type === "background_image",
            "post-post": data.source === null && _.isEmpty(data.medias),
            "post-media": data.source !== null || !_.isEmpty(data.medias)
          })}
          style={renderStyleBackgroundImage()}>
          <div
            id={`post-body-content-${data._id}`}
            className="post-body-content">
            <RenderContentPost
              data={data}
              isViewEditHistory={isViewEditHistory}
            />
          </div>

          {renderBody()}
          {data?.permission === "workspace" && !isInWorkspace && (
            <Fragment>{renderWithTag(true)}</Fragment>
          )}

          {data.has_poll_vote === true && (
            <RenderPollVote
              data={data}
              setData={setData}
              comment_more_count_original={state.comment_more_count_original}
              toggleModalWith={toggleModalWith}
              setDataUserOtherWith={setDataUserOtherWith}
              isViewEditHistory={isViewEditHistory}
            />
          )}
        </div>
        {!offReactionAndComment && !isViewEditHistory && (
          <>
            <div className="post-footer">
              <PostShowReaction
                data={data}
                toggleModalWith={toggleModalWith}
                setDataUserOtherWith={setDataUserOtherWith}
              />
              <div className="post-footer-button">
                <ButtonReaction
                  data={data}
                  setData={setData}
                  comment_more_count_original={
                    state.comment_more_count_original
                  }
                  isFocusCommentOnclick={isFocusCommentOnclick}
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

      {/* render modal */}
      {!isViewEditHistory && (
        <Fragment>
          {state.modalCreatePost && (
            <ModalCreatePost
              modal={state.modalCreatePost}
              toggleModal={toggleModalCreatePost}
              setModal={(value) => setState({ modalCreatePost: value })}
              dataMention={dataMention}
              workspace={[]}
              avatar={data?.created_by?.avatar}
              fullName={data?.created_by?.full_name}
              userId={data?.created_by?.id}
              approveStatus={data?.approve_status}
              dataPost={data}
              setData={setData}
              setDataLink={setDataLink}
              setDataCreateNew={setDataCreateNew}
            />
          )}

          <MemberVoteModal
            modal={state.modalWith}
            toggleModal={toggleModalWith}
            dataUserVote={state.dataUserOtherWith}
            title={useFormatMessage("modules.feed.post.text.people")}
          />

          {data?.type === "event" && (
            <ModalCreateEvent
              setData={setData}
              setDataLink={setDataLink}
              idPost={data?._id}
              options_employee_department={options_employee_department}
              optionsMeetingRoom={optionsMeetingRoom}
              createEventApi={eventApi.postSubmitEvent}
              getDetailApi={eventApi.getGetEventById}
            />
          )}

          {data?.type === "announcement" && (
            <ModalAnnouncement
              modal={state.modalAnnouncement}
              toggleModal={toggleModalAnnouncement}
              options_employee_department={options_employee_department}
              idAnnouncement={data?.link_id}
              setData={setData}
              setDataLink={setDataLink}
              idPost={data?._id}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default LoadPost
