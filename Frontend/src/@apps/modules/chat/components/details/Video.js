import { useEffect, useState } from "react"
import { Placeholder } from "rsuite"
import { downloadApi } from "@apps/modules/download/common/api"
const CACHE = {}

function hashArgs(...args) {
  return args.reduce((acc, arg) => stringify(arg) + ":" + acc, "")
}

function stringify(val) {
  return typeof val === "object" ? JSON.stringify(val) : String(val)
}

const Video = (props) => {
  const [video, setVideo] = useState(false)
  useEffect(() => {
    let imgUrl = ""
    const cacheID = hashArgs(props.src)
    if (CACHE[cacheID] !== undefined) {
      imgUrl = CACHE[cacheID]
      setVideo(URL.createObjectURL(imgUrl))
    } else {
      downloadApi.getPhoto(props.src).then((response) => {
        imgUrl = response.data
        CACHE[cacheID] = imgUrl
        setVideo(URL.createObjectURL(response.data))
      })
    }
    return () => {
      setVideo(false)
      URL.revokeObjectURL(imgUrl)
    }
  }, [props.src])
  if (!video) return <Placeholder.Paragraph active={true} graph="image" />
  else {
    const newProps = { ...props }
    delete newProps.src
    delete newProps.alt
    return (
      <video width="300" height="150" controls loop muted>
        <source src={video}></source>
      </video>
    )
  }
}

export default Video
