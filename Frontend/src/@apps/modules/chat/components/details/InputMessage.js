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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="vuesax/bold/send-2">
      <g id="send-2">
      <path id="Vector" d="M16.14 3.46004L7.11 6.46004C1.04 8.49004 1.04 11.8 7.11 13.82L9.79 14.71L10.68 17.39C12.7 23.46 16.02 23.46 18.04 17.39L21.05 8.37004C22.39 4.32004 20.19 2.11004 16.14 3.46004ZM16.46 8.84004L12.66 12.66C12.51 12.81 12.32 12.88 12.13 12.88C11.94 12.88 11.75 12.81 11.6 12.66C11.31 12.37 11.31 11.89 11.6 11.6L15.4 7.78004C15.69 7.49004 16.17 7.49004 16.46 7.78004C16.75 8.07004 16.75 8.55004 16.46 8.84004Z" fill="white"/>
      </g>
      </g>
      </svg>
      </button>
    </>
  )
}

export default InputMessage
