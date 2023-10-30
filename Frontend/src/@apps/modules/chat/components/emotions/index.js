import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { Smile } from "react-feather"
import EmojiComponent from "./Emoji"
import GifComponent from "./Gif"
import Sticker from "./Sticker"

const index = (props) => {
  const {
    sendMessage,
    selectedUser,
    focusInputMsg,
    setReplyingDefault,
    handleInsertEditorState,
    showEmotion,
    setShowEmotion
  } = props

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
      children: <Sticker />
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
        />
      )
    }
  ]

  return (
    <>
      <div
        className={`emotions-dropdown-menu ${showEmotion ? "show" : ""}`}
        ref={emotionRef}>
        <div className="emotions-dropdown-arrow"></div>
        <Tabs defaultActiveKey="1" tabPosition={"bottom"} items={items} />
      </div>
      <div
        ref={emotionIconRef}
        className="cursor-pointer text-secondary"
        onClick={() => {
          if (showEmotion === false) {
            setShowEmotion(true)
          }
          //focusInputMsg()
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M7.5 18.8332H12.5C16.6667 18.8332 18.3333 17.1665 18.3333 12.9998V7.99984C18.3333 3.83317 16.6667 2.1665 12.5 2.1665H7.5C3.33333 2.1665 1.66667 3.83317 1.66667 7.99984V12.9998C1.66667 17.1665 3.33333 18.8332 7.5 18.8332Z"
            stroke="#696760"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.9167 8.625C13.607 8.625 14.1667 8.06536 14.1667 7.375C14.1667 6.68464 13.607 6.125 12.9167 6.125C12.2263 6.125 11.6667 6.68464 11.6667 7.375C11.6667 8.06536 12.2263 8.625 12.9167 8.625Z"
            stroke="#696760"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.08333 8.625C7.77369 8.625 8.33333 8.06536 8.33333 7.375C8.33333 6.68464 7.77369 6.125 7.08333 6.125C6.39298 6.125 5.83333 6.68464 5.83333 7.375C5.83333 8.06536 6.39298 8.625 7.08333 8.625Z"
            stroke="#696760"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.9167 13C11.9444 13.8333 9.41667 15 7.08333 13"
            stroke="#696760"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  )
}

export default index
