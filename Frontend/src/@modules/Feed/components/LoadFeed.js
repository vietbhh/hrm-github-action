import { useMergedState } from "@apps/utility/common"
import LoadPost from "@src/components/hrm/LoadPost/LoadPost"
import { Skeleton } from "antd"
import React, { useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { LazyLoadComponent } from "react-lazy-load-image-component"
import { useSelector } from "react-redux"
import { feedApi } from "../common/api"
import { handleDataMention, handleLoadAttachmentThumb } from "../common/common"

const LoadFeed = (props) => {
  const {
    dataCreateNew, // data sau khi tạo mới post
    setDataCreateNew, // set data new
    workspace, // arr workspace: []
    apiLoadFeed, // api load feed
    paramsLoadFeed = {}, // add param load feed api
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
      idPostCreateNew: state.idPostCreateNew, // select where id <= idPostCreateNew
      ...paramsLoadFeed
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

  const handleAfterLoadLazyLoadComponent = async (value, index) => {
    setState({ loadingPost: false })
    if (state.hasMore) {
      setState({ hasMoreLazy: true })
    }

    // load media
    const data_attachment = await handleLoadAttachmentThumb(value, cover)
    const dataPost = [...state.dataPost]
    dataPost[index]["url_thumb"] = data_attachment["url_thumb"]
    dataPost[index]["url_cover"] = data_attachment["url_cover"]
    dataPost[index]["medias"] = data_attachment["medias"]
    setState({ dataPost: dataPost })
  }

  // load data create new
  const loadDataCreateNew = async () => {
    // ** user data post
    setState({ loadingPostCreateNew: true })

    // load media
    const data_attachment = await handleLoadAttachmentThumb(
      dataCreateNew,
      cover
    )
    dataCreateNew["url_thumb"] = data_attachment["url_thumb"]
    dataCreateNew["url_cover"] = data_attachment["url_cover"]
    dataCreateNew["medias"] = data_attachment["medias"]

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
