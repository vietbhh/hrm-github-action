import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import Editor from "@draft-js-plugins/editor"
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "@draft-js-plugins/mention"
import {
  decodeHTMLEntities,
  handleTagUserAndReplaceContent
} from "@modules/Feed/common/common"
import classNames from "classnames"
import { ContentState, EditorState, Modifier, convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { Fragment, useCallback, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { Label, Spinner } from "reactstrap"
// import Emoji from "./Emoji"

// import GifBoxButton from "@apps/components/common/GifBoxButton"
import EmotionsComponent from "@apps/modules/chat/components/emotions/index"
import "@draft-js-plugins/mention/lib/plugin.css"
import "@styles/react/libs/editor/editor.scss"
import { handleImageCommentUrl } from "./Comment"

const focusInputMsg = () => {
  if (msgRef.current) {
    msgRef.current.focus()
    localStorage.setItem("chatAppFocus", true)
    localStorage.setItem("formChatFocus", true)
  }
}

const MentionSuggestion = (props) => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...parentProps
  } = props

  return (
    <div {...parentProps}>
      <div className="d-flex align-items-center mention-suggest">
        <div className={theme?.mentionSuggestionsEntryContainerLeft}>
          <img
            src={mention.avatar}
            className={theme?.mentionSuggestionsEntryAvatar}
            role="presentation"
          />
        </div>

        <div className="mention-suggest__info">
          <div className="mention-suggest__name">{mention.name}</div>

          <div className="mention-suggest__title">{mention.title}</div>
        </div>
      </div>
    </div>
  )
}

const defaultSuggestionsFilterFix = (
  valueSearch,
  mentions = [],
  maxRows = 5
) => {
  const value = valueSearch.toLowerCase()
  const data = mentions.filter(function (suggestion) {
    return (
      !value ||
      suggestion.name.toLowerCase().indexOf(value) > -1 ||
      suggestion.username.toLowerCase().indexOf(value) > -1
    )
  })

  return data.slice(0, maxRows)
}
const PostCommentForm = (props) => {
  const {
    data,
    dataMention,
    setData,
    comment_more_count_original,
    setCommentMoreCountOriginal,
    scrollToBottom,
    api,
    id_comment_parent,
    reply_count,
    dataEditComment = {},
    setDataEditComment,
    focusCommentForm = false,
    setFocusCommentForm,
    created_by_comment_parent = null
  } = props
  const [state, setState] = useMergedState({
    editorState: EditorState.createEmpty(),
    image: null,
    loadingSubmit: false,

    // mention
    open: false,
    mentions: dataMention,
    suggestions: dataMention === undefined ? [] : dataMention,
    showEmotion: false,
    selectedUser: {},
    groups: []
  })
  const userData = useSelector((state) => state.auth.userData)
  const avatar = userData.avatar
  const userId = userData.id
  const full_name = userData.full_name
  const currentTime = Date.now()

  // ** function
  const setSuggestions = (value) => {
    setState({ suggestions: value })
  }

  const onEditorStateChange = (editorState) => {
    setState({ editorState: editorState })
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
    const newEditorState = insertCharacter("", emptyEditorState)
    setState({ editorState: newEditorState })
  }

  const handleReturn = (e) => {
    // Prevent line break from being inserted
    if (e.shiftKey || e.ctrlKey || state.open === true) {
      return "not-handled"
    }

    e.preventDefault()
    submitPost()

    return "handled"
  }

  const submitPost = () => {
    const check_can_submit = handleCheckContentBeforeSubmit()
    if (check_can_submit) {
      setState({ loadingSubmit: true })
      const editorStateRaw = convertToRaw(state.editorState.getCurrentContent())
      const content = draftToHtml(editorStateRaw)
      const result_tag_user = handleTagUserAndReplaceContent(
        dataMention,
        content
      )
      const _content = result_tag_user.content
      const tag_user = result_tag_user.tag_user

      if (
        Object.keys(dataEditComment).length !== 0 &&
        !dataEditComment?.image
      ) {
        dataEditComment.image = state.image
      }

      const params = {
        body: JSON.stringify({
          id_post: data._id,
          content: _content,
          comment_more_count_original: comment_more_count_original,
          id_comment_parent: id_comment_parent,
          reply_count: reply_count,
          tag_user: tag_user,
          data_user: {
            id: userId,
            full_name: full_name
          },
          dataEditComment: dataEditComment,
          created_by: created_by_comment_parent
            ? created_by_comment_parent
            : data.created_by.id
        }),
        image: state.image
      }
      api(params)
        .then((res) => {
          setEmptyEditorState()
          if (_.isFunction(setData)) {
            setData(res.data)
            setCommentMoreCountOriginal(res.data?.comment_more_count || 0)
          }
          setState({ loadingSubmit: false, image: null })
          if (_.isFunction(setDataEditComment)) {
            setDataEditComment({})
          }
          if (_.isFunction(scrollToBottom)) {
            setTimeout(() => {
              scrollToBottom()
            }, 100)
          }
        })
        .catch((err) => {
          setState({ loadingSubmit: false })
          notification.showError({
            text: useFormatMessage("notification.something_went_wrong")
          })
        })
    }
  }

  const handleCheckContentBeforeSubmit = () => {
    const editorStateRaw = convertToRaw(state.editorState.getCurrentContent())
    let html = draftToHtml(editorStateRaw)
    html = decodeHTMLEntities(html)
    let check_content = false
    if (html.trim().length || state.image !== null) {
      check_content = true
    }

    return check_content && !state.loadingSubmit
  }

  const changeImage = (files) => {
    if (files[0]) {
      const type = files[0].type
      if (!type.includes("image/")) {
        notification.showError({
          text: useFormatMessage("notification.wrong_avatar_file_type")
        })
        setState({ image: null })
        return
      }
      setState({ image: files[0] })

      handleInsertEditorState("")
    }
    if (document.getElementById(`attach-image${currentTime}`)) {
      document.getElementById(`attach-image${currentTime}`).value = null
    }
  }
  // ** useEffect
  useEffect(() => {
    if (dataMention !== undefined) {
      setState({ mentions: dataMention, suggestions: dataMention })
    }
  }, [dataMention])

  /*  useEffect(() => {
    //setEmptyEditorState()
    setState({ image: null })
  }, [data]) */
  useEffect(() => {
    if (!_.isEmpty(dataEditComment)) {
      setState({ image: dataEditComment.image })
      const content_html = dataEditComment.content
      const contentBlock = htmlToDraft(content_html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        const editorState = EditorState.createWithContent(contentState)
        setState({ editorState: editorState })
      }
    }
  }, [dataEditComment])
  // ** mention
  const { plugins, MentionSuggestions } = useMemo(() => {
    const mentionPlugin = createMentionPlugin()
    const { MentionSuggestions } = mentionPlugin

    const plugins = [mentionPlugin]
    return { plugins, MentionSuggestions }
  }, [])
  const onOpenChange = useCallback((_open) => {
    setState({ open: _open })
  }, [])

  const onSearchChange = useCallback(
    (propsData) => {
      const { value } = propsData
      setSuggestions(defaultSuggestionsFilterFix(value, state.mentions))
    },
    [state.mentions]
  )

  useEffect(() => {
    if (focusCommentForm && _.isFunction(setFocusCommentForm)) {
      handleInsertEditorState("")
      setFocusCommentForm(false)
    }
  }, [focusCommentForm])

  return (
    <Fragment>
      <div className="post-comment__div-form">
        <div className="div-border-reply div-form"></div>
        <Avatar className="img" src={avatar} />
        <div className="post-comment-div-editor">
          <div className="d-flex">
            <div className="div-editor">
              <Editor
                editorKey={"editorPost"}
                editorState={state.editorState}
                onChange={onEditorStateChange}
                plugins={plugins}
                placeholder={useFormatMessage(
                  "modules.feed.post.text.placeholder_input"
                )}
                handleReturn={handleReturn}
              />
              <MentionSuggestions
                open={state.open}
                onOpenChange={onOpenChange}
                suggestions={state.suggestions}
                onSearchChange={onSearchChange}
                onAddMention={() => {
                  // get the mention object selected
                }}
                entryComponent={MentionSuggestion}
              />
            </div>

            <div
              className={classNames("div-form__div-icon", {
                "d-flex justify-content-center mt-25": state.loadingSubmit
              })}>
              {state.loadingSubmit ? (
                <Spinner size="sm" />
              ) : (
                <>
                  {/* <GifBoxButton
                    onSelect={(item) => {
                      setState({ image: item.images.fixed_width.url })
                      if (
                        !_.isEmpty(dataEditComment) &&
                        _.isFunction(setDataEditComment)
                      ) {
                        const _dataEditComment = { ...dataEditComment }
                        _dataEditComment["image"] = item.images.fixed_width.url
                        setDataEditComment(_dataEditComment)
                      }
                    }}></GifBoxButton>
                  <Emoji handleInsertEditorState={handleInsertEditorState} /> */}
                  <EmotionsComponent
                    selectedUser={state.selectedUser}
                    focusInputMsg={focusInputMsg}
                    setStatePostComment={setState}
                    handleInsertEditorState={handleInsertEditorState}
                    showEmotion={state.showEmotion}
                    setShowEmotion={(value) => {
                      setState({ showEmotion: value })
                    }}
                  />
                  <Label
                    className={`mb-0 cursor-pointer`}
                    for={`attach-image${currentTime}`}>
                    <div className="div-form__icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.66992 18.9501L7.59992 15.6401C8.38992 15.1101 9.52992 15.1701 10.2399 15.7801L10.5699 16.0701C11.3499 16.7401 12.6099 16.7401 13.3899 16.0701L17.5499 12.5001C18.3299 11.8301 19.5899 11.8301 20.3699 12.5001L21.9999 13.9001"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <input
                        type="file"
                        id={`attach-image${currentTime}`}
                        accept="image/*"
                        disabled={false}
                        multiple
                        hidden
                        onChange={(e) => changeImage(e.target.files)}
                      />
                    </div>
                  </Label>
                </>
              )}
            </div>
          </div>
          {state.image && (
            <div className="div-form__div-image">
              {handleImageCommentUrl(state.image)}
              <button
                type="button"
                className="btn-close-image"
                onClick={() => {
                  setState({ image: null })
                  if (_.isEmpty(dataEditComment._id_post)) {
                    return
                  }

                  if (_.isFunction(setDataEditComment)) {
                    const editorStateRaw = convertToRaw(
                      state.editorState.getCurrentContent()
                    )
                    const content = draftToHtml(editorStateRaw)
                    const _dataEditComment = { ...dataEditComment }
                    _dataEditComment["image"] = null
                    _dataEditComment["content"] = content
                    setDataEditComment(_dataEditComment)
                  }
                }}
                disabled={state.loadingSubmit}>
                <i className="fa-sharp fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {!_.isEmpty(dataEditComment) && (
        <div className="post-comment__div-cancel">
          <span
            onClick={() => {
              setState({ image: null })
              setEmptyEditorState()
              if (_.isFunction(setDataEditComment)) {
                setDataEditComment({})
              }
            }}>
            {useFormatMessage("modules.feed.post.text.cancel_edit")}
          </span>
        </div>
      )}
    </Fragment>
  )
}

export default PostCommentForm
