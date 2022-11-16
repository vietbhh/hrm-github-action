import EmojiComponent from "./Emoji"
import GifComponent from "./Gif"
import { Tabs } from "antd"

const index = (props) => {
  const { setMsg, msg, sendMessage, selectedUser } = props
  return (
    <Tabs defaultActiveKey="1" tabPosition={"bottom"}>
      <Tabs.TabPane tab="Emoji" key="1">
        <EmojiComponent setMsg={setMsg} msg={msg} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Stickers" key="2">
        Content of Tab Pane 2
      </Tabs.TabPane>
      <Tabs.TabPane tab="Gifs" key="3">
        <GifComponent sendMessage={sendMessage} selectedUser={selectedUser} />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default index
