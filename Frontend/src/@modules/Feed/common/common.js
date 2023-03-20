import { downloadApi } from "@apps/modules/download/common/api"
import { getAvatarUrl } from "@apps/utility/common"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"

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

  const mapObj = {
    "<p>": "",
    "</p>": "",
    "\n": ""
  }
  text = text.replace(/<p>|<\/p>|\n/gi, function (matched) {
    return mapObj[matched]
  })

  return text
}

export const renderShowMoreNumber = (fileLength) => {
  return <span className="more-attachment">+{fileLength - 5}</span>
}

export const renderIconVideo = () => {
  return <i className="fa-light fa-circle-play icon-play"></i>
}

export const handleLoadAttachmentMedias = (value) => {
  const promises = []
  _.forEach(value.medias, (item) => {
    const promise = new Promise(async (resolve, reject) => {
      await downloadApi.getPhoto(item.thumb).then((response) => {
        item["url_thumb"] = URL.createObjectURL(response.data)
      })
      /* if (item.type === "video") {
          await downloadApi.getPhoto(item.thumb).then((response) => {
            item["url_thumb"] = URL.createObjectURL(response.data)
          })
        } */

      resolve(item)
    })

    promises.push(promise)
  })

  return Promise.all(promises)
}

export const handleReaction = (userId, react_type, reaction) => {
  const index_react_type = reaction.findIndex(
    (item) => item.react_type === react_type
  )
  if (index_react_type !== -1) {
    const index_user = reaction[index_react_type]["react_user"].indexOf(userId)
    if (index_user !== -1) {
      reaction[index_react_type]["react_user"].splice(index_user, 1)
    } else {
      reaction[index_react_type]["react_user"].push(userId)
    }
  } else {
    reaction.push({
      react_type: react_type,
      react_user: [userId]
    })
  }

  // remove user from react_user
  _.forEach(reaction, (value) => {
    if (react_type !== value.react_type) {
      const index = value["react_user"].indexOf(userId)
      if (index !== -1) {
        value["react_user"].splice(index, 1)
      }
    }
  })

  return reaction
}

export const renderImageReact = (type) => {
  switch (type) {
    case "like":
      return img_like

    case "love":
      return img_love

    case "care":
      return img_care

    case "smile":
      return img_smile

    case "sad":
      return img_sad

    case "wow":
      return img_wow

    default:
      return useFormatMessage("modules.feed.post.text.other")
  }
}

export const detectUrl = (txt, onlyGetLink = false) => {
  if (onlyGetLink === false) {
    const text = txt
    const link = txt.replace(
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim,
      function (url) {
        const text_href = 'href="' + url
        if (text.includes(text_href)) {
          return url
        }
        return '<a href="' + url + '" target="_blank">' + url + "</a>"
      }
    )
    return link
  } else {
    const arr_link = []
    txt.replace(
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim,
      function (url) {
        arr_link.push(url)
      }
    )
    return arr_link
  }
}

export const handleDataMention = (dataEmployee, userId) => {
  const data_mention = []
  _.forEach(dataEmployee, (value) => {
    if (userId !== value.id) {
      data_mention.push({
        id: value.id,
        name: "@" + value.username,
        link: "#",
        avatar: getAvatarUrl(value.id * 1)
      })
    }
  })

  return data_mention
}

export const handleTagUserAndReplaceContent = (dataMention, content) => {
  const tag_user = []
  let _content = content
  _.forEach(dataMention, (value) => {
    _content = _content.replace(value.name, function (val) {
      tag_user.push(value.id)
      return (
        '<a href="' + value.link + '" target="_blank">' + value.name + "</a>"
      )
    })
  })

  return { content: _content, tag_user: tag_user }
}
