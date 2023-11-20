import { useMergedState, useFormatMessage } from "@apps/utility/common"
import LoadPost from "@src/components/hrm/LoadPost/LoadPost"
import { Skeleton } from "antd"
import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { LazyLoadComponent } from "react-lazy-load-image-component"
import { feedApi } from "../common/api"
import {
  handleDataMention,
  handleLoadAttachmentThumb,
  loadUrlDataLink
} from "../common/common"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import EventDetailsModal from "../../Calendar/components/modal/EventDetails/EventDetailsModal"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import {
  setFeedState,
  handleDataPostState,
  handleNewDataFeedState,
  appendDataFeedState,
  setWorkspaceState,
  handleDataPostWorkspaceState,
  handleNewDataWorkspaceState,
  appendDataWorkspaceState
} from "../common/reducer/feed"

const LoadFeed = (props) => {
  const {
    isWorkspace,
    searchTextFeed,
    dataCreateNew, // data sau khi tạo mới post
    setDataCreateNew, // set data new
    workspace, // arr workspace: []
    apiLoadFeed, // api load feed
    paramsLoadFeed = {}, // add param load feed api
    customAction = {}, // custom dropdown post header

    // create event / announcement
    options_employee_department = [],
    optionsMeetingRoom = [],
    setSearchTextFeed
  } = props

  const [state, setState] = useMergedState({
    text: "",
    scrollPosition: 0,
    hasMoreLazy: false,
    loadingPost: undefined,
    loadingPostCreateNew: false,
    idPostCreateNew: "",
    dataMention: [],
    arrPostIdSeen: [],
    currentWorkspace: workspace,
    scrollPosition: 0
  })

  const pageLength = 7
  const workspaceId = workspace[0]

  const handleSetStateRedux = isWorkspace ? setWorkspaceState : setFeedState
  const handleAppendDataRedux = isWorkspace
    ? appendDataWorkspaceState
    : appendDataFeedState
  const handleDataPostRedux = isWorkspace
    ? handleDataPostWorkspaceState
    : handleDataPostState
  const handleNewDataRedux = isWorkspace
    ? handleNewDataWorkspaceState
    : handleNewDataFeedState

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const cover = userData?.cover || ""
  const dataEmployee = useSelector((state) => state.users.list)
  const current_url = window.location.pathname
  const calendarState = useSelector((state) => state.calendar)
  const feedRedux = useSelector((state) => state.feed)
  const { feedState, workspaceState } = feedRedux

  const { dataPost, hasMore, totalPost, page, newPosts } = isWorkspace
    ? workspaceState[workspaceId] === undefined
      ? { dataPost: [], hasMore: false, totalPost: 0, page: 0 }
      : workspaceState[workspaceId]
    : Object.keys(feedState).length === 0
    ? { dataPost: [], hasMore: false, totalPost: 0, page: 0 }
    : feedState

  const dispatch = useDispatch()

  // ** function
  const loadData = () => {
    setState({
      loadingPost: true,
      hasMore: false,
      hasMoreLazy: false
    })
    const params = {
      page: page,
      pageLength: pageLength,
      workspace: workspace,
      idPostCreateNew: state.idPostCreateNew, // select where id <= idPostCreateNew
      ...paramsLoadFeed
    }

    if (searchTextFeed !== undefined) {
      params["text"] = searchTextFeed
    }

    const api = apiLoadFeed ? apiLoadFeed(params) : feedApi.getLoadFeed(params)
    api
      .then((res) => {
        const arrPostIdSeen = [...state.arrPostIdSeen]
        _.forEach(res.data.dataPost, (item) => {
          const seen = item.seen.indexOf(userId) !== -1
          arrPostIdSeen.push({ id: item._id, seen: seen })
        })

        if (dataPost.length === 0) {
          if (res.data.dataPost.length === 0) {
            setState({
              arrPostIdSeen: arrPostIdSeen
            })

            dispatch(
              handleSetStateRedux({
                type: "init",
                data: {
                  dataPost: [],
                  newPosts: [],
                  hasMore: false,
                  page: 0,
                  totalPost: 0
                },
                workspaceId: workspaceId
              })
            )

            setTimeout(() => {
              setState({
                loadingPost: false
              })
            }, 200)
          } else {
            setState({
              arrPostIdSeen: arrPostIdSeen
            })

            dispatch(
              handleSetStateRedux({
                type: "init",
                data: {
                  dataPost: res.data.dataPost,
                  newPosts: [],
                  hasMore: res.data.hasMore,
                  page: res.data.page,
                  totalPost: res.data.totalPost
                },
                workspaceId: workspaceId
              })
            )
          }
        } else {
          setState({
            arrPostIdSeen: arrPostIdSeen
          })

          dispatch(
            handleAppendDataRedux({
              dataPost: res.data.dataPost,
              page: res.data.page,
              hasMore: res.data.hasMore
            })
          )
        }
      })
      .catch((err) => {
        setState({ loadingPost: false, hasMore: true })
      })
  }

  const handleGetMedia = async (value, index, cover, dataPost) => {
    const data_attachment = await handleLoadAttachmentThumb(value, cover)
    if (dataPost[index] !== undefined) {
      const cloneDataPostIndex = { ...dataPost[index] }
      cloneDataPostIndex["url_thumb"] = data_attachment["url_thumb"]
      cloneDataPostIndex["url_cover"] = data_attachment["url_cover"]
      cloneDataPostIndex["medias"] = data_attachment["medias"]

      // check data link
      const dataUrl = await loadUrlDataLink(dataPost[index])
      const cloneDataLink = { ...cloneDataPostIndex["dataLink"] }
      cloneDataLink["cover_url"] = dataUrl.cover_url
      cloneDataLink["badge_url"] = dataUrl.badge_url
      cloneDataPostIndex["dataLink"] = cloneDataLink

      return cloneDataPostIndex
    }

    return {}
  }

  const handleAfterLoadLazyLoadComponent = async (
    value,
    index,
    dataPostParam = undefined
  ) => {
    setTimeout(() => {
      setState({ loadingPost: false })
    }, 500)

    if (hasMore === true) {
      setState({ hasMoreLazy: true })
    }

    if (
      state.arrPostIdSeen[0] &&
      state.arrPostIdSeen[0].seen === false &&
      state.arrPostIdSeen[0].id === value._id
    ) {
      feedApi
        .getUpdateSeenPost(value._id)
        .then((res) => {
          const _arrPostIdSeen = [...state.arrPostIdSeen]
          _arrPostIdSeen[0].seen = true
          setState({ arrPostIdSeen: _arrPostIdSeen })
        })
        .catch((err) => {})
    }

    // load media
    const cloneDataPost =
      dataPostParam === undefined ? [...dataPost] : dataPostParam

    if (value["url_thumb"] !== undefined) {
      return
    }

    const cloneDataPostIndex = await handleGetMedia(
      value,
      index,
      cover,
      cloneDataPost
    )

    setTimeout(() => {
      dispatch(
        handleSetStateRedux({
          type: "update",
          data: {
            dataPost: cloneDataPostIndex
          },
          workspaceId: workspaceId
        })
      )
    }, 200)
  }

  // load data create new
  const loadDataCreateNew = async () => {
    // ** user data post
    const isUpdatePost =
      dataCreateNew?.is_edit === undefined ? false : dataCreateNew.is_edit

    setState({ loadingPostCreateNew: !isUpdatePost })

    // load media
    const data_attachment = await handleLoadAttachmentThumb(
      dataCreateNew,
      cover
    )
    dataCreateNew["url_thumb"] = data_attachment["url_thumb"]
    dataCreateNew["url_cover"] = data_attachment["url_cover"]
    dataCreateNew["medias"] = data_attachment["medias"]

    // check data link
    const dataUrl = await loadUrlDataLink(dataCreateNew)
    dataCreateNew["dataLink"].cover_url = dataUrl.cover_url
    dataCreateNew["dataLink"].badge_url = dataUrl.badge_url

    if (isUpdatePost) {
      dispatch(
        handleNewDataRedux({
          type: "update",
          dataPost: dataCreateNew,
          workspaceId: workspaceId
        })
      )
      
      setState({
        loadingPostCreateNew: false
      })
      return
    }

    dispatch(
      handleNewDataRedux({
        type: "push",
        dataPost: dataCreateNew,
        workspaceId: workspaceId
      })
    )

    setState({
      loadingPostCreateNew: false
    })

    setDataCreateNew({})
  }

  // detect element on screen
  const checkVisible = (idPost) => {
    if (document.getElementById(`post_id_${idPost}`)) {
      const elm = document.getElementById(`post_id_${idPost}`)
      const rect = elm.getBoundingClientRect()
      const viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
      )
      return rect.bottom > 0 && rect.top - viewHeight < 0
    }
    return false
  }

  const handleAfterRemove = () => {
    loadData()
  }

  const handleAfterUpdateStatus = (status) => {
    const { indexEvent } = calendarState
    const allDataPost = [...dataPost]
    const newDataPost = { ...allDataPost[indexEvent] }
    const newDataLink = { ...newDataPost["dataLink"] }
    const newEmployee = _.isArray(newDataLink["employee"])
      ? [...newDataLink["employee"]].map((item) => {
          if (parseInt(item.id) === parseInt(userId)) {
            return {
              ...item,
              status: status
            }
          }

          return item
        })
      : newDataLink["employee"]
    newDataLink["employee"] = newEmployee
    allDataPost[indexEvent]["dataLink"] = newDataLink
    setState({ dataPost: allDataPost })
  }

  const ref = useRef(null)

  // ** useEffect
  useLayoutEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchTextFeed !== undefined) {
      loadData()
    }
  }, [searchTextFeed])

  useEffect(() => {
    if (!_.isEqual(state.currentWorkspace, workspace)) {
      loadData()
      setState({
        currentWorkspace: workspace
      })
    }
  }, [workspace])

  useEffect(() => {
    // event stopped scrolling
    let timer = null
    window.addEventListener(
      "scroll",
      function () {
        if (timer !== null) {
          clearTimeout(timer)
        }
        timer = setTimeout(function () {
          const _arrPostIdSeen = [...state.arrPostIdSeen]
          _.forEach(_arrPostIdSeen, (item, index) => {
            if (!item.seen && checkVisible(item.id)) {
              _arrPostIdSeen[index].seen = true

              feedApi
                .getUpdateSeenPost(item.id)
                .then((res) => {})
                .catch((err) => {})
            }
          })
          setState({ arrPostIdSeen: _arrPostIdSeen })
        }, 200)
      },
      false
    )
  }, [state.arrPostIdSeen])

  useEffect(() => {
    if (!_.isEmpty(dataCreateNew)) {
      loadDataCreateNew()

      const _arrPostIdSeen = [...state.arrPostIdSeen]
      _arrPostIdSeen.push({ id: dataCreateNew._id, seen: true })
      setState({ arrPostIdSeen: _arrPostIdSeen })
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

  // ** render
  const renderDataCreateNew = () => {
    return (
      <Fragment>
        {_.map(newPosts, (value, index) => {
          return (
            <LoadPost
              key={index}
              data={value}
              dataLink={value.dataLink}
              current_url={current_url}
              dataMention={state.dataMention}
              setData={(data, empty = false, dataCustom = {}) => {
                if (empty) {
                  dispatch(
                    handleNewDataRedux({
                      type: "remove",
                      index: index,
                      workspaceId: workspaceId
                    })
                  )
                } else {
                  const _data = [...newPosts]
                  console.log(data)
                  _data[index] = {
                    ...data,
                    url_thumb: _data[index].url_thumb,
                    url_source: _data[index].url_source,
                    medias: _data[index].medias,
                    dataLink: {
                      ...data.dataLink,
                      cover_url: _data[index]["dataLink"].cover_url,
                      badge_url: _data[index]["dataLink"].badge_url
                    },
                    ...dataCustom
                  }

                  dispatch(
                    handleNewDataRedux({
                      type: "update",
                      dataPost: _data[index],
                      workspaceId: workspaceId
                    })
                  )
                }
              }}
              setDataLink={(data) => {
                const _data = [...newPosts]
                _data[index]["dataLink"] = data
                dispatch(
                  handleNewDataRedux({
                    type: "update",
                    dataPost: _data[index],
                    workspaceId: workspaceId
                  })
                )
              }}
              customAction={customAction}
              options_employee_department={options_employee_department}
              optionsMeetingRoom={optionsMeetingRoom}
              setDataCreateNew={setDataCreateNew}
              isInWorkspace={!_.isEmpty(workspace)}
              workspace={workspace}
            />
          )
        })}
      </Fragment>
    )
  }

  const renderDataPost = () => {
    return (
      <Fragment>
        {_.map(dataPost, (value, index) => {
          return (
            <LazyLoadComponent
              key={index}
              beforeLoad={() => {
                handleAfterLoadLazyLoadComponent(value, index)
              }}>
              <LoadPost
                dataPost={dataPost}
                data={value}
                index={index}
                dataLink={value.dataLink}
                current_url={current_url}
                dataMention={state.dataMention}
                setData={(data, empty = false, dataCustom = {}) => {
                  if (empty) {
                    dispatch(
                      handleDataPostRedux({
                        type: "remove",
                        index: index,
                        workspaceId: workspaceId
                      })
                    )
                  } else {
                    const _data = [...dataPost]
                    _data[index] = {
                      ...data,
                      url_thumb: _data[index].url_thumb,
                      url_source: _data[index].url_source,
                      medias: _data[index].medias,
                      dataLink: {
                        ...data.dataLink,
                        cover_url: _data[index]["dataLink"].cover_url,
                        badge_url: _data[index]["dataLink"].badge_url
                      },
                      ...dataCustom
                    }

                    dispatch(
                      handleDataPostRedux({
                        type: "update",
                        dataPost: _data[index],
                        workspaceId: workspaceId
                      })
                    )
                  }
                }}
                setDataLink={(data) => {
                  const _data = [...dataPost]
                  _data[index]["dataLink"] = data
                  dispatch(handleDataPostRedux({
                    type: "update",
                    dataPost: _data[index],
                    workspaceId: workspaceId
                  }))
                }}
                customAction={customAction}
                options_employee_department={options_employee_department}
                optionsMeetingRoom={optionsMeetingRoom}
                isInWorkspace={!_.isEmpty(workspace)}
                workspace={workspace}
                setDataCreateNew={setDataCreateNew}
              />
            </LazyLoadComponent>
          )
        })}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div
        className="load-feed"
        ref={ref}
        style={{ height: "auto", overflow: "hidden" }}>
        <InfiniteScroll
          dataLength={dataPost.length}
          next={() => {
            loadData()
          }}
          hasMore={state.hasMoreLazy}>
          {state.loadingPostCreateNew && (
            <div className="div-loading">
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          )}

          <Fragment>{renderDataCreateNew()}</Fragment>
          <Fragment>{renderDataPost()}</Fragment>

          {state.loadingPost && (
            <div className="div-loading">
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          )}
          {!state.loadingPost && dataPost.length === 0 && (
            <div className="empty-pinned pt-1">
              <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-2"></div>
            </div>
          )}
        </InfiniteScroll>
      </div>
      <EventDetailsModal
        afterRemove={handleAfterRemove}
        afterUpdateStatus={handleAfterUpdateStatus}
      />
    </Fragment>
  )
}

export default LoadFeed
