import { useMergedState } from "@apps/utility/common"
import EmojiPicker, { Categories, EmojiStyle, Theme } from "emoji-picker-react"
import { Fragment, useEffect, useRef } from "react"

const Emoji = (props) => {
  const { handleInsertEditorState } = props
  const [state, setState] = useMergedState({
    showEmotion: false,
    position: "top"
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
      <label
        className={`mb-0 cursor-pointer form-label`}
        ref={emotionIconRef}
        onClick={(e) => {
          if (state.showEmotion === false) {
            setShowEmotion(true)
            if (e.clientY && e.clientY <= 420) {
              setState({ position: "bottom" })
            } else {
              setState({ position: "top" })
            }
          }
        }}>
        {state.showEmotion && (
          <div
            className={`emotions-dropdown-menu shadow ${
              state.showEmotion ? "show" : ""
            } ${state.position === "bottom" ? "bottom" : ""}`}>
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
                lazyLoadEmojis={true}
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
        )}

        <div className="div-form__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none">
            <path
              d="M6.42251 13.683C6.23827 13.5451 6.20069 13.284 6.33856 13.0998C6.47644 12.9155 6.73757 12.8779 6.92181 13.0158C8.58941 14.2638 11.4621 14.2715 13.0814 13.0197C13.2635 12.879 13.5252 12.9125 13.6659 13.0946C13.8066 13.2766 13.7731 13.5383 13.5911 13.6791C11.6725 15.1621 8.38716 15.1533 6.42251 13.683Z"
              fill="#92929D"
            />
            <path
              d="M7.5 9.16667C7.96024 9.16667 8.33333 8.79357 8.33333 8.33333C8.33333 7.8731 7.96024 7.5 7.5 7.5C7.03976 7.5 6.66667 7.8731 6.66667 8.33333C6.66667 8.79357 7.03976 9.16667 7.5 9.16667Z"
              fill="#92929D"
            />
            <path
              d="M12.5 9.16667C12.9602 9.16667 13.3333 8.79357 13.3333 8.33333C13.3333 7.8731 12.9602 7.5 12.5 7.5C12.0398 7.5 11.6667 7.8731 11.6667 8.33333C11.6667 8.79357 12.0398 9.16667 12.5 9.16667Z"
              fill="#92929D"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.25 10C1.25 14.8325 5.16751 18.75 10 18.75C14.8325 18.75 18.75 14.8325 18.75 10C18.75 5.16751 14.8325 1.25 10 1.25C5.16751 1.25 1.25 5.16751 1.25 10ZM17.9167 10C17.9167 14.3723 14.3723 17.9167 10 17.9167C5.62775 17.9167 2.08333 14.3723 2.08333 10C2.08333 5.62775 5.62775 2.08333 10 2.08333C14.3723 2.08333 17.9167 5.62775 17.9167 10Z"
              fill="#92929D"
            />
          </svg>
        </div>
      </label>
    </Fragment>
  )
}

export default Emoji
