import ReactGiphySearchBox from "./react-giphy"

const Gif = (props) => {
  const {
    sendMessage,
    selectedUser,
    focusInputMsg,
    setReplyingDefault,
    setShowEmotion,
    ...rest
  } = props

  return (
    <ReactGiphySearchBox
      apiKey="rvUhAQyj80vEsaA4laeRiB6Fx5WDM4Bk"
      onSelect={(item) => {
        if (rest.setStatePostComment) {
          rest.setStatePostComment({
            image: item.images.fixed_width.url
          })
          setShowEmotion(false)
          return
        }

        sendMessage(selectedUser.chat.id, item.images.fixed_width.url, {
          type: "gif"
        })

        focusInputMsg()
        setReplyingDefault()
        setShowEmotion(false)
      }}
      masonryConfig={[
        { columns: 2, imageWidth: 110, gutter: 5 },
        { mq: "700px", columns: 3, imageWidth: 120, gutter: 5 }
      ]}
    />
  )
}

export default Gif
