import { convertImageToStickerList } from "../common"

const images = import.meta.globEager(
  "../../assets/images/pepe_frog_batch/*.webp"
)

export default {
  name: "sticker_default",
  label: "pepe frog",
  list: convertImageToStickerList(images),
  default: true
}
