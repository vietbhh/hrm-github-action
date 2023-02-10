import { useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import { Fragment, useEffect, useRef, useState } from "react"
import { Smile } from "react-feather"
import EmojiPicker, { Categories, EmojiStyle, Theme } from "emoji-picker-react"

const Emoji = (props) => {
  const { handleInsertEditorState } = props
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
        className="create_post_footer-li ms-auto"
        onClick={() => {
          if (state.showEmotion === false) {
            setShowEmotion(true)
          }
        }}>
        <div
          className={`emotions-dropdown-menu ${
            state.showEmotion ? "show" : ""
          }`}>
          <div className="emotions-dropdown-arrow"></div>
          <div className="div-emoji" ref={emotionRef}>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                handleInsertEditorState(emojiData.emoji)
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
          <Smile size={22} ref={emotionIconRef} />
        </Tooltip>
      </li>
    </Fragment>
  )
}

export default Emoji
