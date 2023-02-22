import { downloadApi } from "@apps/modules/download/common/api"
import { useMergedState } from "@apps/utility/common"
import { Skeleton } from "antd"
import React, { useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { LazyLoadComponent } from "react-lazy-load-image-component"
import { feedApi } from "../common/api"
import LoadPost from "./LoadFeedDetails/LoadPost"

const LoadFeed = (props) => {
  const { workspace } = props
  const [state, setState] = useMergedState({
    dataPost: [],
    hasMore: false,
    page: 0,
    pageLength: 5,
    totalPost: 0,
    loadingPost: false
  })

  // ** function
  const loadData = () => {
    setState({ loadingPost: true, hasMore: false })
    const params = {
      page: state.page,
      pageLength: state.pageLength
    }
    feedApi
      .getLoadFeed(params)
      .then((res) => {
        setTimeout(() => {
          setState({
            loadingPost: false,
            dataPost: [...state.dataPost, ...res.data.dataPost],
            totalPost: res.data.totalPost,
            page: res.data.page,
            hasMore: res.data.hasMore
          })
        }, 1000)
      })
      .catch((err) => {
        setState({ loadingPost: false, hasMore: true })
      })
  }

  // ** useEffect
  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="load-feed">
      <InfiniteScroll
        dataLength={state.dataPost.length}
        next={loadData}
        hasMore={state.hasMore}
        loader={""}>
        {_.map(state.dataPost, (value, index) => {
          return (
            <LazyLoadComponent
              key={index}
              afterLoad={() => {
                if (
                  value.source !== null &&
                  (value.type === "image" || value.type === "video")
                ) {
                  const dataPost = [...state.dataPost]
                  downloadApi.getPhoto(value.source).then((response) => {
                    dataPost[index]["url_source"] = URL.createObjectURL(
                      response.data
                    )
                    dataPost[index]["url_thumb"] = URL.createObjectURL(
                      response.data
                    )
                    setState({ dataPost: dataPost })
                  })
                }

                if (!_.isEmpty(value.medias) && value.type === "post") {
                  const dataPost = [...state.dataPost]
                  const promises = []
                  _.forEach(value.medias, (item, key) => {
                    const promise = new Promise(async (resolve, reject) => {
                      await downloadApi
                        .getPhoto(item.source)
                        .then((response) => {
                          dataPost[index]["medias"][key]["url_source"] =
                            URL.createObjectURL(response.data)
                          dataPost[index]["medias"][key]["url_thumb"] =
                            URL.createObjectURL(response.data)
                        })
                      if (item.type === "video") {
                        await downloadApi
                          .getPhoto(item.thumb)
                          .then((response) => {
                            dataPost[index]["medias"][key]["url_thumb"] =
                              URL.createObjectURL(response.data)
                          })
                      }

                      resolve("success")
                    })

                    promises.push(promise)
                  })

                  Promise.all(promises).then(() => {
                    setState({ dataPost: dataPost })
                  })
                }
              }}>
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
