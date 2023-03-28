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

export { getFileTypeFromMime }
