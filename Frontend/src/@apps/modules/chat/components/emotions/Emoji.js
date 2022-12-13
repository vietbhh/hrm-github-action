import EmojiPicker, { Categories, EmojiStyle, Theme } from "emoji-picker-react"

const Emoji = (props) => {
  const { setMsg, getValues, focusInputMsg } = props
  return (
    <EmojiPicker
      onEmojiClick={(emojiData) => {
        const msg = getValues("message")
        setMsg(msg + emojiData.emoji)
        focusInputMsg()
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
  )
}

export default Emoji
