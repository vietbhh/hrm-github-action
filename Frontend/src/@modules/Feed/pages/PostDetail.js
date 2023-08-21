import { EmptyContent } from "@apps/components/common/EmptyContent"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import LoadPost from "@src/components/hrm/LoadPost/LoadPost"
import { Skeleton } from "antd"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import {
  handleDataMention,
  handleLoadAttachmentThumb,
  loadUrlDataLink
} from "../common/common"

const PostDetail = (props) => {
  const {
    customAction = {} // custom dropdown post header
  } = props
  const [state, setState] = useMergedState({
    dataPost: {},
    dataMedia: [],
    loadingPost: true,
    _idMedia: "",
    dataMention: [],

    // ** event
    options_employee_department: [],
    optionsMeetingRoom: []
  })
  const { idPost, idMedia } = useParams()
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const cover = userData?.cover || ""
  const dataEmployee = useSelector((state) => state.users.list)
  const current_url = `/posts/${idPost}`

  const screenWidth = screen.width
  const marginLeft = screenWidth <= 1920 ? "340px" : "330px"
  const minWidth = screenWidth <= 1920 ? "1020px" : "1150px"

  // ** useEffect
  useEffect(() => {
    setState({ loadingPost: true })
    feedApi
      .getGetFeed(idPost)
      .then(async (res) => {
        if (!_.isEmpty(res.data)) {
          const data = res.data
          if (idPost === idMedia) {
            setState({ _idMedia: idMedia })
          } else {
            setState({ _idMedia: "" })
            window.history.replaceState(null, "", current_url)
          }

          const data_attachment = await handleLoadAttachmentThumb(data, cover)
          data["url_thumb"] = data_attachment["url_thumb"]
          data["url_cover"] = data_attachment["url_cover"]
          data["medias"] = data_attachment["medias"]

          if (!_.isEmpty(data.medias)) {
            const check_index_media = data.medias.findIndex(
              (item) => item._id === idMedia
            )
            if (check_index_media !== -1) {
              setState({ _idMedia: idMedia })
            } else {
              setState({ _idMedia: "" })
              window.history.replaceState(null, "", current_url)
            }
          }

          // check seen
          if (data.seen.indexOf(userId) === -1) {
            await feedApi
              .getUpdateSeenPost(data._id)
              .then((res) => {
                data.seen.push(userId.toString())
              })
              .catch((err) => {})
          }

          // check data link
          const dataUrl = await loadUrlDataLink(data)
          data["dataLink"].cover_url = dataUrl.cover_url
          data["dataLink"].badge_url = dataUrl.badge_url

          setState({ loadingPost: false, dataPost: data })
        } else {
          setState({ loadingPost: false, dataPost: {} })
        }
      })
      .catch((err) => {
        setState({ loadingPost: false })
      })
  }, [idPost, idMedia])

  useEffect(() => {
    const data_mention = handleDataMention(dataEmployee, userId)
    setState({ dataMention: data_mention })
  }, [dataEmployee])

  useEffect(() => {
    //
    const data_options = []
    _.forEach(dataEmployee, (item) => {
      data_options.push({
        value: `${item.id}_employee`,
        label: item.full_name,
        avatar: item.avatar
      })
    })
    feedApi
      .getGetInitialEvent()
      .then((res) => {
        _.forEach(res.data.dataDepartment, (item) => {
          data_options.push({
            value: `${item.id}_department`,
            label: item.name,
            avatar: ""
          })
        })

        setState({
          options_employee_department: data_options,
          optionsMeetingRoom: res.data.dataMeetingRoom
        })
      })
      .catch((err) => {
        setState({
          options_employee_department: data_options,
          optionsMeetingRoom: []
        })
      })

   /*  // hide menu
    if (document.getElementsByClassName(`main-menu menu-fixed`)[0]) {
      document.getElementsByClassName(`main-menu menu-fixed`)[0].style.display =
        "none"
    }
    if (document.getElementsByClassName(`app-content content`)[0]) {
      document.getElementsByClassName(`app-content content`)[0].style.cssText =
        "margin-left: 0px !important"
      document.getElementsByClassName(
        `app-content content`
      )[0].style.minWidth = `calc(${minWidth} + ${marginLeft})`
    }

    return () => {
      // show menu
      if (document.getElementsByClassName(`main-menu menu-fixed`)[0]) {
        document.getElementsByClassName(
          `main-menu menu-fixed`
        )[0].style.display = "unset"
      }
      if (document.getElementsByClassName(`app-content content`)[0]) {
        document.getElementsByClassName(
          `app-content content`
        )[0].style.marginLeft = marginLeft
        document.getElementsByClassName(
          `app-content content`
        )[0].style.minWidth = minWidth
      }
    } */
  }, [])

  return (
    <div className="div-content div-posts">
      <div className="div-left feed">
        <div className="load-feed">
          {state.loadingPost && (
            <div className="div-loading">
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          )}

          {!state.loadingPost && _.isEmpty(state.dataPost) && (
            <div className="load-post">
              <EmptyContent
                title={useFormatMessage(
                  "modules.feed.post.text.post_not_found"
                )}
              />
            </div>
          )}

          {!state.loadingPost && !_.isEmpty(state.dataPost) && (
            <LoadPost
              data={state.dataPost}
              dataLink={state.dataPost.dataLink}
              current_url={current_url}
              idMedia={state._idMedia}
              setIdMedia={(value) => setState({ _idMedia: value })}
              dataMention={state.dataMention}
              setData={(data, empty = false, dataCustom = {}) => {
                if (empty) {
                  setState({ dataPost: {} })
                } else {
                  setState({
                    dataPost: {
                      ...data,
                      url_thumb: state.dataPost.url_thumb,
                      url_source: state.dataPost.url_source,
                      medias: state.dataPost.medias,
                      dataLink: {
                        ...state.dataPost.dataLink,
                        cover_url: state.dataPost["dataLink"].cover_url,
                        badge_url: state.dataPost["dataLink"].badge_url
                      },
                      ...dataCustom
                    }
                  })
                }
              }}
              setDataLink={(data) => {
                const _data = { ...state.dataPost }
                _data["dataLink"] = data
                setState({ dataPost: _data })
              }}
              customAction={customAction}
              options_employee_department={state.options_employee_department}
              optionsMeetingRoom={state.optionsMeetingRoom}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail
