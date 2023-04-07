export const getTabId = (tabText) => {
  if (tabText === "timeline" || tabText === undefined) {
    return 1
  } else if (tabText === "introduction") {
    return 2
  } else if (tabText === "workspace") {
    return 3
  } else if (tabText === "photo") {
    return 4
  }

  return ""
}
