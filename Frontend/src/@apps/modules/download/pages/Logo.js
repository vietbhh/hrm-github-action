import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import React, { useEffect, useState } from "react"
import { downloadApi } from "../common/api"

const CACHE = {}

function hashArgs(...args) {
  return args.reduce((acc, arg) => stringify(arg) + ":" + acc, "")
}

function stringify(val) {
  return typeof val === "object" ? JSON.stringify(val) : String(val)
}

const Logo = (props) => {
  const [image, setImage] = useState(false)
  const logoType = props.logoType ?? "normal"
  useEffect(() => {
    let imgUrl = ""
    const cacheID = hashArgs(props.src)
    if (CACHE[cacheID] !== undefined) {
      imgUrl = CACHE[cacheID]
      setImage(URL.createObjectURL(imgUrl))
    } else {
      downloadApi.getLogo(props.src, logoType).then((response) => {
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

  if (!image)
    return (
      <>{props.loading && props.loading === "true" && <DefaultSpinner />}</>
    )
  else {
    const newProps = { ...props }
    delete newProps.src
    delete newProps.alt
    delete newProps.logoType
    return <img src={image} alt={props.alt} {...newProps} />
  }
}

export default Logo
