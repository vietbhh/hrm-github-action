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
          <Label className={`mb-0 cursor-pointer`} for="attach-file">
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
                  d="M9.61074 14.5842C8.79427 15.3548 7.5076 15.3405 6.70854 14.5414C5.89495 13.7278 5.89495 12.4087 6.70854 11.5951L13.1904 5.11333C13.3531 4.95061 13.6169 4.95061 13.7796 5.11333C13.9423 5.27605 13.9423 5.53987 13.7796 5.70259L7.2978 12.1844C6.80964 12.6726 6.80964 13.464 7.2978 13.9522C7.78595 14.4403 8.57741 14.4403 9.06556 13.9522L15.5474 7.47035C16.6864 6.33132 16.6864 4.48459 15.5474 3.34556C14.4083 2.20653 12.5616 2.20653 11.4226 3.34556L4.94078 9.82738C3.15087 11.6173 3.15087 14.5193 4.94078 16.3092C6.73068 18.0991 9.63268 18.0991 11.4226 16.3092L16.7259 11.0059C16.8886 10.8432 17.1524 10.8432 17.3151 11.0059C17.4779 11.1686 17.4779 11.4324 17.3151 11.5951L12.0118 16.8984C9.8965 19.0138 6.46686 19.0138 4.35152 16.8984C2.25068 14.7976 2.23628 11.4004 4.30831 9.28181L10.8333 2.75631C12.2978 1.29184 14.6722 1.29184 16.1366 2.75631C17.6011 4.22077 17.6011 6.59514 16.1366 8.05961L9.61137 14.5849L9.61074 14.5842Z"
                  fill="#92929D"
                />
              </svg>

              <input
                type="file"
                id="attach-file"
                accept="image/*, video/*"
                disabled={false}
                multiple
                hidden
                onChange={(e) => {}}
              />
            </div>
          </Label>

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
