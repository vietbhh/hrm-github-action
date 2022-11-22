import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { Smile } from "react-feather"
import EmojiComponent from "./Emoji"
import GifComponent from "./Gif"

const index = (props) => {
  const { setMsg, msg, sendMessage, selectedUser, focusInputMsg } = props
  const [showEmotion, setShowEmotion] = useState(false)
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
  return (
    <>
      <div
        className={`emotions-dropdown-menu ${showEmotion ? "show" : ""}`}
        ref={emotionRef}>
        <div className="emotions-dropdown-arrow"></div>
        <Tabs defaultActiveKey="1" tabPosition={"bottom"}>
          <Tabs.TabPane tab="Emoji" key="1">
            <EmojiComponent
              setMsg={setMsg}
              msg={msg}
              focusInputMsg={focusInputMsg}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Stickers" key="2">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="Gifs" key="3">
            <GifComponent
              sendMessage={sendMessage}
              selectedUser={selectedUser}
              focusInputMsg={focusInputMsg}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Smile
        ref={emotionIconRef}
        className="cursor-pointer text-secondary"
        size={20}
        onClick={() => {
          if (showEmotion === false) {
            setShowEmotion(true)
          }
          focusInputMsg()
        }}
      />
    </>
  )
}

export default index
