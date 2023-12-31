import { useFormatMessage, useMergedState } from "@apps/utility/common"
import createLinkPlugin from "@draft-js-plugins/anchor"
import {
  BoldButton,
  ItalicButton,
  UnderlineButton
} from "@draft-js-plugins/buttons"
import Editor from "@draft-js-plugins/editor"
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar"
import createLinkifyPlugin from "@draft-js-plugins/linkify"
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "@draft-js-plugins/mention"
import { arrImage } from "@modules/Feed/common/common"
import { Fragment, useCallback, useEffect, useMemo } from "react"
import createHashtagPlugin from "@draft-js-plugins/hashtag"

import "@draft-js-plugins/inline-toolbar/lib/plugin.css"
import "@draft-js-plugins/linkify/lib/plugin.css"
import "@draft-js-plugins/mention/lib/plugin.css"
import "@draft-js-plugins/static-toolbar/lib/plugin.css"
import "@styles/react/libs/editor/editor.scss"
import "@draft-js-plugins/hashtag/lib/plugin.css"
import { ContentState, EditorState } from "draft-js"
import htmlToDraft from "html-to-draftjs"
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
const EditorComponent = (props) => {
  const {
    dataPost,
    dataMention,
    editorState,
    onEditorStateChange,
    backgroundImage,
    showChooseBackgroundImage,
    placeholder = null,
    setEditorState
  } = props
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
    if (!_.isEmpty(dataPost)) {
      const content_html = dataPost.content
      const contentBlock = htmlToDraft(content_html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState)
      }
    }
  }, [dataPost])

  useEffect(() => {
    setState({ mentions: dataMention, suggestions: dataMention })
  }, [dataMention])

  useEffect(() => {
    if (document.getElementById("div-tool-bar")) {
      const element = document.getElementById("div-tool-bar")
      if (backgroundImage === null && showChooseBackgroundImage === false) {
        element.classList.remove("d-none")
      } else {
        element.classList.add("d-none")
      }
    }
  }, [backgroundImage, showChooseBackgroundImage])

  // ** mention
  const { plugins, MentionSuggestions, InlineToolbar, linkPlugin } =
    useMemo(() => {
      const mentionPlugin = createMentionPlugin()
      const { MentionSuggestions } = mentionPlugin

      const inlineToolbarPlugin = createInlineToolbarPlugin()
      const { InlineToolbar } = inlineToolbarPlugin

      const linkPlugin = createLinkPlugin()
      const linkifyPlugin = createLinkifyPlugin()

      const hashtagPlugin = createHashtagPlugin()

      const plugins = [
        mentionPlugin,
        inlineToolbarPlugin,
        linkPlugin,
        linkifyPlugin,
        hashtagPlugin
      ]
      return {
        plugins,
        MentionSuggestions,
        InlineToolbar,
        linkPlugin
      }
    }, [])

  const onOpenChange = useCallback((_open) => {
    setState({ open: _open })
  }, [])

  const onSearchChange = useCallback(
    ({ value }) => {
      setSuggestions(defaultSuggestionsFilterFix(value, state.mentions))
    },
    [state.mentions]
  )

  const renderStyleBackgroundImage = () => {
    if (backgroundImage && arrImage[backgroundImage - 1]) {
      return {
        backgroundImage: `url("${arrImage[backgroundImage - 1].image}")`,
        color: arrImage[backgroundImage - 1].color
      }
    }

    return {}
  }

  return (
    <div
      className={`div-editor ${
        backgroundImage !== null ? "div-editor-background" : ""
      }`}
      style={renderStyleBackgroundImage()}>
      <Editor
        editorKey={"editor"}
        editorState={editorState}
        onChange={onEditorStateChange}
        plugins={plugins}
        placeholder={
          placeholder === null
            ? useFormatMessage(
                "modules.feed.create_post.text.you_thinking"
              )
            : placeholder
        }
      />

      <div id="div-tool-bar">
        <InlineToolbar>
          {
            // may be use React.Fragment instead of div to improve performance after React 16
            (externalProps) => (
              <Fragment>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <linkPlugin.LinkButton {...externalProps} />
              </Fragment>
            )
          }
        </InlineToolbar>
      </div>

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
