import { useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import {
  renderIconVideo,
  renderShowMoreNumber
} from "@modules/Feed/common/common"
import { Skeleton } from "antd"
import classNames from "classnames"
import React, { Fragment, useEffect, useRef } from "react"
import PostImageDetailModal from "./modals/PostImageDetailModal"

const LoadPostMedia = (props) => {
  const {
    data,
    current_url,
    idMedia,
    setIdMedia,
    dataMention,
    idPost,
    setData,
    reloadPostThenCloseModal
  } = props
  const [state, setState] = useMergedState({
    modalPostImageDetail: false,
    dataModal: {},
    idImage: "",
    postType: "",
    dataMedias: []
  })

  const isMounted = useRef(false)

  // ** function
  const toggleModalPostImageDetail = () => {
    setState({ modalPostImageDetail: !state.modalPostImageDetail })
  }

  // ** useEffect
  useEffect(() => {
    if (state.modalPostImageDetail) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      //setState({ dataModal: {}, idImage: "", postType: "" })
    }
  }, [state.modalPostImageDetail])

  useEffect(() => {
    if (idMedia !== undefined && idMedia !== "") {
      setState({
        idImage: idMedia,
        modalPostImageDetail: true,
        dataModal: data,
        postType: data.type,
        dataMedias: data.medias
      })

      if (_.isFunction(setIdMedia)) {
        setIdMedia("")
      }
    }
  }, [idMedia, data])

  useEffect(() => {
    if (!state.modalPostImageDetail && reloadPostThenCloseModal) {
      if (isMounted.current) {
        feedApi
          .getGetFeed(idPost)
          .then((res) => {
            setData(res.data)
          })
          .catch((err) => {})
      } else {
        isMounted.current = true
      }
    }
  }, [state.modalPostImageDetail])

  // ** render
  const renderMedia = () => {
    if (data.type === "image") {
      return (
        <div
          onClick={() => {
            toggleModalPostImageDetail()
            window.history.replaceState(
              null,
              "",
              `/posts/${data._id}/${data._id}`
            )
            setState({
              dataModal: data,
              idImage: data._id,
              postType: data.type
            })
          }}
          className="div-attachment-item item-image item-count-1"
          style={{
            backgroundImage: `url("${data.url_thumb}")`
          }}>
          {!data.url_thumb && <Skeleton.Image active={true} />}
        </div>
      )
    }

    if (data.type === "video") {
      return (
        <div className="div-attachment-item item-video item-count-1">
          {data.url_thumb && (
            <video width="100%" height="400" controls muted>
              <source src={data.url_thumb}></source>
            </video>
          )}

          {!data.url_thumb && <Skeleton.Image active={true} />}
        </div>
      )
    }

    if (!_.isEmpty(data.medias)) {
      return _.map(data.medias, (item, key) => {
        return (
          <div
            key={key}
            onClick={() => {
              toggleModalPostImageDetail()
              window.history.replaceState(
                null,
                "",
                `/posts/${data._id}/${item._id}`
              )
              setState({
                dataModal: data,
                idImage: item._id,
                postType: data.type,
                dataMedias: data.medias
              })
            }}
            className={classNames(`div-attachment-item item-${key + 1}`, {
              "item-count-1": data.medias.length === 1,
              "item-count-2": data.medias.length === 2,
              "item-count-3": data.medias.length === 3,
              "item-count-4": data.medias.length === 4,
              "item-count-5": data.medias.length >= 5
            })}
            style={{
              backgroundImage: `url("${item.url_thumb}")`
            }}>
            {!item.url_thumb && <Skeleton.Image active={true} />}

            {item.url_thumb &&
              data.medias.length > 5 &&
              key === 4 &&
              renderShowMoreNumber(data.medias.length)}
            {item.url_thumb &&
              item.type === "video" &&
              ((data.medias.length > 5 && key < 4) ||
                data.medias.length <= 5) &&
              renderIconVideo()}
          </div>
        )
      })
    }

    return ""
  }

  return (
    <Fragment>
      {((data.source !== null &&
        (data.type === "image" || data.type === "video")) ||
        (!_.isEmpty(data.medias) && data.type === "post")) && (
        <div className="post-body-media">{renderMedia()}</div>
      )}

      <PostImageDetailModal
        modal={state.modalPostImageDetail}
        toggleModal={toggleModalPostImageDetail}
        dataModal={state.dataModal}
        idImage={state.idImage}
        setIdImage={(value) => setState({ idImage: value })}
        postType={state.postType}
        dataMedias={state.dataMedias}
        current_url={current_url}
        dataMention={dataMention}
      />
    </Fragment>
  )
}

export default LoadPostMedia
