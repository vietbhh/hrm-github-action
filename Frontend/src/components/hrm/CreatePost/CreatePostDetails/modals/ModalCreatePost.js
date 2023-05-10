import { ErpRadio } from "@apps/components/common/ErpField"
import LinkPreview from "@apps/components/link-preview/LinkPreview"
import { downloadApi } from "@apps/modules/download/common/api"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { feedApi } from "@modules/Feed/common/api"
import {
  decodeHTMLEntities,
  detectUrl,
  handleLoadAttachmentThumb,
  handleTagUserAndReplaceContent
} from "@modules/Feed/common/common"
import { Dropdown, Tooltip } from "antd"
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
import PollVote from "../PollVote"
import PollVoteDetail from "../PollVoteDetail"
import PreviewAttachment from "../PreviewAttachment"
import TagYourColleagues from "../TagYourColleagues"

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
    modalPollVote: false,
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

    // tag your colleagues
    tag_your_colleagues: [],
    modal_tag: false
  })
  const [file, setFile] = useState([])

  const userData = useSelector((state) => state.auth.userData)
  const cover = userData?.cover || ""

  // ** function
  const setLoadingUploadAttachment = (value) =>
    setState({ loadingUploadAttachment: value })

  const setArrLink = (value) => setState({ arrLink: value })

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

  const toggleModalPollVote = () => {
    setState({ modalPollVote: !state.modalPollVote })
  }

  const setPollVoteDetail = (value) => {
    setState({ poll_vote: true, poll_vote_detail: value })
  }

  const setEmptyPollVote = () => {
    setState({
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
      }
    })
  }

  const setTagYourColleagues = (value) => {
    setState({ tag_your_colleagues: value })
  }

  const toggleModalTag = () => setState({ modal_tag: !state.modal_tag })

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
        setState({ backgroundImage: null, showChooseBackgroundImage: false })
        toggleModalPollVote()
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

  // ** render
  const items = [
    {
      label: (
        <a
          className=""
          onClick={(e) => {
            e.preventDefault()
            setState({ privacy_type: "workspace" })
          }}>
          <ErpRadio
            checked={state.privacy_type === "workspace"}
            onChange={() => {}}
          />
          <svg
            style={{ marginRight: "0.4rem", marginLeft: "-0.1rem" }}
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M13.3575 4.1175V4.6725L10.7025 3.135C9.69746 2.5575 8.29496 2.5575 7.29746 3.135L4.64246 4.68V4.1175C4.64246 2.43 5.56496 1.5 7.25246 1.5H10.7475C12.435 1.5 13.3575 2.43 13.3575 4.1175Z"
              fill="#139FF8"
            />
            <path
              d="M13.38 5.97749L13.275 5.92499L12.255 5.33999L10.14 4.11749C9.495 3.74249 8.505 3.74249 7.86 4.11749L5.745 5.33249L4.725 5.93249L4.59 5.99999C3.2775 6.88499 3.1875 7.04999 3.1875 8.46749V11.8575C3.1875 13.275 3.2775 13.44 4.62 14.3475L7.86 16.215C8.1825 16.41 8.5875 16.4925 9 16.4925C9.405 16.4925 9.8175 16.4025 10.14 16.215L13.41 14.325C14.73 13.44 14.8125 13.2825 14.8125 11.8575V8.46749C14.8125 7.04999 14.7225 6.88499 13.38 5.97749ZM11.0925 10.125L10.635 10.6875C10.56 10.77 10.5075 10.9275 10.515 11.04L10.56 11.76C10.59 12.2025 10.275 12.4275 9.8625 12.27L9.195 12C9.09 11.9625 8.9175 11.9625 8.8125 12L8.145 12.2625C7.7325 12.4275 7.4175 12.195 7.4475 11.7525L7.4925 11.0325C7.5 10.92 7.4475 10.7625 7.3725 10.68L6.9075 10.125C6.6225 9.78749 6.75 9.41249 7.1775 9.29999L7.875 9.11999C7.9875 9.08999 8.115 8.98499 8.175 8.89499L8.565 8.29499C8.805 7.91999 9.1875 7.91999 9.435 8.29499L9.825 8.89499C9.885 8.99249 10.02 9.08999 10.125 9.11999L10.8225 9.29999C11.25 9.41249 11.3775 9.78749 11.0925 10.125Z"
              fill="#139FF8"
            />
          </svg>
          <span>
            {useFormatMessage("modules.feed.create_post.text.workspace")}
          </span>
        </a>
      ),
      key: "1"
    },
    {
      label: (
        <a
          className=""
          onClick={(e) => {
            e.preventDefault()
            setState({ privacy_type: "only_me" })
          }}>
          <ErpRadio
            checked={state.privacy_type === "only_me"}
            onChange={() => {}}
          />
          <i className="fa-solid fa-lock-keyhole me-50"></i>
          <span>
            {useFormatMessage("modules.feed.create_post.text.only_me")}
          </span>
        </a>
      ),
      key: "2"
    }
  ]
  const renderTextDropdown = (privacy) => {
    if (privacy === "workspace") {
      return (
        <>
          <svg
            style={{ marginRight: "0.4rem", marginLeft: "-0.1rem" }}
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M13.3575 4.1175V4.6725L10.7025 3.135C9.69746 2.5575 8.29496 2.5575 7.29746 3.135L4.64246 4.68V4.1175C4.64246 2.43 5.56496 1.5 7.25246 1.5H10.7475C12.435 1.5 13.3575 2.43 13.3575 4.1175Z"
              fill="#139FF8"
            />
            <path
              d="M13.38 5.97749L13.275 5.92499L12.255 5.33999L10.14 4.11749C9.495 3.74249 8.505 3.74249 7.86 4.11749L5.745 5.33249L4.725 5.93249L4.59 5.99999C3.2775 6.88499 3.1875 7.04999 3.1875 8.46749V11.8575C3.1875 13.275 3.2775 13.44 4.62 14.3475L7.86 16.215C8.1825 16.41 8.5875 16.4925 9 16.4925C9.405 16.4925 9.8175 16.4025 10.14 16.215L13.41 14.325C14.73 13.44 14.8125 13.2825 14.8125 11.8575V8.46749C14.8125 7.04999 14.7225 6.88499 13.38 5.97749ZM11.0925 10.125L10.635 10.6875C10.56 10.77 10.5075 10.9275 10.515 11.04L10.56 11.76C10.59 12.2025 10.275 12.4275 9.8625 12.27L9.195 12C9.09 11.9625 8.9175 11.9625 8.8125 12L8.145 12.2625C7.7325 12.4275 7.4175 12.195 7.4475 11.7525L7.4925 11.0325C7.5 10.92 7.4475 10.7625 7.3725 10.68L6.9075 10.125C6.6225 9.78749 6.75 9.41249 7.1775 9.29999L7.875 9.11999C7.9875 9.08999 8.115 8.98499 8.175 8.89499L8.565 8.29499C8.805 7.91999 9.1875 7.91999 9.435 8.29499L9.825 8.89499C9.885 8.99249 10.02 9.08999 10.125 9.11999L10.8225 9.29999C11.25 9.41249 11.3775 9.78749 11.0925 10.125Z"
              fill="#139FF8"
            />
          </svg>
          {useFormatMessage("modules.feed.create_post.text.workspace")}
        </>
      )
    }

    if (privacy === "only_me") {
      return (
        <>
          <i className="fa-solid fa-lock-keyhole me-50"></i>
          {useFormatMessage("modules.feed.create_post.text.only_me")}
        </>
      )
    }

    return ""
  }

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

  const renderWithTag = () => {
    if (!_.isEmpty(state.tag_your_colleagues)) {
      const index_user = dataMention.findIndex(
        (item) => item.id === state.tag_your_colleagues[0]
      )
      let data_user = {}
      if (index_user !== -1) {
        data_user = dataMention[index_user]
      }
      if (state.tag_your_colleagues.length > 2) {
        return (
          <span className="cursor-pointer" onClick={() => toggleModalTag()}>
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.with")}
            </span>{" "}
            <span className="text-tag">{data_user?.full_name}</span>{" "}
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.and")}
            </span>{" "}
            <span className="text-tag">
              {state.tag_your_colleagues.length - 1}{" "}
              {useFormatMessage(`modules.feed.post.text.others`)}
            </span>
          </span>
        )
      } else {
        let data_user_and = {}
        if (state.tag_your_colleagues.length === 2) {
          const index_user = dataMention.findIndex(
            (item) => item.id === state.tag_your_colleagues[1]
          )
          if (index_user !== -1) {
            data_user_and = dataMention[index_user]
          }
        }
        return (
          <span className="cursor-pointer" onClick={() => toggleModalTag()}>
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.with")}
            </span>{" "}
            <span className="text-tag">{data_user?.full_name}</span>{" "}
            {state.tag_your_colleagues.length === 2 && (
              <>
                <span className="text-default">
                  {useFormatMessage("modules.feed.post.text.and")}
                </span>{" "}
                <span className="text-tag">{data_user_and?.full_name}</span>
              </>
            )}
          </span>
        )
      }
    }

    return ""
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="feed modal-create-post modal-dialog-centered"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      /* backdrop={"static"} */
    >
      <ModalHeader toggle={() => toggleModal()}>
        <Avatar className="img" src={avatar} />
        <div className="modal-header-privacy">
          <span className="modal-header-privacy-name">
            {fullName} {renderWithTag()}
          </span>
          <div className="modal-header-privacy-choose">
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              overlayClassName="modal-header-privacy-choose-dropdown">
              <a
                onClick={(e) => e.preventDefault()}
                className="modal-header-privacy-choose-dropdown-a">
                <Button.Ripple size="sm" color="flat-default" className="">
                  {renderTextDropdown(state.privacy_type)}
                  <i className="fa-sharp fa-solid fa-caret-down ms-50"></i>
                </Button.Ripple>
              </a>
            </Dropdown>
          </div>
        </div>
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
          <PollVoteDetail
            poll_vote_detail={state.poll_vote_detail}
            toggleModalPollVote={toggleModalPollVote}
            setEmptyPollVote={setEmptyPollVote}
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

          <PollVote
            backgroundImage={state.backgroundImage}
            setPollVoteDetail={setPollVoteDetail}
            modalPollVote={state.modalPollVote}
            toggleModalPollVote={toggleModalPollVote}
            loadingSubmit={state.loadingSubmit}
            poll_vote_detail={state.poll_vote_detail}
          />

          <Emoji handleInsertEditorState={handleInsertEditorState} />
        </ul>
        <Button.Ripple
          color="primary"
          type="button"
          className="btn-post"
          onClick={() => submitPost()}
          disabled={state.loadingSubmit}>
          {state.loadingSubmit && <Spinner size={"sm"} className="me-50" />}
          {useFormatMessage("modules.feed.create_post.text.post")}
        </Button.Ripple>
      </ModalBody>
    </Modal>
  )
}

export default ModalCreatePost
