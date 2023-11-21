import { convertImageToStickerList } from "../common"

const images = import.meta.globEager(
  "../../assets/images/littlefatshibainufull_batch/*.webp"
)

export default {
  name: "sticker_default",
  label: "little fat shiba inu",
  list: convertImageToStickerList(images),
  default: true
}
