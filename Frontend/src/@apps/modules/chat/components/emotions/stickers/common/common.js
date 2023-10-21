import axios from "axios"

export const handleResize = async (imageUrl, maxWidth) => {
  try {
    let result
    const response = await axios.get(imageUrl, {
      responseType: "blob"
    })

    const blob = response.data
    const img = new Image()
    img.src = URL.createObjectURL(blob)

    return new Promise((resolve, reject) => {
      img.onload = () => {
        const aspectRatio = img.width / img.height
        const newWidth = maxWidth
        const newHeight = maxWidth / aspectRatio

        const canvas = document.createElement("canvas")
        canvas.width = newWidth
        canvas.height = newHeight
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, newWidth, newHeight)

        canvas.toBlob((resizedBlob) => {
          result = URL.createObjectURL(resizedBlob)
          resolve(result)
        })

        img.onerror = (error) => {
          reject(new Error("Error loading the image: " + error))
        }
      }
    })
  } catch (error) {
    throw new Error("Error resizing image: " + error)
  }
}
