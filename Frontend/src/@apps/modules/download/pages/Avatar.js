import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import AvatarComponent from "@components/avatar"
import noavt from "assets/images/erp/noavt.png"
import classnames from "classnames"
import { isEmpty } from "lodash"
import React, { Fragment, useEffect, useState } from "react"
import { UncontrolledTooltip } from "reactstrap"
import { downloadApi } from "../common/api"
import ContentLoader from "react-content-loader"
import { Skeleton } from "antd"
const CACHE = {}

function hashArgs(...args) {
  return args.reduce((acc, arg) => stringify(arg) + ":" + acc, "")
}

function stringify(val) {
  return typeof val === "object" ? JSON.stringify(val) : String(val)
}

const Avatar = (props) => {
  const [image, setImage] = useState(false)

  useEffect(() => {
    let imgUrl = ""
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
    return () => {
      setImage(false)
      URL.revokeObjectURL(imgUrl)
    }
  }, [props.src])
  /*  return (
    <div className="circle">
      <ContentLoader width="100%" height="100%" viewBox="0 0 500 500" preserveAspectRatio="xMinYMin meet">
      <circle cx="250" cy="250" r="200"  />
    </ContentLoader>
    </div>
  ); */
  //if (!image) return <DefaultSpinner />;

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
    const { src, img, ...res } = props
    const randomNum = Math.floor(Math.random() * (5000 - 1 + 1)) + 1
    return (
      <Fragment>
        {props.title ? (
          <UncontrolledTooltip
            target={props.title.split(" ").join("-") + randomNum}>
            {props.title}
          </UncontrolledTooltip>
        ) : null}
        <AvatarComponent
          img={image}
          {...res}
          {...(props.title
            ? { id: props.title.split(" ").join("-") + randomNum }
            : {})}
          className={classnames(props.className, "rounded-circle")}
        />
      </Fragment>
    )
  }
}

export default Avatar
