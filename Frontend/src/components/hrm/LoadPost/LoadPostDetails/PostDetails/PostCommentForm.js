import { useFormatMessage, useMergedState } from "@apps/utility/common"
import Editor from "@draft-js-plugins/editor"
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "@draft-js-plugins/mention"
import { EditorState, Modifier } from "draft-js"
import { Fragment, useCallback, useEffect, useMemo } from "react"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useSelector } from "react-redux"
import { Label } from "reactstrap"
import Emoji from "./Emoji"

import "@styles/react/libs/editor/editor.scss"
import "@draft-js-plugins/mention/lib/plugin.css"

const PostCommentForm = (props) => {
  const { dataMention } = props
  const [state, setState] = useMergedState({
    editorState: EditorState.createEmpty(),

    // mention
    open: false,
    mentions: dataMention,
    suggestions: dataMention
  })

  const userData = useSelector((state) => state.auth.userData)
  const avatar = userData.avatar
  const userName = userData.username
  const fullName = userData.full_name
  const userId = userData.id

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
    setState({ editorState: emptyEditorState })
  }

  // ** useEffect
  useEffect(() => {
    setState({ mentions: dataMention, suggestions: dataMention })
  }, [dataMention])

  // ** mention
  const { plugins, MentionSuggestions } = useMemo(() => {
    const mentionPlugin = createMentionPlugin()
    const { MentionSuggestions } = mentionPlugin

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

  return (
    <Fragment>
      <Avatar className="img" src={avatar} />
      <div className="post-comment-div-editor">
        <div className="div-editor">
          <Editor
            editorKey={"editorPost"}
            editorState={state.editorState}
            onChange={onEditorStateChange}
            plugins={plugins}
            placeholder={useFormatMessage(
              "modules.feed.post.text.placeholder_input"
            )}
          />
          <MentionSuggestions
            open={state.open}
            onOpenChange={onOpenChange}
            suggestions={state.suggestions}
            onSearchChange={onSearchChange}
            onAddMention={() => {
              // get the mention object selected
            }}
          />
        </div>

        <div className="div-form__div-icon">
          <Emoji handleInsertEditorState={handleInsertEditorState} />

          <Label className={`mb-0 cursor-pointer`} for="attach-image">
            <div className="div-form__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.75 15.5416C18.75 17.0883 17.4395 18.3333 15.8333 18.3333H4.16667C2.56048 18.3333 1.25 17.0883 1.25 15.5416V4.45829C1.25 2.91158 2.56048 1.66663 4.16667 1.66663H15.8333C17.4395 1.66663 18.75 2.91158 18.75 4.45829V15.5416ZM17.9167 12.559L13.9888 8.9791L10.0604 12.5236L14.5503 17.5H15.8333C16.9886 17.5 17.9167 16.6183 17.9167 15.5416V12.559ZM17.9167 11.4315V4.45829C17.9167 3.38165 16.9886 2.49996 15.8333 2.49996H4.16667C3.01143 2.49996 2.08333 3.38165 2.08333 4.45829V14.5375L6.92796 9.70496C7.09669 9.53666 7.37194 9.5439 7.53158 9.72084L9.50216 11.9049L13.7111 8.10727C13.8702 7.96365 14.1124 7.96426 14.2709 8.10867L17.9167 11.4315ZM13.4279 17.5L7.20633 10.6043L2.0907 15.7072C2.18004 16.7072 3.07123 17.5 4.16667 17.5H13.4279ZM6.8254 7.24996C5.93803 7.24996 5.21825 6.53198 5.21825 5.64579C5.21825 4.7596 5.93803 4.04163 6.8254 4.04163C7.71276 4.04163 8.43254 4.7596 8.43254 5.64579C8.43254 6.53198 7.71276 7.24996 6.8254 7.24996ZM6.8254 6.41663C7.25299 6.41663 7.59921 6.07128 7.59921 5.64579C7.59921 5.22031 7.25299 4.87496 6.8254 4.87496C6.3978 4.87496 6.05159 5.22031 6.05159 5.64579C6.05159 6.07128 6.3978 6.41663 6.8254 6.41663Z"
                  fill="#92929D"
                />
              </svg>

              <input
                type="file"
                id="attach-image"
                accept="image/*"
                disabled={false}
                multiple
                hidden
                onChange={(e) => {}}
              />
            </div>
          </Label>
        </div>
      </div>
    </Fragment>
  )
}

export default PostCommentForm
