import { convertImageToStickerList } from "../common"

const images = import.meta.globEager(
  "../../assets/images/PeterCxy_batch/*.webp"
)

export default {
  name: "sticker_default",
  label: "peter cry",
  list: convertImageToStickerList(images),
  default: true
}
