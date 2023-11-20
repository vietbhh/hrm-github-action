import { Sticker } from "./components/Sticker"
import sticker_4 from "../../../assets/stickers/sticker_4.png"

const index = () => {
  const _stickers = [
    {
      id: "479784002807229",
      frameCount: 16,
      frameRate: 125,
      framesPerCol: 4,
      framesPerRow: 4,
      spriteImg: sticker_4
    }
  ]
  return (
    <div>
      {_stickers.map((sticker, index) => (
        <Sticker
          key={`sticker__${index}`}
          frameCount={sticker.frameCount}
          frameRate={sticker.frameRate}
          framesPerCol={sticker.framesPerCol}
          framesPerRow={sticker.framesPerRow}
          spriteImg={sticker.spriteImg}
        />
      ))}
    </div>
  )
}

export default index
