import { useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import EmojiPicker, { Categories, EmojiStyle, Theme } from "emoji-picker-react"
import { Fragment, useEffect, useRef } from "react"
import { Smile } from "react-feather"

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
          <svg
            ref={emotionIconRef}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M7.70702 16.4196C7.48593 16.2541 7.44083 15.9408 7.60628 15.7197C7.77173 15.4986 8.08508 15.4535 8.30617 15.619C10.3073 17.1165 13.7545 17.1258 15.6977 15.6237C15.9162 15.4548 16.2302 15.495 16.3991 15.7135C16.568 15.932 16.5278 16.246 16.3093 16.4149C14.007 18.1945 10.0646 18.1839 7.70702 16.4196Z"
              fill="#92929D"
            />
            <path
              d="M9 11C9.55228 11 10 10.5523 10 10C10 9.44772 9.55228 9 9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44772 11 9 11Z"
              fill="#92929D"
            />
            <path
              d="M15 11C15.5523 11 16 10.5523 16 10C16 9.44772 15.5523 9 15 9C14.4477 9 14 9.44772 14 10C14 10.5523 14.4477 11 15 11Z"
              fill="#92929D"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.5 12C1.5 17.799 6.20101 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12ZM21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z"
              fill="#92929D"
            />
          </svg>
        </Tooltip>
      </li>
    </Fragment>
  )
}

export default Emoji
