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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.5 9.75C16.3284 9.75 17 9.07843 17 8.25C17 7.42157 16.3284 6.75 15.5 6.75C14.6716 6.75 14 7.42157 14 8.25C14 9.07843 14.6716 9.75 15.5 9.75Z" stroke="#696760" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 9.75C9.32843 9.75 10 9.07843 10 8.25C10 7.42157 9.32843 6.75 8.5 6.75C7.67157 6.75 7 7.42157 7 8.25C7 9.07843 7.67157 9.75 8.5 9.75Z" stroke="#696760" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.5 15C14.3333 16 11.3 17.4 8.5 15" stroke="#696760" strokeLinecap="round"/>
          </svg>
        </Tooltip>
      </li>
    </Fragment>
  )
}

export default Emoji
