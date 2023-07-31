export const renderIconAttachment = (item) => {
  const type = item.type

  if (type === "image") {
    let img = ""
    if (item.new) {
      img = URL.createObjectURL(item.file)
    } else {
      img = item.url
    }
    if (img) {
      return <img src={img} />
    }
  }
  if (type === "video") {
    return <i className="fa-solid fa-file-video"></i>
  }
  if (type === "excel") {
    return <i className="fa-solid fa-file-excel"></i>
  }
  if (type === "word") {
    return <i className="fa-solid fa-file-word"></i>
  }
  return <i className="fa-solid fa-file"></i>
}
