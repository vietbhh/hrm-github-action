export const getListEventRepeat = (listEvent, query) => {
  const createdAtFrom =
    query["created_at_from"] !== undefined
      ? new Date(query["created_at_from"])
      : new Date(dayjs.format("YYYY-MM-DD"))
  const createdAtTo =
    query["created_at_to"] !== undefined
      ? new Date(query["created_at_to"])
      : new Date(dayjs.format("YYYY-MM-DD"))
      
  return listEvent
}
