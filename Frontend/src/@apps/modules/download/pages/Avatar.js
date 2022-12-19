import AvatarComponent from "@components/avatar"
import { Skeleton, Tooltip } from "antd"
import noavt from "assets/images/erp/noavt.png"
import classnames from "classnames"
import { isEmpty } from "lodash"
import React, { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { downloadApi } from "../common/api"
const CACHE = {}

function hashArgs(...args) {
  return args.reduce((acc, arg) => stringify(arg) + ":" + acc, "")
}

function stringify(val) {
  return typeof val === "object" ? JSON.stringify(val) : String(val)
}

const Avatar = (props) => {
  const userId = props.userId ?? false

  const [image, setImage] = useState(false)

  const onlineList = useSelector((state) => state.users.online)
  const onlineStatus =
    userId !== false && !_.isUndefined(onlineList?.[userId])
      ? { status: "online" }
      : {}

  useEffect(() => {
    let imgUrl = ""
    if (userId !== false) {
      const cacheID = hashArgs(userId)
      if (CACHE[cacheID] !== undefined) {
        imgUrl = CACHE[cacheID]
        setImage(URL.createObjectURL(imgUrl))
      } else {
        downloadApi.getAvatarByUserId(userId).then((response) => {
          imgUrl = response.data
          CACHE[cacheID] = imgUrl
          setImage(URL.createObjectURL(imgUrl))
        })
      }
    } else {
      if (isEmpty(props.src)) {
        setImage(noavt)
      } else {
        const cacheID = hashArgs(props.src)
        if (CACHE[cacheID] !== undefined) {
          imgUrl = CACHE[cacheID]
          setImage(URL.createObjectURL(imgUrl))
        } else {
          downloadApi.getAvatar(props.src).then((response) => {
            imgUrl = response.data
            CACHE[cacheID] = imgUrl
            setImage(URL.createObjectURL(imgUrl))
          })
        }
      }
    }
    return () => {
      setImage(false)
      URL.revokeObjectURL(imgUrl)
    }
  }, [props.src, props.userId])

  if (!image)
    return (
      <div
        className={classnames(
          props.className,
          "rounded-circle avatar-component"
        )}>
        <Skeleton.Avatar active={true} size="default" shape="circle" />
      </div>
    )
  else {
    const { src, img, userId, ...res } = props
    const randomNum = Math.floor(Math.random() * (5000 - 1 + 1)) + 1
    return (
      <Fragment>
        <Tooltip title={props.title}>
          <AvatarComponent
            img={image}
            {...res}
            {...(props.title
              ? { id: props.title.split(" ").join("-") + randomNum }
              : {})}
            className={classnames(props.className, "rounded-circle")}
            {...onlineStatus}
          />
        </Tooltip>
      </Fragment>
    )
  }
}

export default Avatar
