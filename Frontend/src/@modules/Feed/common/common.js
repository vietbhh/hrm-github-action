import { downloadApi } from "@apps/modules/download/common/api"

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
