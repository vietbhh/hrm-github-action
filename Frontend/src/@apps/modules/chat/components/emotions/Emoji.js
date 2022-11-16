// ** React Imports

// ** Custom Components

// ** Third Party Components
import EmojiPicker, { Categories, EmojiStyle, Theme } from "emoji-picker-react"

// ** Reactstrap Imports

const Emoji = (props) => {
  const { setMsg, msg } = props
  return (
    <EmojiPicker
      onEmojiClick={(emojiData) => {
        setMsg(msg + emojiData.emoji)
      }}
      autoFocusSearch={false}
      theme={Theme.AUTO}
      emojiStyle={EmojiStyle.NATIVE}
      emojiVersion="5.0"
      searchDisabled={false}
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
  )
}

export default Emoji
