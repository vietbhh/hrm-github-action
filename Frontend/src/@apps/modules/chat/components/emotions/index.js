import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { Smile } from "react-feather"
import EmojiComponent from "./Emoji"
import GifComponent from "./Gif"
import classNames from "classnames"
import Sticker from "./stickers/Sticker"

const index = (props) => {
  const {
    sendMessage,
    selectedUser,
    focusInputMsg,
    setReplyingDefault,
    handleInsertEditorState,
    showEmotion,
    setShowEmotion,
    ...rest
  } = props

  const windowWidth = window.innerWidth

  const emotionRef = useRef(null)
  const emotionIconRef = useRef(null)
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

  const items = [
    {
      key: "1",
      label: "Emoji",
      children: (
        <EmojiComponent
          focusInputMsg={focusInputMsg}
          handleInsertEditorState={handleInsertEditorState}
        />
      )
    },
    {
      key: "2",
      label: "Stickers",
      children: (
        <Sticker
          sendMessage={sendMessage}
          selectedUser={selectedUser}
          focusInputMsg={focusInputMsg}
          setReplyingDefault={setReplyingDefault}
          setShowEmotion={setShowEmotion}
          setStatePostComment={rest.setStatePostComment}
        />
      )
    },
    {
      key: "3",
      label: "Gifs",
      children: (
        <GifComponent
          sendMessage={sendMessage}
          selectedUser={selectedUser}
          focusInputMsg={focusInputMsg}
          setReplyingDefault={setReplyingDefault}
          setShowEmotion={setShowEmotion}
          setStatePostComment={rest.setStatePostComment}
        />
      )
    }
  ]

  return (
    <>
      {showEmotion === true && (
        <div
          className={`emotions-dropdown-menu ${showEmotion ? "show" : ""}`}
          ref={emotionRef}>
          <div className="emotions-dropdown-arrow"></div>
          <Tabs defaultActiveKey="1" tabPosition={"bottom"} items={items} />
        </div>
      )}
      <div
        ref={emotionIconRef}
        className="cursor-pointer text-secondary"
        onClick={() => {
          if (showEmotion === false) {
            setShowEmotion(true)
          }
          //focusInputMsg()
        }}>
          <div className={classNames({'emoji-web-hidden': windowWidth > 767.68 })}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="vuesax/linear/emoji-icon">
              <g id="emoji-icon">
              <path id="Vector" d="M7.5 18.8337H12.5C16.6667 18.8337 18.3333 17.167 18.3333 13.0003V8.00033C18.3333 3.83366 16.6667 2.16699 12.5 2.16699H7.5C3.33333 2.16699 1.66667 3.83366 1.66667 8.00033V13.0003C1.66667 17.167 3.33333 18.8337 7.5 18.8337Z" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path id="Vector_2" d="M12.9167 8.625C13.607 8.625 14.1667 8.06536 14.1667 7.375C14.1667 6.68464 13.607 6.125 12.9167 6.125C12.2263 6.125 11.6667 6.68464 11.6667 7.375C11.6667 8.06536 12.2263 8.625 12.9167 8.625Z" stroke="#696760" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path id="Vector_3" d="M7.08333 8.625C7.77369 8.625 8.33333 8.06536 8.33333 7.375C8.33333 6.68464 7.77369 6.125 7.08333 6.125C6.39298 6.125 5.83333 6.68464 5.83333 7.375C5.83333 8.06536 6.39298 8.625 7.08333 8.625Z" stroke="#696760" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path id="Vector 1" d="M12.9167 13C11.9444 13.8333 9.41667 15 7.08333 13" stroke="#696760" strokeLinecap="round"/>
              </g>
              </g>
            </svg>
          </div>
          
          <div className={classNames({'emoji-mobile-hidden': windowWidth < 767.68 })}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.5 9.75C16.3284 9.75 17 9.07843 17 8.25C17 7.42157 16.3284 6.75 15.5 6.75C14.6716 6.75 14 7.42157 14 8.25C14 9.07843 14.6716 9.75 15.5 9.75Z" stroke="#696760" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 9.75C9.32843 9.75 10 9.07843 10 8.25C10 7.42157 9.32843 6.75 8.5 6.75C7.67157 6.75 7 7.42157 7 8.25C7 9.07843 7.67157 9.75 8.5 9.75Z" stroke="#696760" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.5 15C14.3333 16 11.3 17.4 8.5 15" stroke="#696760" strokeLinecap="round"/>
            </svg>
          </div>
      </div>
    </>
  )
}

export default index
