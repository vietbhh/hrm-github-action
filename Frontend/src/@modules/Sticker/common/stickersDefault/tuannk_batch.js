import { convertImageToStickerList } from "../common"

const images = import.meta.globEager("../../assets/images/tuannk_batch/*.webp")

export default {
  name: "sticker_default",
  label: "tuannk_batch",
  list: convertImageToStickerList(images),
  default: true
}
