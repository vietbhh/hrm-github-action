import { useEffect, useState } from "react"
import { Placeholder } from "rsuite"
import { downloadApi } from "../common/api"

const CACHE = {}

function hashArgs(...args) {
  return args.reduce((acc, arg) => stringify(arg) + ":" + acc, "")
}

function stringify(val) {
  return typeof val === "object" ? JSON.stringify(val) : String(val)
}

const PhotoPublic = (props) => {
  const [image, setImage] = useState(false)

  useEffect(() => {
    let imgUrl = ""
    const cacheID = hashArgs(props.src)
    if (CACHE[cacheID] !== undefined) {
      imgUrl = CACHE[cacheID]
      setImage(URL.createObjectURL(imgUrl))
    } else {
      downloadApi.getPhotoPublic(props.src).then((response) => {
        imgUrl = response.data
        CACHE[cacheID] = imgUrl
        setImage(URL.createObjectURL(response.data))
      })
    }
    return () => {
      setImage(false)
      URL.revokeObjectURL(imgUrl)
    }
  }, [props.src])

  if (!image) return <Placeholder.Paragraph active={true} graph="image" />
  else {
    const newProps = { ...props }
    delete newProps.src
    delete newProps.alt
    return <img src={image} alt={props.alt} {...newProps} />
  }
}

export default PhotoPublic
