import { formatDateToMonthShort } from "@utils"
import moment from "moment"
import Avatar from "@apps/modules/download/pages/Avatar"

export const imageGroup =
  import.meta.env.VITE_APP_URL + "/assets/images/default_chat_group.webp"

export const formatTime = (time, date_time = false) => {
  const today = moment().format("YYYY-MM-DD")
  const day = moment(time).format("YYYY-MM-DD")
  if (today === day) {
    return moment(time).format("HH:mm")
  } else {
    if (date_time === true) {
      return moment(time).format("HH:mm, DD/MM/YYYY")
    } else {
      return formatDateToMonthShort(time)
    }
  }
}

export const replaceHtmlMessage = (txt) => {
  return txt.replace(/<[^>]*>/g, "")
}

export const replaceTextMessage = (txt) => {
  const mapObj = {
    "<br>": " "
  }
  txt = txt.replace(/<br>/gi, function (matched) {
    return mapObj[matched]
  })

  return txt
}

export const replaceMessageBreakLine = (txt) => {
  const mapObj = {
    "<br>": "\n"
  }
  txt = txt.replace(/<br>/gi, function (matched) {
    return mapObj[matched]
  })

  return txt
}

export const triGram = (txt) => {
  txt = txt.slice(0, 500)
  txt = replaceTextMessage(txt)
  const map = {}
  const s1 = (txt || "").toLowerCase()
  const n = 3
  for (let k = 0; k <= s1.length - n; k++) map[s1.substring(k, k + n)] = true

  return map
}

export const highlightText = (text, textSearch) => {
  const index = text.indexOf(textSearch)
  if (index === -1) {
    return text
  }

  return (
    text.substring(0, index) +
    "<span class='highlight-text'>" +
    text.substring(index, index + textSearch.length) +
    "</span>" +
    text.substring(index + textSearch.length)
  )
}

export const decodeHTMLEntities = (text) => {
  const entities = [
    ["amp", "&"],
    ["apos", "'"],
    ["#x27", "'"],
    ["#x2F", "/"],
    ["#39", "'"],
    ["#47", "/"],
    ["lt", "<"],
    ["gt", ">"],
    ["nbsp", " "],
    ["quot", '"']
  ]

  for (let i = 0, max = entities.length; i < max; ++i)
    text = text.replace(
      new RegExp("&" + entities[i][0] + ";", "g"),
      entities[i][1]
    )

  return text
}

export const detectUrl = (txt, onlyGetLink = false) => {
  if (onlyGetLink === false) {
    const link = txt.replace(
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim,
      function (url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>"
      }
    )
    return link
  } else {
    const arr_link = []
    txt.replace(
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim,
      function (url) {
        arr_link.push({ file: url, type: "link" })
      }
    )
    return arr_link
  }
}

export const renderAvatar = (item, className, width = "50", height = "50") => {
  if (item.type && item.type === "group") {
    if (item.avatar) {
      return (
        <Avatar
          src={`/modules/chat/${item.id}/avatar/${item.avatar}`}
          imgHeight={height}
          imgWidth={width}
          className={className}
        />
      )
    } else {
      return (
        <div className={`avatar rounded-circle ${className}`}>
          <img
            className=""
            src={imageGroup}
            alt="avatarImg"
            height={height}
            width={width}
          />
        </div>
      )
    }
  }

  return (
    <Avatar
      src={item?.avatar}
      imgHeight={height}
      imgWidth={width}
      userId={item?.idEmployee}
      className={className}
    />
  )
}
