import LinkPreview from "@apps/components/link-preview/LinkPreview"
import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { feedApi } from "@modules/Feed/common/api"
import {
  decodeHTMLEntities,
  detectHashtag,
  detectUrl,
  handleInsertEditorState,
  handleLoadAttachmentThumb,
  handleTagUserAndReplaceContent
} from "@modules/Feed/common/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import { ContentState, EditorState, convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap"
import AttachPhotoVideo from "../AttachPhotoVideo"
import ChooseBackground from "../ChooseBackground"
import EditorComponent from "../EditorComponent"
import Emoji from "../Emoji"
import HeaderCreatePost from "../HeaderCreatePost"
import PollVote from "../PollVote"
import PreviewAttachment from "../PreviewAttachment"
import TagYourColleagues from "../TagYourColleagues"
import SwAlert from "@apps/utility/SwAlert"
import PerfectScrollbar from "react-perfect-scrollbar"
const ModalCreatePost = (props) => {
  const {
    modal,
    toggleModal,
    avatar,
    fullName,
    userId,
    privacy_type = "workspace",
    dataMention,
    workspace,
    setModal,
    setDataCreateNew,
    approveStatus,
    dataPost = {},
    setData,
    optionCreate = "",
    setOptionCreate,
    setDataLink
  } = props
  const [state, setState] = useMergedState({
    privacy_type: privacy_type,
    editorState: EditorState.createEmpty(),
    loadingUploadAttachment: false,
    loadingSubmit: false,
    arrLink: [],

    // background image
    backgroundImage: null,
    showChooseBackgroundImage: false,

    // poll vote
    poll_vote: false,
    poll_vote_detail: {
      question: "",
      options: ["", ""],
      setting: {
        multiple_selection: false,
        adding_more_options: false,
        incognito: false,
        limit_time: false
      },
      time_end: null
    },
    disable_btn_post: false,

    // tag your colleagues
    tag_your_colleagues: [],
    modal_tag: false,

    // endorsement
    modalEndorsement: false
  })
  const [file, setFile] = useState([])

  const userData = useSelector((state) => state.auth.userData)
  const cover = userData?.cover || ""
  const maxHeightScreen = "50vh" //screen.height - (screen.height * 50) / 100
  // ** function
  const setLoadingUploadAttachment = (value) =>
    setState({ loadingUploadAttachment: value })

  const setArrLink = (value) => setState({ arrLink: value })

  const setPrivacyType = (value) => setState({ privacy_type: value })

  const setEditorState = (data) => {
    setState({
      editorState: data
    })
  }

  const onEditorStateChange = (editorState) => {
    setState({ editorState: editorState })

    // check detect link
    const editorStateRaw = convertToRaw(editorState.getCurrentContent())
    const html = draftToHtml(editorStateRaw)
    const arr_link = detectUrl(html, true)
    setArrLink(arr_link)
  }

  const setEmptyEditorState = () => {
    const emptyEditorState = EditorState.moveFocusToEnd(
      EditorState.createEmpty()
    )
    setState({ editorState: emptyEditorState })
  }

  // submit
  const handleCheckContentBeforeSubmit = () => {
    const editorStateRaw = convertToRaw(state.editorState.getCurrentContent())
    let html = draftToHtml(editorStateRaw)
    html = decodeHTMLEntities(html)
    let check_content = false
    if (html.trim().length) {
      check_content = true
    }

    let check_can_submit = false
    if (check_content === true || !_.isEmpty(file)) {
      check_can_submit = true
    }

    return check_can_submit
  }
  const setEmptyAfterSubmit = () => {
    setEmptyEditorState()
    setModal(false)
    setState({
      loadingSubmit: false,
      arrLink: [],
      backgroundImage: null,
      showChooseBackgroundImage: false,
      tag_your_colleagues: []
    })
    setFile([])
    setEmptyPollVote()
  }
  const submitPost = () => {
    const check_can_submit = handleCheckContentBeforeSubmit()
    if (check_can_submit) {
      setState({ loadingSubmit: true })
      const editorStateRaw = convertToRaw(state.editorState.getCurrentContent())
      const content = draftToHtml(editorStateRaw)
      const _content = detectUrl(content)

      const result_tag_user = handleTagUserAndReplaceContent(
        dataMention,
        _content
      )
      const __content = result_tag_user.content
      const mention = result_tag_user.tag_user
      const arrHashtag = detectHashtag(__content)

      const params = {
        content: __content,
        workspace: workspace,
        privacy_type: state.privacy_type,
        file: file,
        approveStatus: approveStatus,
        arrLink: state.arrLink,
        mention: mention,
        data_user: {
          id: userId,
          full_name: fullName
        },
        _id_post_edit: dataPost?._id || "",
        backgroundImage: state.backgroundImage,
        poll_vote: state.poll_vote,
        poll_vote_detail: state.poll_vote_detail,
        tag_your_colleagues: state.tag_your_colleagues,
        arrHashtag: arrHashtag
      }
      feedApi
        .postSubmitPost(params)
        .then(async (res) => {
          if (_.isFunction(setDataCreateNew)) {
            if (approveStatus !== "pending") {
              setDataCreateNew(res.data)
            } else {
              SwAlert.showSuccess({
                title: "",
                text: useFormatMessage("modules.feed.post.text.post_pending")
              })
            }
          }
          if (_.isFunction(setData)) {
            const data = res.data
            const dataCustom = {}
            const data_attachment = await handleLoadAttachmentThumb(data, cover)
            dataCustom["url_thumb"] = data_attachment["url_thumb"]
            dataCustom["url_cover"] = data_attachment["url_cover"]
            dataCustom["medias"] = data_attachment["medias"]
            setData(data, false, dataCustom)
          }
          setEmptyAfterSubmit()
        })
        .catch((err) => {
          setState({ loadingSubmit: false })
          notification.showError({
            text: useFormatMessage("notification.something_went_wrong")
          })
        })
    } else {
      notification.showError({
        text: useFormatMessage("notification.something_went_wrong")
      })
    }
  }

  // ** attachment
  const handleAddAttachment = (attachment) => {
    setState({ backgroundImage: null, showChooseBackgroundImage: false })
    if (!_.isUndefined(attachment[0])) {
      let check_type_file = true
      _.forEach(attachment, (value) => {
        const type = value.type
        if (!type.includes("image/") && !type.includes("video/")) {
          check_type_file = false
        }
      })
      if (check_type_file === false) {
        notification.showError({
          text: useFormatMessage("notification.wrong_avatar_file_type")
        })
      } else {
        setLoadingUploadAttachment(true)
        const timestamp = Date.now()
        const arrFile = []
        const arrType = []
        _.forEach(attachment, (value) => {
          const newName = timestamp + "_" + value.name
          const newFile = new File([value], newName)
          arrFile.push(newFile)
          arrType.push(value.type)
        })
        const params = { file: arrFile, type: arrType }
        feedApi
          .postUploadAttachment(params)
          .then((res) => {
            const promises = []
            _.forEach(res.data, (value) => {
              const promise = new Promise(async (resolve, reject) => {
                await downloadApi.getPhoto(value.thumb).then((response) => {
                  resolve({
                    ...value,
                    url_thumb: URL.createObjectURL(response.data)
                  })
                })
              })

              promises.push(promise)
            })

            Promise.all(promises).then((res_promise) => {
              setFile([...file, ...res_promise])
              setLoadingUploadAttachment(false)
            })
          })
          .catch((err) => {
            setLoadingUploadAttachment(false)
          })
      }
      if (document.getElementById("attach-doc")) {
        document.getElementById("attach-doc").value = null
      }
      if (document.getElementById("attach-doc-2")) {
        document.getElementById("attach-doc-2").value = null
      }
    }
  }

  const setBackgroundImage = (value) => {
    const backgroundImage = value !== null ? value + 1 : null

    setState({ backgroundImage: backgroundImage })
    handleInsertEditorState("", state.editorState, onEditorStateChange)
  }

  const toggleModalPollVote = () => setEmptyPollVote(!state.poll_vote)

  const setPollVoteDetail = (value) => {
    setState({ poll_vote_detail: { ...state.poll_vote_detail, ...value } })
  }

  const setEmptyPollVote = (poll_vote = false) => {
    setState({
      poll_vote: poll_vote,
      poll_vote_detail: {
        question: "",
        options: ["", ""],
        setting: {
          multiple_selection: false,
          adding_more_options: false,
          incognito: false,
          limit_time: false
        },
        time_end: null
      }
    })
  }

  const setTagYourColleagues = (value) => {
    setState({ tag_your_colleagues: value })
  }

  const toggleModalTag = () => setState({ modal_tag: !state.modal_tag })

  const toggleModalEndorsement = () =>
    setState({ modalEndorsement: !state.modalEndorsement })

  // ** useEffect

  // ** edit post
  useEffect(() => {
    if (!_.isEmpty(dataPost) && modal) {
      // ** endorsement
      if (dataPost.type === "endorsement") {
        toggleModalEndorsement()
      } else {
        // ** media
        const _file = []
        if (dataPost.source) {
          _file.push({
            description: "",
            source: dataPost?.source,
            thumb: dataPost?.thumb,
            name_source: dataPost?.source_attribute?.name || "",
            name_thumb: dataPost?.thumb_attribute?.name || "",
            type: dataPost?.source_attribute?.mime || "",
            url_thumb: dataPost?.url_thumb,
            db: true
          })
        }

        if (!_.isEmpty(dataPost.medias)) {
          _.forEach(dataPost.medias, (value) => {
            _file.push({
              ...value,
              name_source: value?.source_attribute?.name || "",
              name_thumb: value?.thumb_attribute?.name || "",
              type: value?.source_attribute?.mime || "",
              db: true
            })
          })
        }

        setFile(_file)
        // **

        // ** background_image
        if (
          dataPost.type === "background_image" &&
          dataPost.background_image !== null
        ) {
          setState({ backgroundImage: dataPost.background_image })
        }
        // **

        // ** poll_vote
        if (dataPost.has_poll_vote === true) {
          const poll_vote_detail = { ...dataPost.poll_vote_detail }
          const options = []
          _.forEach(dataPost.poll_vote_detail.options, (item) => {
            options.push(item.option_name)
          })
          poll_vote_detail["options"] = options
          setPollVoteDetail(poll_vote_detail)
          setState({ poll_vote: true })
        }
        // **

        // tag_your_colleagues
        if (!_.isEmpty(dataPost.tag_user)) {
          setState({ tag_your_colleagues: dataPost.tag_user.tag })
        }
      }
    }
  }, [dataPost, modal])

  useEffect(() => {
    if (optionCreate !== "" && modal) {
      if (optionCreate === "poll_vote") {
        setState({
          backgroundImage: null,
          showChooseBackgroundImage: false,
          poll_vote: true
        })
      }
      if (optionCreate === "endorsement") {
        toggleModalEndorsement()
      }

      if (_.isFunction(setOptionCreate)) {
        setOptionCreate("")
      }
    }
  }, [optionCreate, modal])

  useEffect(() => {
    if (state.poll_vote) {
      setState({ backgroundImage: null, showChooseBackgroundImage: false })
    }
  }, [state.poll_vote])
  // useEffect
  useEffect(() => {
    let check_options = true
    _.forEach(state.poll_vote_detail.options, (value) => {
      if (value === "") {
        check_options = false
      }
    })
    if (check_options && state.poll_vote_detail.question !== "") {
      let disable_btn_post = false

      if (
        state.poll_vote_detail.setting.limit_time === true &&
        state.poll_vote_detail.time_end === null
      ) {
        disable_btn_post = true
      } else {
        disable_btn_post = false
      }
      setState({ disable_btn_post: disable_btn_post })
    } else {
      setState({ disable_btn_post: true })
    }
  }, [state.poll_vote_detail])
  // ** render
  const renderPreviewAttachment = useMemo(
    () => (
      <PreviewAttachment
        file={file}
        setFile={setFile}
        handleAddAttachment={handleAddAttachment}
        loadingUploadAttachment={state.loadingUploadAttachment}
      />
    ),
    [file, state.loadingUploadAttachment]
  )
  return optionCreate !== "" && modal ? (
    <></>
  ) : (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="feed modal-create-post modal-dialog-centered"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      /* backdrop={"static"} */
    >
      <ModalHeader /* toggle={() => toggleModal()} */>
        <HeaderCreatePost
          avatar={avatar}
          fullName={fullName}
          dataMention={dataMention}
          privacy_type={state.privacy_type}
          setPrivacyType={setPrivacyType}
          tag_your_colleagues={state.tag_your_colleagues}
          toggleModalTag={toggleModalTag}
          toggleModalCreatePost={toggleModal}
          is_poll={state.poll_vote}
        />
      </ModalHeader>
      <ModalBody>
        <PerfectScrollbar
          style={{
            maxHeight: maxHeightScreen
          }}>
          <EditorComponent
            dataPost={dataPost}
            editorState={state.editorState}
            onEditorStateChange={onEditorStateChange}
            dataMention={dataMention}
            backgroundImage={state.backgroundImage}
            showChooseBackgroundImage={state.showChooseBackgroundImage}
            setEditorState={setEditorState}
          />
        </PerfectScrollbar>
        {renderPreviewAttachment}
        {_.isEmpty(file) && !_.isEmpty(state.arrLink) && (
          <LinkPreview
            url={state.arrLink[0]}
            maxLine={2}
            minLine={2}
            showGraphic={true}
            defaultImage={`${
              import.meta.env.VITE_APP_URL
            }/assets/images/link.png`}
          />
        )}
        {state.showChooseBackgroundImage && (
          <ChooseBackground
            backgroundImage={state.backgroundImage}
            setBackgroundImage={setBackgroundImage}
            showChooseBackgroundImage={state.showChooseBackgroundImage}
          />
        )}
        {state.poll_vote && (
          <PollVote
            setPollVoteDetail={setPollVoteDetail}
            poll_vote_detail={state.poll_vote_detail}
            toggleModalPollVote={toggleModalPollVote}
          />
        )}
        <ul className="create_post_footer">
          <Tooltip
            title={useFormatMessage(
              "modules.feed.create_post.text.choose_a_background_image"
            )}>
            <li
              className={classNames("create_post_footer-li", {
                "cursor-not-allowed":
                  !_.isEmpty(file) || state.poll_vote === true,
                "cursor-pointer": _.isEmpty(file) && state.poll_vote === false
              })}
              onClick={() => {
                if (_.isEmpty(file) && state.poll_vote === false) {
                  setState({
                    showChooseBackgroundImage: !state.showChooseBackgroundImage
                  })
                }
              }}>
              {state.showChooseBackgroundImage ? (
                <span className="icon icon-arrow">
                  <i className="fa-solid fa-chevron-up"></i>
                </span>
              ) : (
                <span className="icon toggle-background">
                  <span>Aa</span>
                </span>
              )}
            </li>
          </Tooltip>

          <AttachPhotoVideo
            handleAddAttachment={handleAddAttachment}
            loadingUploadAttachment={state.loadingUploadAttachment}
            backgroundImage={state.backgroundImage}
          />

          <TagYourColleagues
            dataMention={dataMention}
            tag_your_colleagues={state.tag_your_colleagues}
            setTagYourColleagues={setTagYourColleagues}
            modal={state.modal_tag}
            toggleModal={toggleModalTag}
          />
          <Emoji
            editorState={state.editorState}
            setEditorState={onEditorStateChange}
          />
        </ul>
        <Button.Ripple
          color="primary"
          type="button"
          className="btn-post"
          onClick={() => submitPost()}
          disabled={
            state.loadingSubmit || (state.poll_vote && state.disable_btn_post)
          }>
          {state.loadingSubmit && <Spinner size={"sm"} className="me-50" />}
          {useFormatMessage("modules.feed.create_post.text.post")}
        </Button.Ripple>
      </ModalBody>
    </Modal>
  )
}

export default ModalCreatePost
