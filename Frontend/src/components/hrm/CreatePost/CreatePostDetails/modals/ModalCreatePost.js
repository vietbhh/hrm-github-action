import { ErpRadio } from "@apps/components/common/ErpField"
import { downloadApi } from "@apps/modules/download/common/api"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { decodeHTMLEntities, detectUrl } from "@modules/Feed/common/common"
import { Dropdown, Tooltip } from "antd"
import { convertToRaw, EditorState, Modifier } from "draft-js"
import draftToHtml from "draftjs-to-html"
import { useMemo, useState } from "react"
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap"
import { feedApi } from "@modules/Feed/common/api"
import AttachPhotoVideo from "../AttachPhotoVideo"
import EditorComponent from "../EditorComponent"
import Emoji from "../Emoji"
import PreviewAttachment from "../PreviewAttachment"
import LinkPreview from "@apps/components/link-preview/LinkPreview"

const ModalCreatePost = (props) => {
  const {
    modal,
    toggleModal,
    avatar,
    fullName,
    privacy_type = "workspace",
    dataMention,
    workspace,
    setModal,
    setDataCreateNew,
    approveStatus
  } = props
  const [state, setState] = useMergedState({
    privacy_type: privacy_type,
    editorState: EditorState.createEmpty(),
    loadingUploadAttachment: false,
    loadingSubmit: false,
    arrLink: []
  })
  const [file, setFile] = useState([])

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
    setState({ loadingSubmit: false, arrLink: [] })
    setFile([])
  }
  const submitPost = () => {
    const check_can_submit = handleCheckContentBeforeSubmit()
    if (check_can_submit) {
      setState({ loadingSubmit: true })
      const editorStateRaw = convertToRaw(state.editorState.getCurrentContent())
      const content = draftToHtml(editorStateRaw)
      const _content = detectUrl(content)

      const params = {
        content: _content,
        workspace: workspace,
        privacy_type: state.privacy_type,
        file: file,
        approveStatus: approveStatus,
        arrLink: state.arrLink
      }
      feedApi
        .postSubmitPost(params)
        .then((res) => {
          if (_.isFunction(setDataCreateNew)) {
            setDataCreateNew(res.data)
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
                    url: URL.createObjectURL(response.data)
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

  // ** useEffect

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
          <i className="fa-regular fa-briefcase me-50"></i>
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
          <i className="fa-regular fa-briefcase me-50"></i>
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
          <span className="modal-header-privacy-name">{fullName}</span>
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

        <ul className="create_post_footer">
          <Tooltip
            title={useFormatMessage(
              "modules.feed.create_post.text.choose_a_background_image"
            )}>
            <li className="create_post_footer-li cursor-pointer">
              <span className="icon toggle-background">
                <span>Aa</span>
              </span>
            </li>
          </Tooltip>

          <AttachPhotoVideo
            handleAddAttachment={handleAddAttachment}
            loadingUploadAttachment={state.loadingUploadAttachment}
          />

          <Tooltip
            title={useFormatMessage(
              "modules.feed.create_post.text.tag_your_colleagues"
            )}>
            <li className="create_post_footer-li cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.97532 12.0251L11.9753 2.02513C12.6317 1.36875 13.5219 1 14.4502 1H20.5004C21.8812 1 23.0004 2.11929 23.0004 3.5V9.55025C23.0004 10.4785 22.6317 11.3687 21.9753 12.0251L11.9753 22.0251C10.6085 23.392 8.39241 23.392 7.02558 22.0251L1.97532 16.9749C0.608485 15.608 0.608488 13.392 1.97532 12.0251ZM17.5004 8C18.3289 8 19.0004 7.32843 19.0004 6.5C19.0004 5.67157 18.3289 5 17.5004 5C16.672 5 16.0004 5.67157 16.0004 6.5C16.0004 7.32843 16.672 8 17.5004 8Z"
                  fill="#2F54EB"></path>
              </svg>
            </li>
          </Tooltip>
          <Tooltip
            title={useFormatMessage("modules.feed.create_post.text.poll_vote")}>
            <li className="create_post_footer-li cursor-pointer">
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
          <Tooltip
            title={useFormatMessage(
              "modules.feed.create_post.text.anonymous_q_and_a"
            )}>
            <li className="create_post_footer-li cursor-pointer">
              <svg
                width="23"
                height="21"
                viewBox="0 0 23 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.333313 4C0.333313 1.79086 2.12417 0 4.33331 0H18.3333C20.5425 0 22.3333 1.79086 22.3333 4V13C22.3333 15.2091 20.5425 17 18.3333 17H12.2424L5.78886 20.8372C5.04072 21.2821 4.12081 20.625 4.29895 19.773L4.87877 17H4.33331C2.12417 17 0.333313 15.2091 0.333313 13V4ZM9.74753 5C9.51876 5 9.33331 5.18545 9.33331 5.41421C9.33331 5.52407 9.37695 5.62943 9.45463 5.70711L9.54042 5.79289C9.93094 6.18342 9.93094 6.81658 9.54042 7.20711C9.1499 7.59763 8.51673 7.59763 8.12621 7.20711L8.04042 7.12132C7.58767 6.66857 7.33331 6.0545 7.33331 5.41421C7.33331 4.08088 8.41419 3 9.74753 3H12.5899C14.105 3 15.3333 4.22827 15.3333 5.74342C15.3333 6.92427 14.5777 7.97263 13.4574 8.34605L13.1495 8.44868C12.6621 8.61116 12.3333 9.06733 12.3333 9.58114V10C12.3333 10.5523 11.8856 11 11.3333 11C10.781 11 10.3333 10.5523 10.3333 10V9.58114C10.3333 8.20647 11.213 6.98603 12.5171 6.55132L12.825 6.44868C13.1286 6.34749 13.3333 6.06341 13.3333 5.74342C13.3333 5.33284 13.0005 5 12.5899 5H9.74753ZM11.3333 12C10.781 12 10.3333 12.4477 10.3333 13C10.3333 13.5523 10.781 14 11.3333 14C11.8856 14 12.3333 13.5523 12.3333 13C12.3333 12.4477 11.8856 12 11.3333 12Z"
                  fill="#20C950"></path>
              </svg>
            </li>
          </Tooltip>

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
