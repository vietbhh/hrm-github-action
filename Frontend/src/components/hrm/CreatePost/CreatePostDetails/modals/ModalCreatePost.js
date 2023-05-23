import LinkPreview from "@apps/components/link-preview/LinkPreview"
import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { feedApi } from "@modules/Feed/common/api"
import {
  decodeHTMLEntities,
  detectUrl,
  handleLoadAttachmentThumb,
  handleTagUserAndReplaceContent
} from "@modules/Feed/common/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import { ContentState, EditorState, Modifier, convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
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
import Endorsement from "../Endorsement"

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
    setOptionCreate
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

  // ** function
  const setLoadingUploadAttachment = (value) =>
    setState({ loadingUploadAttachment: value })

  const setArrLink = (value) => setState({ arrLink: value })

  const setPrivacyType = (value) => setState({ privacy_type: value })

  const onEditorStateChange = (editorState) => {
    setState({ editorState: editorState })

    // check detect link
    const editorStateRaw = convertToRaw(editorState.getCurrentContent())
    const html = draftToHtml(editorStateRaw)
    const arr_link = detectUrl(html, true)
    setArrLink(arr_link)
  }

  const insertCharacter = (characterToInsert, editorState) => {
    const currentContent = editorState.getCurrentContent(),
      currentSelection = editorState.getSelection()

    const newContent = Modifier.replaceText(
      currentContent,
      currentSelection,
      characterToInsert
    )

    const newEditorState = EditorState.push(
      editorState,
      newContent,
      "insert-characters"
    )

    return EditorState.forceSelection(
      newEditorState,
      newContent.getSelectionAfter()
    )
  }
  const handleInsertEditorState = (characterToInsert) => {
    const newEditorState = insertCharacter(characterToInsert, state.editorState)
    setState({ editorState: newEditorState })
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
        tag_your_colleagues: state.tag_your_colleagues
      }
      feedApi
        .postSubmitPost(params)
        .then(async (res) => {
          if (_.isFunction(setDataCreateNew)) {
            setDataCreateNew(res.data)
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
          notification.showSuccess({
            text: useFormatMessage("notification.success")
          })
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
    let backgroundImage = null
    if (value !== null && value !== undefined) {
      const backgroundImageSplit = value.split("/")
      if (backgroundImageSplit[3]) {
        const _backgroundImageSplit = backgroundImageSplit[3].split(".")
        if (_backgroundImageSplit[0]) {
          backgroundImage = _backgroundImageSplit[0]
        }
      }
    }
    setState({ backgroundImage: backgroundImage })
    handleInsertEditorState("")
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
  useEffect(() => {
    if (!_.isEmpty(dataPost)) {
      const content_html = dataPost.content
      const contentBlock = htmlToDraft(content_html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        const editorState = EditorState.createWithContent(contentState)
        setState({ editorState: editorState })
      }
    }
  }, [dataPost])

  // ** edit post
  useEffect(() => {
    if (!_.isEmpty(dataPost) && modal) {
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

  return (
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
        />
      </ModalHeader>
      <ModalBody>
        <EditorComponent
          editorState={state.editorState}
          onEditorStateChange={onEditorStateChange}
          dataMention={dataMention}
          backgroundImage={state.backgroundImage}
          showChooseBackgroundImage={state.showChooseBackgroundImage}
        />

        {renderPreviewAttachment}

        {_.isEmpty(file) && !_.isEmpty(state.arrLink) && (
          <LinkPreview
            url={state.arrLink[0]}
            maxLine={2}
            minLine={2}
            showGraphic={true}
            defaultImage={`${process.env.REACT_APP_URL}/assets/images/link.png`}
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

          <Tooltip
            title={useFormatMessage("modules.feed.create_post.text.poll_vote")}>
            <li
              className={classNames("create_post_footer-li", {
                "cursor-not-allowed": state.backgroundImage !== null,
                "cursor-pointer": state.backgroundImage === null
              })}
              onClick={() => {
                if (state.backgroundImage === null) {
                  toggleModalPollVote()
                }
              }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.5 2C9.5 1.44772 9.94772 1 10.5 1H13.5C14.0523 1 14.5 1.44772 14.5 2V20C14.5 20.5523 14.0523 21 13.5 21H10.5C9.94772 21 9.5 20.5523 9.5 20V2Z"
                  fill="#FFA940"></path>
                <path
                  d="M17 6C17 5.44772 17.4477 5 18 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H18C17.4477 21 17 20.5523 17 20V6Z"
                  fill="#FFA940"></path>
                <path
                  d="M2 10C2 9.44772 2.44772 9 3 9H6C6.55228 9 7 9.44772 7 10V20C7 20.5523 6.55228 21 6 21H3C2.44772 21 2 20.5523 2 20V10Z"
                  fill="#FFA940"></path>
              </svg>
            </li>
          </Tooltip>

          <Endorsement
            modal={state.modalEndorsement}
            toggleModal={toggleModalEndorsement}
            toggleModalCreatePost={toggleModal}
          />

          <Emoji handleInsertEditorState={handleInsertEditorState} />
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
