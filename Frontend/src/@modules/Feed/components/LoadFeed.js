import { downloadApi } from "@apps/modules/download/common/api"
import { useMergedState } from "@apps/utility/common"
import LoadPost from "@src/components/hrm/LoadPost/LoadPost"
import { Skeleton } from "antd"
import React, { useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { LazyLoadComponent } from "react-lazy-load-image-component"
import { useSelector } from "react-redux"
import { feedApi } from "../common/api"
import { handleDataMention, handleLoadAttachmentMedias } from "../common/common"

const LoadFeed = (props) => {
  const {
    dataCreateNew, // data sau khi tạo mới post
    setDataCreateNew, // set data new
    workspace, // arr workspace: []
    apiLoadFeed, // api load feed
    customAction = {} // custom dropdown post header
  } = props
  const [state, setState] = useMergedState({
    dataPost: [],
    hasMore: false,
    hasMoreLazy: false,
    page: 0,
    pageLength: 7,
    totalPost: 0,
    loadingPost: false,
    loadingPostCreateNew: false,
    idPostCreateNew: "",
    dataCreateNewTemp: [],
    dataMention: []
  })

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const cover = userData?.cover || ""
  const dataEmployee = useSelector((state) => state.users.list)
  const current_url = window.location.pathname

  // ** function
  const loadData = () => {
    setState({ loadingPost: true, hasMore: false, hasMoreLazy: false })
    const params = {
      page: state.page,
      pageLength: state.pageLength,
      workspace: workspace,
      idPostCreateNew: state.idPostCreateNew // select where id <= idPostCreateNew
    }
    const api = apiLoadFeed ? apiLoadFeed(params) : feedApi.getLoadFeed(params)
    api
      .then((res) => {
        setState({
          dataPost: [...state.dataPost, ...res.data.dataPost],
          totalPost: res.data.totalPost,
          page: res.data.page,
          hasMore: res.data.hasMore
        })

        setTimeout(() => {
          setState({ loadingPost: false })
        }, 1000)
      })
      .catch((err) => {
        setState({ loadingPost: false, hasMore: true })
      })
  }

  const handleAfterLoadLazyLoadComponent = (value, index) => {
    setState({ loadingPost: false })
    if (state.hasMore) {
      setState({ hasMoreLazy: true })
    }

    // load media
    if (
      value.source !== null &&
      (value.type === "image" ||
        value.type === "video" ||
        value.type === "update_cover" ||
        value.type === "update_avatar")
    ) {
      if (value.type === "image" || value.type === "update_cover") {
        downloadApi.getPhoto(value.thumb).then((response) => {
          value["url_thumb"] = URL.createObjectURL(response.data)
          const dataPost = [...state.dataPost]
          dataPost[index] = value
          setState({ dataPost: dataPost })
        })
      }
      if (value.type === "video") {
        downloadApi.getPhoto(value.source).then((response) => {
          value["url_thumb"] = URL.createObjectURL(response.data)
          const dataPost = [...state.dataPost]
          dataPost[index] = value
          setState({ dataPost: dataPost })
        })
      }
      if (value.type === "update_avatar") {
        downloadApi.getPhoto(value.thumb).then((response) => {
          value["url_thumb"] = URL.createObjectURL(response.data)
        })
        value["url_cover"] = ""
        if (cover !== "") {
          downloadApi.getPhoto(cover).then((response) => {
            value["url_cover"] = URL.createObjectURL(response.data)
          })
        }
      }
    }

    if (!_.isEmpty(value.medias) && value.type === "post") {
      handleLoadAttachmentMedias(value).then((res_promise) => {
        const dataPost = [...state.dataPost]
        dataPost[index]["medias"] = res_promise
        setState({ dataPost: dataPost })
      })
    }
  }

  // load data create new
  const loadDataCreateNew = async () => {
    // ** user data post
    setState({ loadingPostCreateNew: true })

    if (
      dataCreateNew.source !== null &&
      (dataCreateNew.type === "image" ||
        dataCreateNew.type === "video" ||
        dataCreateNew.type === "update_cover" ||
        dataCreateNew.type === "update_avatar")
    ) {
      if (
        dataCreateNew.type === "image" ||
        dataCreateNew.type === "update_cover"
      ) {
        await downloadApi.getPhoto(dataCreateNew.thumb).then((response) => {
          dataCreateNew["url_thumb"] = URL.createObjectURL(response.data)
        })
      }

      if (dataCreateNew.type === "video") {
        await downloadApi.getPhoto(dataCreateNew.source).then((response) => {
          dataCreateNew["url_thumb"] = URL.createObjectURL(response.data)
        })
      }

      if (dataCreateNew.type === "update_avatar") {
        await downloadApi.getPhoto(dataCreateNew.thumb).then((response) => {
          dataCreateNew["url_thumb"] = URL.createObjectURL(response.data)
        })
        dataCreateNew["url_cover"] = ""
        if (cover !== "") {
          await downloadApi.getPhoto(cover).then((response) => {
            dataCreateNew["url_cover"] = URL.createObjectURL(response.data)
          })
        }
      }
    }

    if (!_.isEmpty(dataCreateNew.medias) && dataCreateNew.type === "post") {
      await handleLoadAttachmentMedias(dataCreateNew).then((res_promise) => {
        dataCreateNew["medias"] = res_promise
      })
    }

    setState({
      dataCreateNewTemp: [...[dataCreateNew], ...state.dataCreateNewTemp],
      loadingPostCreateNew: false
    })

    setDataCreateNew({})
  }

  // ** useEffect
  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!_.isEmpty(dataCreateNew)) {
      loadDataCreateNew()
    }
  }, [dataCreateNew])
  useEffect(() => {
    if (!_.isEmpty(dataCreateNew) && state.idPostCreateNew === "") {
      setState({ idPostCreateNew: dataCreateNew._id })
    }
  }, [dataCreateNew, state.idPostCreateNew])

  useEffect(() => {
    const data_mention = handleDataMention(dataEmployee, userId)
    setState({ dataMention: data_mention })
  }, [dataEmployee])

  // ** function

  return (
    <div className="load-feed">
      <InfiniteScroll
        dataLength={state.dataPost.length}
        next={loadData}
        hasMore={state.hasMoreLazy}>
        {state.loadingPostCreateNew && (
          <div className="div-loading">
            <Skeleton avatar active paragraph={{ rows: 2 }} />
          </div>
        )}

        {_.map(state.dataCreateNewTemp, (value, index) => {
          return (
            <LoadPost
              key={index}
              data={value}
              current_url={current_url}
              dataMention={state.dataMention}
              setData={(data, empty = false, dataCustom = {}) => {
                if (empty) {
                  const _data = state.dataCreateNewTemp.filter(
                    (item, key) => key !== index
                  )
                  setState({ dataCreateNewTemp: _data })
                } else {
                  const _data = [...state.dataCreateNewTemp]
                  _data[index] = {
                    ...data,
                    url_thumb: _data[index].url_thumb,
                    url_source: _data[index].url_source,
                    medias: _data[index].medias,
                    ...dataCustom
                  }
                  setState({ dataCreateNewTemp: _data })
                }
              }}
              customAction={customAction}
            />
          )
        })}

        {_.map(state.dataPost, (value, index) => {
          return (
            <LazyLoadComponent
              key={index}
              afterLoad={() => handleAfterLoadLazyLoadComponent(value, index)}>
              <LoadPost
                data={value}
                current_url={current_url}
                dataMention={state.dataMention}
                setData={(data, empty = false, dataCustom = {}) => {
                  if (empty) {
                    const _data = state.dataPost.filter(
                      (item, key) => key !== index
                    )
                    setState({ dataPost: _data })
                  } else {
                    const _data = [...state.dataPost]
                    _data[index] = {
                      ...data,
                      url_thumb: _data[index].url_thumb,
                      url_source: _data[index].url_source,
                      medias: _data[index].medias,
                      ...dataCustom
                    }
                    setState({ dataPost: _data })
                  }
                }}
                customAction={customAction}
              />
            </LazyLoadComponent>
          )
        })}

        {state.loadingPost && (
          <div className="div-loading">
            <Skeleton avatar active paragraph={{ rows: 2 }} />
          </div>
        )}
      </InfiniteScroll>
    </div>
  )
}

export default LoadFeed
