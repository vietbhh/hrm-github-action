import { useMergedState } from "@apps/utility/common"
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "@draft-js-plugins/mention"
import { convertToRaw, EditorState, Modifier } from "draft-js"
import draftToHtml from "draftjs-to-html"
import React, { useCallback, useEffect, useMemo } from "react"
//import { Editor } from "react-draft-wysiwyg"
import Editor from "@draft-js-plugins/editor"
import "@draft-js-plugins/mention/lib/plugin.css"
import { InputGroup, InputGroupText } from "reactstrap"
import UpFile from "../details/UpFile"
import EmotionsComponent from "../emotions/index"

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
    setRefMessage,
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
    mentions
  } = props

  const [state, setState] = useMergedState({
    editorState: EditorState.createEmpty(),
    showEmotion: false,

    // mention
    open: false
  })

  const onEditorStateChange = (editorState) => {
    setState({ editorState: editorState })
    handleHeight(replying, false)
  }

  const handleReturn = (e) => {
    // Prevent line break from being inserted
    if (e.shiftKey || e.ctrlKey || state.open === true) {
      return "not-handled"
    }

    e.preventDefault()

    return "handled"
  }

  const setEditorReference = (ref) => {
    setRefMessage(ref)
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

  const onSubmitEditor = () => {
    const editorStateRaw = convertToRaw(state.editorState.getCurrentContent())
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

  useEffect(() => {
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
        {/* <Editor
          wrapperClassName="wrapper-message"
          editorClassName="editor-message"
          editorState={state.editorState}
          onEditorStateChange={onEditorStateChange}
          stripPastedStyles={true}
          editorRef={setEditorReference}
          placeholder="Type a message ..."
          toolbarHidden
          editorStyle={{
            minHeight: "55px",
            maxHeight: "auto"
          }}
        /> */}
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
        <MentionSuggestions
          open={state.open}
          onOpenChange={onOpenChange}
          suggestions={suggestions}
          onSearchChange={onSearchChange}
          onAddMention={() => {
            // get the mention object selected
          }}
        />
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
        {/* <ErpInput
                        innerRef={msgRef}
                        useForm={methods}
                        name="message"
                        defaultValue=""
                        placeholder="Type a message ..."
                        nolabel
                        autoComplete="off"
                      /> */}
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
