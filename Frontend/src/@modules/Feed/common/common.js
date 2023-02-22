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
