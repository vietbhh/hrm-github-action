import { convertImageToStickerList } from "../common"

const images = import.meta.globEager(
  "../../assets/images/KanaheiFacebook_batch/*.webp"
)

export default {
  name: "sticker_default",
  label: "kanahei",
  list: convertImageToStickerList(images),
  default: true
}
