import { useEffect, useState } from "react"
import { Placeholder } from "rsuite"
import { downloadApi } from "@apps/modules/download/common/api"
import { Spinner } from "reactstrap"
const CACHE = {}

function hashArgs(...args) {
  return args.reduce((acc, arg) => stringify(arg) + ":" + acc, "")
}

function stringify(val) {
  return typeof val === "object" ? JSON.stringify(val) : String(val)
}

const Audio = (props) => {
  const [audio, setAudio] = useState(false)
  useEffect(() => {
    let imgUrl = ""
    const cacheID = hashArgs(props.src)
    if (CACHE[cacheID] !== undefined) {
      imgUrl = CACHE[cacheID]
      setAudio(URL.createObjectURL(imgUrl))
    } else {
      downloadApi.getPhoto(props.src).then((response) => {
        imgUrl = response.data
        CACHE[cacheID] = imgUrl
        setAudio(URL.createObjectURL(response.data))
      })
    }
    return () => {
      setAudio(false)
      URL.revokeObjectURL(imgUrl)
    }
  }, [props.src])
  if (!audio)
    return (
      <>
        Audio loading... <Spinner size="sm" />
      </>
    )
  else {
    const newProps = { ...props }
    delete newProps.src
    delete newProps.alt
    return (
      <audio style={{ height: "35px", marginBottom: "-5px" }} controls>
        <source src={audio} />
      </audio>
    )
  }
}

export default Audio
