import { downloadApi } from "@apps/modules/download/common/api"
import { useMergedState } from "@apps/utility/common"
import { Skeleton } from "antd"
import React, { useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { LazyLoadComponent } from "react-lazy-load-image-component"
import { feedApi } from "../common/api"
import LoadPost from "./LoadFeedDetails/LoadPost"

const LoadFeed = (props) => {
  const { dataCreateNew, setDataCreateNew, workspace } = props
  const [state, setState] = useMergedState({
    dataPost: [],
    hasMore: false,
    hasMoreLazy: false,
    page: 0,
    pageLength: 10,
    totalPost: 0,
    loadingPost: false,
    loadingPostCreateNew: false,
    idPostCreateNew: "",
    dataCreateNewTemp: []
  })

  // ** function
  const loadData = () => {
    setState({ loadingPost: true, hasMore: false, hasMoreLazy: false })
    const params = {
      page: state.page,
      pageLength: state.pageLength,
      workspace: workspace,
      idPostCreateNew: state.idPostCreateNew
    }
    setTimeout(() => {
      feedApi
        .getLoadFeed(params)
        .then((res) => {
          setState({
            loadingPost: false,
            dataPost: [...state.dataPost, ...res.data.dataPost],
            totalPost: res.data.totalPost,
            page: res.data.page,
            hasMore: res.data.hasMore
          })
        })
        .catch((err) => {
          setState({ loadingPost: false, hasMore: true })
        })
    }, 1000)
  }

  const handleLoadAttachmentMedias = (value) => {
    const promises = []
    _.forEach(value.medias, (item) => {
      const promise = new Promise(async (resolve, reject) => {
        await downloadApi.getPhoto(item.thumb).then((response) => {
          item["url_thumb"] = URL.createObjectURL(response.data)
        })
        /* if (item.type === "video") {
          await downloadApi.getPhoto(item.thumb).then((response) => {
            item["url_thumb"] = URL.createObjectURL(response.data)
          })
        } */

        resolve(item)
      })

      promises.push(promise)
    })

    return Promise.all(promises)
  }

  const handleAfterLoadLazyLoadComponent = (value, index) => {
    if (state.hasMore) {
      setState({ hasMoreLazy: true })
    }

    // ** user data post
    feedApi
      .getGetUserPost(value.created_by)
      .then((res) => {
        value["user_data"] = res.data
        const dataPost = [...state.dataPost]
        dataPost[index] = value
        setState({ dataPost: dataPost })
      })
      .catch((err) => {})

    // load media
    if (
      value.source !== null &&
      (value.type === "image" || value.type === "video")
    ) {
      if (value.type === "image") {
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
    await feedApi
      .getGetUserPost(dataCreateNew.created_by)
      .then((res) => {
        dataCreateNew["user_data"] = res.data
      })
      .catch((err) => {})

    if (
      dataCreateNew.source !== null &&
      (dataCreateNew.type === "image" || dataCreateNew.type === "video")
    ) {
      await downloadApi.getPhoto(dataCreateNew.source).then((response) => {
        dataCreateNew["url_thumb"] = URL.createObjectURL(response.data)
      })
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
          return <LoadPost key={index} data={value} />
        })}

        {_.map(state.dataPost, (value, index) => {
          return (
            <LazyLoadComponent
              key={index}
              afterLoad={() => handleAfterLoadLazyLoadComponent(value, index)}>
              <LoadPost data={value} />
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
