import { useFormatMessage } from "@apps/utility/common"

export const checkHTMLTag = (str) => {
  const test =
    /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(
      str
    )
  return test
}

export const handleFormatMessageStr = (str) => {
  const regex = /{{(.*?)}}/g
  const listFormatMessage = str.match(regex)
  let newStr = str
  if (listFormatMessage !== null) {
    listFormatMessage.map((text) => {
      const formatText = text.replace(/[{}]/g, "")
      newStr = str.replace(text, useFormatMessage(formatText))
    })
  }

  return newStr
}

export const handleFormatUrl = (str, strReplace) => {
  const regex = /{(.*?)}/g
  const listFormat = str.match(regex)
  let newStr = str
  if (listFormat !== null) {
    listFormat.map((text) => {
      const formatText = text.replace(/[{}]/g, "")
      newStr = str.replace(text, strReplace)
    })
  }

  return newStr
}

export const stripHTML = (str) => {
  return str.replace(/(<([^>]+)>)/gi, "")
}
