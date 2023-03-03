import { useFormatMessage, useMergedState } from "@apps/utility/common"
import createLinkPlugin from "@draft-js-plugins/anchor"
import {
  BoldButton,
  CodeBlockButton,
  ItalicButton,
  OrderedListButton,
  UnderlineButton,
  UnorderedListButton
} from "@draft-js-plugins/buttons"
import Editor from "@draft-js-plugins/editor"
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar"
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "@draft-js-plugins/mention"
import createToolbarPlugin from "@draft-js-plugins/static-toolbar"
import { useCallback, useEffect, useMemo } from "react"

import "@styles/react/libs/editor/editor.scss"
import "@draft-js-plugins/inline-toolbar/lib/plugin.css"
import "@draft-js-plugins/mention/lib/plugin.css"
import "@draft-js-plugins/static-toolbar/lib/plugin.css"

const EditorComponent = (props) => {
  const { dataMention, editorState, onEditorStateChange } = props
  const [state, setState] = useMergedState({
    // mention
    open: false,
    mentions: dataMention,
    suggestions: dataMention
  })

  // ** function
  const setSuggestions = (value) => {
    setState({ suggestions: value })
  }

  // ** useEffect
  useEffect(() => {
    setState({ mentions: dataMention, suggestions: dataMention })
  }, [dataMention])

  // ** mention
  const { plugins, MentionSuggestions, Toolbar, InlineToolbar, linkPlugin } =
    useMemo(() => {
      const mentionPlugin = createMentionPlugin()
      const { MentionSuggestions } = mentionPlugin

      const staticToolbarPlugin = createToolbarPlugin()
      const { Toolbar } = staticToolbarPlugin

      const inlineToolbarPlugin = createInlineToolbarPlugin()
      const { InlineToolbar } = inlineToolbarPlugin

      const linkPlugin = createLinkPlugin()

      const plugins = [
        mentionPlugin,
        staticToolbarPlugin,
        inlineToolbarPlugin,
        linkPlugin
      ]
      return { plugins, MentionSuggestions, Toolbar, InlineToolbar, linkPlugin }
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
    <div className="div-editor">
      <Editor
        editorKey={"editor"}
        editorState={editorState}
        onChange={onEditorStateChange}
        plugins={plugins}
        placeholder={useFormatMessage(
          "modules.feed.create_post.text.placeholder_input"
        )}
      />
      <Toolbar>
        {
          // may be use React.Fragment instead of div to improve performance after React 16
          (externalProps) => (
            <div>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <CodeBlockButton {...externalProps} />
            </div>
          )
        }
      </Toolbar>
      <InlineToolbar>
        {
          // may be use React.Fragment instead of div to improve performance after React 16
          (externalProps) => (
            <div>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <linkPlugin.LinkButton {...externalProps} />
            </div>
          )
        }
      </InlineToolbar>
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
  )
}

export default EditorComponent