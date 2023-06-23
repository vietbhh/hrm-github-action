const handleCountFile = (groups, groupId, type, action = "plus") => {
  const index_groups = groups.findIndex((item) => item.id === groupId)
  let file_count = {}
  if (index_groups !== -1) {
    const group_file_count = groups[index_groups]?.file_count || {}
    if (type === "link") {
      const count_link = group_file_count?.link
        ? action === "plus"
          ? group_file_count?.link + 1
          : group_file_count?.link - 1
        : 1
      file_count = { ...group_file_count, link: count_link }
    } else if (type === "image" || type === "image_gif") {
      const count_image = group_file_count?.image
        ? action === "plus"
          ? group_file_count?.image + 1
          : group_file_count?.image - 1
        : 1
      file_count = { ...group_file_count, image: count_image }
    } else if (type === "file" || type === "audio" || type === "video") {
      const count_file = group_file_count?.file
        ? action === "plus"
          ? group_file_count?.file + 1
          : group_file_count?.file - 1
        : 1
      file_count = { ...group_file_count, file: count_file }
    }
  }

  return file_count
}

export { handleCountFile }
