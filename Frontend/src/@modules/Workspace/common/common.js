const getFileTypeFromMime = (mime) => {
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mime === "application/vnd.ms-excel"
  ) {
    return "excel"
  } else if (mime === "application/pdf") {
    return "pdf"
  } else if (
    mime === "application/msword" ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "word"
  } else if (mime === "video/mp4") {
    return "video"
  } else if (mime === "audio/mpeg") {
    return "sound"
  } else if (mime === "application/zip") {
    return "zip"
  } else if (
    mime === "image/gif" ||
    mime === "image/webp" ||
    mime === "image/jpeg" ||
    mime === "image/jpg" ||
    mime === "image/png"
  ) {
    return "image"
  }

  return ""
}

const formatByte = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const getTabIdFromFeedType = (type) => {
  if (type === "file") {
    return 1
  } else if (type === "image") {
    return 2
  } else if (type === "video") {
    return 3
  }

  return ""
}

export { getFileTypeFromMime, formatByte, getTabIdFromFeedType }
