import { downloadApi } from "@apps/modules/download/common/api"
import { getAvatarUrl } from "@apps/utility/common"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"

import image_1 from "@modules/Feed/assets/images/background-feed/1.png"
import image_2 from "@modules/Feed/assets/images/background-feed/2.png"
import image_3 from "@modules/Feed/assets/images/background-feed/3.png"
import image_4 from "@modules/Feed/assets/images/background-feed/4.png"
import image_5 from "@modules/Feed/assets/images/background-feed/5.png"
import image_6 from "@modules/Feed/assets/images/background-feed/6.png"
import image_7 from "@modules/Feed/assets/images/background-feed/7.png"
import image_8 from "@modules/Feed/assets/images/background-feed/8.png"
import image_9 from "@modules/Feed/assets/images/background-feed/9.png"
import image_10 from "@modules/Feed/assets/images/background-feed/10.png"
import image_11 from "@modules/Feed/assets/images/background-feed/11.png"
import image_12 from "@modules/Feed/assets/images/background-feed/12.png"
import image_13 from "@modules/Feed/assets/images/background-feed/13.png"
import image_14 from "@modules/Feed/assets/images/background-feed/14.png"
import image_15 from "@modules/Feed/assets/images/background-feed/15.png"
import image_16 from "@modules/Feed/assets/images/background-feed/16.png"
import image_17 from "@modules/Feed/assets/images/background-feed/17.png"
import image_18 from "@modules/Feed/assets/images/background-feed/18.png"
import image_19 from "@modules/Feed/assets/images/background-feed/19.png"
import image_20 from "@modules/Feed/assets/images/background-feed/20.png"
import image_21 from "@modules/Feed/assets/images/background-feed/21.png"
import image_22 from "@modules/Feed/assets/images/background-feed/22.png"
import image_23 from "@modules/Feed/assets/images/background-feed/23.png"

import { EditorState, Modifier } from "draft-js"

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

      resolve(item)
    })

    promises.push(promise)
  })

  return Promise.all(promises)
}

export const handleLoadAttachmentThumb = async (data, cover = "") => {
  const out = {
    url_thumb: "",
    url_cover: "",
    medias: data.medias
  }

  if (
    data.source !== null &&
    (data.type === "image" ||
      data.type === "update_cover" ||
      data.type === "update_avatar")
  ) {
    await downloadApi.getPhoto(data.thumb).then((response) => {
      out["url_thumb"] = URL.createObjectURL(response.data)
    })
  }

  if (data.source !== null && data.type === "video") {
    await downloadApi.getPhoto(data.source).then((response) => {
      out["url_thumb"] = URL.createObjectURL(response.data)
    })
  }

  if (data.source !== null && data.type === "update_avatar" && cover !== "") {
    await downloadApi.getPhoto(cover).then((response) => {
      out["url_cover"] = URL.createObjectURL(response.data)
    })
  }

  if (!_.isEmpty(data.medias)) {
    await handleLoadAttachmentMedias(data).then((res_promise) => {
      out["medias"] = res_promise
    })
  }

  return out
}

export const loadUrlDataLink = async (_dataPost) => {
  const out = { cover_url: "", badge_url: "" }

  const dataPost = { ..._dataPost }
  if (dataPost.type === "announcement") {
    await downloadApi
      .getPhoto(dataPost.dataLink.cover_image)
      .then((response) => {
        out.cover_url = URL.createObjectURL(response.data)
      })
  }

  if (dataPost.type === "endorsement") {
    const promise = new Promise(async (resolve, reject) => {
      const _data = { cover_url: "", badge_url: "" }
      if (dataPost.dataLink.cover_type === "upload") {
        await downloadApi.getPhoto(dataPost.dataLink.cover).then((response) => {
          _data.cover_url = URL.createObjectURL(response.data)
        })
      }
      if (dataPost.dataLink.badge_type === "upload") {
        await downloadApi.getPhoto(dataPost.dataLink.badge).then((response) => {
          _data.badge_url = URL.createObjectURL(response.data)
        })
      }
      resolve(_data)
    })
    const data_url = await promise.then((res_promise) => {
      return res_promise
    })
    out.cover_url = data_url.cover_url
    out.badge_url = data_url.badge_url
  }

  return out
}

export const handleReaction = (userId, react_type, reaction) => {
  let react_action = "add"
  const index_react_type = reaction.findIndex(
    (item) => item.react_type === react_type
  )
  if (index_react_type !== -1) {
    const index_user = reaction[index_react_type]["react_user"].indexOf(userId)
    if (index_user !== -1) {
      react_action = "remove"
    }
  }

  return react_action
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
        link: "/u/" + value.username,
        avatar: getAvatarUrl(value.id * 1),
        full_name: value.full_name
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

export const arrImage = [
  { image: image_1, color: "#000" },
  { image: image_2, color: "#000" },
  { image: image_3, color: "#000" },
  { image: image_4, color: "#000" },
  { image: image_5, color: "#000" },
  { image: image_6, color: "#1a1a1a" },
  { image: image_7, color: "#fff" },
  { image: image_8, color: "#1a1a1a" },
  { image: image_9, color: "#000" },
  { image: image_10, color: "#fff" },
  { image: image_11, color: "#1a1a1a" },
  { image: image_12, color: "#fff" },
  { image: image_13, color: "#1a1a1a" },
  { image: image_14, color: "#fff" },
  { image: image_15, color: "#fff" },
  { image: image_16, color: "#fff" },
  { image: image_17, color: "#fff" },
  { image: image_18, color: "#1a1a1a" },
  { image: image_19, color: "#1a1a1a" },
  { image: image_20, color: "#fff" },
  { image: image_21, color: "#fff" },
  { image: image_22, color: "#fff" },
  { image: image_23, color: "#fff" }
]

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

// ** editor
export const insertCharacter = (characterToInsert, editorState) => {
  const currentContent = editorState.getCurrentContent(),
    currentSelection = editorState.getSelection()

  const newContent = Modifier.replaceText(
    currentContent,
    currentSelection,
    characterToInsert
  )

  const newEditorState = EditorState.push(
    editorState,
    newContent,
    "insert-characters"
  )

  return EditorState.forceSelection(
    newEditorState,
    newContent.getSelectionAfter()
  )
}

export const handleInsertEditorState = (
  characterToInsert,
  editorState,
  setEditorState
) => {
  const newEditorState = insertCharacter(characterToInsert, editorState)
  setEditorState(newEditorState)
}
// ** end editor

export const detectHashtag = (txt) => {
  const arr_hashtag = txt.match(/#\w+/g)
  const uniqueChars = [...new Set(arr_hashtag)]
  return uniqueChars
}

export const renderContentHashtag = (content, arrHashtag) => {
  const mapObj = {}
  let mapReg = ""
  if (!_.isEmpty(arrHashtag)) {
    _.forEach(arrHashtag, (item, index) => {
      mapObj[item] =
        '<a href="/hashtag/' +
        item.replace("#", "") +
        '" target="_blank">' +
        item +
        "</a>"
      if (index === 0) {
        mapReg = item
      } else {
        mapReg += "|" + item
      }
    })
  }
  if (!_.isEmpty(mapObj)) {
    const _content = content.replace(
      new RegExp(mapReg, "gi"),
      function (matched) {
        return mapObj[matched]
      }
    )
    return _content
  }
  return content
}
