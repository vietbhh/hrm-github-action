import { getAvatarUrl, useMergedState } from "@apps/utility/common"
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "@draft-js-plugins/mention"
import { convertToRaw, EditorState, Modifier } from "draft-js"
import draftToHtml from "draftjs-to-html"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
//import { Editor } from "react-draft-wysiwyg"
import Editor from "@draft-js-plugins/editor"
import "@draft-js-plugins/mention/lib/plugin.css"
import { InputGroup, InputGroupText } from "reactstrap"
import UpFile from "../details/UpFile"
import EmotionsComponent from "../emotions/index"
import { decodeHTMLEntities } from "../../common/common"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import moment from "moment"

const InputMessage = (props) => {
  const {
    handleHeight,
    replying,
    replying_timestamp,
    handleSendMsg,
    sendMessage,
    selectedUser,
    focusInputMsg,
    setReplyingDefault,
    msgRef,
    linkPreview,
    file,
    modal,
    compress_images,
    toggleModal,
    setCompressImages,
    handleSaveFile,
    changeFile,
    renderFormReply,
    selectedGroup,
    handleUpdateGroup,
    userId,
    groups,
    typing,
    dataEmployees
  } = props

  const [state, setState] = useMergedState({
    editorState: EditorState.createEmpty(),
    showEmotion: false,

    // mention
    open: false,
    mentions: [],
    suggestions: []
  })

  // ** mention
  const setSuggestions = (value) => {
    setState({ suggestions: value })
  }
  useEffect(() => {
    if (selectedGroup.user) {
      const data_mention = []
      _.forEach(selectedGroup.user, (value) => {
        if (value !== userId) {
          const index_employee = dataEmployees.findIndex(
            (item_employee) => item_employee.id === value
          )
          if (index_employee > -1) {
            data_mention.push({
              id: value,
              name: dataEmployees[index_employee].full_name,
              link: `/chat/${dataEmployees[index_employee].username}`,
              avatar: getAvatarUrl(value * 1)
            })
          }
        }
      })

      setState({ suggestions: data_mention, mentions: data_mention })
    } else {
      setState({ suggestions: [], mentions: [] })
    }
  }, [selectedGroup, dataEmployees])

  const handleRemoveTyping = (groupId = "") => {
    let group = selectedGroup
    if (groupId !== "") {
      const index_group = groups.findIndex((value) => value.id === groupId)
      if (index_group !== -1) {
        group = groups[index_group]
      }
    }
    if (group.id) {
      let arrRemove = {}
      if (group.chat.typing) {
        _.forEach(group.chat.typing, (value) => {
          if (value.id === userId) {
            arrRemove = {
              ...arrRemove,
              ...{ id: value.id, timestamp: value.timestamp }
            }
          }
        })
      }

      if (!_.isEmpty(arrRemove)) {
        handleUpdateGroup(group.id, {
          typing: arrayRemove(arrRemove),
          typing_id: arrayRemove(userId)
        })
      }
    }
  }

  const onEditorStateChange = (editorState) => {
    setState({ editorState: editorState })
    handleHeight(replying, false)

    // ** check typing
    const html = handleMessageBeforeCallSubmitFunction(editorState)
    const msg = decodeHTMLEntities(html)
    if (selectedGroup.id) {
      let old_timestamp = 0
      if (selectedGroup.chat.typing) {
        const index_typing = selectedGroup.chat.typing.findIndex(
          (value) => value.id === userId
        )
        if (index_typing !== -1) {
          old_timestamp = selectedGroup.chat.typing[index_typing].timestamp
        }
      }

      const new_timestamp = Date.now()
      if (msg.trim().length) {
        const minute_diff = moment(new_timestamp).diff(
          moment(old_timestamp),
          "minutes"
        )
        if (minute_diff >= 1) {
          handleRemoveTyping()

          handleUpdateGroup(selectedGroup.id, {
            typing: arrayUnion({ id: userId, timestamp: new_timestamp }),
            typing_id: arrayUnion(userId)
          })
        }
      } else {
        handleRemoveTyping()
      }
    }
  }

  const handleReturn = (e) => {
    // Prevent line break from being inserted
    if (e.shiftKey || e.ctrlKey || state.open === true) {
      return "not-handled"
    }

    e.preventDefault()
    onSubmitEditor()

    return "handled"
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

    localStorage.setItem("formChatFocus", true)

    return EditorState.forceSelection(
      newEditorState,
      newContent.getSelectionAfter()
    )
  }

  const setEmptyEditorState = () => {
    const emptyEditorState = EditorState.moveFocusToEnd(
      EditorState.createEmpty()
    )
    setState({ editorState: emptyEditorState })
    handleHeight(replying, true)
  }

  const handleInsertEditorState = (characterToInsert) => {
    const newEditorState = insertCharacter(characterToInsert, state.editorState)
    setState({ editorState: newEditorState })
  }

  const handleMessageBeforeCallSubmitFunction = (editorState) => {
    const editorStateRaw = convertToRaw(editorState.getCurrentContent())
    let html = draftToHtml(editorStateRaw)
    const mapObj = {
      "<p>": "",
      "</p>": "",
      "\n": "<br>"
    }
    html = html.replace(/<p>|<\/p>|\n/gi, function (matched) {
      return mapObj[matched]
    })
    const num_slice = 4
    html = html.slice(0, -num_slice)

    return html
  }

  const onSubmitEditor = () => {
    const html = handleMessageBeforeCallSubmitFunction(state.editorState)
    const values = { message: html, mentions: state.mentions }
    handleSendMsg(values)
    setEmptyEditorState()
    setState({ showEmotion: false })
  }

  // ** mention
  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin()
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin]
    return { plugins, MentionSuggestions }
  }, [])

  const onOpenChange = useCallback((_open) => {
    setTimeout(() => {
      setState({ open: _open })
    }, 100)
  }, [])
  const onSearchChange = useCallback(
    ({ value }) => {
      setSuggestions(defaultSuggestionsFilter(value, state.mentions))
    },
    [state.mentions]
  )

  // ** listen
  const handle = (event) => {
    if (localStorage.getItem("formChatFocus") === "true") {
      if (
        (event.keyCode === 13 && event.shiftKey) ||
        (event.keyCode === 13 && event.ctrlKey) ||
        (event.keyCode === 90 && event.ctrlKey) ||
        event.keyCode === 8
      ) {
        handleHeight(replying, false)
      }
    }
  }

  const handlePaste = (event) => {
    handleHeight(replying)
  }
  useEffect(() => {
    window.addEventListener("keydown", handle)
    window.addEventListener("paste", handlePaste)

    return () => {
      window.removeEventListener("keydown", handle)
      window.removeEventListener("paste", handlePaste)
    }
  }, [state.editorState, state.open, replying, typing])

  useEffect(() => {
    handleInsertEditorState("")
  }, [replying_timestamp])

  const usePrevious = (value) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const preSelectedUser = usePrevious(selectedUser)

  useEffect(() => {
    if (preSelectedUser?.chat?.id) {
      handleRemoveTyping(preSelectedUser.chat.id)
    }

    setEmptyEditorState()
  }, [selectedUser])

  return (
    <>
      <InputGroup className="input-group-merge form-send-message">
        {replying && (
          <div id="form-reply">
            <div className="form-reply-left">{renderFormReply()}</div>
            <div className="form-reply-right">
              <i
                className="far fa-times form-reply-right-icon"
                onClick={() => {
                  setReplyingDefault()
                  focusInputMsg()
                  handleHeight(false, false)
                }}></i>
            </div>
          </div>
        )}
        <InputGroupText className="input-group-text-first">
          <EmotionsComponent
            sendMessage={sendMessage}
            selectedUser={selectedUser}
            focusInputMsg={focusInputMsg}
            setReplyingDefault={setReplyingDefault}
            handleInsertEditorState={handleInsertEditorState}
            showEmotion={state.showEmotion}
            setShowEmotion={(value) => setState({ showEmotion: value })}
          />
        </InputGroupText>
        <Editor
          editorKey={"editor"}
          editorState={state.editorState}
          onChange={onEditorStateChange}
          handleReturn={handleReturn}
          stripPastedStyles={true}
          plugins={plugins}
          ref={msgRef}
          placeholder="Type a message ..."
          toolbarHidden
          editorStyle={{
            minHeight: "55px",
            maxHeight: "auto"
          }}
        />
        {selectedGroup?.type === "group" && (
          <MentionSuggestions
            open={state.open}
            onOpenChange={onOpenChange}
            suggestions={state.suggestions}
            onSearchChange={onSearchChange}
            onAddMention={() => {
              // get the mention object selected
            }}
          />
        )}
        <InputGroupText>
          <UpFile
            selectedUser={selectedUser}
            linkPreview={linkPreview}
            file={file}
            modal={modal}
            compress_images={compress_images}
            toggleModal={toggleModal}
            setCompressImages={setCompressImages}
            handleSaveFile={handleSaveFile}
            changeFile={changeFile}
          />
        </InputGroupText>
      </InputGroup>

      <button type="button" className="send" onClick={() => onSubmitEditor()}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="vuesax/bold/send-2">
        <g id="send-2">
        <path id="Vector" d="M24.2099 4.44006L10.6649 8.94006C1.55993 11.9851 1.55993 16.9501 10.6649 19.9801L14.6849 21.3151L16.0199 25.3351C19.0499 34.4401 24.0299 34.4401 27.0599 25.3351L31.5749 11.8051C33.5849 5.73006 30.2849 2.41506 24.2099 4.44006ZM24.6899 12.5101L18.9899 18.2401C18.7649 18.4651 18.4799 18.5701 18.1949 18.5701C17.9099 18.5701 17.6249 18.4651 17.3999 18.2401C16.9649 17.8051 16.9649 17.0851 17.3999 16.6501L23.0999 10.9201C23.5349 10.4851 24.2549 10.4851 24.6899 10.9201C25.1249 11.3551 25.1249 12.0751 24.6899 12.5101Z" fill="#2F9BFA"/>
        </g>
        </g>
      </svg>
      </button>
    </>
  )
}

export default InputMessage
