import ReactGiphySearchBox from "react-giphy-searchbox"

const Gif = (props) => {
  const { sendMessage, selectedUser } = props

  return (
    <ReactGiphySearchBox
      apiKey="rvUhAQyj80vEsaA4laeRiB6Fx5WDM4Bk"
      onSelect={(item) => {
        console.log(item)
        sendMessage(selectedUser.chat.id, item.images.fixed_width.url, {
          type: "gif"
        })
      }}
      masonryConfig={[
        { columns: 2, imageWidth: 110, gutter: 5 },
        { mq: "700px", columns: 3, imageWidth: 120, gutter: 5 }
      ]}
    />
  )
}

export default Gif
