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
      <Smile
        ref={emotionIconRef}
        className="cursor-pointer text-secondary"
        size={22}
        onClick={() => {
          if (showEmotion === false) {
            setShowEmotion(true)
          }
          //focusInputMsg()
        }}
      />
    </>
  )
}

export default index
