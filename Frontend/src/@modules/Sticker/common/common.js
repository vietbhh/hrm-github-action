export const generateRandomString = () => {
  return Math.floor(Math.random() * Date.now()).toString(36)
}

export const convertImageToStickerList = (images) => {
  const list = []
  let index = 0

  for (const key in images) {
    list.push({
      url: images[key].default,
      default: index !== 0 ? false : true
    })
    index++
  }

  return list
}
