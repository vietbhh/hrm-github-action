import { useMergedState } from "@apps/utility/common"
import { isFileList } from "@apps/utility/handleData"
import noimg from "@src/assets/images/erp/img-not-found.png"
import { Image } from "antd"
import { useEffect } from "react"
import CircleSpinner from "../../../components/spinner/CircleSpinner"
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
  const defaultImg = _.isUndefined(defaultPhoto) ? noimg : defaultPhoto
  const [state, setState] = useMergedState({
    image: defaultImg,
    fallback: true
  })
  useEffect(() => {
    let imgUrl = ""
    if (isFileList(src)) {
      setState({ image: URL.createObjectURL(src[0]) })
    } else {
      if (!_.isUndefined(src) && src !== "") {
        const cacheID = hashArgs(src)

        if (CACHE[cacheID] !== undefined) {
          imgUrl = URL.createObjectURL(CACHE[cacheID])
          setState({
            image: imgUrl,
            fallback: false
          })
        } else {
          setState({
            fallback: true
          })
          downloadApi.getPhoto(src).then((response) => {
            CACHE[cacheID] = response.data
            imgUrl = URL.createObjectURL(CACHE[cacheID])
            setState({
              image: imgUrl
            })
          })
        }
      } else {
        setState({
          image: defaultImg
        })
      }
    }

    return () => {
      setState({
        image: false
      })
      URL.revokeObjectURL(imgUrl)
    }
  }, [src])

  if (!state.image) {
    return <CircleSpinner center={true} />
  } else {
    return (
      <Image
        src={state.image}
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
        {...(state.fallback
          ? {
              fallback: noimg
            }
          : {})}
        {...rest}
      />
    )
  }
}

export default Photo
