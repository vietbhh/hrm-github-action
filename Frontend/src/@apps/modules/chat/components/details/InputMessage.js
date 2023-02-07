import { useMergedState } from "@apps/utility/common"
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
    suggestions,
    setSuggestions,
    mentions,
    selectedGroup,
    handleUpdateGroup,
    userId,
    groups
  } = props

  const [state, setState] = useMergedState({
    editorState: EditorState.createEmpty(),
    showEmotion: false,

    // mention
    open: false
  })

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
    const values = { message: html }
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
      setSuggestions(defaultSuggestionsFilter(value, mentions))
    },
    [mentions]
  )

  // ** listen
  useEffect(() => {
    const handle = (event) => {
      if (localStorage.getItem("formChatFocus") === "true") {
        if (
          (event.keyCode === 13 && event.shiftKey) ||
          (event.keyCode === 13 && event.ctrlKey) ||
          (event.keyCode === 90 && event.ctrlKey) ||
          event.keyCode === 8
        ) {
          handleHeight(replying, false)
          return
        }

        if (event.keyCode === 13 && state.open === false) {
          onSubmitEditor()
        }
      }
    }

    const handlePaste = (event) => {
      handleHeight(replying)
    }

    window.addEventListener("keydown", handle)
    window.addEventListener("paste", handlePaste)

    return () => {
      window.removeEventListener("keydown", handle)
      window.removeEventListener("paste", handlePaste)
    }
  }, [state.editorState, state.open, replying])

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
            suggestions={suggestions}
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M16.586 5.09924L8.76251 6.3913C3.50182 7.27084 3.07032 9.99521 7.80305 12.4491L9.89286 13.531L10.276 15.8529C11.1473 21.1123 13.8799 21.5451 16.3338 16.8123L19.9872 9.78061C21.6181 6.62185 20.0954 4.51606 16.586 5.09924ZM16.148 9.5691L12.5223 12.2179C12.3793 12.3218 12.2138 12.3546 12.0574 12.3298C11.901 12.3051 11.7538 12.2227 11.6499 12.0797C11.449 11.8032 11.5116 11.4081 11.7881 11.2072L15.4137 8.55845C15.6902 8.35757 16.0853 8.42014 16.2862 8.69664C16.4871 8.97313 16.4245 9.36821 16.148 9.5691Z"
            fill="white"
          />
        </svg>
      </button>
    </>
  )
}

export default InputMessage
