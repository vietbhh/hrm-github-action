import { convertImageToStickerList } from "../common"

const images = import.meta.globEager(
  "../../assets/images/Cat_00_by_demybot_batch/*.webp"
)

export default {
  name: "sticker_default",
  label: "cute cat",
  list: convertImageToStickerList(images),
  default: true
}
