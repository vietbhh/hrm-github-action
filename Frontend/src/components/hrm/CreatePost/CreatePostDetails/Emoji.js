import { useMergedState } from "@apps/utility/common"
import { handleInsertEditorState } from "@modules/Feed/common/common"
import { Tooltip } from "antd"
import EmojiPicker, { Categories, EmojiStyle, Theme } from "emoji-picker-react"
import { Fragment, useEffect, useRef } from "react"

const Emoji = (props) => {
  const { editorState, setEditorState } = props
  const [state, setState] = useMergedState({
    showEmotion: false
  })

  const emotionRef = useRef(null)
  const emotionIconRef = useRef(null)

  const setShowEmotion = (value) => {
    setState({ showEmotion: value })
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emotionRef.current &&
        !emotionRef.current.contains(event.target) &&
        emotionIconRef.current &&
        !emotionIconRef.current.contains(event.target)
      ) {
        setShowEmotion(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.addEventListener("mousedown", handleClickOutside)
    }
  }, [emotionRef, emotionIconRef])

  return (
    <Fragment>
      <li
        className="create_post_footer-li cursor-pointer ms-auto"
        onClick={() => {
          if (state.showEmotion === false) {
            setShowEmotion(true)
          }
        }}>
        <div
          className={`emotions-dropdown-menu shadow ${
            state.showEmotion ? "show" : ""
          }`}>
          <div className="emotions-dropdown-arrow"></div>
          <div className="div-emoji" ref={emotionRef}>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                handleInsertEditorState(
                  emojiData.emoji,
                  editorState,
                  setEditorState
                )
              }}
              autoFocusSearch={false}
              theme={Theme.AUTO}
              emojiStyle={EmojiStyle.NATIVE}
              emojiVersion="5.0"
              searchDisabled={false}
              skinTonesDisabled
              previewConfig={{
                showPreview: false
              }}
              categories={[
                {
                  category: "suggested",
                  name: "Recently Used"
                },
                {
                  name: "Smiles & Emotions",
                  category: Categories.SMILEYS_PEOPLE
                }
              ]}
            />
          </div>
        </div>
        <Tooltip title="Emoji">
          <svg
            ref={emotionIconRef}
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13 26H19C24 26 26 24 26 19V13C26 8 24 6 19 6H13C8 6 6 8 6 13V19C6 24 8 26 13 26Z"
              stroke="#696760"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19.5 13.75C20.3284 13.75 21 13.0784 21 12.25C21 11.4216 20.3284 10.75 19.5 10.75C18.6716 10.75 18 11.4216 18 12.25C18 13.0784 18.6716 13.75 19.5 13.75Z"
              stroke="#696760"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.5 13.75C13.3284 13.75 14 13.0784 14 12.25C14 11.4216 13.3284 10.75 12.5 10.75C11.6716 10.75 11 11.4216 11 12.25C11 13.0784 11.6716 13.75 12.5 13.75Z"
              stroke="#696760"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19.5 19C18.3333 20 15.3 21.4 12.5 19"
              stroke="#696760"
              stroke-linecap="round"
            />
          </svg>
        </Tooltip>
      </li>
    </Fragment>
  )
}

export default Emoji
