import { isFileList } from "@apps/utility/handleData"
import noimg from "@src/assets/images/erp/img-not-found.png"
import { Image, Skeleton } from "antd"
import { useEffect, useState } from "react"
import { downloadApi } from "../common/api"
const CACHE = {}

function hashArgs(...args) {
  return args.reduce((acc, arg) => stringify(arg) + ":" + acc, "")
}

function stringify(val) {
  return typeof val === "object" ? JSON.stringify(val) : String(val)
}

const Photo = (props) => {
  const {
    placeholder,
    alt,
    src,
    width,
    height,
    className,
    defaultPhoto,
    ...rest
  } = props
  let defaultImg = _.isUndefined(src) ? defaultPhoto : false
  defaultImg = _.isUndefined(defaultPhoto) ? noimg : false
  const [image, setImage] = useState(defaultImg)

  useEffect(() => {
    if (isFileList(src)) {
      setImage(URL.createObjectURL(src[0]))
    } else {
      let imgUrl = ""
      const cacheID = hashArgs(src)

      if (!_.isUndefined(src)) {
        if (CACHE[cacheID] !== undefined) {
          imgUrl = CACHE[cacheID]
          setImage(URL.createObjectURL(imgUrl))
        } else {
          downloadApi.getPhoto(src).then((response) => {
            imgUrl = response.data
            CACHE[cacheID] = imgUrl
            setImage(URL.createObjectURL(response.data))
          })
        }
      } else {
        setImage(noimg)
      }

      return () => {
        setImage(false)
        URL.revokeObjectURL(imgUrl)
      }
    }
  }, [src])

  if (!image) {
    return (
      <Skeleton.Avatar
        shape="square"
        size="default"
        active={true}
        style={{ width: width, height: height }}
        {...placeholder}
      />
    )
  } else {
    return (
      <Image
        src={image}
        alt={alt}
        preview={{
          mask: false
        }}
        placeholder={true}
        width={width}
        height={height}
        className={className}
        fallback={noimg}
        style={{
          cursor: "pointer"
        }}
        {...rest}
      />
    )
  }
}

export default Photo
