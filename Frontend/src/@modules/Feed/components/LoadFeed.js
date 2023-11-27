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
    setSearchTextFeed,
    handleUnPinPost
  } = props

  const [state, setState] = useMergedState({
    text: "",
    hasMoreLazy: false,
    loadingPost: undefined,
    loadingPostCreateNew: false,
    idPostCreateNew: "",
    dataMention: [],
    arrPostIdSeen: [],
    currentWorkspace: workspace
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
              handleUnPinPost={handleUnPinPost}
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
                  dispatch(
                    handleDataPostRedux({
                      type: "update",
                      dataPost: _data[index],
                      workspaceId: workspaceId
                    })
                  )
                }}
                customAction={customAction}
                options_employee_department={options_employee_department}
                optionsMeetingRoom={optionsMeetingRoom}
                isInWorkspace={!_.isEmpty(workspace)}
                workspace={workspace}
                setDataCreateNew={setDataCreateNew}
                handleUnPinPost={handleUnPinPost}
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
              <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-2">
                <EmptyContent
                  className="custom-empty-content empty-post"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="130"
                      height="120"
                      viewBox="0 0 130 120"
                      fill="none">
                      <path
                        d="M67.292 43.2338C67.3371 43.26 67.3807 43.2862 67.4244 43.3153L67.4753 43.3503C67.4753 43.3503 67.5612 43.4114 67.5059 43.3707C67.4506 43.3299 67.5234 43.3867 67.5335 43.3954L67.5932 43.4449C67.6267 43.4769 67.6616 43.5075 67.6936 43.5409C67.7256 43.5744 67.7664 43.6151 67.7999 43.653C67.8333 43.6908 67.8348 43.6923 67.8508 43.7127C67.8668 43.733 67.8886 43.7883 67.8508 43.7127C67.8916 43.7971 67.9658 43.8742 68.0153 43.9572C68.065 44.042 68.1102 44.1295 68.1506 44.2191C68.1768 44.2744 68.1419 44.2191 68.1506 44.2002C68.156 44.2253 68.1653 44.2494 68.1783 44.2715C68.1957 44.321 68.2117 44.369 68.2263 44.417C68.2544 44.5126 68.2768 44.6098 68.2932 44.7081C68.2932 44.7227 68.3107 44.8129 68.2932 44.7416C68.2758 44.6703 68.2932 44.7692 68.2932 44.7765C68.2932 44.8274 68.2932 44.8798 68.302 44.9308C68.302 45.1719 68.4974 45.3674 68.7386 45.3674C68.9797 45.3674 69.1752 45.1719 69.1752 44.9308C69.1436 43.9229 68.599 43.0011 67.7315 42.4873C67.5962 42.3961 67.4214 42.3879 67.2783 42.466C67.1351 42.5441 67.0474 42.6955 67.0509 42.8586C67.0544 43.0217 67.1485 43.1692 67.2949 43.2411L67.292 43.2338Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M68.6323 39.4733C69.1824 39.6479 69.7617 39.5111 70.287 39.3205C70.76 39.1502 71.3509 38.8839 71.3291 38.2857C71.3291 38.0446 71.1336 37.8491 70.8925 37.8491C70.6513 37.8491 70.4559 38.0446 70.4559 38.2857C70.4537 38.3041 70.4537 38.3227 70.4559 38.341C70.4471 38.3323 70.4762 38.2377 70.4559 38.3017C70.4559 38.2784 70.5024 38.2246 70.4675 38.2668C70.4326 38.309 70.4893 38.2435 70.4908 38.2435C70.4922 38.2435 70.4224 38.3294 70.4122 38.3207C70.402 38.3119 70.4922 38.2668 70.4326 38.3046L70.3816 38.3367C70.3477 38.357 70.3127 38.376 70.2768 38.3934C70.2584 38.3993 70.2407 38.4076 70.2245 38.4182C70.2405 38.4051 70.303 38.3861 70.2477 38.408C70.1459 38.4458 70.0454 38.4837 69.9436 38.5186C69.8417 38.5535 69.7427 38.5855 69.6409 38.6132C69.5899 38.6263 69.539 38.6394 69.4866 38.6496L69.4109 38.6656C69.4007 38.6656 69.3207 38.6801 69.3731 38.6728C69.4255 38.6656 69.344 38.6728 69.3338 38.6728H69.2581H69.1126H69.0369C68.9729 38.6728 69.1009 38.6903 69.0369 38.6728C68.9729 38.6554 68.9248 38.6466 68.8695 38.6292C68.7578 38.5984 68.6384 38.6133 68.5377 38.6707C68.4369 38.728 68.3631 38.823 68.3325 38.9348C68.2741 39.1663 68.4081 39.4029 68.6367 39.4718L68.6323 39.4733Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M71.7628 45.1185C71.7555 45.104 71.69 44.9584 71.722 45.0414C71.7031 44.9905 71.6871 44.941 71.6725 44.8886C71.6589 44.8368 71.6482 44.7844 71.6405 44.7314C71.6551 44.8289 71.6405 44.6659 71.6405 44.647C71.6405 44.5946 71.6405 44.5408 71.6405 44.4869C71.6405 44.4331 71.6405 44.4331 71.6405 44.4869C71.6405 44.4607 71.6493 44.4345 71.6551 44.4083C71.6652 44.3557 71.6784 44.3037 71.6944 44.2526C71.6944 44.2351 71.7628 44.0911 71.7235 44.1711C71.7468 44.1216 71.7715 44.0751 71.7992 44.0256C71.8093 44.0096 71.9054 43.88 71.8457 43.9543C71.9034 43.8861 71.9662 43.8224 72.0335 43.7636C72.0728 43.7316 72.0742 43.7316 72.0335 43.7636C72.0539 43.7477 72.0753 43.7332 72.0975 43.7199C72.1403 43.692 72.1845 43.6662 72.2299 43.6428C72.2532 43.6312 72.275 43.6195 72.2998 43.6093C72.2532 43.6283 72.2547 43.6283 72.2998 43.6093C72.3449 43.5904 72.3973 43.5773 72.4453 43.5642C72.4933 43.5511 72.5443 43.5409 72.5909 43.5322C72.4861 43.5497 72.6447 43.5322 72.6651 43.5322H72.8106C72.8106 43.5322 72.8616 43.5322 72.8106 43.5322L72.8863 43.5468C72.9411 43.5575 72.9951 43.5721 73.0478 43.5904C72.978 43.5657 73.0784 43.6093 73.093 43.6181C73.1366 43.6472 73.1395 43.6486 73.1046 43.6181C73.1246 43.6359 73.1435 43.6548 73.1614 43.6748C73.1948 43.7127 73.1963 43.7156 73.1686 43.6748C73.1846 43.6967 73.1992 43.7199 73.2137 43.7432C73.2414 43.7898 73.2661 43.8393 73.2894 43.8888C73.2545 43.8145 73.3171 43.9615 73.3214 43.9761C73.3666 44.0983 73.4044 44.2235 73.4379 44.3487C73.5004 44.577 73.5438 44.8102 73.5674 45.0458C73.5728 45.2846 73.7651 45.477 74.004 45.4824C74.2223 45.4722 74.4639 45.2888 74.4406 45.0458C74.4019 44.5466 74.2886 44.056 74.1044 43.5904C74.0202 43.3519 73.8776 43.1383 73.6896 42.969C73.4925 42.8113 73.2559 42.7106 73.0056 42.6779C72.053 42.5357 71.1368 43.1015 70.8372 44.0168C70.6816 44.5314 70.7382 45.0869 70.9943 45.5595C71.1227 45.7498 71.3765 45.8083 71.5752 45.6932C71.7738 45.5782 71.8494 45.3289 71.7482 45.1229L71.7628 45.1185Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M76.5028 42.3869C76.5535 42.8466 76.7981 43.2629 77.1752 43.5308C77.5035 43.7744 77.9107 43.8875 78.3176 43.848C79.2461 43.7374 79.9185 42.9064 79.9476 41.9881C79.9476 41.747 79.7521 41.5515 79.511 41.5515C79.2721 41.5569 79.0798 41.7493 79.0744 41.9881V42.0973C79.0744 42.186 79.089 42.0303 79.0642 42.1438C79.0497 42.2151 79.0235 42.2894 79.0045 42.3534C78.9929 42.384 78.9958 42.3767 79.0133 42.3345C79.0043 42.3569 78.9941 42.3787 78.9827 42.4C78.9667 42.4335 78.9492 42.4655 78.9303 42.4975C78.9114 42.5295 78.8925 42.5601 78.8721 42.5892C78.8517 42.6183 78.7906 42.6881 78.8532 42.6168C78.8084 42.6725 78.7597 42.725 78.7077 42.774C78.696 42.7856 78.6043 42.8526 78.6844 42.7973L78.5956 42.8584C78.565 42.8773 78.533 42.8948 78.501 42.9108C78.469 42.9268 78.4035 42.9486 78.4733 42.9254L78.3715 42.9588C78.3584 42.9588 78.2259 42.9952 78.2885 42.9807C78.3511 42.9661 78.2434 42.9807 78.2274 42.9807H78.1241H78.0731H78.1037C78.0644 42.9719 78.0251 42.9661 77.9858 42.9559C77.9465 42.9457 77.9203 42.9341 77.8868 42.9254C77.801 42.8992 77.9509 42.9617 77.8636 42.9166C77.8024 42.8832 77.7428 42.8511 77.6845 42.8133C77.5914 42.7536 77.7457 42.8715 77.6627 42.7987C77.6365 42.7755 77.6118 42.7536 77.587 42.7289C77.5623 42.7041 77.5405 42.6794 77.5172 42.6547C77.4517 42.5834 77.5477 42.71 77.5041 42.6343L77.4502 42.5484C77.4299 42.5091 77.4109 42.4611 77.4371 42.5295C77.4228 42.4929 77.4107 42.4555 77.4008 42.4174C77.3935 42.3927 77.3731 42.2719 77.3877 42.3825C77.36 42.1569 77.2072 41.9343 76.9511 41.9459C76.7386 41.9546 76.4839 42.1395 76.5145 42.3825L76.5028 42.3869Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M85.7049 43.0942C85.6947 43.052 85.686 43.0112 85.6787 42.969C85.6787 42.969 85.6598 42.8235 85.6685 42.9181C85.6598 42.8337 85.654 42.7493 85.6525 42.6649C85.6511 42.5804 85.654 42.4958 85.6613 42.4116C85.6613 42.4014 85.6729 42.2908 85.6613 42.3432C85.6496 42.3956 85.6729 42.269 85.6758 42.2544C85.7064 42.0949 85.7518 41.9385 85.8112 41.7873C85.7821 41.8615 85.8272 41.7509 85.8345 41.7363C85.8417 41.7218 85.8679 41.6679 85.8854 41.6345C85.9203 41.5704 85.9596 41.5093 85.9989 41.4496C86.0382 41.39 85.9523 41.4948 86.0193 41.4234L86.0921 41.3434C86.1139 41.323 86.1372 41.3041 86.1575 41.2837C86.1779 41.2634 86.1765 41.2677 86.1386 41.2968C86.1531 41.2863 86.1682 41.2766 86.1837 41.2677C86.2128 41.2488 86.2449 41.2343 86.2754 41.2153C86.306 41.1964 86.2085 41.2299 86.2856 41.2153C86.3249 41.2081 86.3613 41.195 86.4006 41.1877C86.3045 41.2051 86.4151 41.1877 86.4384 41.1877C86.4617 41.1877 86.5549 41.1964 86.4763 41.1877C86.515 41.1932 86.5534 41.201 86.5912 41.211C86.6305 41.2212 86.6669 41.2343 86.7048 41.2459C86.8226 41.2852 86.6378 41.2095 86.7499 41.2648C86.8227 41.3009 86.8937 41.3407 86.9623 41.3842L87.0468 41.4409L87.0962 41.4773C87.2692 41.6414 87.5403 41.6414 87.7133 41.4773C87.8588 41.3187 87.904 41.013 87.7133 40.8588C87.3524 40.5677 86.9449 40.3319 86.4704 40.3116C86.0434 40.305 85.6375 40.4969 85.3717 40.8311C84.8084 41.5122 84.6556 42.4742 84.8492 43.3227C84.8798 43.4345 84.9536 43.5295 85.0543 43.5868C85.1551 43.6441 85.2745 43.6591 85.3862 43.6283C85.6154 43.5599 85.7501 43.3232 85.6918 43.0913L85.7049 43.0942Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M87.4979 36.1405C88.1983 35.833 88.7818 35.3092 89.1628 34.6459C89.2712 34.4386 89.197 34.1826 88.9944 34.0655C88.7918 33.9484 88.533 34.0118 88.4075 34.2093C88.3653 34.2849 88.3187 34.3548 88.2707 34.429L88.2023 34.5251C88.1571 34.5847 88.2532 34.461 88.2197 34.5018L88.1833 34.5484C88.0758 34.6792 87.958 34.8014 87.8311 34.9137L87.7424 34.9908L87.6958 35.0272C87.6274 35.0825 87.7817 34.9646 87.7103 35.017C87.639 35.0694 87.575 35.113 87.5051 35.1625C87.3621 35.2523 87.2123 35.3307 87.0569 35.3968C86.9586 35.4542 86.8865 35.5476 86.8561 35.6573C86.8001 35.8854 86.9345 36.1168 87.1602 36.1813C87.2745 36.2049 87.3934 36.1895 87.4979 36.1376V36.1405Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M90.6299 34.969C90.1671 35.8422 89.5704 37.6162 90.8263 38.1358C91.0586 38.2 91.299 38.0638 91.3634 37.8316C91.421 37.6002 91.2873 37.3642 91.0592 37.2946C91.0869 37.3048 91.1232 37.3252 91.0781 37.2946C91.033 37.264 91.0781 37.3106 91.0927 37.3106C91.1072 37.3106 91.0577 37.2771 91.049 37.2699C91.001 37.2277 91.049 37.2859 91.0607 37.2902C91.0723 37.2946 91.033 37.248 91.0272 37.2393C91.0214 37.2306 90.9704 37.1549 91.0083 37.2087C91.0461 37.2626 91.0083 37.2087 91.001 37.1884C90.9937 37.168 90.9879 37.1476 90.9821 37.1272C90.9762 37.1069 90.9646 37.0414 90.9559 36.9992C90.9471 36.957 90.9559 37.0748 90.9559 37.0166C90.9573 36.9943 90.9573 36.972 90.9559 36.9497C90.9396 36.853 90.9431 36.754 90.9661 36.6586C90.9544 36.6804 90.953 36.7358 90.9661 36.6775C90.9661 36.647 90.9762 36.6179 90.9821 36.5873C90.9923 36.5276 91.0054 36.468 91.0185 36.4083C91.0456 36.289 91.0776 36.1711 91.1145 36.0547C91.1802 35.8309 91.2694 35.6148 91.3808 35.4099C91.4821 35.2039 91.4064 34.9546 91.2078 34.8396C91.0091 34.7245 90.7553 34.783 90.627 34.9733L90.6299 34.969Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M8.41169 49.029C8.38404 50.6387 9.38823 52.1668 10.423 53.3252C11.3818 54.3941 12.5485 55.2562 13.8518 55.859C15.1834 56.4834 16.6336 56.8149 18.1043 56.8311C19.6029 56.8287 21.0838 56.5072 22.4485 55.8881C23.9644 55.2146 25.2951 54.1845 26.327 52.8857C26.4896 52.7122 26.4896 52.4422 26.327 52.2686C26.1814 52.1231 25.8569 52.0824 25.7099 52.2686C23.9968 54.4297 21.4486 55.7643 18.6966 55.9419C15.9978 56.0696 13.3701 55.0547 11.4577 53.1462C10.9357 52.631 10.477 52.0555 10.0912 51.4318C9.64437 50.7041 9.2718 49.8993 9.28635 49.029C9.29654 48.4673 8.42333 48.4658 8.41315 49.029H8.41169Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M5.57811 50.8482C6.08166 54.4211 8.65325 57.5428 11.8899 59.0418C15.6214 60.7722 20.0282 60.5481 23.7408 58.8846C25.7147 58.0205 27.4506 56.6925 28.801 55.0134C28.9639 54.8394 28.9639 54.5689 28.801 54.3949C28.6555 54.2493 28.3309 54.2086 28.184 54.3949C25.8903 57.3012 22.2811 59.0302 18.6253 59.3212C16.6866 59.4911 14.7345 59.2215 12.9145 58.5324C11.3174 57.9086 9.89345 56.9104 8.7624 55.6217C7.50874 54.2173 6.69414 52.4763 6.4193 50.6139C6.38728 50.3796 6.08894 50.253 5.88228 50.3097C5.65368 50.3787 5.51971 50.6152 5.57811 50.8468V50.8482Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M24.0741 61.3806C25.2543 61.1201 26.2309 60.3618 27.1958 59.672C27.7294 59.2955 28.263 58.9172 28.7967 58.5368L29.2027 58.2458C29.3518 58.1604 29.4825 58.0461 29.5869 57.9096C29.763 57.6185 29.7033 57.1615 29.3118 57.0873C29.08 57.0298 28.8438 57.1642 28.7748 57.3929C28.7106 57.6252 28.8468 57.8656 29.079 57.9299H29.1095L28.916 57.8179L28.9349 57.8353L28.8228 57.6418C28.8592 57.7466 28.7734 57.3202 28.8781 57.4046C28.8781 57.4046 28.7122 57.5224 28.705 57.5283L28.3557 57.7757L27.7168 58.2297L26.3502 59.199C25.5745 59.7477 24.7857 60.324 23.8427 60.5321C23.6882 60.57 23.5665 60.6889 23.5251 60.8425C23.4837 60.996 23.529 61.16 23.6435 61.2704C23.758 61.3808 23.9235 61.4202 24.0755 61.3733L24.0741 61.3806Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M68.0022 17.7697L63.7293 29.7923C63.5532 30.2886 63.3742 30.8227 63.5051 31.3335C63.6929 32.0612 64.4322 32.4862 65.122 32.7889C68.3351 34.1613 71.8959 34.4985 75.3094 33.7538L75.3647 33.4918C74.1175 33.0145 72.6942 33.6039 71.3887 33.3186C70.7178 33.1731 70.1211 32.8034 69.539 32.4454C68.9569 32.0874 68.3936 31.7294 67.9861 31.2011C67.4695 30.5302 67.2832 29.6628 67.2134 28.8202C66.8917 24.8907 68.8142 21.069 68.7866 17.1207"
                        fill="#6573C9"
                      />
                      <path
                        d="M67.5815 17.6533L63.6798 28.6135C63.5211 29.0589 63.3523 29.5042 63.2053 29.9554C63.0406 30.4005 62.9906 30.88 63.0598 31.3496C63.2053 32.1311 63.8879 32.6594 64.5602 32.9999C66.1073 33.7698 67.8479 34.205 69.5535 34.4262C71.5081 34.6757 73.4911 34.5871 75.4156 34.1642C75.5653 34.1251 75.6821 34.0082 75.7213 33.8586L75.778 33.5981C75.8347 33.3663 75.7006 33.1307 75.4724 33.0611C74.7855 32.8064 74.0447 32.8355 73.3258 32.8908C72.6345 32.9461 71.9228 33.0276 71.2475 32.8224C70.5723 32.6172 69.9916 32.214 69.4167 31.8429C68.8419 31.4718 68.3558 31.0832 68.0516 30.4836C67.7605 29.9088 67.6674 29.2451 67.6266 28.6106C67.5849 27.8752 67.6058 27.1376 67.6892 26.4058C67.8464 24.9504 68.2044 23.5111 68.5246 22.0805C68.8899 20.4461 69.2202 18.7871 69.2144 17.1061C69.2144 16.5444 68.3412 16.5429 68.3412 17.1061C68.35 20.174 67.2264 23.0934 66.8495 26.1147C66.7528 26.8557 66.7163 27.6033 66.7403 28.3501C66.7694 29.0778 66.8495 29.8346 67.1187 30.5186C67.4021 31.2207 67.881 31.8268 68.4984 32.265C69.0757 32.7015 69.6948 33.0798 70.3467 33.3943C70.7495 33.5918 71.1814 33.7235 71.6259 33.7844C72.0329 33.8295 72.4434 33.8339 72.8513 33.7975C73.6489 33.7407 74.4697 33.6141 75.241 33.8979L74.9354 33.3609L74.8786 33.6228L75.1842 33.3172C71.936 34.0194 68.5513 33.7216 65.4757 32.4629C64.9037 32.2286 64.2139 31.9244 63.9679 31.3554C63.8428 31.0643 63.9053 30.6772 64.0014 30.3512C64.1265 29.9248 64.2925 29.5071 64.438 29.088L66.3096 23.8284L68.4256 17.8847C68.4564 17.773 68.4415 17.6536 68.3842 17.5529C68.3268 17.4521 68.2318 17.3783 68.12 17.3477C67.8881 17.2894 67.6513 17.4242 67.583 17.6533H67.5815Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M29.8328 32.7147C29.5592 31.0236 29.0717 29.3776 28.7981 27.6865C28.7224 27.4123 28.5428 27.1784 28.2975 27.0345C28.0425 26.8885 27.7403 26.8488 27.4563 26.9239C27.182 27.0003 26.9482 27.1804 26.8043 27.426C26.6707 27.685 26.6316 27.9824 26.6937 28.2672C26.9673 29.9568 27.4548 31.6043 27.727 33.2954C27.8431 33.7187 28.2013 34.0315 28.6364 34.0895C29.0715 34.1476 29.4991 33.9397 29.7222 33.5617C29.8558 33.3027 29.8949 33.0052 29.8328 32.7205V32.7147Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M19.7343 40.5066C20.3062 40.5066 20.852 40.0045 20.8258 39.4151C20.8156 38.8165 20.3328 38.3337 19.7343 38.3235C19.1638 38.3235 18.6166 38.8256 18.6427 39.4151C18.6529 40.0136 19.1357 40.4964 19.7343 40.5066Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M27.9656 40.5066C28.5375 40.5066 29.0833 40.0045 29.0571 39.4151C29.047 38.8165 28.5642 38.3337 27.9656 38.3235C27.3951 38.3235 26.8479 38.8256 26.8741 39.4151C26.8842 40.0136 27.367 40.4964 27.9656 40.5066Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M42.1378 46.1941C42.9471 42.1469 42.6857 37.9586 41.3796 34.0434C40.7357 32.1093 39.8235 30.2751 38.6697 28.5946C37.4556 26.8463 35.9767 25.2977 34.2862 24.0044C30.7821 21.3544 26.4857 19.9651 22.0934 20.0619C19.948 20.1136 17.8231 20.492 15.7917 21.184C13.7619 21.8735 11.8364 22.8387 10.0693 24.0525C8.29883 25.2617 6.69702 26.7011 5.30598 28.3326C3.91963 29.9486 2.76826 31.7521 1.88592 33.6898C-0.0346935 37.9546 -0.503999 42.7315 0.549918 47.2885C1.0616 49.5335 1.94715 51.6766 3.16954 53.628C4.40264 55.5846 5.97071 57.3089 7.80189 58.7217C9.52461 60.0473 11.4441 61.0952 13.4908 61.8274C15.5057 62.5438 17.6134 62.9659 19.7488 63.0804C21.8771 63.2001 24.0116 63.0233 26.0912 62.555C28.1716 62.0892 30.1736 61.3245 32.0348 60.2847C33.9879 59.1965 35.7474 57.7925 37.242 56.1297C38.943 54.2027 40.275 51.9793 41.1715 49.5705C41.5835 48.4742 41.9047 47.3459 42.132 46.197C42.244 45.6396 41.9733 44.992 41.3694 44.8551C40.828 44.7314 40.1469 45.0181 40.0275 45.6163C39.8563 46.4781 39.6328 47.3286 39.3581 48.1631C39.2213 48.5794 39.067 48.9912 38.9069 49.3987C38.8749 49.4773 38.7294 49.8164 38.872 49.486C38.8313 49.5821 38.7905 49.6782 38.7483 49.7771C38.6552 49.9867 38.5577 50.1963 38.4572 50.4029C38.0779 51.1879 37.6462 51.9464 37.1649 52.6733C36.9262 53.0342 36.6497 53.3704 36.4125 53.7313C36.6002 53.4402 36.4037 53.74 36.3484 53.8113L36.1476 54.0587C35.9982 54.2392 35.8454 54.4172 35.6892 54.5928C35.1259 55.2243 34.5205 55.817 33.8773 56.3669C33.7405 56.4848 33.6008 56.6012 33.4596 56.7147L33.2486 56.8836C33.2195 56.9054 33.0725 57.0204 33.2311 56.8981C33.3897 56.7759 33.2005 56.9199 33.17 56.9432C32.8673 57.1703 32.5602 57.39 32.2458 57.5996C31.6358 58.0065 31.0043 58.3801 30.3539 58.7187C30.0221 58.8905 29.683 59.0549 29.3424 59.2092L29.0965 59.3169C29.0484 59.3387 28.999 59.362 28.9509 59.3809C28.9509 59.3809 29.2216 59.2689 29.0645 59.3329C28.8825 59.4086 28.7006 59.4784 28.5172 59.5527C26.9513 60.1519 25.3211 60.5675 23.6593 60.7912L23.9504 60.7519C22.0069 61.0116 20.0375 61.0116 18.0941 60.7519L18.3851 60.7897C16.8155 60.5784 15.2748 60.1908 13.7921 59.6342C13.6262 59.5701 13.4603 59.5061 13.2958 59.4391L13.1503 59.378C13.4806 59.509 13.2871 59.4348 13.2143 59.4042L12.9232 59.2747C12.5652 59.1146 12.2116 58.9429 11.8652 58.761C11.1663 58.3967 10.4907 57.9894 9.84228 57.5414C9.67928 57.4293 9.5192 57.3143 9.35911 57.1965L9.14226 57.0349C9.11316 57.0131 8.96617 56.8981 9.1248 57.0204L9.06367 56.9723C8.75078 56.7249 8.44515 56.4659 8.14972 56.1981C7.5193 55.6298 6.92896 55.0185 6.38293 54.3687C6.24419 54.2028 6.10884 54.0355 5.97689 53.8666C5.84446 53.6993 6.10933 54.0398 6.02201 53.9248L5.93323 53.807C5.86192 53.7138 5.7877 53.6192 5.72366 53.5246C5.46752 53.1695 5.22496 52.8057 4.99599 52.4331C4.5392 51.7012 4.13224 50.9393 3.77787 50.1526C3.7313 50.0478 3.68764 49.9401 3.63961 49.8353C3.79679 50.1817 3.62797 49.8062 3.5945 49.7204C3.50717 49.5064 3.42568 49.2838 3.34709 49.0727C3.18312 48.6187 3.03758 48.1597 2.91048 47.696C2.64988 46.7678 2.45535 45.8224 2.32835 44.8668L2.36764 45.1579C2.12969 43.3582 2.12969 41.535 2.36764 39.7353L2.32835 40.0263C2.45778 39.0679 2.65572 38.12 2.92067 37.1899C3.05165 36.729 3.2001 36.273 3.36601 35.8218C3.44168 35.6137 3.52173 35.4056 3.60468 35.2004L3.66581 35.0549C3.67599 35.0301 3.68764 35.0054 3.69637 34.9806C3.7051 34.9559 3.59158 35.2251 3.63816 35.1189L3.77641 34.8016C4.13996 33.9903 4.55459 33.2028 5.01782 32.444C5.25068 32.0627 5.49323 31.6891 5.74549 31.3234C5.87356 31.14 6.00309 30.9595 6.13698 30.7791L6.33054 30.5229C6.4004 30.4312 6.22867 30.6525 6.24176 30.6379C6.25486 30.6233 6.27524 30.5942 6.29125 30.5739C6.33054 30.5244 6.36838 30.4749 6.40767 30.4283C7.53168 29.0146 8.81834 27.7382 10.241 26.6255C10.2636 26.6102 10.285 26.5931 10.3051 26.5746C10.3182 26.5615 10.0999 26.7332 10.1901 26.6634L10.3196 26.5659L10.6005 26.3548C10.781 26.2224 10.9644 26.0914 11.1492 25.9648C11.5198 25.7087 11.8972 25.4661 12.2814 25.2371C13.0477 24.763 13.8419 24.3353 14.6595 23.9564L14.9505 23.824L15.0961 23.76L14.9593 23.8182L15.0582 23.776C15.2649 23.6901 15.473 23.6086 15.6826 23.5286C16.1017 23.3694 16.5252 23.2239 16.9531 23.0919C17.8089 22.8282 18.6811 22.6206 19.564 22.4705C19.7852 22.4327 20.0006 22.3992 20.2276 22.3686L19.9365 22.4079C21.6034 22.1826 23.2927 22.1792 24.9604 22.3978L24.6693 22.3585C25.5406 22.4755 26.4024 22.6545 27.2482 22.894C27.6761 23.0153 28.0986 23.1516 28.5158 23.303C28.7093 23.3743 28.9 23.4485 29.0906 23.5227C29.1751 23.5577 29.5462 23.7207 29.1882 23.5606L29.5403 23.7148C30.31 24.0611 31.055 24.4598 31.7699 24.9082C32.1134 25.1222 32.4481 25.3448 32.7756 25.5864C32.8614 25.6475 32.9459 25.7101 33.0288 25.7727L33.154 25.8673C33.3111 25.9866 32.9691 25.7218 33.0783 25.8091C33.2486 25.943 33.4174 26.0783 33.5833 26.218C34.2018 26.7378 34.7852 27.2978 35.3297 27.8946C35.5946 28.1856 35.8507 28.4835 36.0981 28.7882C36.1622 28.8668 36.2262 28.9482 36.2888 29.0283C36.4154 29.1869 36.1214 28.8071 36.2437 28.9686L36.3368 29.0909C36.459 29.2539 36.5798 29.4198 36.6977 29.5871C37.1578 30.2408 37.5786 30.9211 37.9581 31.6246C38.1521 31.9768 38.3316 32.3339 38.4965 32.6958C38.578 32.8733 38.6595 33.0523 38.7367 33.2313L38.7978 33.3769C38.6639 33.0712 38.7192 33.1891 38.7468 33.2575C38.792 33.3681 38.8371 33.4773 38.8807 33.5893C39.5455 35.274 40.0024 37.0334 40.2415 38.8286L40.2036 38.5375C40.4656 40.5266 40.4656 42.5415 40.2036 44.5306L40.2415 44.2395C40.1804 44.6975 40.1052 45.153 40.0159 45.6061C39.9053 46.165 40.1745 46.8126 40.7785 46.9494C41.3359 47.0804 42.0199 46.7937 42.1378 46.1941Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M38.1545 29.788C41.1525 34.4815 42.1742 40.412 41.0856 45.9045C40.2982 49.8834 38.4063 53.6324 35.3501 56.5139C27.8783 63.5636 15.4031 63.9362 7.65344 57.2067C8.41871 58.423 9.32272 59.5463 10.3473 60.554C18.0097 68.065 31.1339 67.9369 38.8793 60.6297C41.9355 57.7466 43.8274 53.9977 44.6192 50.0187C46.057 42.7464 43.7998 34.7085 38.1545 29.788V29.788Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M37.2115 30.3396C37.5327 30.8441 37.832 31.3617 38.1095 31.8924C38.255 32.1675 38.3889 32.444 38.5199 32.7249C38.581 32.8559 38.6407 32.9883 38.6989 33.1207C38.728 33.1862 38.7556 33.2532 38.7847 33.3187C38.8328 33.4278 38.7294 33.1891 38.7353 33.2008C38.7556 33.2488 38.7746 33.2968 38.7949 33.3463C39.2546 34.4668 39.6206 35.6234 39.8894 36.8042C40.0422 37.4708 40.163 38.146 40.2546 38.8242L40.2153 38.5332C40.481 40.5323 40.481 42.5577 40.2153 44.5568L40.2546 44.2658C40.0059 46.0986 39.5252 47.8924 38.824 49.604C38.7571 49.7684 38.8619 49.5196 38.8648 49.5094C38.843 49.5647 38.8182 49.6185 38.7949 49.6738C38.7469 49.783 38.6989 49.8921 38.6494 49.9998C38.5592 50.1997 38.4651 50.3976 38.3671 50.5936C38.1633 51.004 37.945 51.4066 37.7122 51.8015C37.4793 52.1964 37.2319 52.5845 36.9699 52.9658C36.8448 53.1482 36.7162 53.3282 36.5843 53.5057L36.4766 53.6513C36.4562 53.676 36.331 53.839 36.4518 53.6847C36.5726 53.5305 36.4446 53.692 36.4256 53.7168L36.2801 53.906C35.7044 54.6174 35.0774 55.2857 34.4042 55.9056C34.1131 56.1734 33.8138 56.4319 33.5062 56.6813L33.2603 56.8792L33.2472 56.8894C33.4058 56.7657 33.2617 56.8778 33.2326 56.8996C33.0648 57.0277 32.8959 57.1519 32.7262 57.2722C32.073 57.7352 31.3927 58.1585 30.6887 58.5398C30.3452 58.7241 29.9974 58.8997 29.6452 59.0666C29.472 59.1481 29.2988 59.2267 29.1242 59.3024C29.0412 59.3387 28.708 59.4726 29.0762 59.3257C28.9786 59.3635 28.884 59.4042 28.7851 59.4435C27.1299 60.103 25.3994 60.5551 23.6332 60.7897L23.9242 60.7504C22.0052 61.0037 20.0612 61.0037 18.1422 60.7504L18.4332 60.7883C16.9442 60.5916 15.4805 60.2359 14.0672 59.7273C13.9057 59.6691 13.7441 59.6094 13.584 59.5469L13.3439 59.4508L13.1984 59.3911L13.1023 59.3518L13.2682 59.4217C12.9136 59.2846 12.5679 59.1252 12.2335 58.9444C11.5656 58.6139 10.9174 58.2451 10.292 57.8397C9.93985 57.6108 9.59639 57.3716 9.26166 57.1223L9.1365 57.0277L9.05209 56.9636L9.19035 57.0699C9.10448 57.0087 9.02444 56.9389 8.94294 56.8734C8.76393 56.7279 8.58929 56.5823 8.41611 56.4368C8.00133 56.0773 7.43229 56.0002 6.98259 56.3509C6.54903 56.6837 6.42892 57.2861 6.70171 57.7597C8.12512 60.004 9.9802 61.9432 12.1592 63.4646C13.9979 64.7364 16.0301 65.7026 18.1771 66.3259C20.3151 66.9536 22.5344 67.2611 24.7625 67.2383C26.994 67.2201 29.211 66.8769 31.3436 66.2196C33.4714 65.5646 35.4845 64.5827 37.3105 63.3089C39.4023 61.8416 41.1998 59.9942 42.6094 57.863C44.03 55.6851 45.0393 53.2651 45.587 50.7231C46.1106 48.3351 46.258 45.8799 46.0236 43.4464C45.7819 40.9525 45.1494 38.5121 44.1491 36.2148C43.1862 33.9986 41.843 31.9679 40.1804 30.2144C39.7817 29.7943 39.3635 29.3936 38.9259 29.0123C38.7177 28.8132 38.4426 28.699 38.1546 28.6921C37.8655 28.6941 37.5887 28.809 37.3833 29.0123C37.0049 29.4242 36.9234 30.1548 37.3833 30.5564C38.1063 31.1883 38.7801 31.8742 39.3989 32.6085C39.5532 32.7928 39.7045 32.9801 39.853 33.1702C39.9199 33.2532 39.7686 33.0509 39.7671 33.0596C39.7656 33.0684 39.8108 33.1149 39.818 33.1251L39.9185 33.2575C39.9912 33.3551 40.064 33.4511 40.1324 33.5486C40.4118 33.9387 40.6781 34.3403 40.9299 34.7493C41.4277 35.561 41.8687 36.4061 42.2499 37.2787L42.3154 37.4315C42.3634 37.5377 42.2543 37.2859 42.2601 37.2976C42.2693 37.3239 42.28 37.3496 42.2921 37.3747C42.3416 37.4941 42.3911 37.6148 42.4377 37.7356C42.523 37.9501 42.6045 38.1664 42.6822 38.3847C42.8452 38.8388 42.9907 39.2972 43.1188 39.76C43.4135 40.7966 43.6333 41.853 43.7766 42.921L43.7387 42.63C44.0046 44.624 44.007 46.6444 43.746 48.6391L43.7839 48.348C43.5461 50.151 43.0801 51.9164 42.3969 53.6018C42.3736 53.6571 42.3503 53.7109 42.3285 53.7677C42.4522 53.4504 42.3751 53.6585 42.3445 53.7255C42.3052 53.8172 42.2659 53.9089 42.2252 53.9991C42.1282 54.2174 42.0263 54.4333 41.9196 54.6467C41.7158 55.0581 41.4985 55.4617 41.2676 55.8576C41.0366 56.2534 40.7849 56.6507 40.5122 57.0495C40.3813 57.2435 40.2469 57.4313 40.1091 57.6127C40.0494 57.6942 39.9869 57.7728 39.9286 57.8543C40.1208 57.5865 39.9956 57.767 39.9505 57.8252L39.8049 58.0144C39.2243 58.7311 38.592 59.4043 37.913 60.0286C37.6219 60.2973 37.3212 60.5569 37.0107 60.8072L36.7691 60.9993L36.6876 61.0633C36.9641 60.8436 36.8069 60.9702 36.7444 61.0182C36.5799 61.1419 36.414 61.2642 36.2466 61.3835C35.5981 61.8425 34.9231 62.2629 34.2252 62.6424C33.8744 62.833 33.5164 63.0135 33.154 63.1838C32.9852 63.2624 32.8149 63.3395 32.6432 63.4152C32.5617 63.4501 32.2619 63.5709 32.6228 63.4254C32.5122 63.469 32.4031 63.5156 32.2925 63.5607C30.6492 64.2129 28.9322 64.6611 27.1798 64.8952L27.4709 64.856C25.5352 65.1143 23.5737 65.1143 21.6379 64.856L21.929 64.8952C20.9042 64.7603 19.8905 64.5512 18.896 64.2695C18.4109 64.1297 17.9282 63.9716 17.448 63.795C17.2107 63.7062 16.9735 63.6131 16.7392 63.517C16.7072 63.5039 16.6752 63.4923 16.6446 63.4777C16.6446 63.4777 16.9182 63.5942 16.7654 63.5272L16.601 63.4574L16.2313 63.29C15.2954 62.8569 14.3956 62.3498 13.5404 61.7735C13.3279 61.628 13.1169 61.4825 12.9102 61.3369C12.8069 61.2598 12.7035 61.1827 12.6017 61.1041C12.4998 61.0255 12.737 61.2118 12.7196 61.1958C12.7021 61.1798 12.6657 61.1536 12.6381 61.1317L12.4765 61.0037C12.0651 60.6718 11.6678 60.323 11.2846 59.9573C10.7542 59.4495 10.2547 58.9106 9.78849 58.3433L9.60075 58.1119L9.53963 58.0348L9.47851 57.9562L9.56874 58.0726C9.47414 57.9154 9.3417 57.7713 9.23401 57.6229C9.00989 57.3115 8.79741 56.9927 8.59075 56.6697L6.87781 57.9926C8.30215 59.233 9.89266 60.2685 11.6033 61.0692C13.3071 61.8651 15.1068 62.4369 16.9575 62.7704C20.668 63.4405 24.4864 63.1855 28.0749 62.0282C29.8732 61.4475 31.5881 60.6343 33.1759 59.6094C34.8619 58.5212 36.3753 57.1863 37.6656 55.6495C39.087 53.9296 40.2276 51.9959 41.0449 49.9198C41.8384 47.8878 42.3326 45.7514 42.5119 43.5774C42.7027 41.3357 42.5743 39.0782 42.1306 36.8726C41.6965 34.688 40.9428 32.5794 39.8937 30.6146C39.6444 30.1518 39.3785 29.6983 39.0962 29.2539C38.7906 28.7722 38.1124 28.535 37.603 28.8624C37.1213 29.1564 36.8841 29.8244 37.2115 30.3396Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M4.74707 54.0282C4.74707 54.0282 8.95447 60.0984 12.0514 62.0326L4.74707 54.0282Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M3.80547 54.5783C4.37014 55.3933 4.96974 56.1792 5.58099 56.9665C6.6785 58.4086 7.87217 59.7749 9.15385 61.0561C9.86768 61.7772 10.6555 62.4211 11.5042 62.9771C12.0258 63.2752 12.6901 63.1004 12.9974 62.5842C13.2884 62.062 13.1156 61.4033 12.6059 61.091C12.4473 60.992 12.293 60.8872 12.1417 60.7766C12.0674 60.7228 11.9961 60.6646 11.9205 60.6122C11.9088 60.6035 12.165 60.8028 12.0456 60.7082L11.9976 60.6704C11.9539 60.6369 11.9117 60.602 11.8695 60.5671C11.5377 60.2978 11.2204 60.0126 10.9105 59.7171C10.2439 59.0826 9.61665 58.4073 9.00977 57.7146C8.42764 57.051 7.86684 56.3718 7.3274 55.6771L7.13966 55.4384L7.05525 55.3293L7.16731 55.4748L7.1091 55.3991C6.99703 55.2536 6.88788 55.1081 6.77728 54.9625C6.59536 54.7224 6.41635 54.4808 6.23734 54.2349C6.05834 53.9889 5.8706 53.7299 5.69305 53.4737C5.54322 53.2337 5.31166 53.0559 5.04105 52.9731C4.75722 52.8974 4.45497 52.9366 4.19986 53.0822C3.73416 53.3835 3.46055 54.0748 3.80838 54.5754L3.80547 54.5783Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M33.6692 24.8966C33.7885 25.0014 41.237 29.6847 43.9454 38.7224L33.6692 24.8966Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M32.8963 25.6694C33.1786 25.9066 33.5003 26.106 33.7957 26.3185L34.1275 26.5674L34.2148 26.6343L34.1028 26.5484L34.3124 26.7129C34.6282 26.9647 34.9396 27.2252 35.2438 27.4915C36.0291 28.1774 36.7758 28.9062 37.4806 29.6745C37.8954 30.1271 38.2971 30.5943 38.6813 31.0731C38.7293 31.1313 38.7759 31.191 38.8268 31.2507C38.8778 31.3103 39.048 31.5417 38.9112 31.3583C38.7744 31.175 38.9491 31.4093 38.9811 31.45C39.0379 31.5243 39.0946 31.5956 39.1499 31.6756C39.3551 31.9521 39.556 32.2316 39.7495 32.5153C40.6952 33.8962 41.5006 35.3681 42.1537 36.909L42.0446 36.6471C42.3693 37.4184 42.653 38.2063 42.8945 39.0076C43.059 39.5534 43.6673 39.9536 44.2378 39.7702C44.8083 39.5869 45.1765 39.012 44.9989 38.4269C43.9991 35.1073 42.2964 32.07 40.1134 29.3893C38.6812 27.6394 37.0483 26.0641 35.2481 24.6958C35.0095 24.5124 34.7664 24.3334 34.5205 24.1617C34.3939 24.0729 34.0009 23.7498 34.4433 24.1253C34.2347 23.9269 33.9599 23.8128 33.672 23.8051C33.3826 23.8075 33.1055 23.9223 32.8992 24.1253C32.5266 24.5313 32.435 25.275 32.8992 25.6694H32.8963Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M14.6187 35.7942C14.5969 35.8204 14.5911 35.8277 14.6027 35.816C14.6058 35.8114 14.6098 35.8075 14.6144 35.8044C14.6144 35.8146 14.5693 35.8335 14.6027 35.816C14.6362 35.7986 14.5518 35.8306 14.5867 35.816H14.6202C14.6071 35.816 14.5664 35.816 14.6027 35.816C14.6129 35.8168 14.6231 35.8168 14.6333 35.816C14.5969 35.816 14.5867 35.816 14.6042 35.816H14.6217C14.6318 35.816 14.6624 35.832 14.6289 35.816C14.5955 35.8 14.6289 35.816 14.6289 35.816C14.6404 35.8248 14.6525 35.8326 14.6653 35.8393C14.6348 35.8131 14.6478 35.8393 14.6653 35.8393L14.6901 35.8641C14.6973 35.8713 14.7104 35.8932 14.7192 35.8975C14.6959 35.8655 14.7032 35.8888 14.7192 35.8975C14.7424 35.9295 14.7497 35.9412 14.7643 35.9645C14.8256 36.0585 14.882 36.1556 14.9331 36.2555C14.9331 36.2555 14.9506 36.2992 14.952 36.3007C14.936 36.2585 14.9535 36.3021 14.952 36.3007C14.968 36.3429 14.9709 36.356 14.9782 36.3836C14.9884 36.4086 14.9938 36.4352 14.9942 36.4622C14.9942 36.4316 14.9942 36.4258 14.9942 36.4433C14.9949 36.451 14.9949 36.4588 14.9942 36.4666V36.4826C15.003 36.4496 15.003 36.4438 14.9942 36.4651L15.051 36.3691L15.1179 36.3327H15.1514C15.1432 36.332 15.1349 36.332 15.1267 36.3327H15.0714C15.0481 36.3327 15.115 36.3443 15.0932 36.3327C15.0862 36.3294 15.0789 36.3269 15.0714 36.3254C15.0495 36.3254 15.1106 36.3458 15.0917 36.3341C15.0728 36.3225 15.1339 36.3734 15.1063 36.3458C15.139 36.3767 15.1524 36.4229 15.1412 36.4666C15.1485 36.4375 15.1412 36.4666 15.1325 36.4811C15.1456 36.4564 15.1325 36.4811 15.1223 36.4942C15.1412 36.4724 15.1223 36.4942 15.1106 36.4942C15.1207 36.4884 15.1304 36.4821 15.1398 36.4753L15.198 36.4476C15.302 36.3869 15.3372 36.2534 15.2766 36.1493C15.2138 36.0479 15.0827 36.0134 14.9782 36.0707C14.8635 36.1147 14.7726 36.2051 14.7279 36.3196C14.6857 36.441 14.7194 36.5758 14.8138 36.663C14.9001 36.7335 15.0096 36.7693 15.1208 36.7635C15.184 36.7657 15.2466 36.7501 15.3013 36.7183C15.381 36.6655 15.4278 36.5753 15.425 36.4797C15.4113 36.272 15.3441 36.0715 15.23 35.8975C15.1466 35.7234 15.0235 35.5714 14.8705 35.4536C14.7811 35.3959 14.6754 35.3689 14.5693 35.3765C14.4355 35.3853 14.3131 35.455 14.2374 35.5657C14.1766 35.6694 14.2111 35.8028 14.3146 35.8641C14.4191 35.9226 14.5511 35.8886 14.6144 35.7869L14.6187 35.7942Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M15.0422 50.2138C15.4513 49.289 15.7597 48.3229 15.9619 47.3322C16.1907 46.3426 16.3617 45.3406 16.4742 44.3313C16.4742 44.0901 16.2787 43.8947 16.0376 43.8947C15.7984 43.8993 15.6057 44.0921 15.601 44.3313C15.5777 44.5466 15.5559 44.7169 15.5326 44.8756C15.5006 45.107 15.4628 45.3384 15.4235 45.5698C15.3361 46.082 15.2348 46.5919 15.1193 47.0993C15.0058 47.597 14.8792 48.0904 14.7293 48.5779C14.6609 48.8021 14.5837 49.0233 14.5081 49.243C14.4702 49.3401 14.4309 49.4405 14.3902 49.5443C14.3785 49.5719 14.38 49.5719 14.3902 49.5443C14.38 49.5719 14.3683 49.5981 14.3567 49.6243L14.2868 49.7699C14.1714 49.9788 14.2406 50.2416 14.444 50.3666C14.6518 50.488 14.9187 50.4184 15.0407 50.2108L15.0422 50.2138Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M20.8272 51.2252C21.2317 50.1454 21.4661 49.0102 21.8706 47.9303C21.9348 47.6981 21.7987 47.4577 21.5665 47.3933C21.3344 47.3342 21.0972 47.4692 21.0295 47.6989C20.6249 48.7773 20.3906 49.914 19.986 50.9938C19.9218 51.2261 20.0579 51.4665 20.2901 51.5309C20.5221 51.5891 20.7588 51.4544 20.8272 51.2252Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M4.94219 52.4681C5.43701 51.2456 6.50814 50.1221 7.66223 49.4293C8.21879 49.081 8.84361 48.8562 9.4945 48.7701C10.3025 48.6755 11.1204 48.7133 11.9162 48.8821C12.8279 49.0741 13.7092 49.3894 14.5358 49.8194C14.7447 49.9356 15.008 49.8662 15.1325 49.6622C15.2539 49.4544 15.1843 49.1875 14.9768 49.0655C13.3686 48.2403 11.5451 47.7164 9.72445 47.8736C8.92327 47.9347 8.14433 48.1659 7.43956 48.5518C6.73636 48.9422 6.09809 49.4396 5.54761 50.026C4.9288 50.6657 4.43519 51.4155 4.09227 52.2367C4.0035 52.4565 4.18832 52.717 4.39644 52.7737C4.62807 52.8329 4.86512 52.6987 4.93346 52.4696L4.94219 52.4681Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M20.721 51.2471C22.613 50.972 24.6941 50.7202 26.3808 51.8205C27.8857 52.8014 28.7472 54.507 29.1955 56.1996C29.4767 57.3604 29.6713 58.5406 29.7776 59.7303C29.7845 59.9685 29.976 60.16 30.2142 60.1669C30.4296 60.1669 30.677 59.966 30.6508 59.7303C30.4078 57.5633 30.124 55.3133 28.9932 53.401C28.5063 52.5653 27.8577 51.835 27.0852 51.2529C26.2464 50.6512 25.2633 50.2821 24.2357 50.1832C22.9841 50.0377 21.7223 50.2254 20.4853 50.4059C20.2509 50.4393 20.1229 50.7348 20.1796 50.9429C20.2492 51.171 20.4852 51.3047 20.7167 51.2471H20.721Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M64.112 98.9488C64.9213 94.9012 64.66 90.7124 63.3538 86.7967C62.7098 84.8634 61.7981 83.0298 60.6454 81.3494C59.4317 79.6003 57.9528 78.0512 56.2619 76.7578C52.7571 74.1079 48.4602 72.7192 44.0676 72.8167C41.9227 72.8671 39.7981 73.245 37.7674 73.9373C35.7371 74.6268 33.8111 75.592 32.0435 76.8058C30.274 78.0163 28.6723 79.4555 27.2802 81.086C25.8938 82.7024 24.7424 84.5064 23.8601 86.4445C21.9394 90.7088 21.4701 95.4853 22.5241 100.042C23.0361 102.287 23.9216 104.431 25.1437 106.383C26.3767 108.339 27.9442 110.063 29.7746 111.476C31.4981 112.801 33.4181 113.849 35.465 114.581C37.48 115.297 39.5876 115.72 41.723 115.835C43.8508 115.954 45.9848 115.776 48.0639 115.308C50.1442 114.843 52.1462 114.079 54.0075 113.039C55.961 111.951 57.7214 110.547 59.2177 108.884C60.9195 106.957 62.2516 104.732 63.1471 102.321C63.5591 101.225 63.8804 100.097 64.1076 98.9488C64.2197 98.39 63.949 97.7424 63.3465 97.6056C62.8036 97.4819 62.1225 97.77 62.0032 98.3682C61.8325 99.2294 61.6094 100.079 61.3352 100.914C61.1897 101.33 61.0441 101.743 60.8826 102.149C60.8506 102.228 60.705 102.567 60.8491 102.236L60.7239 102.528C60.6308 102.739 60.5348 102.947 60.4329 103.155C60.0532 103.939 59.6219 104.697 59.142 105.424C58.9033 105.785 58.6253 106.121 58.3881 106.482C58.5759 106.191 58.3794 106.492 58.3241 106.562C58.2688 106.632 58.1917 106.728 58.1233 106.809C57.9777 106.99 57.822 107.169 57.6648 107.343C57.1019 107.976 56.4965 108.569 55.8529 109.119C55.7161 109.235 55.5764 109.352 55.4367 109.465L55.2242 109.634C55.1951 109.657 55.0481 109.771 55.2067 109.649C55.3654 109.526 55.1776 109.67 55.1456 109.695C54.8448 109.922 54.5368 110.14 54.2215 110.35C53.6118 110.757 52.9802 111.131 52.3295 111.469C51.9958 111.643 51.6562 111.806 51.3108 111.96L51.0663 112.069C51.0168 112.089 50.9688 112.114 50.9208 112.131C50.9208 112.131 51.1915 112.019 51.0343 112.085C50.8524 112.159 50.6704 112.23 50.4885 112.303C48.9222 112.903 47.2915 113.319 45.6291 113.542L45.9202 113.504C43.9762 113.763 42.0064 113.763 40.0624 113.504L40.3535 113.543C38.7839 113.331 37.2432 112.943 35.7605 112.386C35.5945 112.323 35.4286 112.258 35.2642 112.191L35.1186 112.13C35.449 112.261 35.2554 112.188 35.1841 112.156L34.8931 112.028C34.5351 111.866 34.1829 111.696 33.835 111.514C33.137 111.149 32.4619 110.742 31.8136 110.295C31.6506 110.183 31.489 110.066 31.3289 109.95L31.1135 109.787C31.0844 109.765 30.936 109.651 31.0946 109.774C31.2533 109.896 31.0655 109.75 31.035 109.726C30.7206 109.477 30.4164 109.219 30.1195 108.951C29.4896 108.383 28.8997 107.771 28.3542 107.121C28.2087 106.956 28.0806 106.787 27.9467 106.618C27.8128 106.45 28.0792 106.793 27.9918 106.677L27.9031 106.56C27.8332 106.466 27.7575 106.373 27.6949 106.276C27.4388 105.921 27.1962 105.558 26.9673 105.186C26.5131 104.454 26.1091 103.692 25.7579 102.904C25.7099 102.798 25.6662 102.691 25.6123 102.586C25.7695 102.932 25.6007 102.557 25.5672 102.472C25.4814 102.257 25.3984 102.036 25.3198 101.823C25.1559 101.371 25.0103 100.912 24.8832 100.446C24.6232 99.5186 24.4286 98.5737 24.3011 97.6187L24.3404 97.9097C24.1032 96.11 24.1032 94.2869 24.3404 92.4871L24.3025 92.7782C24.4309 91.8197 24.6284 90.8717 24.8934 89.9417C25.0244 89.4804 25.1743 89.0249 25.3387 88.5737C25.4159 88.3656 25.4945 88.1589 25.5789 87.9537C25.5978 87.9042 25.6182 87.8548 25.6385 87.8082C25.6487 87.7834 25.6604 87.7602 25.6691 87.7354C25.6778 87.7107 25.5643 87.9799 25.6109 87.881C25.6575 87.782 25.7026 87.6685 25.7491 87.5637C26.1135 86.752 26.5286 85.9641 26.992 85.2046C27.2229 84.8233 27.4655 84.4497 27.7197 84.084C27.8478 83.902 27.9787 83.7201 28.1112 83.5411L28.3047 83.2835L28.216 83.3985C28.234 83.3784 28.2506 83.357 28.2654 83.3345C28.3047 83.2864 28.344 83.237 28.3819 83.1889C29.5075 81.7766 30.7939 80.5004 32.2152 79.3861C32.2378 79.3713 32.2592 79.3547 32.2793 79.3366C32.2924 79.3221 32.0741 79.4938 32.1658 79.424L32.2938 79.3264C32.387 79.2551 32.4816 79.1809 32.5747 79.1169C32.7566 78.983 32.94 78.8535 33.1248 78.7254C33.4945 78.4712 33.8714 78.2286 34.2556 77.9977C35.0231 77.5318 35.8177 77.1119 36.6351 76.7403C36.7341 76.6952 36.8316 76.6515 36.9262 76.6093L37.0717 76.5453C37.178 76.4987 36.9145 76.6093 36.9349 76.602C36.9553 76.5948 37.0004 76.5744 37.0339 76.5613C37.2405 76.4754 37.4487 76.3925 37.6582 76.3139C38.0774 76.1548 38.5009 76.0092 38.9287 75.8773C39.7846 75.6132 40.6567 75.4051 41.5396 75.2544C41.7608 75.218 41.9762 75.1845 42.2047 75.154L41.9136 75.1933C43.5809 74.9682 45.2706 74.9643 46.9389 75.1816L46.6479 75.1423C47.5191 75.2594 48.3809 75.4384 49.2267 75.6779C49.6546 75.8002 50.0776 75.937 50.4958 76.0883C50.6879 76.1582 50.88 76.2338 51.0707 76.3081C51.1551 76.3415 51.5262 76.5045 51.1667 76.3459C51.2846 76.3968 51.4025 76.4463 51.5189 76.5002C52.2891 76.8456 53.0346 77.2439 53.7499 77.6921C54.092 77.9075 54.4281 78.1287 54.7556 78.3703C54.84 78.4329 54.9244 78.494 55.0074 78.558L55.1325 78.6526C55.2897 78.7705 54.9477 78.5071 55.0568 78.593C55.2266 78.7268 55.395 78.8632 55.5618 79.0019C56.1796 79.5224 56.763 80.0824 57.3083 80.6785C57.5746 80.9695 57.8307 81.2606 58.0767 81.572C58.1422 81.6521 58.2048 81.7321 58.2688 81.8122C58.3939 81.9723 58.1 81.5924 58.2222 81.754L58.3154 81.8762C58.4391 82.0392 58.5584 82.2037 58.6763 82.371C59.1365 83.0245 59.5574 83.7049 59.9366 84.4085C60.1258 84.7607 60.3063 85.1187 60.4751 85.4811C60.558 85.6586 60.6381 85.8362 60.7152 86.0167L60.7763 86.1622C60.6439 85.858 60.6978 85.9759 60.7254 86.0429L60.8608 86.3747C61.5248 88.0595 61.9818 89.8188 62.2215 91.6139L62.1822 91.3228C62.4456 93.3114 62.4456 95.326 62.1822 97.3145L62.2215 97.0234C62.1584 97.4804 62.0828 97.9359 61.9945 98.39C61.8839 98.9488 62.1531 99.595 62.7571 99.7333C63.3116 99.8337 63.9941 99.547 64.112 98.9488Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M60.1288 82.5427C63.1268 87.2362 64.1499 93.1667 63.0598 98.6577C62.2739 102.637 60.382 106.386 57.3258 109.269C49.8541 116.317 37.3789 116.691 29.6292 109.961C30.394 111.178 31.2986 112.302 32.3244 113.309C39.9854 120.821 53.1097 120.693 60.8492 113.384C63.9054 110.503 65.7973 106.754 66.589 102.775C68.0313 95.5011 65.774 87.4632 60.1288 82.5427V82.5427Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M59.1871 83.0929C59.5073 83.5974 59.8061 84.115 60.0836 84.6457C60.2262 84.9213 60.363 85.1992 60.494 85.4796C60.5551 85.6106 60.6148 85.7416 60.673 85.874C60.7021 85.9395 60.7298 86.0065 60.7589 86.0734C60.8069 86.1826 60.705 85.9424 60.7094 85.9541C60.7298 86.0021 60.7501 86.0501 60.7691 86.0996C61.2284 87.2197 61.5945 88.3757 61.8635 89.5561C62.0168 90.2236 62.1385 90.8969 62.2288 91.5761L62.1895 91.285C62.4558 93.2836 62.4558 95.3086 62.1895 97.3072L62.2288 97.0161C61.9799 98.8493 61.4997 100.643 60.7996 102.356C60.7327 102.519 60.836 102.27 60.8404 102.26C60.8185 102.315 60.7923 102.369 60.7691 102.424C60.721 102.533 60.673 102.642 60.6235 102.752C60.5313 102.946 60.4368 103.143 60.3397 103.344C60.136 103.754 59.9177 104.158 59.6848 104.553C59.452 104.949 59.2046 105.337 58.9426 105.718C58.8174 105.9 58.6894 106.08 58.5584 106.256L58.4492 106.402C58.4303 106.426 58.3037 106.589 58.4245 106.435C58.5453 106.281 58.4172 106.435 58.3983 106.469L58.2528 106.658C57.6762 107.369 57.0482 108.038 56.3739 108.657C56.0828 108.925 55.783 109.184 55.4774 109.433L55.23 109.63C55.2009 109.653 55.0568 109.765 55.2169 109.641C55.377 109.518 55.2329 109.628 55.2024 109.651C55.0345 109.778 54.8657 109.901 54.6959 110.023C54.0431 110.486 53.3627 110.909 52.6584 111.29C52.315 111.476 51.9671 111.653 51.6149 111.818C51.4432 111.898 51.27 111.977 51.0954 112.054C51.011 112.091 50.6777 112.224 51.0459 112.076L50.7548 112.194C49.0997 112.854 47.3692 113.306 45.6029 113.542L45.894 113.502C43.9754 113.756 42.0319 113.756 40.1134 113.502L40.4044 113.542C38.9156 113.344 37.4521 112.988 36.0384 112.481C35.8754 112.422 35.7139 112.361 35.5538 112.299L35.3137 112.203L35.1681 112.144L35.0721 112.104L35.238 112.174C34.8838 112.036 34.5383 111.877 34.2032 111.698C33.5353 111.367 32.8871 110.997 32.2618 110.592C31.9115 110.365 31.5681 110.125 31.2314 109.874L31.1063 109.78L31.0218 109.715L31.1601 109.822C31.0742 109.762 30.9942 109.692 30.9127 109.627C30.7351 109.483 30.5595 109.338 30.3859 109.19C29.9711 108.832 29.4035 108.753 28.9538 109.106C28.5193 109.437 28.399 110.04 28.6729 110.513C30.0978 112.761 31.956 114.703 34.1392 116.225C35.974 117.496 38.0016 118.462 40.1439 119.088C42.2822 119.714 44.5013 120.021 46.7294 119.999C48.961 119.982 51.1782 119.639 53.3104 118.98C55.4381 118.325 57.4511 117.343 59.2773 116.069C61.3681 114.601 63.1649 112.754 64.5748 110.624C65.9955 108.446 67.0047 106.026 67.5524 103.484C68.0774 101.096 68.2247 98.6405 67.989 96.207C67.7473 93.713 67.1148 91.2727 66.1145 88.9754C65.1511 86.7636 63.8091 84.7369 62.1487 82.9866C61.75 82.5675 61.3318 82.1668 60.8942 81.7845C60.6859 81.5858 60.4107 81.4721 60.1229 81.4658C59.8342 81.468 59.5576 81.5823 59.3515 81.7845C58.9732 82.1964 58.8917 82.927 59.3515 83.3286C60.0766 83.9571 60.7524 84.6402 61.373 85.3719C61.5287 85.5553 61.6786 85.7431 61.8285 85.9323C61.894 86.0167 61.7427 85.8144 61.7427 85.8216C61.7427 85.8289 61.7849 85.8769 61.7922 85.8886L61.8926 86.021C61.9653 86.1171 62.0381 86.2146 62.1065 86.3121C62.3869 86.7002 62.6528 87.0999 62.904 87.5113C63.4021 88.3228 63.8431 89.168 64.224 90.0407C64.2473 90.0916 64.2677 90.1426 64.291 90.1935C64.2745 90.1484 64.2555 90.1042 64.2342 90.0611C64.2342 90.0873 64.2561 90.112 64.2662 90.1382C64.3172 90.2575 64.3652 90.3769 64.4118 90.4977C64.4962 90.7131 64.5777 90.9294 64.6563 91.1467C64.8183 91.6008 64.9638 92.0597 65.0929 92.5235C65.3872 93.5597 65.6076 94.6156 65.7521 95.683L65.7129 95.392C65.9794 97.3855 65.9819 99.4055 65.7201 101.4L65.7594 101.109C65.5205 102.911 65.054 104.676 64.371 106.361C64.3492 106.416 64.3245 106.472 64.3026 106.527C64.4263 106.211 64.3492 106.418 64.3201 106.486C64.291 106.554 64.24 106.668 64.1993 106.758C64.1003 106.977 63.9985 107.195 63.8937 107.407C63.6899 107.818 63.4726 108.221 63.2417 108.618C63.0108 109.015 62.759 109.412 62.4864 109.809C62.3568 109.999 62.2215 110.187 62.0847 110.373C62.025 110.453 61.961 110.532 61.9028 110.613C62.0949 110.346 61.9697 110.528 61.9246 110.584C61.8795 110.641 61.8242 110.711 61.7791 110.774C61.1996 111.491 60.5671 112.164 59.8871 112.788C59.596 113.056 59.2953 113.316 58.9848 113.566L58.7432 113.76L58.6617 113.822C58.9397 113.603 58.7811 113.731 58.7185 113.777C58.5555 113.901 58.3896 114.023 58.2207 114.143C57.5732 114.602 56.8987 115.023 56.2007 115.401C55.8485 115.596 55.4915 115.776 55.1296 115.943C54.9593 116.023 54.789 116.1 54.6173 116.174C54.5358 116.211 54.236 116.331 54.5969 116.184C54.4878 116.23 54.3772 116.276 54.2666 116.32C52.6234 116.972 50.9064 117.421 49.154 117.656L49.445 117.617C47.5088 117.875 45.5468 117.875 43.6106 117.617L43.9016 117.656C42.8776 117.517 41.865 117.304 40.8716 117.02C40.3865 116.878 39.9038 116.72 39.4235 116.544C39.1849 116.455 38.9476 116.363 38.7133 116.266C38.6828 116.253 38.6493 116.241 38.6187 116.227L38.7395 116.278L38.5765 116.206C38.4514 116.152 38.3277 116.096 38.2054 116.039C37.2702 115.605 36.3709 115.098 35.5159 114.522C35.302 114.377 35.0924 114.231 34.8843 114.086C34.781 114.01 34.6777 113.932 34.5758 113.854C34.4739 113.777 34.7111 113.961 34.6951 113.946C34.6791 113.932 34.6398 113.902 34.6136 113.882C34.5583 113.84 34.5045 113.796 34.4506 113.753C34.0393 113.421 33.6419 113.072 33.2587 112.706C32.728 112.199 32.2284 111.661 31.7626 111.094L31.5763 110.862L31.5138 110.784L31.4526 110.707L31.5429 110.823C31.4483 110.666 31.3158 110.522 31.2081 110.372C30.985 110.06 30.771 109.743 30.5663 109.419L28.8519 110.741C30.2761 111.982 31.8667 113.018 33.5774 113.818C35.2814 114.615 37.0817 115.187 38.9331 115.519C42.6437 116.186 46.4615 115.929 50.049 114.77C51.8448 114.189 53.5572 113.375 55.1427 112.351C56.829 111.263 58.3424 109.927 59.6324 108.39C61.0539 106.67 62.1944 104.737 63.0117 102.661C63.8054 100.629 64.2996 98.4921 64.4787 96.3176C64.6702 94.0759 64.5418 91.8183 64.0974 89.6128C63.6635 87.4282 62.9098 85.3195 61.8606 83.3548C61.6132 82.8911 61.3478 82.437 61.0645 81.9926C60.7574 81.5124 60.0792 81.2737 59.5713 81.6012C59.0969 81.9097 58.8582 82.5777 59.1871 83.0929Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M26.7228 106.781C26.7228 106.781 30.9302 112.852 34.0257 114.786L26.7228 106.781Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M25.7797 107.333C26.3444 108.148 26.944 108.934 27.5567 109.72C28.6534 111.163 29.8471 112.529 31.1296 113.809C31.843 114.531 32.6309 115.175 33.4799 115.73C34.0012 116.029 34.6653 115.855 34.9731 115.339C35.2641 114.817 35.0914 114.158 34.5816 113.846C34.423 113.745 34.2687 113.641 34.1174 113.531C34.0432 113.478 33.9718 113.419 33.8962 113.365C33.8845 113.358 34.1407 113.558 34.0213 113.463L33.9733 113.425L33.8452 113.322C33.5149 113.051 33.1961 112.766 32.8862 112.472C32.2196 111.836 31.5924 111.162 30.9869 110.468C30.4048 109.804 29.8474 109.123 29.3031 108.43C29.2405 108.352 29.1779 108.272 29.1168 108.192L29.0324 108.083C29.0077 108.052 29.21 108.314 29.143 108.228L29.0848 108.152C28.9742 108.007 28.8636 107.861 28.7544 107.716C28.573 107.474 28.393 107.232 28.2145 106.988C28.0297 106.736 27.8463 106.485 27.6688 106.228C27.5198 105.987 27.288 105.809 27.0168 105.726C26.7327 105.651 26.4305 105.691 26.1756 105.837C25.7099 106.137 25.4363 106.828 25.7841 107.33L25.7797 107.333Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M55.6434 77.6586C55.7642 77.7634 63.2112 82.4467 65.9211 91.4844L55.6434 77.6586Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M54.872 78.4227C55.1529 78.6613 55.4745 78.8593 55.7714 79.0732L56.1032 79.3221L56.1905 79.389C55.8412 79.1227 55.9984 79.2435 56.077 79.3017L56.2866 79.4661C56.6038 79.7194 56.9138 79.9784 57.2195 80.2462C58.0043 80.9321 58.7506 81.6609 59.4549 82.4292C59.8711 82.8813 60.2713 83.347 60.6555 83.8263L60.8011 84.0039C60.8345 84.0461 61.0223 84.295 60.8855 84.1116C60.7487 83.9282 60.9248 84.1625 60.9553 84.2033C61.0121 84.279 61.0688 84.3488 61.1241 84.4289C61.3293 84.7054 61.5302 84.9862 61.7237 85.27C62.6717 86.6495 63.4782 88.121 64.1309 89.6623L64.0217 89.4018C64.3451 90.173 64.6283 90.9604 64.8702 91.7609C65.0346 92.3066 65.643 92.7083 66.2135 92.5235C66.784 92.3386 67.1522 91.7667 66.9761 91.1802C65.9748 87.862 64.272 84.8233 62.089 82.1425C60.6567 80.3934 59.0243 78.8182 57.2253 77.449C56.9851 77.2671 56.7421 77.0881 56.4976 76.9149C56.3695 76.8261 55.9766 76.5031 56.419 76.8785C56.2101 76.6806 55.9353 76.5671 55.6477 76.5598C55.3588 76.5613 55.082 76.6756 54.8764 76.8785C54.5038 77.2846 54.4106 78.0283 54.8764 78.4227H54.872Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M117.36 81.8544C118.17 77.8072 117.908 73.6188 116.602 69.7037C115.958 67.7699 115.046 65.9358 113.893 64.2549C112.68 62.5063 111.201 60.9577 109.51 59.6648C106.005 57.0144 101.708 55.6251 97.3156 55.7222C95.1706 55.7747 93.0461 56.1541 91.0155 56.8472C88.9852 57.5367 87.0592 58.5019 85.2916 59.7157C83.5211 60.9249 81.9193 62.3643 80.5283 63.9959C79.1419 65.6118 77.9906 67.4153 77.1082 69.353C75.1876 73.6178 74.7183 78.3947 75.7722 82.9517C76.2842 85.1967 77.1697 87.3396 78.3918 89.2912C79.6226 91.2512 81.1892 92.979 83.0198 94.3951C84.7433 95.7204 86.6632 96.7683 88.7102 97.5008C90.7252 98.2168 92.8328 98.6388 94.9682 98.7538C97.096 98.8722 99.23 98.6949 101.309 98.227C103.387 97.7602 105.386 96.9939 107.244 95.9523C109.2 94.8625 110.962 93.456 112.458 91.79C114.164 89.8629 115.5 87.6378 116.4 85.2264C116.812 84.1301 117.133 83.0018 117.36 81.8529C117.472 81.2955 117.201 80.6479 116.599 80.5111C116.056 80.3874 115.375 80.6741 115.256 81.2722C115.085 82.1337 114.862 82.9838 114.586 83.8176C114.449 84.2353 114.295 84.6472 114.135 85.0547C114.103 85.1333 113.957 85.4724 114.102 85.142L113.976 85.4331C113.883 85.6426 113.787 85.8522 113.685 86.0589C113.306 86.8433 112.874 87.6018 112.394 88.3292C112.156 88.6901 111.878 89.0263 111.641 89.3872C111.828 89.0962 111.632 89.396 111.577 89.4673C111.521 89.5386 111.444 89.6317 111.376 89.7147C111.23 89.8951 111.074 90.0727 110.917 90.2473C110.355 90.88 109.749 91.4732 109.105 92.0229C108.969 92.1407 108.829 92.2557 108.689 92.3707L108.477 92.5395C108.448 92.5613 108.301 92.6763 108.459 92.5526C108.618 92.4289 108.43 92.5744 108.398 92.5992C108.097 92.8262 107.788 93.046 107.474 93.2555C106.864 93.6625 106.232 94.0361 105.582 94.3747C105.25 94.5464 104.913 94.7109 104.571 94.8651L104.326 94.9728C104.277 94.9947 104.229 95.018 104.181 95.0369C104.181 95.0369 104.451 94.9248 104.294 94.9888C104.112 95.0645 103.93 95.1344 103.747 95.2086C102.181 95.808 100.551 96.2236 98.8889 96.4471L99.1799 96.4078C97.2365 96.6676 95.2671 96.6676 93.3236 96.4078L93.6147 96.4456C92.0447 96.2319 90.5039 95.8413 89.0217 95.2814C88.8557 95.2188 88.6898 95.1548 88.5254 95.0864L88.3798 95.0252C88.7102 95.1577 88.5166 95.0834 88.4439 95.0529L88.1528 94.9234C87.7948 94.7633 87.4421 94.592 87.0948 94.4096C86.3961 94.0457 85.721 93.6384 85.0733 93.19C84.9103 93.0785 84.7488 92.9635 84.5887 92.8451L84.3733 92.6836L84.3544 92.669C84.5203 92.7971 84.3253 92.6457 84.2932 92.621C83.9803 92.3736 83.6762 92.1145 83.3793 91.8468C82.7454 91.283 82.1516 90.6756 81.6023 90.029C81.4568 89.8631 81.3287 89.6958 81.1948 89.5255C81.0609 89.3552 81.3273 89.7001 81.2399 89.5837L81.1512 89.4673C81.0813 89.3741 81.0056 89.2795 80.943 89.1849C80.6869 88.8298 80.4443 88.466 80.2154 88.0934C79.7593 87.3603 79.3538 86.5969 79.0016 85.8085C78.9536 85.7038 78.9099 85.5961 78.8561 85.4898C79.0133 85.8362 78.8444 85.4607 78.811 85.3763C78.7256 85.1619 78.6431 84.9455 78.5636 84.7272C78.3991 84.2746 78.2521 83.8147 78.127 83.3519C77.867 82.4236 77.6725 81.4782 77.5448 80.5227L77.5841 80.8138C77.3462 79.0141 77.3462 77.1909 77.5841 75.3912L77.5463 75.6823C77.6743 74.7223 77.8718 73.7729 78.1371 72.8414C78.2681 72.3801 78.418 71.9231 78.5825 71.472C78.6582 71.2634 78.7382 71.0567 78.8226 70.852C78.8415 70.8025 78.8619 70.753 78.8823 70.7064C78.8925 70.6817 78.9041 70.657 78.9128 70.6322C78.9216 70.6075 78.8081 70.8767 78.8546 70.7705C78.9012 70.6642 78.9463 70.558 79.0002 70.4532C79.3645 69.6415 79.7796 68.8536 80.243 68.0941C80.4749 67.7147 80.7175 67.3417 80.9707 66.9749C81.0988 66.7916 81.2297 66.6111 81.3622 66.4306L81.5557 66.1745C81.6256 66.0828 81.4539 66.304 81.467 66.2895C81.4801 66.2749 81.5004 66.2458 81.5164 66.2254L81.6329 66.0799C82.7581 64.6672 84.0446 63.391 85.4662 62.2771C85.4891 62.2627 85.5106 62.2461 85.5303 62.2276C85.5434 62.2145 85.3251 62.3863 85.4168 62.3164L85.5448 62.2174L85.8257 62.0079C86.0076 61.8754 86.191 61.7444 86.3758 61.6178C86.7455 61.3617 87.1224 61.1191 87.5066 60.8902C88.2741 60.4237 89.0687 60.0034 89.8861 59.6313L90.1772 59.5003L90.3227 59.4363L90.1859 59.4945L90.2849 59.4523C90.4915 59.3664 90.6997 59.2849 90.9092 59.2049C91.3284 59.0458 91.7519 58.9002 92.1797 58.7683C93.0354 58.504 93.9076 58.2964 94.7906 58.1468C95.0118 58.109 95.2272 58.0755 95.4543 58.045L95.1632 58.0843C96.8305 57.8592 98.5202 57.8553 100.188 58.0726L99.8974 58.0348C100.769 58.1512 101.631 58.3301 102.476 58.5703C102.904 58.6916 103.327 58.8279 103.745 58.9793C103.937 59.0506 104.13 59.1248 104.319 59.199C104.405 59.234 104.776 59.3955 104.416 59.2369L104.768 59.3912C105.538 59.7377 106.284 60.1364 107 60.5845C107.342 60.7985 107.676 61.0211 108.005 61.2627L108.257 61.449L108.382 61.5436C108.539 61.6629 108.197 61.3981 108.306 61.4854C108.477 61.6193 108.645 61.7546 108.811 61.8943C109.43 62.4141 110.013 62.9742 110.558 63.5709C110.823 63.862 111.08 64.153 111.326 64.4645C111.392 64.5431 111.454 64.6246 111.518 64.7046C111.644 64.8632 111.35 64.4834 111.472 64.6449L111.565 64.7672C111.687 64.9302 111.808 65.0961 111.926 65.2635C112.386 65.9171 112.807 66.5975 113.186 67.3009C113.375 67.6517 113.556 68.0097 113.725 68.3721C113.808 68.5496 113.888 68.7286 113.965 68.9076L114.026 69.0532C113.892 68.7476 113.947 68.8654 113.975 68.9338L114.11 69.2657C114.775 70.9504 115.232 72.7097 115.471 74.5049L115.432 74.2138C115.695 76.2028 115.695 78.2179 115.432 80.2069L115.471 79.9159C115.408 80.3738 115.332 80.8293 115.244 81.2824C115.133 81.8413 115.403 82.4874 116.007 82.6257C116.558 82.7407 117.242 82.4613 117.36 81.8544Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M113.377 65.4483C116.375 70.1418 117.398 76.0723 116.308 81.5648C115.519 85.5437 113.623 89.2926 110.568 92.1742C103.096 99.2239 90.621 99.5965 82.8713 92.867C83.6362 94.084 84.5408 95.2074 85.5666 96.2143C93.2276 103.727 106.352 103.599 114.091 96.2914C117.148 93.4084 119.04 89.6594 119.831 85.6805C121.279 78.4067 119.022 70.3688 113.377 65.4483Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M112.434 65.9998C112.756 66.5053 113.055 67.0229 113.332 67.5527C113.477 67.8277 113.611 68.1043 113.742 68.3851C113.803 68.5161 113.863 68.6486 113.921 68.7795C113.95 68.8465 113.978 68.9134 114.007 68.9789C114.055 69.0881 113.953 68.8494 113.958 68.861C113.978 68.9076 113.997 68.9556 114.017 69.0066C114.477 70.127 114.843 71.2836 115.112 72.4645C115.265 73.131 115.387 73.8039 115.477 74.483L115.438 74.192C115.704 76.191 115.704 78.2166 115.438 80.2156L115.477 79.9246C115.228 81.7577 114.748 83.5519 114.048 85.2642C113.981 85.4287 114.084 85.1798 114.089 85.1682C114.065 85.2235 114.04 85.2788 114.017 85.3326C113.969 85.4432 113.921 85.5509 113.872 85.6601C113.78 85.8599 113.686 86.0574 113.588 86.2524C113.384 86.6628 113.166 87.0674 112.933 87.4618C112.7 87.8562 112.453 88.2477 112.191 88.6261C112.066 88.8085 111.937 88.9884 111.805 89.166L111.697 89.3115C111.678 89.3377 111.552 89.4993 111.673 89.345C111.793 89.1907 111.665 89.3537 111.646 89.3785L111.501 89.5677C110.926 90.2794 110.299 90.9478 109.625 91.5673C109.334 91.8351 109.035 92.0937 108.727 92.343C108.646 92.4099 108.564 92.4754 108.481 92.5395C108.452 92.5628 108.308 92.6748 108.468 92.5511C108.628 92.4274 108.484 92.5395 108.453 92.5613C108.286 92.6879 108.117 92.8131 107.947 92.9339C107.294 93.3969 106.614 93.8198 105.909 94.2C105.566 94.3863 105.218 94.5624 104.866 94.7283C104.694 94.8098 104.521 94.8884 104.346 94.9641C104.262 95.0005 103.929 95.1343 104.297 94.9874L104.006 95.1052C102.351 95.7647 100.62 96.2168 98.854 96.4514L99.1451 96.4121C97.2261 96.6661 95.282 96.6661 93.363 96.4121L93.654 96.4514C92.165 96.2548 90.7013 95.8991 89.288 95.3905C89.125 95.3323 88.9635 95.2711 88.8034 95.2086L88.5633 95.114L88.4177 95.0543L88.3217 95.015L88.4876 95.0849C88.1334 94.9466 87.7879 94.7872 87.4528 94.6075C86.7849 94.277 86.1367 93.9082 85.5114 93.5029C85.1602 93.2739 84.8167 93.0348 84.481 92.7854L84.3559 92.6894L84.2715 92.6268L84.4097 92.733C84.3238 92.6719 84.2438 92.602 84.1623 92.5366C83.9847 92.391 83.8087 92.2455 83.6355 92.1C83.2207 91.7405 82.6531 91.6634 82.2034 92.0141C81.7688 92.3461 81.6479 92.949 81.9211 93.4229C83.3449 95.6669 85.1999 97.606 87.3786 99.1278C89.2141 100.398 91.2421 101.365 93.3848 101.99C95.5228 102.618 97.7421 102.926 99.9702 102.903C102.202 102.885 104.419 102.542 106.551 101.884C108.679 101.229 110.692 100.248 112.518 98.9735C114.609 97.5054 116.406 95.6582 117.816 93.5276C119.237 91.3499 120.246 88.9299 120.793 86.3877C121.318 83.9999 121.466 81.5445 121.23 79.111C120.988 76.6171 120.356 74.1767 119.355 71.8794C118.392 69.6676 117.05 67.641 115.39 65.8907C114.991 65.4715 114.573 65.0713 114.135 64.69C113.927 64.4909 113.652 64.3767 113.364 64.3699C113.075 64.3718 112.798 64.4867 112.592 64.69C112.214 65.1019 112.133 65.8325 112.592 66.2341C113.316 66.8656 113.99 67.5516 114.608 68.2862C114.764 68.471 114.914 68.6587 115.062 68.8479C115.129 68.9309 114.978 68.7286 114.978 68.7359C114.978 68.7432 115.02 68.7926 115.027 68.8028L115.128 68.9353C115.2 69.0313 115.273 69.1288 115.342 69.2263C115.622 69.6144 115.888 70.0146 116.139 70.427C116.637 71.2384 117.078 72.0836 117.459 72.9564C117.482 73.0073 117.503 73.0582 117.526 73.1019C117.573 73.2081 117.465 72.9564 117.469 72.968C117.478 72.9943 117.489 73.0201 117.501 73.0452C117.552 73.1645 117.6 73.2853 117.647 73.4046C117.731 73.62 117.813 73.8369 117.891 74.0552C118.053 74.5078 118.2 74.9677 118.328 75.4305C118.622 76.4671 118.843 77.5235 118.987 78.5915L118.948 78.3004C119.211 80.2943 119.211 82.3142 118.948 84.308L118.987 84.017C118.748 85.8199 118.282 87.5852 117.599 89.2708C117.577 89.3261 117.552 89.3799 117.53 89.4352C117.654 89.1194 117.577 89.3261 117.548 89.3945L117.427 89.6681C117.328 89.8849 117.226 90.1047 117.121 90.3157C116.918 90.7261 116.7 91.1297 116.469 91.5266C116.239 91.9234 115.987 92.3207 115.714 92.7185C115.583 92.9125 115.449 93.1003 115.312 93.2817C115.253 93.3632 115.189 93.4418 115.131 93.5233C115.323 93.254 115.197 93.436 115.152 93.4927C115.107 93.5495 115.052 93.6193 115.007 93.6834C114.427 94.4004 113.794 95.0736 113.115 95.6976C112.824 95.9653 112.521 96.2259 112.213 96.4747L111.971 96.6683L111.889 96.7323C112.167 96.5126 112.009 96.6392 111.946 96.6857C111.783 96.8109 111.617 96.9331 111.449 97.051C110.801 97.5111 110.126 97.9315 109.427 98.3099C109.077 98.504 108.72 98.6844 108.357 98.8513C108.187 98.9313 108.017 99.0085 107.845 99.0827C107.764 99.1191 107.464 99.2399 107.825 99.0943L107.494 99.2282C105.851 99.8809 104.134 100.33 102.382 100.564L102.673 100.525C100.737 100.783 98.7746 100.783 96.8383 100.525L97.1294 100.564C96.1116 100.424 95.1053 100.211 94.1183 99.9253C93.6332 99.7856 93.151 99.627 92.6717 99.4494C92.433 99.3621 92.1963 99.2695 91.9615 99.1715C91.9309 99.1598 91.8974 99.1482 91.8669 99.1336C91.8669 99.1336 92.1405 99.2501 91.9877 99.1831L91.8247 99.1118C91.6995 99.0579 91.5758 99.0026 91.4536 98.9444C90.517 98.5117 89.6167 98.0046 88.7612 97.428C88.5472 97.2824 88.3377 97.1369 88.1296 96.9841C88.0262 96.907 87.9229 96.8298 87.821 96.7512C87.7192 96.6726 87.9564 96.8575 87.9404 96.8429L87.8589 96.7789L87.6959 96.6508C87.2835 96.319 86.8862 95.9702 86.5039 95.6044C85.9736 95.0967 85.474 94.5577 85.0079 93.9904C84.9453 93.9148 84.8827 93.8376 84.8216 93.759L84.759 93.6819L84.6979 93.6033L84.7881 93.7198C84.6935 93.5626 84.5611 93.4185 84.4534 93.2701C84.2312 92.9586 84.0173 92.6404 83.8116 92.3153L82.0972 93.6383C83.5208 94.8796 85.1114 95.9153 86.8227 96.7148C88.5266 97.5121 90.3269 98.0845 92.1783 98.4176C95.8884 99.0856 99.7059 98.8307 103.294 97.6754C105.09 97.094 106.802 96.2809 108.388 95.2566C110.074 94.1678 111.587 92.8331 112.878 91.2966C114.303 89.5775 115.447 87.6437 116.267 85.5669C117.061 83.535 117.555 81.3986 117.734 79.2245C117.925 76.9828 117.797 74.7254 117.353 72.5198C116.919 70.3352 116.165 68.2265 115.116 66.2618C114.869 65.798 114.603 65.3444 114.32 64.9011C114.013 64.4193 113.335 64.1734 112.827 64.5096C112.345 64.8166 112.106 65.4846 112.434 65.9998Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M79.9709 89.6885C79.9709 89.6885 84.1783 95.7587 87.2739 97.6929L79.9709 89.6885Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M79.0278 90.2386C79.5925 91.0536 80.1921 91.8395 80.8048 92.6254C81.9002 94.0706 83.0924 95.4399 84.3733 96.7236C85.0872 97.4422 85.875 98.0832 86.7237 98.6359C87.2448 98.9351 87.9096 98.7608 88.2169 98.2445C88.5078 97.7223 88.3351 97.0635 87.8254 96.7513C87.6668 96.6523 87.5125 96.5475 87.3611 96.4369C87.2869 96.3831 87.2156 96.3249 87.1399 96.2725C87.1283 96.2637 87.3844 96.4631 87.2651 96.3685L87.2171 96.3307L87.089 96.2273C86.7586 95.9581 86.4399 95.6714 86.1299 95.3774C85.4634 94.7429 84.8361 94.0676 84.238 93.3749C83.6558 92.7112 83.0984 92.0301 82.5541 91.3374L82.3577 91.0987L82.2733 90.9896C82.2485 90.959 82.4508 91.221 82.3839 91.1351C82.3649 91.1089 82.3446 91.0842 82.3256 91.0594C82.215 90.9139 82.1044 90.7684 81.9953 90.6228C81.8139 90.3822 81.6339 90.1396 81.4554 89.8952C81.2705 89.6448 81.0872 89.3916 80.9096 89.1355C80.7604 88.8949 80.5286 88.7169 80.2576 88.6348C79.9738 88.5585 79.6713 88.5977 79.4164 88.744C78.9507 89.0438 78.6771 89.7365 79.0249 90.2372L79.0278 90.2386Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M108.891 60.5569C109.012 60.6617 116.459 65.345 119.169 74.3826L108.891 60.5569Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M108.117 61.3282C108.398 61.5669 108.72 61.7648 109.017 61.9788L109.348 62.2276L109.436 62.2946C109.086 62.0282 109.244 62.149 109.322 62.2072L109.532 62.3731C109.849 62.6249 110.159 62.8854 110.465 63.1518C111.249 63.838 111.995 64.5668 112.7 65.3348C113.116 65.7869 113.517 66.2531 113.901 66.7334C113.949 66.7916 113.997 66.8512 114.046 66.9109C114.096 66.9706 114.268 67.202 114.131 67.0171C113.994 66.8323 114.17 67.0681 114.201 67.1103C114.257 67.1845 114.314 67.2558 114.369 67.3359C114.575 67.6109 114.775 67.8918 114.969 68.1756C115.915 69.555 116.722 71.0254 117.376 72.5649L117.267 72.3044C117.591 73.076 117.874 73.8639 118.115 74.665C118.28 75.2107 118.888 75.6109 119.459 75.4261C120.029 75.2413 120.397 74.6693 120.221 74.0843C119.22 70.7647 117.517 67.7274 115.334 65.0452C113.902 63.2962 112.27 61.7214 110.471 60.3531C110.23 60.1698 109.987 59.9912 109.743 59.8176C109.615 59.7288 109.222 59.4072 109.664 59.7826C109.456 59.5842 109.181 59.4701 108.893 59.4625C108.604 59.4644 108.327 59.5793 108.122 59.7826C107.749 60.1887 107.656 60.9324 108.122 61.3253L108.117 61.3282Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M91.2047 64.706C91.1959 65.6345 92.0473 66.3389 92.8914 66.7275C94.3366 67.3955 95.9709 67.5716 97.5602 67.477C99.1494 67.3824 100.711 67.0287 102.264 66.6751C101.783 67.2322 101.791 68.0594 102.281 68.6078C102.413 68.7181 102.526 68.8482 102.617 68.9934C102.663 69.1055 102.689 69.2247 102.693 69.3456L102.839 70.8883C102.893 70.3935 103.364 70.0151 103.857 69.9467C104.351 69.8783 104.849 70.0689 105.263 70.3454C106.072 70.881 106.656 71.8008 106.663 72.7657C106.671 73.7306 106.029 74.7129 105.093 74.972C104.712 75.0782 104.252 75.0986 104.029 75.4246C103.932 75.603 103.882 75.8034 103.884 76.0067L103.606 79.4049C104.278 79.2085 104.747 78.6176 105.154 78.0486C106.138 76.6762 107.046 75.2252 107.56 73.617C108.074 72.0089 108.142 70.213 107.489 68.6587C106.835 67.1044 105.348 65.8542 103.664 65.748C103.818 64.9481 103.911 64.1375 103.942 63.3234C103.647 64.1295 103.451 64.9687 103.36 65.8222C103.489 65.1659 102.948 64.5779 102.415 64.1719C99.6377 62.0927 96.0421 61.4454 92.7139 62.4255C91.8814 62.6787 91.0635 63.0425 90.4188 63.6276C89.7741 64.2126 89.3156 65.0422 89.3215 65.9139C89.3273 66.7857 89.8629 67.6603 90.688 67.9441C90.771 67.9607 90.847 68.0017 90.9063 68.062C90.9585 68.1546 90.9705 68.2645 90.9398 68.3662L90.477 71.1153L91.9454 66.7056"
                        fill="#81E2D2"
                      />
                      <path
                        d="M90.7681 64.706C90.7826 66.3971 92.6746 67.2427 94.063 67.608C95.7919 68.0635 97.598 67.9864 99.3488 67.7128C100.368 67.5527 101.375 67.3256 102.379 67.0971L101.954 66.3695C101.417 66.9814 101.321 67.8642 101.714 68.5772C101.811 68.7426 101.933 68.8931 102.073 69.024C102.127 69.0669 102.176 69.1157 102.219 69.1695C102.25 69.2493 102.265 69.3343 102.264 69.4199L102.409 70.8927C102.407 71.1128 102.57 71.2999 102.788 71.3293C102.98 71.3511 103.237 71.2332 103.267 71.0164C103.311 70.6973 103.561 70.4456 103.879 70.3979C104.281 70.3149 104.713 70.5099 105.044 70.734C105.656 71.1401 106.141 71.8459 106.215 72.559C106.297 73.2716 105.978 73.9711 105.387 74.3768C105.073 74.5776 104.706 74.5951 104.339 74.7217C103.871 74.8562 103.527 75.2569 103.466 75.7404C103.38 76.3313 103.361 76.9382 103.313 77.5334L103.169 79.405C103.169 79.5413 103.233 79.6698 103.341 79.7523C103.45 79.8348 103.591 79.8619 103.722 79.8256C104.285 79.6295 104.777 79.2697 105.134 78.7923C105.519 78.3063 105.879 77.8011 106.214 77.2787C106.937 76.2184 107.517 75.0675 107.94 73.8558C108.708 71.5388 108.583 68.7926 106.874 66.9152C106.049 65.9881 104.9 65.4117 103.664 65.3042L104.084 65.8557C104.245 65.0176 104.342 64.1688 104.376 63.3162C104.374 63.0988 104.213 62.9158 103.997 62.8868C103.782 62.8575 103.578 62.9909 103.518 63.1997C103.216 64.0459 103.016 64.9254 102.923 65.8194C102.869 66.304 103.697 66.4204 103.78 65.9358C103.926 65.0393 103.344 64.3349 102.68 63.827C102.058 63.3493 101.385 62.9422 100.673 62.6132C99.227 61.9448 97.6596 61.5788 96.067 61.5377C94.4661 61.497 92.7808 61.7822 91.3313 62.4939C89.8818 63.2056 88.6069 64.706 88.946 66.4306C89.1113 67.2939 89.708 68.0121 90.5265 68.3327C90.5574 68.3482 90.5901 68.3594 90.624 68.3662C90.4595 68.3735 90.5585 68.0941 90.5192 68.2454C90.5003 68.3167 90.4799 68.4841 90.4624 68.5874L90.3315 69.3631L90.0593 70.9858C90.018 71.1363 90.0601 71.2975 90.1698 71.4085C90.2795 71.5196 90.4401 71.5637 90.5911 71.5242C90.7421 71.4848 90.8606 71.3677 90.902 71.2172L92.3689 66.8061C92.4179 66.6534 92.3793 66.4861 92.2682 66.3704C92.1572 66.2547 91.9917 66.2092 91.8371 66.2518C91.6825 66.2945 91.5638 66.4184 91.5278 66.5747L90.0593 70.9858L90.902 71.2172C91.0514 70.3236 91.2013 69.4305 91.3517 68.5379C91.388 68.3124 91.4288 68.0824 91.3124 67.8714C91.1959 67.6604 90.982 67.5803 90.7579 67.4901C90.5123 67.3836 90.2983 67.2157 90.1364 67.0025C89.7632 66.4978 89.6595 65.8428 89.8585 65.2474C90.0755 64.5925 90.5053 64.029 91.0795 63.6465C91.7176 63.225 92.4243 62.9182 93.1679 62.7398C93.8511 62.5575 94.5516 62.4477 95.2578 62.4124C96.7035 62.3421 98.1486 62.5628 99.5074 63.0615C100.254 63.3355 100.966 63.696 101.629 64.1355C101.966 64.3447 102.279 64.5913 102.561 64.8705C102.783 65.1033 102.989 65.4177 102.941 65.6956L103.799 65.8121C103.891 64.9982 104.081 64.1984 104.364 63.4297L103.505 63.3133C103.475 64.0881 103.388 64.8596 103.243 65.6214C103.211 65.7525 103.239 65.8913 103.321 65.9989C103.403 66.1064 103.529 66.171 103.664 66.1745C104.56 66.2656 105.396 66.663 106.033 67.2994C106.748 68.0041 107.23 68.9114 107.413 69.8987C107.873 72.1821 106.946 74.4626 105.758 76.3691C105.419 76.9134 105.057 77.4461 104.677 77.97C104.37 78.3877 103.997 78.8301 103.491 78.9887L104.042 79.405L104.188 77.6076C104.231 77.0502 104.249 76.4579 104.323 75.918C104.332 75.826 104.361 75.737 104.408 75.6575C104.378 75.7055 104.47 75.6109 104.418 75.6458C104.457 75.619 104.498 75.5951 104.541 75.5745C104.729 75.5134 104.92 75.4648 105.113 75.429C105.571 75.316 105.987 75.0752 106.313 74.7348C106.974 74.0359 107.24 73.0522 107.023 72.1152C106.782 71.1485 106.149 70.3259 105.276 69.8448C104.747 69.5538 104.087 69.3879 103.496 69.5945C102.975 69.7764 102.504 70.2116 102.425 70.7792L103.283 70.8956L103.156 69.5639C103.15 69.3338 103.113 69.1055 103.044 68.8858C102.954 68.6868 102.822 68.51 102.657 68.3677C102.277 67.9989 102.243 67.4005 102.578 66.9909C102.716 66.8504 102.743 66.6348 102.644 66.4646C102.545 66.2944 102.343 66.2119 102.153 66.2632C100.523 66.6329 98.8816 67.0113 97.205 67.0651C95.7177 67.1146 94.0935 66.9341 92.7779 66.1919C92.4737 66.025 92.2008 65.8063 91.9716 65.5457C91.7708 65.3168 91.656 65.025 91.6471 64.7206C91.6471 64.1588 90.7739 64.1573 90.7739 64.7206L90.7681 64.706Z"
                        fill="#81E2D2"
                      />
                      <path
                        d="M99.3212 77.1783C99.8931 77.1783 100.439 76.6762 100.413 76.0868C100.403 75.4882 99.9198 75.0054 99.3212 74.9953C98.7507 74.9953 98.2035 75.4974 98.2297 76.0868C98.2405 76.6851 98.7229 77.1674 99.3212 77.1783Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M91.0897 77.1783C91.6617 77.1783 92.2074 76.6762 92.1812 76.0868C92.1711 75.4882 91.6883 75.0054 91.0897 74.9953C90.5192 74.9953 89.972 75.4974 89.9982 76.0868C90.0083 76.6854 90.4911 77.1682 91.0897 77.1783Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M102.264 82.9851C102.888 82.3464 103.308 81.5354 103.467 80.6565C103.603 79.9711 103.668 79.2696 103.758 78.5769C103.82 78.0864 103.856 77.6003 103.879 77.1055C103.91 76.4055 103.953 75.7069 103.999 75.0069L103.446 75.429C104.684 75.6633 106.131 75.2383 106.722 74.0478C107.138 73.2096 107.071 72.2941 106.64 71.4748C106.27 70.7733 105.621 70.1301 104.83 69.9278C104.384 69.8095 103.911 69.8614 103.502 70.0733C103.012 70.3294 102.667 70.8126 102.438 71.3031C102.323 71.5116 102.391 71.7743 102.594 71.8997C102.694 71.9585 102.813 71.9752 102.926 71.9459C103.038 71.9167 103.134 71.8441 103.192 71.744C103.28 71.5507 103.386 71.3664 103.51 71.1939C103.533 71.1648 103.619 71.0717 103.673 71.0207C103.726 70.9698 103.74 70.9596 103.774 70.9305C103.809 70.9014 103.766 70.9305 103.76 70.9407C103.785 70.9232 103.809 70.9058 103.836 70.8897C103.862 70.8737 103.897 70.8519 103.927 70.8359C103.958 70.8199 104.047 70.782 103.964 70.8141C104.036 70.7867 104.11 70.7643 104.185 70.7471C104.233 70.7355 104.274 70.7384 104.198 70.7471H104.31H104.424H104.473C104.534 70.7471 104.393 70.7326 104.453 70.7471C104.523 70.7593 104.593 70.7754 104.662 70.7951L104.773 70.833C104.867 70.8665 104.745 70.8141 104.811 70.8475C104.876 70.881 104.956 70.9203 105.025 70.964L105.113 71.0207C105.14 71.0382 105.239 71.1124 105.17 71.06C105.299 71.1627 105.418 71.2767 105.527 71.4006L105.613 71.5024C105.665 71.5636 105.589 71.4661 105.637 71.533C105.685 71.5999 105.739 71.6785 105.783 71.7557C105.826 71.8328 105.872 71.9099 105.911 71.99C105.928 72.0235 105.944 72.0584 105.96 72.0933V72.1108C105.939 72.0584 105.976 72.1544 105.981 72.1646C106.038 72.3237 106.081 72.4873 106.11 72.6536C106.12 72.7046 106.11 72.6347 106.11 72.6303L106.119 72.7031V72.8137C106.123 72.899 106.123 72.9845 106.119 73.0698C106.119 73.147 106.134 73.0145 106.119 73.1164C106.119 73.1513 106.106 73.1877 106.097 73.2227C106.074 73.3276 106.041 73.4303 106 73.5297C106.019 73.4832 105.976 73.5807 105.971 73.5938C105.947 73.6403 105.924 73.6855 105.898 73.7291C105.872 73.7728 105.856 73.8033 105.832 73.8383C105.809 73.8732 105.745 73.9605 105.76 73.9431C105.774 73.9256 105.716 73.9925 105.704 74.0056C105.693 74.0187 105.643 74.0711 105.611 74.1031L105.527 74.1788L105.47 74.2268C105.5 74.2006 105.506 74.2021 105.47 74.2268C105.404 74.269 105.34 74.3142 105.273 74.352L105.164 74.4088C105.145 74.4175 105.044 74.4626 105.09 74.4437C105.137 74.4248 105.032 74.4655 105.016 74.4713L104.905 74.5077C104.832 74.5296 104.76 74.5485 104.684 74.5645L104.575 74.5863C104.531 74.5863 104.437 74.6067 104.54 74.5863C104.467 74.595 104.394 74.6023 104.323 74.6067C104.194 74.614 104.064 74.614 103.935 74.6067C103.846 74.6067 103.757 74.5936 103.67 74.5849C103.582 74.5761 103.806 74.6052 103.696 74.5849H103.668C103.537 74.549 103.397 74.5764 103.289 74.6589C103.18 74.7413 103.117 74.8695 103.117 75.0055C103.058 75.9005 103.023 76.7955 102.971 77.6891C102.926 78.4372 102.814 79.1925 102.706 79.9332C102.652 80.3959 102.542 80.8502 102.379 81.2867C102.209 81.6898 101.962 82.0557 101.651 82.3637C101.255 82.7639 101.872 83.3824 102.268 82.9807L102.264 82.9851Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M90.7986 69.1259C90.4755 70.3804 90.2383 71.6582 90.0186 72.933C89.7755 74.3389 89.5601 75.752 89.4102 77.171C89.2647 78.5608 89.1556 80.0337 89.563 81.3915C89.7772 82.1489 90.198 82.8317 90.7783 83.3635C91.3569 83.8559 92.0411 84.2085 92.7779 84.3939C93.6137 84.599 94.4701 84.7084 95.3306 84.7199C96.3723 84.7781 97.4171 84.7548 98.4552 84.65C98.6931 84.6424 98.8842 84.4513 98.8918 84.2134C98.8918 83.9995 98.691 83.7477 98.4552 83.7768C97.5254 83.8704 96.5902 83.8971 95.6566 83.8568C94.9642 83.852 94.2733 83.7936 93.59 83.6822C92.9074 83.5801 92.2539 83.3357 91.6718 82.9647C91.1433 82.5938 90.7378 82.0733 90.5076 81.4701C90.0244 80.1952 90.1219 78.769 90.2543 77.43C90.3868 76.0911 90.5716 74.8643 90.7943 73.5399C91.0286 72.1384 91.2833 70.734 91.6384 69.3587C91.7839 68.8144 90.9354 68.5816 90.7957 69.1259H90.7986Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M98.0753 74.2909C98.6371 74.2909 98.6371 73.4177 98.0753 73.4177C97.5135 73.4177 97.5121 74.2909 98.0753 74.2909Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M92.4591 73.5254L92.3965 73.4628C92.3569 73.4204 92.3067 73.3892 92.251 73.3726C92.1441 73.3222 92.0203 73.3222 91.9134 73.3726C91.8577 73.3892 91.8075 73.4204 91.7678 73.4628L91.6994 73.5516C91.6605 73.6183 91.6399 73.6941 91.6398 73.7713L91.6558 73.8878C91.6755 73.9606 91.7142 74.0268 91.7678 74.0799L91.8304 74.1425C91.8701 74.1849 91.9203 74.2161 91.976 74.2327C92.0277 74.2604 92.0861 74.2735 92.1448 74.2705C92.203 74.2736 92.2609 74.2605 92.3121 74.2327C92.3679 74.2162 92.4182 74.1851 92.4577 74.1425L92.5261 74.0537C92.5651 73.987 92.5856 73.9112 92.5857 73.8339L92.5697 73.7175C92.55 73.6447 92.5113 73.5784 92.4577 73.5254H92.4591Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M104.815 72.2447C104.754 72.1527 104.659 72.0884 104.552 72.0657C104.444 72.045 104.332 72.0588 104.233 72.105C104.07 72.2004 103.939 72.3429 103.859 72.514C103.747 72.6796 103.671 72.867 103.636 73.0641C103.624 73.1231 103.624 73.1841 103.636 73.2431C103.663 73.3377 103.739 73.4098 103.835 73.4308C103.939 73.4524 104.047 73.4428 104.145 73.4032C104.295 73.3421 104.377 73.1801 104.338 73.0233C104.299 72.8972 104.204 72.7961 104.08 72.7497C104.028 72.722 103.968 72.7137 103.911 72.7264C103.857 72.7427 103.81 72.7784 103.78 72.8269C103.722 72.9317 103.757 73.0639 103.859 73.1267C103.877 73.1337 103.894 73.142 103.911 73.1514L103.942 73.1689C103.966 73.182 103.911 73.1427 103.93 73.1689C103.949 73.1951 103.908 73.1339 103.921 73.1558C103.934 73.1776 103.907 73.1136 103.921 73.1398C103.936 73.1659 103.921 73.1485 103.921 73.1296C103.918 73.1191 103.918 73.108 103.921 73.0975C103.925 73.0699 103.938 73.0443 103.958 73.0248C103.937 73.0452 103.974 73.0146 103.978 73.0117C103.953 73.0277 103.994 73.0117 104 73.0117C103.992 73.0104 103.984 73.0104 103.977 73.0117C103.949 73.0204 103.991 73.0117 103.998 73.0117H103.945H103.93C103.962 73.0128 103.992 73.0263 104.014 73.0495L104.07 73.1456C104.07 73.1281 104.07 73.1281 104.07 73.1456C104.07 73.163 104.07 73.1645 104.07 73.1456C104.07 73.1267 104.07 73.0917 104.07 73.1267C104.07 73.1616 104.07 73.1165 104.07 73.1092C104.07 73.1019 104.077 73.0786 104.081 73.0626C104.088 73.037 104.096 73.0117 104.105 72.9869C104.105 72.9768 104.122 72.9273 104.105 72.9869C104.105 72.9753 104.116 72.9622 104.122 72.9506C104.173 72.85 104.229 72.7527 104.292 72.6595L104.335 72.5984L104.346 72.5794C104.356 72.5678 104.346 72.5722 104.335 72.5955C104.335 72.5882 104.355 72.5722 104.359 72.5678L104.384 72.5416L104.4 72.5271C104.413 72.5169 104.4 72.5271 104.384 72.5387C104.384 72.5256 104.432 72.5125 104.442 72.5038C104.409 72.5169 104.402 72.5212 104.418 72.5154H104.435C104.444 72.5154 104.48 72.5154 104.435 72.5154C104.39 72.5154 104.435 72.5154 104.435 72.5154C104.435 72.5154 104.467 72.5271 104.423 72.5154H104.453C104.49 72.5241 104.444 72.5154 104.437 72.5154C104.442 72.5174 104.447 72.5204 104.451 72.5241C104.466 72.5329 104.458 72.5241 104.431 72.5052V72.514C104.447 72.53 104.442 72.5241 104.419 72.4965C104.449 72.5441 104.496 72.5792 104.55 72.5955C104.607 72.6111 104.667 72.6032 104.717 72.5736C104.821 72.5124 104.856 72.3795 104.796 72.2753L104.815 72.2447Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M104.77 86.4445C104.745 86.3935 104.722 86.344 104.7 86.2989C104.7 86.2902 104.648 86.1767 104.675 86.2422C104.635 86.1432 104.595 86.0428 104.559 85.9424C104.477 85.7241 104.405 85.5058 104.336 85.2802C104.191 84.7854 104.054 84.2818 103.939 83.7768C103.824 83.2718 103.725 82.777 103.638 82.272C103.558 81.8019 103.504 81.4439 103.457 81.0087C103.45 80.7708 103.258 80.5797 103.021 80.5721C102.804 80.5721 102.558 80.773 102.584 81.0087C102.696 82.0177 102.867 83.0192 103.096 84.0082C103.299 84.9992 103.606 85.9657 104.015 86.8912C104.073 86.9913 104.169 87.064 104.281 87.0932C104.394 87.1224 104.513 87.1058 104.613 87.047C104.816 86.922 104.885 86.6592 104.77 86.4503V86.4445Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M99.0708 87.664C98.6662 86.5856 98.4319 85.449 98.0273 84.3691C97.9589 84.1413 97.7245 84.0065 97.4932 84.0621C97.3814 84.0927 97.2864 84.1665 97.229 84.2672C97.1717 84.3679 97.1568 84.4873 97.1875 84.5991C97.5921 85.6789 97.8264 86.8141 98.231 87.894C98.3006 88.1221 98.5366 88.2558 98.768 88.1981C98.8798 88.1675 98.9749 88.0937 99.0322 87.993C99.0895 87.8923 99.1044 87.7729 99.0737 87.6611L99.0708 87.664Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M114.717 88.2593C114.141 86.8785 113.058 85.7701 111.691 85.1608C110.176 84.4666 108.49 84.3779 106.876 84.7242C105.905 84.9387 104.967 85.2813 104.086 85.743C103.939 85.8149 103.845 85.9624 103.842 86.1255C103.838 86.2886 103.926 86.44 104.069 86.5181C104.212 86.5962 104.387 86.588 104.522 86.4968C105.914 85.7823 107.468 85.3326 109.043 85.4039C110.365 85.4522 111.632 85.9472 112.637 86.8083C113.172 87.269 113.594 87.8466 113.87 88.4965C113.94 88.7242 114.176 88.858 114.407 88.8021C114.614 88.7439 114.802 88.4848 114.713 88.2651L114.717 88.2593Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M98.5671 87.0761C96.4496 86.769 94.1545 86.4939 92.2582 87.7223C90.5628 88.8167 89.5513 90.6693 89.0361 92.5744C88.697 93.8245 88.5442 95.1169 88.4001 96.4019C88.3739 96.6362 88.6199 96.8385 88.8367 96.8385C89.0759 96.8339 89.2687 96.6411 89.2733 96.4019C89.4974 94.4154 89.7594 92.3401 90.7709 90.5806C91.1829 89.841 91.7397 89.1921 92.4081 88.6726C93.13 88.1337 93.9856 87.8025 94.8822 87.715C96.0348 87.5927 97.1948 87.747 98.3357 87.9129C98.5673 87.9681 98.802 87.8345 98.8728 87.6073C98.9295 87.4021 98.8029 87.1052 98.5686 87.0703L98.5671 87.0761Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M95.3858 30.5229C96.1953 26.4758 95.9339 22.2874 94.6276 18.3723C93.9837 16.4381 93.0716 14.604 91.9178 12.9235C90.704 11.1749 89.2251 9.62623 87.5343 8.33331C84.0301 5.68321 79.7338 4.294 75.3414 4.39078C73.1961 4.4425 71.0711 4.82087 69.0398 5.51285C67.0098 6.20329 65.0843 7.16946 63.3174 8.38424C61.5465 9.59309 59.9447 11.0325 58.554 12.6644C57.1677 14.2803 56.0163 16.0838 55.134 18.0215C53.2134 22.2863 52.744 27.0632 53.798 31.6203C54.3099 33.8652 55.1954 36.0082 56.4176 37.9597C57.65 39.919 59.2181 41.6457 61.0499 43.0607C62.7727 44.3863 64.6922 45.4342 66.7389 46.1664C68.7541 46.8815 70.8616 47.3035 72.9968 47.4195C75.1252 47.5379 77.2596 47.3606 79.3392 46.8926C81.4149 46.4261 83.412 45.6614 85.2683 44.6223C87.2245 43.5325 88.9866 42.126 90.4828 40.46C92.1838 38.532 93.5158 36.3076 94.4122 33.8979C94.8242 32.8016 95.1455 31.6733 95.3727 30.5244C95.4848 29.9655 95.2141 29.3194 94.6101 29.1811C94.0688 29.0588 93.3877 29.3456 93.2683 29.9437C93.0964 30.8048 92.8729 31.6548 92.5989 32.4891C92.4621 32.9068 92.3078 33.3186 92.1477 33.7261C92.1157 33.8047 91.9702 34.1424 92.1128 33.8135C92.072 33.9095 92.0313 34.0056 91.9891 34.1045C91.8921 34.316 91.795 34.5251 91.698 34.7318C91.3198 35.5165 90.8885 36.2746 90.4071 37.0007C90.1684 37.3616 89.8919 37.6992 89.6547 38.0587C89.8424 37.7749 89.646 38.0689 89.5907 38.1387C89.5354 38.2086 89.4568 38.3046 89.3898 38.3876C89.2404 38.5681 89.0876 38.7456 88.9314 38.9202C88.3726 39.5511 87.7716 40.1434 87.1326 40.6929C86.9958 40.8107 86.8561 40.9257 86.7149 41.0392C86.6451 41.096 86.5694 41.1527 86.5039 41.208C86.4748 41.2313 86.3278 41.3536 86.4864 41.2226C86.6451 41.0916 86.4559 41.2444 86.4238 41.2692C86.1221 41.4962 85.8145 41.715 85.5012 41.9255C84.8912 42.3325 84.2596 42.7061 83.6092 43.0447C83.2759 43.2164 82.9383 43.3809 82.5905 43.5351L82.3445 43.6428C82.2965 43.6647 82.247 43.688 82.199 43.7069L82.3125 43.6588C82.1306 43.7331 81.9487 43.8044 81.7653 43.8786C80.1993 44.4779 78.5691 44.8935 76.9074 45.1171L77.1984 45.0778C75.255 45.3383 73.2855 45.3383 71.3421 45.0778L71.6332 45.1171C70.0639 44.9059 68.5236 44.5177 67.0416 43.9601C66.8757 43.8975 66.7098 43.8335 66.5453 43.7651L66.3998 43.704C66.7301 43.8364 66.5366 43.7622 66.4638 43.7316L66.1727 43.6021C65.8147 43.442 65.4611 43.2703 65.1147 43.0884C64.4161 42.7236 63.7405 42.3163 63.0918 41.8688C62.9288 41.7567 62.7687 41.6417 62.6086 41.5239L62.3918 41.3623C62.3627 41.339 62.2157 41.2255 62.3743 41.3478C62.5329 41.47 62.3452 41.3245 62.3132 41.2997C62.0003 41.0509 61.6947 40.7933 61.3992 40.5255C60.7688 39.9572 60.1785 39.3459 59.6324 38.6961C59.4947 38.5302 59.3588 38.3624 59.2249 38.1926C59.094 38.0267 59.3588 38.3672 59.2701 38.2508L59.1827 38.1344C59.1114 38.0412 59.0372 37.9466 58.9732 37.852C58.717 37.4969 58.4745 37.1331 58.2455 36.7605C57.7911 36.0279 57.3866 35.2655 57.0346 34.4785C56.9881 34.3738 56.9444 34.2661 56.8891 34.1598C57.0463 34.5062 56.8775 34.1307 56.844 34.0463C56.7567 33.8324 56.6752 33.6097 56.5966 33.3972C56.4321 32.9446 56.2851 32.4847 56.16 32.0219C55.8994 31.0938 55.7049 30.1484 55.5778 29.1927L55.6171 29.4838C55.3792 27.6841 55.3792 25.8609 55.6171 24.0612L55.5778 24.3523C55.7073 23.3934 55.9052 22.445 56.1702 21.5143C56.3012 21.0545 56.4496 20.5985 56.6155 20.1463C56.6912 19.9382 56.7712 19.7316 56.8542 19.5264L56.9153 19.3808C56.9255 19.3561 56.9371 19.3313 56.9459 19.3066C56.9546 19.2819 56.8411 19.5511 56.8877 19.4449C56.9342 19.3386 56.9793 19.2324 57.0259 19.1276C57.3898 18.3159 57.8044 17.528 58.2673 16.7685C58.5002 16.3881 58.7427 16.0151 58.995 15.6493C59.1231 15.4659 59.2526 15.284 59.3865 15.105L59.58 14.8489C59.6499 14.7572 59.4782 14.9784 59.4913 14.9624C59.5044 14.9464 59.5247 14.9202 59.5407 14.8998L59.6572 14.7543C60.782 13.3413 62.0686 12.065 63.4905 10.9515C63.5131 10.9366 63.5345 10.9201 63.5546 10.902C63.5677 10.8874 63.3494 11.0606 63.4396 10.9908L63.5691 10.8918L63.85 10.6822C64.0305 10.5503 64.2134 10.4198 64.3987 10.2907C64.7693 10.0365 65.1467 9.79399 65.5309 9.56307C66.298 9.09578 67.0926 8.67539 67.9104 8.3042L68.2015 8.17322L68.347 8.10918C68.4533 8.06261 68.1884 8.17467 68.2015 8.1674C68.2146 8.16012 68.2684 8.13975 68.3019 8.12519C68.5086 8.03933 68.7167 7.95637 68.9263 7.87778C69.3454 7.71964 69.7689 7.5741 70.1968 7.44118C71.0524 7.17675 71.9246 6.96915 72.8077 6.81975C73.0289 6.78191 73.2443 6.74844 73.4713 6.71788L73.1802 6.75717C74.847 6.53209 76.5362 6.52818 78.2041 6.74553L77.913 6.70769C78.7843 6.82359 79.6462 7.00209 80.4919 7.2418C80.9197 7.36405 81.3423 7.50085 81.7595 7.65221C81.953 7.72206 82.1437 7.79774 82.3416 7.87196C82.426 7.90689 82.7971 8.06843 82.4391 7.9098L82.7942 8.04951C83.5642 8.39516 84.3092 8.79392 85.0238 9.2429C85.3673 9.45683 85.702 9.6795 86.0294 9.92109C86.1153 9.98221 86.1983 10.0448 86.2827 10.1074L86.4078 10.202C86.565 10.3213 86.223 10.0564 86.3322 10.1423C86.5024 10.2776 86.6712 10.413 86.8372 10.5527C87.4553 11.0728 88.0387 11.6329 88.5836 12.2293C88.8484 12.5203 89.1046 12.8182 89.352 13.1228C89.416 13.2014 89.4801 13.2815 89.5426 13.363C89.6693 13.5216 89.3753 13.1418 89.4975 13.3033L89.5907 13.4256C89.7129 13.5885 89.8337 13.7545 89.9516 13.9204C90.4113 14.5742 90.8321 15.2546 91.2119 15.9578C91.4011 16.3086 91.5801 16.6666 91.7504 17.029C91.8319 17.2065 91.9134 17.3855 91.9905 17.5645L92.0517 17.7101C91.9178 17.4045 91.9731 17.5223 92.0007 17.5907C92.0458 17.6999 92.091 17.8105 92.1346 17.9211C92.7994 19.6057 93.2563 21.3651 93.4954 23.1603L93.4575 22.8693C93.7195 24.8579 93.7195 26.8723 93.4575 28.8609L93.4954 28.5699C93.4342 29.0278 93.359 29.4833 93.2698 29.9364C93.1592 30.4953 93.4284 31.1414 94.0324 31.2797C94.5825 31.4092 95.268 31.1225 95.3858 30.5229Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M91.4025 14.1168C94.4005 18.8103 95.4222 24.7408 94.3336 30.2333C93.5448 34.2122 91.6485 37.9612 88.5937 40.8427C81.122 47.8924 68.6468 48.265 60.8971 41.5355C61.6619 42.7521 62.566 43.8755 63.5909 44.8828C71.2533 52.3953 84.3761 52.2672 92.1229 44.9585C95.1792 42.0769 97.0711 38.3279 97.8628 34.349C99.305 27.0752 97.0478 19.0373 91.4025 14.1168Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M90.4595 14.6684C90.7816 15.172 91.0809 15.6896 91.3575 16.2213C91.5001 16.4949 91.6369 16.7724 91.7679 17.0537C91.829 17.1847 91.8887 17.3172 91.9469 17.4481C91.976 17.5151 92.0036 17.582 92.0327 17.6475C92.0808 17.7567 91.9774 17.518 91.9833 17.5296C92.0036 17.5762 92.0226 17.6242 92.0429 17.6752C92.5025 18.7956 92.8686 19.9522 93.1373 21.1331C93.2829 21.7996 93.4095 22.4734 93.5026 23.1516L93.4633 22.8606C93.7282 24.8597 93.7282 26.8851 93.4633 28.8842L93.5026 28.5932C93.2541 30.4265 92.7734 32.2208 92.072 33.9328C92.0051 34.0973 92.1084 33.8484 92.1128 33.8368C92.091 33.8921 92.0662 33.9474 92.0429 34.0012C91.9949 34.1118 91.9454 34.2195 91.8974 34.3287C91.8072 34.528 91.7126 34.726 91.6151 34.921C91.4113 35.3314 91.193 35.736 90.9602 36.1304C90.7273 36.5248 90.4799 36.9163 90.2179 37.2947C90.0928 37.4771 89.9642 37.657 89.8323 37.8346L89.7246 37.9801C89.7042 38.0063 89.579 38.1679 89.6984 38.0136C89.8177 37.8593 89.6984 38.0223 89.6722 38.0471C89.6227 38.1096 89.5732 38.1737 89.5266 38.2363C88.9509 38.9477 88.324 39.616 87.6507 40.2359C87.3596 40.5037 87.0603 40.7622 86.7528 41.0116C86.6713 41.0785 86.5898 41.144 86.5068 41.2081C86.4777 41.2314 86.3336 41.3434 86.4937 41.2197C86.6538 41.096 86.5083 41.2081 86.4792 41.2299C86.3118 41.3565 86.143 41.4817 85.9727 41.6025C85.3197 42.0652 84.6393 42.4881 83.9352 42.8686C83.5918 43.0549 83.2439 43.231 82.8917 43.3969C82.7185 43.4784 82.5454 43.557 82.3707 43.6327C82.2878 43.6691 81.9545 43.8029 82.3212 43.656L82.0302 43.7724C80.3745 44.4325 78.6436 44.8851 76.8768 45.12L77.1679 45.0807C75.2488 45.334 73.3048 45.334 71.3858 45.0807L71.6769 45.12C70.1878 44.9233 68.7241 44.5676 67.3108 44.0591C67.1493 44.0009 66.9877 43.9397 66.8277 43.8772L66.5861 43.7826L66.4405 43.7229L66.3445 43.6836L66.5104 43.7535C66.156 43.6158 65.8104 43.4564 65.4756 43.2761C64.8074 42.9457 64.1592 42.5764 63.5342 42.1701C63.182 41.943 62.8386 41.7039 62.5038 41.4526L62.3787 41.358C62.3496 41.3376 62.3219 41.3158 62.2943 41.2939L62.4325 41.4016C62.3467 41.3405 62.2666 41.2706 62.1851 41.2052C62.0061 41.0596 61.8315 40.9141 61.6583 40.7686C61.2435 40.4091 60.6745 40.332 60.2248 40.6827C59.7914 41.0149 59.6713 41.6168 59.9439 42.09C61.3668 44.3351 63.222 46.2748 65.4014 47.7964C67.2367 49.067 69.2648 50.0336 71.4076 50.6591C73.5456 51.2871 75.7649 51.5941 77.993 51.5701C80.2247 51.5533 82.4418 51.2101 84.5741 50.5514C86.7022 49.8971 88.7154 48.915 90.541 47.6407C92.6322 46.1726 94.4296 44.3254 95.8399 42.1948C97.2597 40.0164 98.2689 37.5966 98.8176 35.0549C99.3411 32.6668 99.4884 30.2117 99.2542 27.7782C99.0125 25.2842 98.3799 22.8439 97.3797 20.5466C96.4158 18.335 95.0737 16.3085 93.4139 14.5578C93.0151 14.1387 92.5969 13.7385 92.1594 13.3572C91.9512 13.158 91.6761 13.0438 91.388 13.037C91.0986 13.0394 90.8215 13.1542 90.6152 13.3572C90.2383 13.769 90.1568 14.4996 90.6152 14.8998C91.3434 15.5278 92.0225 16.2104 92.6469 16.9417C92.8012 17.126 92.9525 17.3133 93.101 17.5034C93.1665 17.5864 93.0166 17.3841 93.0151 17.3914C93.0136 17.3987 93.0588 17.4481 93.066 17.4583L93.1665 17.5908L93.3804 17.8818C93.6598 18.2699 93.9257 18.6701 94.1779 19.0825C94.676 19.894 95.117 20.7392 95.4979 21.6119C95.5197 21.6614 95.5416 21.7137 95.5634 21.7647C95.6114 21.8709 95.5023 21.6192 95.5081 21.6308C95.5173 21.6571 95.528 21.6829 95.5401 21.7079C95.5896 21.8273 95.6391 21.9481 95.6857 22.0674C95.771 22.2828 95.8525 22.4996 95.9301 22.7179C96.0931 23.1705 96.2401 23.6304 96.3668 24.0932C96.6615 25.1298 96.8813 26.1862 97.0246 27.2542L96.9853 26.9632C97.2526 28.9566 97.255 30.9767 96.9925 32.9708L97.0318 32.6798C96.7941 34.4827 96.3281 36.2482 95.6449 37.9335C95.6216 37.9889 95.5983 38.0427 95.5765 38.098C95.7002 37.7822 95.6216 37.9888 95.5925 38.0573C95.5532 38.1489 95.5139 38.2392 95.4732 38.3309C95.3742 38.5477 95.2723 38.7675 95.1675 38.9785C94.9638 39.3889 94.7465 39.7925 94.5156 40.1893C94.2846 40.5862 94.0329 40.9835 93.7602 41.3813C93.6293 41.5704 93.4954 41.7596 93.3571 41.9445C93.2974 42.026 93.2349 42.1046 93.1752 42.1861C93.3687 41.9168 93.2436 42.0987 93.1985 42.1555L93.0529 42.3447C92.4727 43.0622 91.8403 43.7359 91.161 44.3603C90.8699 44.6281 90.5672 44.8886 90.2587 45.1375L90.0171 45.3311L89.9356 45.3936C90.2121 45.1753 90.0549 45.3019 89.9924 45.3485C89.8279 45.4737 89.662 45.5945 89.4946 45.7138C88.8468 46.1738 88.1718 46.5942 87.4732 46.9727C87.1224 47.1648 86.7644 47.3453 86.402 47.5141C86.2332 47.5946 86.0629 47.6717 85.8912 47.7455C85.8082 47.7819 85.5099 47.9026 85.8708 47.7557C85.7602 47.8008 85.6511 47.8473 85.5405 47.891C83.8972 48.5435 82.1802 48.9922 80.4278 49.227L80.7189 49.1877C78.7831 49.446 76.8216 49.446 74.8859 49.1877L75.177 49.227C74.153 49.0879 73.1404 48.8754 72.1469 48.591C71.6594 48.4455 71.1762 48.3 70.6916 48.1151C70.4544 48.0278 70.2171 47.9347 69.9828 47.8372C69.9508 47.8255 69.9188 47.8124 69.8882 47.7979C69.8882 47.7979 70.1618 47.9157 70.009 47.8488L69.8446 47.7775C69.7209 47.7236 69.5972 47.6683 69.4735 47.6101C68.5388 47.1776 67.64 46.6715 66.7854 46.0966C66.573 45.951 66.3619 45.8055 66.1553 45.6512C66.052 45.5756 65.9486 45.497 65.8468 45.4198L65.9646 45.5115C65.9399 45.4882 65.9108 45.4693 65.8831 45.4475L65.7216 45.3194C65.3092 44.9876 64.9119 44.6388 64.5297 44.273C63.9993 43.7653 63.4997 43.2263 63.0336 42.659C62.971 42.5834 62.9084 42.5048 62.8458 42.4276L62.7847 42.3505L62.7236 42.2719L62.8138 42.3884C62.7192 42.2312 62.5868 42.0871 62.4791 41.9387C62.255 41.6272 62.0405 41.309 61.8358 40.9839L60.1214 42.3069C61.5456 43.5483 63.1367 44.5839 64.8484 45.3834C66.5517 46.1806 68.3516 46.7526 70.2026 47.0847C73.913 47.7543 77.7312 47.4999 81.32 46.344C83.1183 45.7632 84.8332 44.9501 86.4209 43.9252C88.1076 42.8367 89.6219 41.5019 90.9136 39.9652C92.3345 38.2453 93.4745 36.3115 94.2914 34.2355C95.0843 32.2034 95.5784 30.067 95.7584 27.8931C95.9494 25.6525 95.8215 23.396 95.3786 21.1913C94.9439 19.0069 94.1903 16.8983 93.1417 14.9333C92.8924 14.4695 92.6265 14.016 92.3442 13.5726C92.0386 13.0908 91.3604 12.8449 90.851 13.1811C90.3693 13.4852 90.1321 14.1532 90.4595 14.6684Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M57.9951 38.3643C57.9951 38.3643 62.2025 44.4346 65.2995 46.3687L57.9951 38.3643Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M57.0535 38.9071C57.6181 39.7221 58.2178 40.508 58.829 41.2939C59.9252 42.7362 61.1179 44.1025 62.399 45.3834C63.1112 46.1056 63.8987 46.7496 64.7479 47.3045C65.2691 47.6028 65.9332 47.4287 66.2411 46.913C66.532 46.3908 66.3593 45.7321 65.8496 45.4198C65.6909 45.3208 65.5367 45.2161 65.3853 45.1054C65.3096 45.0516 65.2398 44.9934 65.1641 44.941C65.1525 44.9323 65.4086 45.1316 65.2893 45.037L65.2412 44.9992L65.1132 44.8959C64.7813 44.6266 64.4641 44.3399 64.1541 44.046C63.4875 43.4114 62.8603 42.7362 62.2534 42.0434C61.6713 41.3798 61.1105 40.7006 60.571 40.0059L60.3818 39.7658C60.3542 39.7294 60.3265 39.693 60.2974 39.6581C60.2683 39.6232 60.4764 39.8895 60.4095 39.8036L60.3513 39.7265C60.2392 39.581 60.1301 39.4354 60.0195 39.2899C59.8375 39.0498 59.6585 38.8082 59.4795 38.5622C59.3005 38.3163 59.1128 38.0587 58.9352 37.8025C58.7855 37.5621 58.554 37.3838 58.2832 37.3004C57.9992 37.2252 57.697 37.2649 57.4421 37.4111C56.9763 37.7109 56.7027 38.4021 57.0506 38.9042L57.0535 38.9071Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M86.9171 9.2254C87.0365 9.33019 94.4849 14.0135 97.1933 23.0512L86.9171 9.2254Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M86.1414 9.99675C86.4238 10.2354 86.7454 10.4334 87.0408 10.6473C87.1524 10.7288 87.263 10.8117 87.3727 10.8962L87.46 10.9631C87.1121 10.6968 87.2679 10.8176 87.3479 10.8758L87.5575 11.0417C87.8733 11.2935 88.1847 11.554 88.4889 11.8203C89.2742 12.5062 90.021 13.235 90.7258 14.0033C91.1405 14.4559 91.5422 14.9216 91.9264 15.4004L92.072 15.5794C92.104 15.6217 92.2932 15.8705 92.1564 15.6857C92.0196 15.5009 92.1942 15.7366 92.2262 15.7788L92.395 16.0029C92.6007 16.2795 92.8006 16.5599 92.9946 16.8441C93.9412 18.2244 94.7476 19.6958 95.4018 21.2364L95.2912 20.9759C95.6156 21.7468 95.8993 22.5342 96.1411 23.335C96.3055 23.8822 96.9139 24.2824 97.4844 24.0976C98.0549 23.9127 98.4231 23.3408 98.2455 22.7557C97.2457 19.4361 95.5429 16.3988 93.3599 13.7166C91.9278 11.9672 90.2948 10.3924 88.4947 9.02458C88.256 8.84121 88.0135 8.66269 87.7671 8.48901C87.6404 8.40024 87.246 8.07861 87.6899 8.45409C87.4812 8.25565 87.2064 8.14158 86.9186 8.13391C86.6292 8.13628 86.3521 8.2511 86.1458 8.45409C85.7732 8.86013 85.6815 9.60381 86.1458 9.99675H86.1414Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M67.4783 18.6444C70.8996 17.7547 74.1134 16.2032 76.938 14.0775C77.7896 16.1197 79.1505 17.9095 80.8907 19.276C81.0362 18.7681 81.6606 18.5629 82.1889 18.5935C83.535 18.6707 84.6311 19.7037 84.7878 21.0428C84.9446 22.382 84.1167 23.6402 82.8249 24.0263C82.6007 24.0932 82.3446 24.1485 82.2209 24.3479C82.1672 24.4498 82.1355 24.5619 82.1278 24.6768L81.7217 27.6442C81.5292 28.5554 81.5567 29.4993 81.8018 30.3978C82.0142 31.3394 81.5412 32.0685 81.8556 32.9766C81.8323 32.8908 86.2216 31.2404 86.6742 31.0381C88.6841 30.1343 90.8263 29.0006 92.0415 27.0796C92.1471 26.9329 92.2183 26.7642 92.2497 26.5862C92.2962 26.1831 91.979 25.8396 91.6981 25.5456C90.1758 23.9448 89.0785 22.0048 87.9549 20.1099C86.8314 18.2151 85.6264 16.3173 83.9367 14.8954C82.2471 13.4736 79.9957 12.5669 77.8243 12.9875C77.8766 12.0497 77.7648 11.11 77.4939 10.2107L77.4867 13.1869C76.8573 12.5737 76.2863 11.9033 75.781 11.1843C76.1616 11.6607 76.4845 12.1805 76.743 12.7328C74.7143 11.7544 72.3345 11.8343 70.376 12.9465C68.4175 14.0588 67.1299 16.0618 66.9311 18.3053C66.9075 18.4143 66.929 18.5282 66.9907 18.6211C67.062 18.7041 67.2338 18.691 67.2483 18.5818"
                        fill="#6573C9"
                      />
                      <path
                        d="M67.5932 19.065C70.285 18.3645 72.8548 17.2595 75.2149 15.7876C75.8814 15.3728 76.5247 14.926 77.1563 14.4545L76.5159 14.194C77.3909 16.3054 78.7899 18.1587 80.5807 19.5788C80.8383 19.781 81.2036 19.7243 81.3084 19.3866C81.3346 19.3008 81.3229 19.3459 81.3084 19.3634C81.3215 19.3369 81.3361 19.3111 81.352 19.2862C81.32 19.3357 81.3972 19.2367 81.4117 19.2222C81.4641 19.1727 81.3695 19.2498 81.4277 19.2062C81.4526 19.1888 81.4783 19.1728 81.5048 19.1582C81.5451 19.1318 81.5887 19.1107 81.6344 19.0956C81.8496 19.018 82.0811 18.9969 82.3067 19.0345C82.7743 19.1071 83.2105 19.315 83.5612 19.6326C84.3049 20.3093 84.564 21.3208 84.1769 22.2217C83.8934 22.9276 83.29 23.4559 82.5527 23.6435C82.2078 23.7483 81.8992 23.923 81.7639 24.2766C81.6446 24.5895 81.6417 24.9664 81.5965 25.2953L81.451 26.3912C81.3477 27.1451 81.2109 27.9033 81.1687 28.663C81.148 29.0825 81.1763 29.5031 81.2531 29.9161C81.3171 30.2712 81.4234 30.6117 81.4175 30.9741C81.4175 31.3103 81.3477 31.6406 81.3186 31.9739C81.28 32.3477 81.3177 32.7255 81.4292 33.0843C81.5747 33.5413 82.2893 33.4773 82.2878 32.9694C82.2878 33.0072 82.1932 33.3099 82.0899 33.3274C82.0972 33.3274 82.1074 33.3157 82.1146 33.3128C82.1452 33.3012 82.1729 33.2837 82.202 33.2706L82.3111 33.2197C82.3519 33.2022 82.5411 33.1251 82.3984 33.1818C82.6895 33.064 82.9806 32.9446 83.2716 32.8282C84.024 32.5299 84.7779 32.2461 85.5318 31.9477C87.2389 31.2855 88.9387 30.5462 90.4028 29.4241C90.9089 29.0445 91.3734 28.6123 91.7883 28.1347C92.2074 27.6414 92.7794 26.9952 92.6615 26.301C92.5538 25.6403 91.912 25.1585 91.4972 24.6783C91.0542 24.1552 90.6417 23.6071 90.2616 23.0366C88.6972 20.7197 87.4965 18.1598 85.6744 16.0219C83.9586 14.0062 81.4743 12.3632 78.7193 12.4592C78.3817 12.472 78.0455 12.5105 77.7137 12.5742L78.2667 12.9948C78.3158 12.0177 78.1987 11.0394 77.9203 10.1016C77.7748 9.63294 77.0646 9.71735 77.0631 10.218L77.05 13.1869L77.7966 12.8784C77.1938 12.2911 76.6454 11.6506 76.1579 10.9646L75.4725 11.4929C75.8242 11.9428 76.124 12.431 76.366 12.9482L76.9642 12.3515C75.0095 11.4297 72.7519 11.3973 70.7717 12.2627C68.954 13.0559 67.5568 14.6582 66.8874 16.5109C66.704 17.0287 66.5804 17.5658 66.5192 18.1118C66.4799 18.4378 66.4799 18.8278 66.8015 19.0199C66.9565 19.1154 67.1467 19.1341 67.3173 19.0707C67.4879 19.0073 67.6197 18.8688 67.6747 18.6954C67.739 18.4627 67.6025 18.2219 67.3698 18.1576C67.1371 18.0933 66.8964 18.2298 66.8321 18.4625L66.8219 18.496L66.934 18.3039L67.1275 18.2355C67.2731 18.2539 67.3531 18.3136 67.3676 18.4145C67.377 18.3597 67.3804 18.3041 67.3778 18.2486C67.3778 18.1685 67.3924 18.103 67.4011 18.039C67.4334 17.8225 67.4766 17.6078 67.5306 17.3957C67.6221 17.0253 67.7468 16.6639 67.9032 16.3159C68.2307 15.5926 68.6835 14.9328 69.2407 14.3672C71.1659 12.4704 74.066 11.9676 76.5174 13.1054C76.6886 13.2046 76.9051 13.1763 77.0451 13.0364C77.185 12.8965 77.2133 12.6799 77.1141 12.5087C76.8343 11.9254 76.4886 11.376 76.0837 10.8714C75.9284 10.7156 75.6815 10.6997 75.5075 10.8342C75.3334 10.9687 75.2866 11.2116 75.3982 11.4012C75.925 12.1502 76.5188 12.8497 77.1723 13.4911C77.2972 13.6158 77.4848 13.653 77.6479 13.5855C77.8109 13.518 77.9173 13.359 77.9174 13.1825L77.9291 10.2078L77.0719 10.3228C77.3273 11.1857 77.4336 12.0859 77.3862 12.9846C77.3702 13.2888 77.6773 13.4547 77.9378 13.4052C80.4788 12.9322 82.9384 14.3628 84.6207 16.1529C86.4719 18.1263 87.6566 20.5975 89.1003 22.8576C89.467 23.431 89.8512 23.9943 90.2646 24.5342C90.4843 24.8253 90.7099 25.1018 90.9471 25.3739C91.1625 25.6213 91.4041 25.8484 91.6122 26.1016C91.7577 26.2821 91.8625 26.4422 91.7767 26.6459C91.6493 26.9089 91.4873 27.1536 91.2949 27.3736C90.9139 27.8429 90.4819 28.2686 90.007 28.6426C89.0697 29.3878 87.9869 29.9524 86.9042 30.4531C86.7776 30.5127 86.6509 30.571 86.5229 30.6277L86.4312 30.6685C86.3541 30.7048 86.5127 30.6364 86.4763 30.651L86.2289 30.75C85.9514 30.8606 85.6725 30.9697 85.3921 31.0774C84.6557 31.3685 83.9193 31.6465 83.1858 31.9361C82.8816 32.0569 82.5774 32.1777 82.2762 32.3028C82.069 32.377 81.8672 32.4655 81.6722 32.5677C81.5163 32.646 81.4162 32.8037 81.4117 32.9781L82.2689 32.8617C82.0652 32.2388 82.2776 31.6159 82.2878 30.9828C82.2755 30.6139 82.2228 30.2473 82.1306 29.8899C82.056 29.5359 82.0233 29.1745 82.0331 28.8129C82.0579 28.0372 82.2049 27.2601 82.3097 26.4844L82.4697 25.3201C82.4945 25.1338 82.5178 24.9475 82.5454 24.7627C82.5494 24.6948 82.5641 24.628 82.5891 24.5648C82.5614 24.6157 82.6182 24.5502 82.6531 24.5327C82.688 24.5153 82.8845 24.4614 82.9835 24.4294C83.1498 24.3753 83.3114 24.3076 83.4667 24.2271C83.7335 24.0865 83.9785 23.9081 84.1943 23.6974C84.637 23.2749 84.9577 22.741 85.1228 22.1518C85.4357 20.9425 85.0047 19.6626 84.024 18.8889C83.4889 18.4479 82.8249 18.1925 82.1321 18.1612C81.4335 18.1394 80.6768 18.4523 80.4599 19.1669L81.1876 18.9733C79.5035 17.657 78.1814 15.9343 77.3455 13.967C77.2509 13.7385 76.9569 13.5172 76.7051 13.7064C74.5368 15.3416 72.1322 16.6371 69.5739 17.5486C68.8434 17.8076 68.1026 18.0346 67.3516 18.2297C66.8088 18.3752 67.0387 19.2135 67.583 19.0708L67.5932 19.065Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M77.3469 25.8484C77.9174 25.8484 78.4646 25.3463 78.4384 24.7569C78.4283 24.1583 77.9455 23.6755 77.3469 23.6653C76.7764 23.6653 76.2292 24.1674 76.2554 24.7569C76.2655 25.3554 76.7483 25.8382 77.3469 25.8484Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M69.114 25.8484C69.6845 25.8484 70.2317 25.3463 70.2055 24.7569C70.1954 24.1583 69.7126 23.6755 69.114 23.6653C68.5435 23.6653 67.9963 24.1674 68.0225 24.7569C68.0326 25.3554 68.5154 25.8382 69.114 25.8484Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M80.2895 31.6538C80.9137 31.015 81.3323 30.204 81.4916 29.3252C81.6284 28.6398 81.6925 27.9383 81.7827 27.2455C81.8438 26.7551 81.8802 26.2675 81.902 25.7742C81.9341 25.0742 81.9763 24.3756 82.0214 23.6756L81.4698 24.0976C82.7068 24.3319 84.1549 23.907 84.7458 22.7165C85.1606 21.8782 85.0936 20.9628 84.6628 20.1435C84.2932 19.442 83.6441 18.7987 82.8538 18.5964C82.4087 18.478 81.9354 18.5299 81.5266 18.742C81.0347 18.9981 80.6897 19.4798 80.4613 19.9717C80.3466 20.1808 80.4157 20.443 80.6184 20.5684C80.8262 20.6899 81.0932 20.6202 81.2151 20.4127C81.3031 20.2193 81.4098 20.0351 81.5338 19.8626C81.5571 19.8335 81.6415 19.7403 81.6954 19.6894C81.7492 19.6385 81.7638 19.6283 81.7987 19.5992C81.8336 19.5701 81.79 19.5992 81.7842 19.6094C81.8089 19.5919 81.8336 19.5744 81.8598 19.5584C81.8894 19.5388 81.92 19.5208 81.9515 19.5046C81.9821 19.4871 82.0694 19.4507 81.9864 19.4827C82.0591 19.4554 82.1335 19.433 82.2091 19.4158C82.2571 19.4041 82.2979 19.4071 82.2222 19.4158L82.3343 19.4085H82.4478H82.4958C82.5584 19.4085 82.4158 19.394 82.4769 19.4085C82.538 19.4231 82.6224 19.4362 82.6865 19.4565L82.7971 19.4944C82.8902 19.5279 82.7694 19.4755 82.8335 19.5089C82.8975 19.5424 82.979 19.5817 83.0488 19.6254L83.1376 19.6821C83.1638 19.6996 83.2628 19.7738 83.1944 19.7214C83.3252 19.8243 83.4465 19.9388 83.5568 20.0634L83.6426 20.1638C83.695 20.2264 83.6193 20.1289 83.6674 20.1959C83.7154 20.2628 83.7692 20.3414 83.8129 20.4185C83.8566 20.4957 83.9031 20.5728 83.9424 20.6528C83.9599 20.6863 83.9744 20.7212 83.9905 20.7562C83.9905 20.7562 84.0181 20.8202 83.9992 20.7736C83.9803 20.7271 84.0152 20.8173 84.0196 20.8275C84.0765 20.9865 84.1198 21.1501 84.1491 21.3165C84.1578 21.3674 84.1491 21.2976 84.1491 21.2932C84.1491 21.3165 84.1491 21.3412 84.1564 21.366C84.1636 21.3907 84.1564 21.4402 84.1564 21.4766V21.7327C84.1564 21.7327 84.1709 21.6774 84.1564 21.7793C84.1564 21.8142 84.1433 21.8506 84.1345 21.8855C84.1095 21.9901 84.0769 22.0927 84.037 22.1926C84.0559 22.146 84.0137 22.2435 84.0065 22.2566C83.985 22.3029 83.9612 22.3481 83.9352 22.392C83.9148 22.4298 83.8915 22.4662 83.8697 22.5011C83.8478 22.536 83.7823 22.6234 83.7954 22.6059L83.7416 22.6685C83.711 22.702 83.679 22.734 83.647 22.766C83.615 22.798 83.5931 22.8169 83.564 22.8417L83.5073 22.8897C83.5378 22.8635 83.5422 22.865 83.5073 22.8897C83.4418 22.9319 83.3792 22.977 83.3108 23.0149C83.2759 23.0352 83.2395 23.0542 83.2031 23.0716C83.1667 23.0891 83.0809 23.1255 83.1289 23.1065C83.1769 23.0876 83.0707 23.1269 83.0547 23.1342L82.9426 23.1706C82.8698 23.1924 82.7971 23.2113 82.7229 23.2273L82.6137 23.2492C82.57 23.2564 82.4682 23.2695 82.5788 23.2564C82.506 23.2652 82.4332 23.2725 82.3605 23.2768C82.231 23.2841 82.1013 23.2841 81.9719 23.2768C81.8831 23.2768 81.7958 23.2637 81.707 23.255C81.6182 23.2463 81.8438 23.2754 81.7347 23.255H81.707C81.576 23.2223 81.4371 23.2508 81.3296 23.3326C81.2221 23.4144 81.1575 23.5405 81.154 23.6756C81.0972 24.5706 81.0623 25.4657 81.0085 26.3592C80.9619 27.1073 80.8513 27.8626 80.7436 28.6034C80.6889 29.066 80.5789 29.5204 80.4161 29.9568C80.2463 30.3599 79.9991 30.7258 79.6885 31.0338C79.2926 31.434 79.9097 32.0525 80.3055 31.6509L80.2895 31.6538Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M68.8229 17.7946C68.4998 19.0491 68.2626 20.3269 68.0428 21.6017C67.7998 23.0076 67.5844 24.4207 67.4345 25.8397C67.289 27.2295 67.1798 28.7024 67.58 30.0602C67.7933 30.818 68.2142 31.501 68.7952 32.0322C69.3738 32.5246 70.0581 32.8772 70.7949 33.0626C71.6306 33.2678 72.487 33.3772 73.3475 33.3886C74.3893 33.4468 75.434 33.4235 76.4722 33.3187C76.7101 33.3111 76.9012 33.12 76.9088 32.8821C76.9088 32.6682 76.7079 32.4164 76.4722 32.4455C75.5419 32.5391 74.6062 32.5659 73.6721 32.5255C72.9802 32.5207 72.2898 32.4623 71.607 32.3509C70.927 32.2474 70.2761 32.003 69.6961 31.6334C69.167 31.2631 68.7614 30.7424 68.5318 30.1388C68.0472 28.8639 68.1462 27.4377 68.2786 26.0987C68.411 24.7598 68.5959 23.533 68.8229 22.2101C69.0572 20.8086 69.3119 19.4042 69.6655 18.0289C69.8111 17.4831 68.9641 17.2517 68.8243 17.796L68.8229 17.7946Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M73.0114 27.0694C73.6048 26.9702 74.1862 26.8092 74.7462 26.5892C75.0412 26.4738 75.3302 26.3436 75.6121 26.1991C75.746 26.1307 75.877 26.0536 76.0065 25.9823C76.0633 25.9488 76.1186 25.9168 76.1724 25.8819L76.2816 25.8135C76.3703 25.7698 76.3427 25.7654 76.2015 25.8004L76.008 25.6883C76.0651 25.7778 76.1069 25.8761 76.1317 25.9794C76.1744 26.1019 76.2098 26.2267 76.2379 26.3534C76.2943 26.5886 76.3111 26.8316 76.2874 27.0723C76.2483 27.4871 76.0063 27.8555 75.6412 28.0561C75.5062 28.125 75.3561 28.1591 75.2046 28.1551C74.9995 28.1233 74.8085 28.0311 74.656 27.8902C74.4818 27.7358 74.3243 27.5636 74.1859 27.3765C74.0549 27.2019 73.921 27.017 73.9297 26.7944C73.9297 26.5532 73.7343 26.3578 73.4931 26.3578C73.252 26.3578 73.0565 26.5532 73.0565 26.7944C73.0391 27.2179 73.253 27.5788 73.5019 27.9033C73.7336 28.236 74.0217 28.5256 74.3532 28.7591C75.0474 29.2059 75.893 29.072 76.4868 28.5248C77.1155 27.9426 77.2523 27.0694 77.1038 26.2588C77.0678 26.0681 77.0162 25.8807 76.9496 25.6985C76.8724 25.4816 76.7968 25.2357 76.6221 25.0785C76.2103 24.7074 75.7125 25.1586 75.34 25.3623C74.5402 25.7939 73.674 26.089 72.7771 26.2355C72.6653 26.2661 72.5703 26.3399 72.513 26.4407C72.4556 26.5414 72.4407 26.6608 72.4715 26.7725C72.5398 27.0017 72.7765 27.1364 73.0085 27.0781L73.0114 27.0694Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M74.9354 27.9266C74.9698 27.756 75.0185 27.5885 75.0809 27.426C75.0999 27.3751 75.0431 27.5089 75.0809 27.4347C75.0809 27.4173 75.097 27.3983 75.1057 27.3809C75.1246 27.3401 75.145 27.3008 75.1654 27.2615C75.2076 27.183 75.2541 27.1073 75.3109 27.0331C75.3342 26.9996 75.3575 26.969 75.3807 26.937C75.324 27.0039 75.404 26.905 75.3807 26.937L75.4186 26.8904C75.4768 26.8235 75.5379 26.758 75.602 26.6969C75.6354 26.6663 75.6674 26.6372 75.7024 26.6081C75.7167 26.5947 75.7318 26.5821 75.7475 26.5703C75.7577 26.5615 75.8101 26.5179 75.762 26.5586C75.714 26.5994 75.7766 26.547 75.7897 26.5397L75.8377 26.5048C75.8785 26.4766 75.9207 26.4504 75.9643 26.4262L75.4346 25.7407C75.1736 26.0622 74.9423 26.4065 74.7433 26.7696C74.6516 26.9385 74.5701 27.1116 74.4944 27.2877C74.4479 27.3969 74.4028 27.506 74.3606 27.6181C74.3504 27.6443 74.3402 27.6705 74.3314 27.6967C74.3227 27.7229 74.3009 27.7724 74.3314 27.7112C74.362 27.6501 74.3314 27.7112 74.3227 27.7243C74.3096 27.7665 74.3882 27.6545 74.33 27.7142L75.0155 27.8029C74.8809 27.6256 74.7657 27.4343 74.672 27.2324C74.624 27.1393 74.6633 27.2121 74.672 27.2324C74.6618 27.2122 74.653 27.1913 74.6458 27.1699C74.6254 27.1155 74.6065 27.0617 74.589 27.0083C74.5537 26.8999 74.5245 26.7896 74.5017 26.6779L74.0797 27.2295C73.9529 27.2206 73.8412 27.143 73.7886 27.0272C73.853 27.2594 74.0934 27.3956 74.3256 27.3314C74.5538 27.2618 74.6879 27.0261 74.6312 26.7944C74.6073 26.6853 74.5504 26.5862 74.4682 26.5106C74.3616 26.4177 74.2268 26.3633 74.0855 26.3563C73.9499 26.3542 73.822 26.419 73.7435 26.5295C73.6594 26.6369 73.6303 26.7774 73.6649 26.9093C73.7667 27.3949 73.9733 27.8524 74.2703 28.2497C74.3408 28.3626 74.4574 28.4387 74.589 28.4578C74.7234 28.4795 74.8599 28.4351 74.9558 28.3385C75.0836 28.1584 75.1756 27.9553 75.2265 27.7403C75.2338 27.72 75.2439 27.6981 75.2527 27.6763C75.2716 27.6268 75.2221 27.7447 75.2527 27.669L75.3094 27.5424C75.3512 27.4522 75.3948 27.3634 75.4404 27.2761C75.5292 27.1073 75.6267 26.9414 75.7315 26.7813C75.7824 26.7027 75.8348 26.627 75.8887 26.5513L75.9818 26.4247C75.9818 26.4174 76.0342 26.3578 75.9993 26.4L76.0298 26.3621C76.1803 26.2053 76.195 25.9627 76.0648 25.7887C75.9315 25.6158 75.6909 25.5679 75.5015 25.6767C74.7641 26.1149 74.2509 26.8492 74.0928 27.6923C74.0344 27.9238 74.1683 28.1604 74.3969 28.2293C74.6094 28.2788 74.8932 28.1653 74.934 27.9252L74.9354 27.9266Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M82.8408 20.9133C82.7797 20.8213 82.6853 20.7566 82.5774 20.7329C82.469 20.7135 82.3573 20.7277 82.2572 20.7736C82.0948 20.8695 81.965 21.012 81.8847 21.1826C81.7724 21.3482 81.6966 21.5356 81.662 21.7327C81.6496 21.7917 81.6496 21.8527 81.662 21.9117C81.6893 22.0059 81.7657 22.0778 81.8614 22.0994C81.9647 22.1211 82.0721 22.1114 82.1699 22.0718C82.3197 22.0107 82.4021 21.849 82.3635 21.6919C82.3241 21.5656 82.2284 21.4645 82.1044 21.4183C82.0533 21.3904 81.9938 21.3821 81.937 21.395C81.8823 21.4109 81.8356 21.4467 81.8061 21.4955C81.747 21.6002 81.7818 21.7329 81.8847 21.7953L81.937 21.8185L81.9676 21.8375C81.9909 21.8506 81.9356 21.8113 81.956 21.8302C81.9763 21.8491 81.9341 21.7953 81.9472 21.8171C81.9603 21.8389 81.9327 21.7749 81.9472 21.8011C81.9618 21.8273 81.9472 21.8098 81.9472 21.7909C81.9429 21.7807 81.9429 21.7691 81.9472 21.7589C81.9502 21.731 81.9631 21.7052 81.9836 21.6861C81.9632 21.7065 81.9996 21.6759 82.0025 21.673C81.9778 21.689 82.02 21.6657 82.0244 21.6657L82.0025 21.673C81.9749 21.6817 82.0156 21.673 82.0244 21.673H81.9691H81.956C81.9877 21.6735 82.0178 21.6872 82.0389 21.7108L82.0957 21.8069C82.0957 21.7894 82.0957 21.7894 82.0957 21.8069C82.0957 21.8244 82.0957 21.8258 82.0957 21.8069C82.0957 21.788 82.0957 21.7531 82.0957 21.788C82.0957 21.8229 82.0957 21.7778 82.0957 21.7705C82.0957 21.7632 82.0957 21.74 82.1059 21.7239C82.1128 21.6983 82.121 21.673 82.1306 21.6483C82.1306 21.6381 82.1481 21.5871 82.1306 21.641C82.1306 21.6293 82.1422 21.6162 82.1466 21.6046C82.1981 21.5043 82.2554 21.4071 82.3183 21.3135C82.3314 21.2932 82.3445 21.2713 82.3591 21.2524L82.3722 21.2335L82.3605 21.2495C82.3605 21.2422 82.3809 21.2262 82.3853 21.2219L82.41 21.1957C82.4146 21.1901 82.42 21.1852 82.426 21.1811C82.4377 21.1709 82.426 21.1738 82.41 21.1927C82.41 21.1796 82.4581 21.1665 82.4668 21.1578C82.4348 21.1709 82.4275 21.1753 82.4435 21.1695H82.4595C82.4697 21.1695 82.5046 21.1622 82.4595 21.1695C82.4144 21.1767 82.4595 21.1695 82.4595 21.1695C82.4595 21.1695 82.4915 21.1811 82.4479 21.1695H82.477C82.5134 21.1782 82.4668 21.1695 82.461 21.1622C82.4662 21.1637 82.4711 21.1662 82.4755 21.1695C82.4901 21.1792 82.4828 21.1733 82.4537 21.152L82.4624 21.1607C82.477 21.1767 82.4741 21.1709 82.4508 21.1418C82.4801 21.1901 82.5262 21.2259 82.5803 21.2422C82.6659 21.2662 82.7575 21.2358 82.8119 21.1655C82.8662 21.0951 82.8725 20.9989 82.8277 20.9221L82.8408 20.9133Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M82.7942 35.1131L82.7258 34.9676C82.7258 34.9588 82.6734 34.8453 82.7011 34.9108C82.6603 34.8118 82.621 34.7114 82.5832 34.611C82.5036 34.3927 82.4294 34.172 82.3605 33.9488C82.215 33.454 82.0782 32.9505 81.9632 32.4454C81.8482 31.9404 81.7493 31.4442 81.6634 30.9406C81.5834 30.4705 81.5295 30.1125 81.4815 29.6774C81.4754 29.4388 81.2834 29.2469 81.0449 29.2408C80.8038 29.2408 80.6083 29.4363 80.6083 29.6774C80.7218 30.6862 80.8934 31.6877 81.122 32.6768C81.3237 33.668 81.6316 34.6346 82.0403 35.5599C82.1687 35.7502 82.4225 35.8087 82.6211 35.6936C82.8198 35.5786 82.8954 35.3293 82.7942 35.1233V35.1131Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M77.0965 36.3268C76.6919 35.2484 76.4561 34.1118 76.053 33.0319C75.9834 32.8038 75.7474 32.6702 75.516 32.7278C75.4042 32.7584 75.3092 32.8322 75.2518 32.9329C75.1945 33.0337 75.1796 33.1531 75.2104 33.2648C75.615 34.3432 75.8493 35.4798 76.2539 36.5597C76.3234 36.7878 76.5595 36.9215 76.7909 36.8639C76.9027 36.8333 76.9977 36.7594 77.055 36.6587C77.1123 36.558 77.1273 36.4386 77.0965 36.3268Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M92.7415 36.9279C92.1655 35.5472 91.0836 34.4388 89.7173 33.8295C88.2023 33.1353 86.5155 33.0465 84.9016 33.3929C83.9306 33.6073 82.9924 33.9499 82.1117 34.4116C81.9036 34.5331 81.8333 34.8001 81.9545 35.0083C82.0791 35.2132 82.3435 35.2826 82.5526 35.1655C83.9439 34.4509 85.4983 34.0012 87.0729 34.0725C88.395 34.1211 89.6615 34.6162 90.6662 35.4769C91.2016 35.9376 91.6238 36.5152 91.9003 37.1651C91.9705 37.3928 92.2057 37.5267 92.4373 37.4707C92.644 37.4125 92.8303 37.1535 92.7415 36.9337V36.9279Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M76.5916 35.7447C74.474 35.4376 72.1804 35.1626 70.2841 36.3909C68.5872 37.4853 67.5772 39.338 67.062 41.243C66.7229 42.4932 66.5701 43.7855 66.426 45.0706C66.3998 45.3049 66.6458 45.5072 66.8626 45.5072C67.1015 45.5018 67.2938 45.3094 67.2992 45.0706C67.5219 43.084 67.7838 41.0087 68.7968 39.2492C69.2091 38.5115 69.7653 37.8642 70.4326 37.3456C71.1547 36.8071 72.0102 36.476 72.9066 36.388C74.0607 36.2657 75.2206 36.42 76.3616 36.5859C76.5931 36.6411 76.8278 36.5075 76.8986 36.2803C76.9554 36.0751 76.8288 35.7782 76.593 35.7433L76.5916 35.7447Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M16.8133 34.1845C16.6867 33.109 15.7 30.8372 16.0376 29.7879C16.1482 29.4459 16.3185 29.0748 16.6881 28.9235C16.9577 28.8414 17.2426 28.8224 17.5206 28.8682C20.7544 29.1461 25.2223 30.1401 28.1446 28.9104C28.8592 28.6106 29.6407 28.0764 29.5083 27.3953C29.4195 26.9456 28.9261 26.6211 28.4182 26.5221C27.9103 26.4232 27.3747 26.5047 26.8581 26.5847C28.181 25.9196 28.7922 24.3551 28.2116 23.1254C28.1113 22.8818 27.9346 22.6775 27.708 22.5432C27.3878 22.3715 26.9803 22.3977 26.615 22.4807C25.5148 22.7208 24.5426 23.3771 23.9954 24.2445C24.3098 23.6813 24.6314 23.089 24.6038 22.4632C24.5761 21.8374 24.0638 21.181 23.3463 21.1534C23.0477 21.1554 22.7527 21.2198 22.4804 21.3426C20.3774 22.1678 18.7707 23.8952 18.2774 25.8541C18.4462 25.2225 17.6952 24.6171 16.9457 24.6317C16.1962 24.6462 15.5588 25.1119 15.1469 25.6504C14.1043 27.0581 14.2887 29.025 15.5748 30.2143C14.7351 30.1168 13.8473 30.4719 13.3845 31.0876C12.923 31.7077 12.9101 32.5537 13.3525 33.1876C13.8939 32.4701 16.3214 32.8121 16.6299 33.6242"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M17.9049 34.1846C17.7492 32.9374 17.2325 31.7716 17.0579 30.5288L17.0972 30.8198C17.056 30.5545 17.0496 30.2849 17.0783 30.0179L17.039 30.309C17.0663 30.1494 17.1122 29.9936 17.1758 29.8447L17.0666 30.1053C17.0936 30.0429 17.1242 29.9821 17.1583 29.9233C17.1802 29.884 17.314 29.6978 17.186 29.8666C17.0579 30.0354 17.2136 29.8666 17.2398 29.8317C17.0826 29.9466 17.0521 29.9772 17.1452 29.9146C17.1764 29.8973 17.2084 29.8818 17.2413 29.868L16.9808 29.9772C17.0605 29.9483 17.1429 29.9274 17.2267 29.9146L16.9357 29.9539C17.234 29.9347 17.5335 29.9469 17.8292 29.9903C18.0941 30.015 18.359 30.0441 18.6239 30.0747C19.1958 30.1402 19.7663 30.2202 20.3368 30.2828C21.5083 30.4283 22.6814 30.5564 23.8616 30.5943C25.0588 30.6532 26.2585 30.5514 27.4287 30.2915C28.0082 30.1547 28.5674 29.9428 29.0921 29.6614C29.731 29.3135 30.3423 28.7736 30.5475 28.0503C30.8124 27.0956 30.2564 26.1176 29.3832 25.7116C28.9454 25.5053 28.4686 25.3946 27.9846 25.387C27.5107 25.394 27.0383 25.4427 26.5729 25.5326L27.4141 27.5278C28.7399 26.8467 29.683 25.3128 29.5055 23.8022C29.3861 22.7761 28.8971 21.7647 27.8449 21.4256C27.3515 21.267 26.7971 21.3252 26.3008 21.4358C25.882 21.5353 25.4758 21.6817 25.0899 21.8724C24.2592 22.2799 23.5575 22.9096 23.0627 23.6916L24.9473 24.7933C25.4581 23.8793 25.9588 22.7951 25.5717 21.737C25.3774 21.1881 25.0076 20.7185 24.5195 20.401C23.9886 20.0796 23.3541 19.9753 22.7483 20.11C22.2674 20.2238 21.8039 20.4015 21.3701 20.6382C21.0196 20.811 20.6829 21.0105 20.363 21.2349C19.6186 21.7576 18.9606 22.3935 18.4128 23.1196C17.8634 23.8454 17.4632 24.673 17.2355 25.5544L19.3413 26.1394C19.6106 24.9752 18.7985 23.9957 17.7288 23.6479C16.7392 23.3277 15.7088 23.7148 14.9302 24.329C13.6364 25.3477 13.1649 27.1349 13.5069 28.695C13.7074 29.5649 14.1588 30.3568 14.805 30.9726L15.5778 29.1098C14.5387 29.0007 13.3395 29.4329 12.6671 30.245C12.2348 30.748 11.9792 31.3788 11.9395 32.0409C11.9121 32.6391 12.0763 33.2305 12.4081 33.7291C12.5823 34.0136 12.8751 34.2048 13.2056 34.2501C13.5156 34.2908 13.9144 34.2122 14.1225 33.9488C14.1443 33.9226 14.1691 33.8979 14.1923 33.8731C14.2622 33.7975 14.3655 33.8178 14.0555 33.975C14.1152 33.9445 14.1705 33.9052 14.2345 33.8775L13.9726 33.9867C14.13 33.9239 14.2948 33.8818 14.463 33.8615L14.172 33.9008C14.4726 33.8673 14.7762 33.8717 15.0757 33.9139L14.7847 33.876C15.0844 33.9151 15.3778 33.9924 15.6579 34.106L15.3974 33.9954C15.4732 34.0269 15.547 34.0628 15.6186 34.1031C15.6768 34.1366 15.8864 34.2879 15.6957 34.1409C15.5051 33.9939 15.6957 34.1497 15.735 34.1933C15.8383 34.2952 15.5647 33.9357 15.6288 34.0565C15.6448 34.0871 15.6622 34.1147 15.6768 34.1467L15.5662 33.8862L15.5764 33.9081C15.6606 34.1783 15.838 34.4099 16.077 34.5615C16.3319 34.7078 16.6344 34.747 16.9182 34.6707C17.1923 34.5947 17.4261 34.4152 17.5702 34.17C17.6983 33.927 17.7885 33.5952 17.6808 33.3288C17.5838 33.0458 17.4224 32.7892 17.2093 32.5793C17.0362 32.4154 16.84 32.2776 16.6271 32.1704C16.2307 31.9703 15.8047 31.8351 15.3653 31.7702C14.8387 31.6828 14.3013 31.6828 13.7747 31.7702C13.3482 31.8444 12.852 32.0612 12.5784 32.4032L14.2928 32.6245C14.218 32.5145 14.1541 32.3975 14.1021 32.2752L14.2113 32.5357C14.1577 32.3971 14.1192 32.2532 14.0963 32.1064L14.1356 32.3974C14.1137 32.2322 14.1137 32.0649 14.1356 31.8997L14.0963 32.1908C14.1189 32.0415 14.1575 31.8952 14.2113 31.7542L14.1007 32.0161C14.1532 31.894 14.217 31.7771 14.2913 31.6668C14.4063 31.4907 14.105 31.8808 14.2695 31.7018C14.3104 31.6564 14.3537 31.6132 14.399 31.5722C14.4252 31.5475 14.4514 31.5242 14.479 31.5024L14.3408 31.6072C14.3944 31.559 14.4547 31.5188 14.5198 31.4878C14.6287 31.4215 14.7426 31.3636 14.8603 31.3146L14.5998 31.4253C14.8069 31.3415 15.0234 31.2833 15.2446 31.2521L14.9535 31.2899C15.159 31.2666 15.3665 31.2666 15.572 31.2899C15.7654 31.2937 15.9559 31.2433 16.1221 31.1444C16.3239 31.0241 16.4808 30.8411 16.5689 30.6234C16.7428 30.2166 16.6537 29.7452 16.3433 29.43C16.2531 29.3441 16.1672 29.2553 16.0857 29.1607C16.0304 29.0967 15.9402 28.9424 16.1236 29.2175C16.0901 29.168 16.0523 29.12 16.0173 29.072C15.8877 28.8799 15.7771 28.6757 15.687 28.4622L15.7976 28.7227C15.6816 28.4428 15.6014 28.1494 15.5589 27.8495L15.5967 28.1405C15.5596 27.8409 15.5596 27.5379 15.5967 27.2382L15.5574 27.5293C15.598 27.2293 15.6772 26.9358 15.7932 26.6561L15.6841 26.9166C15.751 26.759 15.8298 26.6067 15.9198 26.4611C15.9606 26.3941 16.0071 26.3316 16.0508 26.2661C16.1236 26.1613 15.8776 26.4742 15.9941 26.3388C16.0246 26.3054 16.0537 26.2704 16.0843 26.2355C16.1396 26.1744 16.1978 26.1147 16.2575 26.0579C16.2909 26.0259 16.3259 25.9954 16.3623 25.9648C16.4991 25.8484 16.3317 25.9648 16.2953 26.0143C16.4372 25.8887 16.603 25.7931 16.7828 25.7334L16.5223 25.844C16.6797 25.7768 16.8442 25.7279 17.0128 25.6985L16.7217 25.7378C16.8702 25.7164 17.0208 25.714 17.17 25.7305L16.8789 25.6912C17.0037 25.7112 17.1261 25.7438 17.2442 25.7887L16.9837 25.6796C17.0496 25.7065 17.1138 25.7376 17.1758 25.7727C17.2064 25.7902 17.2355 25.8091 17.2646 25.828C17.4101 25.9197 17.0987 25.6825 17.1874 25.7669C17.2267 25.8062 17.3781 25.9779 17.2558 25.8178C17.1336 25.6577 17.2704 25.8571 17.2951 25.908L17.1845 25.6475C17.2144 25.717 17.2359 25.7898 17.2486 25.8644L17.2093 25.5733C17.2151 25.6333 17.2151 25.6938 17.2093 25.7538L17.2471 25.4627C17.2442 25.4938 17.2384 25.5245 17.2296 25.5544C17.1016 26.1103 17.4014 26.7623 17.9922 26.8977C18.5598 27.0272 19.1827 26.7274 19.3341 26.1351C19.407 25.8538 19.4999 25.578 19.612 25.3099L19.5029 25.5704C19.6673 25.1872 19.8691 24.8211 20.1054 24.4774C20.1665 24.3916 20.2306 24.3072 20.2917 24.2213C20.0748 24.5298 20.2917 24.2213 20.3557 24.1529C20.5012 23.9826 20.6555 23.8182 20.8156 23.6625C20.9757 23.5067 21.1372 23.3714 21.3061 23.2258C21.4749 23.0803 21.1605 23.3292 21.258 23.2608L21.3919 23.1633C21.4807 23.0978 21.5724 23.0352 21.6655 22.9741C22.0494 22.7231 22.4551 22.5073 22.8778 22.3294L22.6173 22.44C22.863 22.3297 23.121 22.2491 23.3857 22.1998L23.0947 22.2391C23.2136 22.2253 23.3337 22.2253 23.4527 22.2391L23.1616 22.1998C23.2609 22.2156 23.3583 22.241 23.4527 22.2755L23.1907 22.1664C23.2653 22.199 23.3378 22.2365 23.4076 22.2784C23.5677 22.3701 23.2126 22.095 23.3421 22.2246C23.3712 22.2537 23.4017 22.2799 23.4294 22.309C23.4571 22.3381 23.5124 22.3876 23.5094 22.3992C23.5065 22.4109 23.3377 22.1416 23.4381 22.3163C23.4827 22.3916 23.523 22.4693 23.5589 22.5491L23.4498 22.2886C23.495 22.4054 23.5268 22.527 23.5444 22.651L23.5051 22.3599C23.5196 22.4934 23.5196 22.6281 23.5051 22.7616L23.5429 22.4705C23.5054 22.7214 23.4345 22.9662 23.3319 23.1982L23.4425 22.9377C23.329 23.1953 23.1951 23.4412 23.0583 23.6872C22.7803 24.1849 22.9215 24.9009 23.4498 25.1804C23.972 25.4713 24.6307 25.2986 24.943 24.7889C24.991 24.7132 25.0448 24.6434 25.0885 24.5691C24.8891 24.8733 25.0696 24.5953 25.1394 24.5196C25.2683 24.3782 25.4069 24.2459 25.5542 24.1238C25.6925 24.0074 25.3796 24.2519 25.4858 24.1747L25.5993 24.0947C25.676 24.0404 25.7546 23.9894 25.8351 23.9419C26.0165 23.8365 26.2052 23.7441 26.3998 23.6654L26.1378 23.776C26.4597 23.6378 26.7975 23.54 27.1434 23.4849L26.8524 23.5227C27.0101 23.5019 27.1697 23.4985 27.3283 23.5126L27.0372 23.4733C27.1512 23.4884 27.2627 23.5183 27.369 23.562L27.1085 23.4529C27.1432 23.4685 27.1767 23.4865 27.2089 23.5067C27.3035 23.5708 27.2744 23.5475 27.1245 23.4398C27.1347 23.4602 27.3254 23.6697 27.1871 23.4951C27.0488 23.3204 27.2002 23.5329 27.2206 23.5722C27.2409 23.6115 27.2817 23.693 27.3093 23.7556L27.1987 23.4951C27.2759 23.6818 27.3297 23.8773 27.3588 24.0772L27.3195 23.7862C27.3472 24.0021 27.3472 24.2207 27.3195 24.4367L27.3588 24.1456C27.3254 24.3795 27.2628 24.6084 27.1725 24.8267L27.2817 24.5662C27.2191 24.7137 27.1447 24.8558 27.059 24.9912C27.027 25.0407 26.8771 25.243 27.0037 25.08C27.1303 24.917 26.9499 25.1382 26.9149 25.176C26.88 25.2138 26.8116 25.2837 26.7578 25.3332C26.7272 25.3623 26.6952 25.3899 26.6646 25.4161C26.5191 25.5355 26.7257 25.3885 26.7476 25.3565C26.6859 25.4164 26.6145 25.4656 26.5366 25.502C26.4638 25.5486 26.391 25.5893 26.311 25.6286C25.8278 25.8775 25.6648 26.5178 25.8642 26.9923C25.9501 27.2114 26.1076 27.395 26.311 27.5133C26.5702 27.6461 26.8674 27.6852 27.1522 27.6239L27.4898 27.573L27.1987 27.6123C27.5583 27.5553 27.9235 27.5441 28.2859 27.5788L27.9948 27.5409C28.1645 27.564 28.3307 27.608 28.4896 27.6719L28.2291 27.5613C28.2942 27.5896 28.3579 27.6212 28.4198 27.6559C28.4503 27.6734 28.4794 27.6938 28.5085 27.7112C28.6541 27.8044 28.3426 27.5657 28.43 27.6501C28.4678 27.6894 28.6206 27.8626 28.494 27.7025C28.3674 27.5424 28.5027 27.7418 28.5275 27.7971L28.4169 27.5366C28.4386 27.596 28.4547 27.6574 28.4649 27.7199L28.4256 27.4289C28.4351 27.5052 28.4351 27.5825 28.4256 27.6588L28.4649 27.3678C28.4533 27.4271 28.4373 27.4855 28.4169 27.5424L28.526 27.2819C28.5027 27.3388 28.475 27.3938 28.4431 27.4463C28.3048 27.6705 28.5886 27.2935 28.4663 27.4187C28.4169 27.4682 28.3703 27.5177 28.3208 27.5642C28.2946 27.589 28.267 27.6108 28.2393 27.6326C28.3848 27.5249 28.4212 27.4944 28.3528 27.5439C28.1157 27.7048 27.8638 27.8427 27.6004 27.9557L27.8609 27.8466C27.2538 28.0903 26.618 28.2556 25.969 28.3385L26.26 28.2992C24.0406 28.5902 21.7776 28.2642 19.5655 27.9921C19.0314 27.9252 18.4958 27.8611 17.9646 27.8073C17.6894 27.7711 17.4125 27.7502 17.135 27.7447C16.6173 27.7416 16.1155 27.9238 15.7204 28.2584C15.2009 28.695 14.9608 29.4067 14.8953 30.0587C14.8716 30.5541 14.9206 31.0503 15.0408 31.5315C15.2387 32.5066 15.636 33.4453 15.7685 34.4305L15.7292 34.1395V34.1715C15.7399 34.4587 15.8535 34.7324 16.0494 34.9428C16.2541 35.1477 16.5318 35.2628 16.8214 35.2628C17.111 35.2628 17.3888 35.1477 17.5935 34.9428C17.7739 34.7449 17.9471 34.4509 17.9122 34.1715L17.9049 34.1846Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M17.4086 45.6963C17.1312 45.4192 16.9024 45.0975 16.7318 44.7445C16.5704 44.3772 16.4588 43.9901 16.4 43.5933C16.2967 43.0039 16.237 42.4028 16.1642 41.8076C16.106 41.3331 16.0755 40.8631 16.0536 40.3857C16.0231 39.7032 15.9809 39.0206 15.9372 38.3395C15.9347 38.204 15.8704 38.077 15.7627 37.9948C15.6549 37.9126 15.5155 37.8841 15.3842 37.9175C15.3565 37.9175 15.2634 37.9349 15.3623 37.9175C15.4613 37.9 15.3551 37.9175 15.326 37.9175L15.1921 37.9276C15.0887 37.9349 14.984 37.9378 14.8792 37.9349C14.8195 37.9349 14.7613 37.9349 14.7031 37.9262L14.6027 37.9175C14.5823 37.9175 14.4746 37.9014 14.5415 37.9175C14.6085 37.9335 14.4993 37.9102 14.4775 37.9058L14.3844 37.8883C14.3101 37.8723 14.2388 37.8534 14.1646 37.8316C14.0904 37.8098 14.0191 37.7821 13.9419 37.7545C14.0147 37.7821 13.955 37.7545 13.9201 37.7443C13.8852 37.7341 13.8371 37.7021 13.7964 37.6802C13.728 37.6424 13.6625 37.6016 13.5985 37.558C13.5344 37.5143 13.6116 37.574 13.5563 37.526C13.501 37.4779 13.4893 37.4692 13.4573 37.4386C13.3968 37.3806 13.3399 37.3188 13.287 37.2538C13.3365 37.3135 13.2579 37.2145 13.2463 37.1956C13.2186 37.1549 13.1924 37.1141 13.1677 37.0704C13.0699 36.9149 13 36.7435 12.961 36.564C12.9523 36.5276 12.945 36.4927 12.9377 36.4563C12.9305 36.4199 12.929 36.4083 12.9261 36.385C12.9261 36.385 12.9348 36.4621 12.9261 36.4097C12.9193 36.325 12.9169 36.24 12.9188 36.155C12.9188 36.1114 12.9188 36.0692 12.9261 36.0255C12.9334 35.9818 12.9407 35.9164 12.9261 35.9949C12.9407 35.9091 12.9581 35.8232 12.9799 35.7388C13.0018 35.6544 13.0251 35.5816 13.0527 35.5045C13.0629 35.4798 13.1036 35.375 13.0716 35.4506C13.092 35.4041 13.1138 35.3575 13.1357 35.3124C13.2136 35.1605 13.3026 35.0146 13.402 34.8758L13.4355 34.8307C13.4355 34.8307 13.3947 34.8816 13.4253 34.8438L13.5111 34.7419C13.5679 34.6764 13.629 34.6138 13.6916 34.5527C13.7542 34.4916 13.8095 34.4465 13.8721 34.397C13.9099 34.365 13.859 34.4057 13.8546 34.4086L13.9128 34.3679C13.9477 34.3431 13.9812 34.3198 14.0161 34.298C14.086 34.2558 14.1617 34.218 14.2301 34.1816L14.2767 34.1598C14.2767 34.1598 14.2053 34.1874 14.2519 34.1699C14.2985 34.1525 14.3349 34.1394 14.3785 34.1263C14.4573 34.1022 14.5375 34.0833 14.6187 34.0695C14.5212 34.087 14.6187 34.0695 14.6652 34.0695H14.7773H14.8428C14.9039 34.0695 14.7627 34.0535 14.8224 34.0695C14.8821 34.0855 14.9083 34.0855 14.9505 34.0972C14.9927 34.1088 15.0247 34.1219 15.0611 34.1336C15.0975 34.1452 15.1324 34.1685 15.0509 34.1336L15.1135 34.1641C15.1542 34.1874 15.1964 34.2107 15.2357 34.2369L15.2808 34.2675C15.2314 34.2252 15.3347 34.3024 15.2808 34.2675C15.3579 34.3312 15.4299 34.4007 15.4962 34.4756L15.5515 34.5411C15.5224 34.5047 15.5515 34.5411 15.5646 34.5585C15.601 34.6095 15.6359 34.6618 15.668 34.7157C15.7404 34.8334 15.8055 34.9553 15.863 35.081C15.9845 35.289 16.2515 35.3594 16.4597 35.2382C16.6639 35.1131 16.7332 34.8493 16.6168 34.64C16.2414 33.8338 15.5079 33.1032 14.5503 33.2094C13.7076 33.3026 13.012 33.8701 12.5608 34.5643C12.1097 35.2585 11.887 36.19 12.1722 37.002C12.4589 37.8474 13.1549 38.4897 14.0205 38.7077C14.5398 38.8421 15.0822 38.8615 15.6098 38.7645L15.0567 38.3439C15.1149 39.2491 15.1455 40.1558 15.2023 41.061C15.259 41.9182 15.3842 42.7856 15.5166 43.634C15.6752 44.6528 16.0464 45.574 16.7813 46.3177C17.1772 46.7179 17.8 46.1008 17.3984 45.7006L17.4086 45.6963Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M27.4198 32.6884C27.7283 33.8905 27.9582 35.1145 28.1722 36.337C28.408 37.6832 28.6088 38.9959 28.7543 40.3232C28.8999 41.6242 29.0337 43.0039 28.7107 44.2759C28.5577 44.9519 28.206 45.5668 27.7007 46.0412C27.2088 46.4586 26.6238 46.7516 25.995 46.8955C25.232 47.0774 24.4508 47.1726 23.6664 47.1793C22.643 47.2337 21.6169 47.2094 20.5971 47.1065C20.3628 47.0789 20.1605 47.3277 20.1605 47.5431C20.1666 47.7817 20.3586 47.9736 20.5971 47.9797C21.5447 48.0757 22.4981 48.102 23.4496 48.0583C24.2201 48.049 24.9886 47.9775 25.7476 47.8444C26.4829 47.7204 27.1857 47.4497 27.8142 47.0483C28.4609 46.6144 28.9691 46.0036 29.2782 45.2888C29.8604 43.9222 29.8182 42.3781 29.6843 40.9228C29.5562 39.5416 29.351 38.1649 29.124 36.7954C28.8824 35.3401 28.6204 33.8847 28.2508 32.4527C28.1052 31.9098 27.2684 32.1398 27.4096 32.6855L27.4198 32.6884Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M19.8244 35.7577C20.9759 35.6687 22.133 35.6808 23.2823 35.7941L22.8457 35.3575C22.7759 36.0852 22.7147 36.8245 22.917 37.5405C23.0888 38.1416 23.4526 38.7266 24.0085 39.0424C24.5562 39.3603 25.2287 39.3751 25.7899 39.0817C26.3895 38.7441 26.6121 38.063 26.6631 37.4197C26.7201 36.6151 26.5886 35.8083 26.2789 35.0635L25.8568 35.6165C26.6031 35.6135 27.3476 35.5453 28.082 35.4128C28.3147 35.3489 28.4516 35.1085 28.3877 34.8758C28.3238 34.6431 28.0833 34.5063 27.8506 34.5702C27.1924 34.686 26.5252 34.7439 25.8568 34.7433C25.6021 34.7433 25.3256 35.0271 25.4362 35.2964C25.6617 35.829 25.7856 36.3991 25.8015 36.9773C25.8102 37.3964 25.8015 37.9174 25.4872 38.226C25.2412 38.4676 24.8061 38.4748 24.4946 38.3133C24.1301 38.0987 23.8678 37.7461 23.7669 37.3353C23.5777 36.6979 23.6563 36.0153 23.7189 35.3648C23.7437 35.113 23.4992 34.9485 23.2823 34.9282C22.133 34.8149 20.9759 34.8027 19.8244 34.8918C19.5859 34.8979 19.3939 35.0898 19.3878 35.3284C19.3878 35.5695 19.5833 35.765 19.8244 35.765V35.7577Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M20.9843 37.6191C21.5461 37.6191 21.5475 36.7459 20.9843 36.7459C20.4211 36.7459 20.4211 37.6191 20.9843 37.6191Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M27.2147 37.4707L27.2773 37.4081C27.3197 37.3684 27.3509 37.3182 27.3675 37.2626C27.394 37.2103 27.407 37.1523 27.4053 37.0937C27.407 37.0357 27.394 36.9781 27.3675 36.9264C27.3507 36.8708 27.3196 36.8206 27.2773 36.7808L27.1885 36.7124C27.1218 36.6735 27.046 36.6529 26.9687 36.6528L26.8523 36.6688C26.7792 36.6887 26.7124 36.7273 26.6588 36.7808L26.5976 36.8434C26.5545 36.8825 26.5232 36.9329 26.5074 36.989C26.4796 37.0402 26.4665 37.0981 26.4696 37.1563C26.4666 37.215 26.4797 37.2734 26.5074 37.3251C26.5234 37.3811 26.5547 37.4314 26.5976 37.4707L26.6849 37.5391C26.7521 37.5783 26.8284 37.5989 26.9062 37.5987L27.0211 37.5827C27.0943 37.5628 27.161 37.5242 27.2147 37.4707Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M20.4255 40.6826C21.0713 41.563 22.0029 42.1917 23.0611 42.461C23.2938 42.5253 23.5345 42.3888 23.5988 42.1562C23.6631 41.9235 23.5266 41.6827 23.2939 41.6184C23.179 41.5908 23.0655 41.5573 22.9534 41.5194C22.8995 41.502 22.8472 41.4831 22.7948 41.4627L22.7089 41.4292C22.6463 41.4045 22.77 41.4583 22.7089 41.4292C22.4939 41.3308 22.2858 41.218 22.086 41.0916C22.0394 41.061 21.9943 41.029 21.9478 40.9955C21.9274 40.9824 21.9085 40.9664 21.8881 40.9519C21.792 40.882 21.9259 40.9853 21.8721 40.9417C21.7818 40.866 21.6902 40.7961 21.6043 40.7103C21.5184 40.6244 21.4442 40.5531 21.3685 40.4701L21.2463 40.3246L21.1997 40.2664C21.1226 40.1703 21.2521 40.3362 21.1779 40.2358C21.0519 40.0328 20.7887 39.9643 20.5797 40.0801C20.3993 40.1965 20.277 40.4818 20.424 40.6768L20.4255 40.6826Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M69.4705 22.5913C69.5495 22.7093 69.6172 22.8346 69.6728 22.9653L69.6291 22.862C69.648 22.9071 69.6655 22.9537 69.6815 23.0002C69.6945 23.0548 69.7216 23.105 69.7601 23.1458C69.8689 23.2835 70.0484 23.3444 70.2185 23.3015C70.3303 23.2709 70.4253 23.1971 70.4827 23.0963C70.54 22.9956 70.5549 22.8762 70.5241 22.7645C70.4501 22.5472 70.3494 22.3399 70.2243 22.1474C70.1977 22.0975 70.1586 22.0554 70.1108 22.0252C70.07 21.9867 70.0198 21.9596 69.9653 21.9466C69.9086 21.9313 69.8488 21.9313 69.7921 21.9466C69.7341 21.9483 69.6777 21.9659 69.6291 21.9975C69.5313 22.0561 69.4595 22.1498 69.4283 22.2595C69.3974 22.373 69.4137 22.4942 69.4734 22.5956L69.4705 22.5913Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M75.5175 22.5913C75.597 22.709 75.6648 22.8343 75.7197 22.9653L75.6761 22.862C75.695 22.9071 75.7125 22.9537 75.7299 23.0002C75.7429 23.0545 75.7695 23.1045 75.8071 23.1458C75.8374 23.1931 75.8796 23.2317 75.9293 23.2578C75.9781 23.2892 76.0343 23.3073 76.0923 23.3102C76.1502 23.3233 76.2106 23.3203 76.267 23.3015C76.4992 23.2371 76.6353 22.9967 76.5711 22.7645C76.4983 22.5467 76.3975 22.3393 76.2713 22.1474C76.2452 22.0976 76.2066 22.0555 76.1593 22.0251C76.1185 21.9867 76.0683 21.9596 76.0137 21.9466C75.9565 21.9313 75.8963 21.9313 75.8391 21.9466C75.7815 21.9481 75.7256 21.9657 75.6775 21.9975C75.5789 22.0552 75.5068 22.1492 75.4767 22.2595C75.4454 22.3728 75.4611 22.494 75.5204 22.5956L75.5175 22.5913Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M68.9496 20.9002C69.538 20.8345 70.1305 20.8131 70.7222 20.8361C70.8531 20.8361 70.9827 20.8492 71.1122 20.8594C71.1706 20.8714 71.2302 20.8763 71.2898 20.874C71.3814 20.9045 71.3654 20.8842 71.2403 20.8099C71.2083 20.8099 71.2534 20.7008 71.2286 20.826C71.2199 20.874 71.2286 20.9293 71.2155 20.9715C71.1995 21.117 71.1762 21.2626 71.1559 21.4081C71.0802 21.9601 70.9967 22.5108 70.9055 23.0599C70.824 23.5518 70.76 24.0903 71.0423 24.5356C71.575 25.3885 72.8353 25.2167 73.4247 24.5356C73.7326 24.1518 73.9513 23.7045 74.0651 23.2258C74.2106 22.7135 74.3314 22.1954 74.4624 21.6817C74.4973 21.5478 74.5279 21.411 74.5701 21.28C74.5916 21.2047 74.6235 21.1327 74.6647 21.0661C74.7106 21.0108 74.7777 20.9775 74.8495 20.9744C74.982 20.9511 75.1246 20.9526 75.2585 20.9424L77.296 20.7867C77.5348 20.7813 77.7272 20.5889 77.7326 20.3501C77.7326 20.1089 77.5371 19.9135 77.296 19.9135L75.4826 20.0517C74.9208 20.0954 74.3183 20.0677 73.953 20.5756C73.6721 20.9686 73.6052 21.5318 73.4888 21.9888C73.3856 22.4766 73.2515 22.9574 73.0871 23.4281C73.0215 23.6032 72.9292 23.7672 72.8135 23.9142C72.7117 24.051 72.5698 24.1528 72.4075 24.2053L72.2939 24.2358C72.2765 24.2358 72.1804 24.2504 72.2488 24.2446C72.2004 24.2478 72.1517 24.2478 72.1033 24.2446C71.9694 24.2446 72.1702 24.2664 72.0422 24.2446C71.9985 24.2357 71.9556 24.223 71.9141 24.2067C71.9898 24.2387 71.8661 24.1747 71.8632 24.1732C71.9257 24.214 71.8195 24.1339 71.8166 24.1296C71.7836 24.0945 71.7583 24.0528 71.7424 24.0073C71.6085 23.6726 71.7758 23.1341 71.8341 22.7586C71.9243 22.1882 72.0043 21.6177 72.0785 21.0443C72.1178 20.7445 72.1018 20.4257 71.8632 20.206C71.6245 19.9862 71.2505 19.992 70.9376 19.9731C70.2756 19.9338 69.6115 19.9513 68.9525 20.0255C68.7142 20.0324 68.5227 20.2239 68.5159 20.4621C68.5159 20.6775 68.7167 20.9249 68.9525 20.8987L68.9496 20.9002Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M16.0026 29.6511C16.6372 30.047 17.3794 30.1896 18.1027 30.3351C18.8954 30.4943 19.6914 30.6345 20.4909 30.7557C21.9855 30.9828 23.5238 31.2229 25.0374 31.1298C25.8891 31.0858 26.7265 30.8927 27.5115 30.5593C27.7283 30.4647 27.7764 30.1489 27.6687 29.9626C27.5431 29.759 27.2799 29.6898 27.0705 29.8054C25.8218 30.3482 24.4058 30.3279 23.0756 30.2085C21.5912 30.0658 20.115 29.8477 18.6528 29.5551C17.9091 29.4095 17.1 29.3062 16.4465 28.8958C15.9692 28.5975 15.5296 29.3528 16.0099 29.6511H16.0026Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M28.4181 29.9829C28.9799 29.9829 28.9814 29.1097 28.4181 29.1097C27.8549 29.1097 27.8549 29.9829 28.4181 29.9829Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M72.0043 17.5165C74.0477 16.9403 75.9354 15.9117 77.5273 14.5068C77.6095 14.4249 77.6557 14.3136 77.6557 14.1975C77.6557 14.0815 77.6095 13.9702 77.5273 13.8883C77.3546 13.7234 77.0829 13.7234 76.9102 13.8883C75.4286 15.192 73.6729 16.146 71.7729 16.6796C71.2329 16.8252 71.4614 17.6736 72.0043 17.5208V17.5165Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M78.137 17.3506C78.8924 18.3882 79.6797 19.4506 80.8149 20.0983C81.0209 20.1995 81.2702 20.1239 81.3852 19.9252C81.5003 19.7266 81.4418 19.4727 81.2515 19.3444C81.1205 19.2702 80.9953 19.1916 80.8731 19.1057L80.7858 19.0431C80.7858 19.0431 80.6941 18.9733 80.729 19.0009C80.7639 19.0286 80.681 18.9616 80.6737 18.9558L80.5762 18.8729C80.3549 18.6826 80.1459 18.4784 79.9504 18.2616C79.7525 18.0433 79.5662 17.8148 79.3857 17.582C79.4207 17.6285 79.3741 17.5689 79.361 17.5514L79.2955 17.4655L79.1674 17.2924C79.0728 17.1657 78.9797 17.0377 78.8866 16.9096C78.7611 16.7068 78.4984 16.6382 78.2899 16.7539C78.1065 16.8718 77.9886 17.1541 78.1327 17.3506H78.137Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M90.9601 72.1675C91.8319 72.04 92.7117 71.9748 93.5928 71.9725L93.1562 71.5359C92.9854 73.0281 92.7608 74.5111 92.4824 75.9849C92.4496 76.1159 92.4782 76.2548 92.56 76.3623C92.6417 76.4698 92.7679 76.5344 92.9029 76.5379C93.511 76.5841 94.1224 76.5558 94.7236 76.4535C94.9957 76.4098 95.3465 76.3807 95.5458 76.1624C95.7452 75.9441 95.7612 75.5555 95.8165 75.2717L96.5224 71.5912L96.1018 71.9114L98.9979 71.6785C99.2365 71.6724 99.4284 71.4804 99.4345 71.2419C99.4345 71.0008 99.239 70.8053 98.9979 70.8053L96.1018 71.0382C95.9063 71.0418 95.7359 71.1721 95.6812 71.3598L95.0423 74.6867L94.8851 75.5002C94.8677 75.5977 94.7949 75.7142 94.9302 75.5759C95.0656 75.4377 94.9768 75.5075 94.8939 75.5264C94.7614 75.557 94.6261 75.5832 94.4922 75.605C93.9665 75.6865 93.4329 75.704 92.9029 75.6574L93.3235 76.2104C93.6146 74.6581 93.8499 73.0975 94.0294 71.5286C94.0556 71.2943 93.8082 71.092 93.5928 71.092C92.6338 71.0984 91.6766 71.1743 90.7287 71.319C90.4944 71.354 90.3663 71.6479 90.423 71.8561C90.4926 72.0842 90.7286 72.2178 90.9601 72.1602V72.1675Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M94.6975 78.7661C94.7659 78.7326 94.8343 78.7006 94.9041 78.6715L94.7993 78.7151C95.0601 78.607 95.3334 78.5322 95.6129 78.4925L95.4964 78.5085L95.6201 78.4939C95.7352 78.4903 95.8449 78.4448 95.9287 78.3658C96.0989 78.1954 96.0989 77.9192 95.9287 77.7488C95.8479 77.6653 95.7363 77.619 95.6201 77.6207C95.1453 77.6657 94.6829 77.7985 94.2565 78.0122C94.1587 78.0708 94.0868 78.1645 94.0557 78.2742C94.0265 78.3878 94.0427 78.5084 94.1008 78.6103C94.2257 78.8138 94.489 78.8825 94.6975 78.7661Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M26.6572 105.239C27.1452 103.907 28.1096 102.803 29.3641 102.14C30.7074 101.423 32.3199 101.321 33.8175 101.685C34.7624 101.924 35.6675 102.299 36.5041 102.8C36.9901 103.091 37.4297 102.33 36.9407 102.046C35.318 101.097 33.4216 100.462 31.5224 100.625C29.898 100.762 28.3793 101.486 27.251 102.663C26.6105 103.336 26.12 104.138 25.8117 105.015C25.7627 105.167 25.8013 105.335 25.9124 105.45C26.0234 105.566 26.1889 105.612 26.3435 105.569C26.4981 105.526 26.6168 105.402 26.6528 105.246L26.6572 105.239Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M38.4063 87.5971C39.7545 87.1036 40.9363 86.2401 41.8162 85.1056C42.3081 85.8041 43.3909 85.6528 44.1578 85.2787C45.7749 84.4806 47.0114 83.0763 47.5983 81.3711C47.9703 82.7933 48.7891 84.0585 49.9341 84.9804C50.3503 85.3137 51.0052 85.5785 51.3632 85.1841C51.5017 84.9971 51.5739 84.7692 51.5684 84.5365C51.9265 78.5856 44.2408 76.9105 39.8675 78.6293C37.5188 79.5445 35.571 81.2634 34.3707 83.4799C32.9241 86.2131 32.5457 89.278 32.0421 92.2848C31.6273 94.7399 31.1194 97.2417 29.8591 99.4159C29.3963 100.215 28.8404 101.231 29.3817 101.974C29.4874 102.081 29.5662 102.21 29.6117 102.353C29.6189 102.471 29.5948 102.589 29.5418 102.695C29.0135 104.057 27.3908 104.694 26.4856 105.773C25.734 106.707 25.5183 107.963 25.9151 109.094C26.1379 109.712 26.5441 110.247 27.0794 110.628C27.6892 111.065 28.2437 111.245 28.5915 111.946C28.9495 112.674 29.3585 113.352 30.1924 113.606C31.0263 113.859 31.9985 113.524 32.6665 112.93C34.0709 111.68 34.6777 109.453 35.2322 107.727C35.8944 105.667 36.3849 103.558 36.8753 101.452C37.1664 100.212 37.4574 98.9619 37.4851 97.6885C37.4852 96.7629 37.4161 95.8386 37.2784 94.9233L36.8884 91.7856C36.8851 91.6777 36.8518 91.5729 36.7924 91.4829C36.6468 91.3024 36.363 91.3606 36.1302 91.365C35.3632 91.381 34.7869 90.6373 34.5599 89.9096C34.2091 88.7803 34.4449 87.405 35.3734 86.6715C36.3019 85.938 37.9261 86.1811 38.3801 87.274"
                        fill="#E9C26D"
                      />
                      <path
                        d="M38.5228 88.0177C39.9425 87.5022 41.1903 86.601 42.1262 85.4155L41.4407 85.3268C42.1684 86.3193 43.5131 86.0981 44.4795 85.6062C45.5378 85.0576 46.4457 84.2581 47.1238 83.2776C47.5041 82.7269 47.8058 82.1259 48.0203 81.4919H47.1791C47.4087 82.3769 47.8038 83.2105 48.3434 83.9486C48.6184 84.3239 48.9278 84.6727 49.2676 84.9906C49.5793 85.3014 49.9485 85.5486 50.3547 85.7183C50.7782 85.8754 51.2934 85.8638 51.6325 85.5291C51.9716 85.1943 52.0065 84.6879 52.0123 84.2309C52.0246 83.5965 51.9377 82.964 51.7547 82.3564C51.0271 79.9857 48.8208 78.539 46.5155 77.9351C44.136 77.3107 41.5106 77.4228 39.249 78.4168C37.6529 79.1188 36.2448 80.1873 35.1391 81.5356C33.9268 83.0259 33.1758 84.8145 32.6737 86.6569C32.1513 88.5693 31.8893 90.5398 31.5531 92.4914C31.2242 94.3994 30.8342 96.3364 30.0294 98.109C29.8358 98.5369 29.6132 98.9473 29.3803 99.3548C29.1281 99.7641 28.93 100.204 28.7909 100.665C28.649 101.127 28.688 101.626 28.9 102.06C28.9572 102.157 29.0214 102.249 29.0921 102.335C29.0921 102.335 29.1693 102.449 29.1649 102.42C29.1736 102.482 29.1052 102.593 29.0936 102.621C29.045 102.724 28.9906 102.825 28.9306 102.922C28.5755 103.492 27.9322 103.965 27.3967 104.377C26.7403 104.882 26.0869 105.412 25.7027 106.167C25.2971 106.977 25.1776 107.9 25.3636 108.787C25.5659 109.707 26.112 110.514 26.8902 111.044C27.1813 111.245 27.548 111.434 27.7838 111.638C28.0894 111.901 28.2204 112.24 28.4169 112.594C28.8535 113.355 29.4967 113.974 30.3918 114.105C32.2837 114.38 33.6692 112.748 34.41 111.214C34.7685 110.446 35.073 109.653 35.321 108.842C35.6121 107.93 35.9031 107.017 36.1607 106.093C36.4431 105.074 36.6978 104.047 36.9408 103.016C37.1911 101.963 37.456 100.909 37.6554 99.8453C37.8646 98.7868 37.9394 97.7062 37.8781 96.629C37.8038 95.5345 37.6379 94.4459 37.5026 93.3588C37.4371 92.8276 37.373 92.2949 37.3046 91.7579C37.2683 91.4843 37.1984 91.2369 36.9612 91.0695C36.7533 90.9429 36.5082 90.8916 36.267 90.924C35.9348 90.966 35.6046 90.8334 35.3938 90.5733C35.1524 90.2928 34.987 89.955 34.9135 89.5924C34.7338 88.8982 34.8276 88.1615 35.1755 87.5345C35.3382 87.246 35.5808 87.0105 35.874 86.8563C35.874 86.8563 36.005 86.7952 35.9293 86.8272C35.9628 86.8127 35.9977 86.801 36.0312 86.7894C36.1069 86.7632 36.1855 86.7414 36.2641 86.7224L36.3936 86.6977C36.3237 86.7093 36.3936 86.6977 36.4082 86.6977C36.5102 86.6885 36.6128 86.6851 36.7152 86.6875C36.9851 86.697 37.2487 86.7714 37.4837 86.9044C37.5113 86.9204 37.6525 87.0179 37.603 86.98C37.669 87.0319 37.7303 87.0893 37.7864 87.1518C37.8712 87.2543 37.9399 87.3691 37.9901 87.4923C38.0847 87.7092 38.402 87.7572 38.5883 87.6495C38.7907 87.523 38.859 87.2605 38.744 87.0513C38.1298 85.6309 36.104 85.4839 35.0125 86.3935C33.7667 87.4312 33.6197 89.5778 34.5337 90.8716C34.7791 91.2483 35.1349 91.5401 35.5524 91.707C35.7325 91.7719 35.9228 91.8039 36.1142 91.8016C36.2175 91.8016 36.3223 91.7841 36.4256 91.7885C36.4474 91.7885 36.4926 91.7739 36.4591 91.7885H36.4853C36.4623 91.7737 36.4417 91.7556 36.4242 91.7346C36.4533 91.7346 36.7749 94.4998 36.8084 94.7734C36.9379 95.8081 37.0747 96.8502 37.0252 97.8966C36.9757 98.943 36.7531 99.969 36.5188 100.986C36.0531 103.002 35.5873 105.02 34.9848 107.001C34.7374 107.813 34.4856 108.627 34.2019 109.427C33.9532 110.178 33.6208 110.898 33.2108 111.574C32.8222 112.189 32.3085 112.783 31.6099 113.077C31.2659 113.231 30.8857 113.285 30.5126 113.233C30.1584 113.174 29.834 112.999 29.5899 112.735C29.3501 112.459 29.1512 112.15 28.999 111.817C28.8133 111.435 28.5389 111.102 28.1986 110.848C27.8915 110.616 27.5422 110.446 27.2366 110.212C26.93 109.975 26.6758 109.678 26.49 109.338C26.1299 108.657 26.0475 107.863 26.26 107.122C26.4682 106.367 26.9688 105.825 27.5699 105.341C28.1229 104.891 28.7676 104.467 29.2653 103.911C29.5231 103.632 29.734 103.312 29.8897 102.966C29.9959 102.715 30.0876 102.461 30.0076 102.187C29.9421 101.96 29.7601 101.817 29.6568 101.614C29.5113 101.312 29.6001 100.948 29.7252 100.611C29.9 100.208 30.1044 99.819 30.3365 99.4465C30.8029 98.5894 31.1841 97.6886 31.4745 96.757C32.0567 94.9422 32.3477 93.0546 32.6548 91.1787C32.9677 89.2707 33.2937 87.3497 33.9457 85.5218C34.5279 83.8845 35.4011 82.3884 36.657 81.1834C37.7499 80.124 39.0698 79.3277 40.5166 78.8549C40.7737 78.7753 41.0352 78.7064 41.301 78.6482C41.4364 78.6191 41.5717 78.5914 41.7085 78.5682L41.8963 78.5376L42.0112 78.5201C42.0418 78.5201 42.1262 78.5041 42.0476 78.5201C42.6334 78.4449 43.224 78.4148 43.8144 78.4299C44.1055 78.4386 44.3965 78.4561 44.6876 78.4867C44.7545 78.4867 44.8215 78.4998 44.887 78.5085C44.9132 78.5085 45.1024 78.5361 45.0092 78.523C45.1679 78.5449 45.3265 78.5711 45.4837 78.5987C46.0556 78.7026 46.6178 78.854 47.1646 79.0513C47.2985 79.1008 47.4324 79.1517 47.5634 79.207C47.4833 79.1736 47.6521 79.2463 47.6725 79.2565C47.7424 79.2871 47.818 79.3206 47.8821 79.354C48.1388 79.4775 48.3885 79.615 48.6301 79.7659C48.7407 79.8358 48.8499 79.9085 48.9576 79.9842L49.122 80.105C49.1395 80.1181 49.205 80.169 49.1366 80.1152L49.253 80.2083C49.4591 80.379 49.6536 80.5633 49.8351 80.7599C49.921 80.853 50.0054 80.9491 50.0855 81.051L50.1422 81.1223C50.0796 81.0422 50.1539 81.1383 50.1626 81.1499C50.2063 81.2081 50.247 81.2678 50.2892 81.3289C50.4395 81.5519 50.5728 81.7859 50.688 82.029C50.6996 82.0537 50.7709 82.2182 50.7345 82.1294C50.7637 82.1978 50.7899 82.2749 50.816 82.3389C50.8641 82.4699 50.9063 82.6038 50.9441 82.7377C50.982 82.8716 51.014 83.0157 51.0416 83.1554C51.0533 83.2209 51.0649 83.2864 51.0751 83.3519C51.0751 83.3621 51.094 83.4974 51.0824 83.3955C51.0824 83.4363 51.0926 83.4756 51.0955 83.5163C51.1285 83.8339 51.1367 84.1536 51.1202 84.4725C51.1273 84.6125 51.0993 84.7521 51.0387 84.8785C50.9878 84.9542 50.8844 84.9629 50.7709 84.9367C50.4115 84.8567 50.148 84.6238 49.873 84.3706C49.5698 84.0944 49.2949 83.7887 49.0522 83.4581C48.5678 82.7968 48.2118 82.0503 48.0029 81.2576C47.8879 80.821 47.2956 80.8661 47.1617 81.2576C46.8366 82.1891 46.3007 83.0328 45.5957 83.723C45.2444 84.0684 44.8536 84.3713 44.4315 84.6253C44.0525 84.8747 43.6291 85.0486 43.1842 85.1376C43.0879 85.1524 42.9906 85.1602 42.8932 85.1609C42.8306 85.1609 42.768 85.1609 42.7054 85.1609C42.6428 85.1609 42.6967 85.1609 42.7054 85.1609L42.6152 85.1448C42.5567 85.1323 42.4993 85.1153 42.4435 85.0939C42.4988 85.1143 42.3663 85.0546 42.3489 85.0444C42.3314 85.0342 42.311 85.0211 42.2936 85.008C42.2339 84.9673 42.3314 85.043 42.2776 84.9949C42.2543 84.9746 42.2339 84.9542 42.2121 84.9324C42.1902 84.9105 42.148 84.8567 42.1771 84.896C42.0316 84.6981 41.6823 84.5642 41.4917 84.8072C40.6612 85.8842 39.5469 86.7082 38.2739 87.1867C38.0457 87.2563 37.9116 87.492 37.9683 87.7237C38.0327 87.9559 38.273 88.0921 38.5053 88.0279L38.5228 88.0177Z"
                        fill="#EAC36E"
                      />
                      <path
                        d="M41.7099 93.2613C42.2804 93.2613 42.8276 92.7592 42.8015 92.1698C42.7913 91.5712 42.3085 91.0884 41.7099 91.0782C41.138 91.0782 40.5908 91.5803 40.6184 92.1698C40.6286 92.7683 41.1114 93.2511 41.7099 93.2613Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M49.9414 93.2613C50.5119 93.2613 51.0591 92.7592 51.0329 92.1698C51.0228 91.5712 50.54 91.0884 49.9414 91.0782C49.3694 91.0782 48.8222 91.5803 48.8499 92.1698C48.86 92.7683 49.3428 93.2511 49.9414 93.2613Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M39.3844 98.4496C39.1063 98.1733 38.877 97.852 38.7062 97.4993C38.5456 97.1318 38.4345 96.7447 38.3758 96.3481C38.271 95.7572 38.2113 95.1576 38.1386 94.5624C38.0804 94.0879 38.0513 93.6164 38.0294 93.1391C37.9974 92.4565 37.9552 91.7739 37.9115 91.0928C37.9086 90.9576 37.8442 90.8311 37.7365 90.7492C37.6288 90.6673 37.4896 90.639 37.3585 90.6723C37.3309 90.6723 37.2377 90.6897 37.3367 90.6723C37.4357 90.6548 37.3367 90.6723 37.3018 90.6723L37.1679 90.6839C37.0631 90.6839 36.9583 90.6926 36.8535 90.6839C36.7953 90.6839 36.7356 90.6839 36.6774 90.6766L36.577 90.6679C36.5581 90.6679 36.4489 90.6504 36.5159 90.6606C36.5828 90.6708 36.4737 90.6606 36.4533 90.649C36.4329 90.6373 36.3907 90.6373 36.3602 90.6315C36.2859 90.6155 36.2146 90.5966 36.1389 90.5762C36.0633 90.5558 35.9934 90.5267 35.9177 90.4991C35.989 90.5253 35.9294 90.4991 35.8959 90.4874C35.8624 90.4758 35.8115 90.4467 35.7707 90.4234C35.7031 90.3863 35.6375 90.3455 35.5743 90.3011C35.4928 90.2458 35.5859 90.3186 35.5306 90.2691C35.4986 90.24 35.4651 90.2124 35.4331 90.1818C35.3721 90.1237 35.3148 90.062 35.2614 89.997C35.3109 90.0581 35.2323 89.9577 35.2206 89.9402C35.193 89.8995 35.1668 89.8573 35.142 89.8151C35.044 89.6591 34.9741 89.4872 34.9354 89.3071C34.9266 89.2722 34.9194 89.2358 34.9135 89.2009L34.9004 89.1281C34.9004 89.1281 34.9092 89.2053 34.9004 89.1543C34.8924 89.0692 34.8895 88.9837 34.8917 88.8982C34.8917 88.856 34.8917 88.8123 34.899 88.7701C34.9063 88.7279 34.915 88.661 34.899 88.7381C34.9121 88.6524 34.9296 88.5674 34.9514 88.4834C34.9732 88.4034 34.9965 88.3262 35.0256 88.2491C35.0343 88.2244 35.0765 88.1181 35.0445 88.1938C35.0634 88.1472 35.0853 88.1021 35.1086 88.0483C35.1851 87.8959 35.2737 87.7499 35.3734 87.6117L35.4084 87.5651C35.4084 87.5651 35.3662 87.6175 35.3982 87.5782C35.4302 87.5389 35.4535 87.5098 35.4826 87.4778C35.5408 87.4123 35.6005 87.3482 35.663 87.2886C35.7256 87.2289 35.7809 87.1809 35.8435 87.1314C35.8813 87.1008 35.8304 87.1416 35.826 87.1445L35.8843 87.1023L35.989 87.0339C36.0583 86.9909 36.1297 86.9516 36.203 86.916L36.2495 86.8942C36.2495 86.8942 36.1768 86.9218 36.2234 86.9058C36.2699 86.8898 36.3078 86.8738 36.35 86.8607C36.429 86.8365 36.5098 86.818 36.5916 86.8054C36.4926 86.8214 36.5916 86.8054 36.6367 86.8054C36.6745 86.8032 36.7124 86.8032 36.7502 86.8054H36.8142C36.8753 86.8054 36.7342 86.7894 36.7953 86.8054C36.8564 86.8214 36.8797 86.8214 36.9219 86.8331C36.9641 86.8447 36.9961 86.8563 37.034 86.868C37.0718 86.8796 37.1038 86.9044 37.0223 86.868C37.0442 86.8782 37.0645 86.8869 37.0849 86.8985C37.1053 86.9102 37.1679 86.9437 37.2072 86.9699L37.2523 87.0004C37.2028 86.9582 37.3061 87.0368 37.2523 87.0004C37.3294 87.0646 37.4014 87.1347 37.4677 87.21C37.4872 87.2308 37.5057 87.2527 37.523 87.2755C37.4939 87.2391 37.523 87.2755 37.5361 87.2929C37.5725 87.3424 37.6074 87.3948 37.6409 87.4487C37.7125 87.5665 37.7771 87.6885 37.8344 87.814C37.8928 87.9143 37.9886 87.9872 38.1009 88.0167C38.2131 88.0462 38.3324 88.0298 38.4326 87.9711C38.6363 87.8456 38.7049 87.5819 38.5883 87.373C38.2128 86.5667 37.4793 85.8361 36.5217 85.9424C35.6791 86.0355 34.9834 86.6046 34.5322 87.2973C34.0811 87.9901 33.8584 88.9229 34.1437 89.735C34.4287 90.5815 35.1254 91.2244 35.992 91.4407C36.5112 91.5751 37.0536 91.5945 37.5812 91.4974L37.0282 91.0768C37.0864 91.9821 37.1184 92.8887 37.1737 93.794C37.2304 94.6512 37.3556 95.52 37.488 96.367C37.6467 97.3857 38.0192 98.3084 38.7527 99.0521C39.1486 99.4523 39.7715 98.8338 39.3713 98.4336L39.3844 98.4496Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M49.3941 85.4403C49.7041 86.6424 49.9326 87.8664 50.1466 89.0889C50.3823 90.435 50.5832 91.7492 50.7287 93.075C50.8742 94.3761 51.0067 95.7572 50.685 97.0292C50.5312 97.7045 50.1796 98.3186 49.675 98.7931C49.1835 99.211 48.5984 99.5041 47.9694 99.6474C47.2064 99.8299 46.4252 99.9251 45.6408 99.9312C44.6174 99.986 43.5913 99.9622 42.5715 99.8598C42.3372 99.8307 42.1349 100.08 42.1349 100.296C42.141 100.535 42.3329 100.727 42.5715 100.733C43.5192 100.828 44.4725 100.854 45.424 100.81C46.1945 100.802 46.9632 100.731 47.7219 100.596C48.4574 100.473 49.1604 100.202 49.7885 99.8002C50.436 99.3671 50.9444 98.756 51.2526 98.0407C51.8347 96.6756 51.7925 95.13 51.6587 93.6746C51.5306 92.2921 51.3254 90.9095 51.0983 89.5458C50.8568 88.0905 50.5948 86.6351 50.2251 85.2045C50.0796 84.6602 49.2428 84.8902 49.3825 85.4359L49.3941 85.4403Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M42.9586 90.3739C43.5204 90.3739 43.5218 89.5007 42.9586 89.5007C42.3954 89.5007 42.3968 90.3739 42.9586 90.3739Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M49.1889 90.2254L49.2515 90.1629C49.2941 90.1233 49.3253 90.0731 49.3417 90.0173C49.3689 89.9659 49.382 89.9081 49.3796 89.85C49.382 89.7913 49.3689 89.7331 49.3417 89.6811C49.3251 89.6255 49.2939 89.5753 49.2515 89.5356L49.1627 89.4672C49.096 89.4282 49.0202 89.4076 48.943 89.4075L48.8265 89.4221C48.7537 89.4426 48.6875 89.4818 48.6344 89.5356L48.5718 89.5967C48.5299 89.6368 48.4988 89.6869 48.4816 89.7423C48.4313 89.8487 48.4313 89.972 48.4816 90.0784C48.4984 90.134 48.5296 90.1842 48.5718 90.224L48.6606 90.2924C48.7274 90.331 48.8032 90.3516 48.8804 90.352L48.9968 90.336C49.0696 90.3163 49.1359 90.2776 49.1889 90.224V90.2254Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M36.593 88.5474C36.5712 88.5736 36.5653 88.5809 36.577 88.5692L36.5886 88.5576C36.5886 88.5678 36.5435 88.5867 36.577 88.5692C36.6105 88.5518 36.5261 88.5838 36.561 88.5692C36.5723 88.5672 36.5835 88.5643 36.5945 88.5605C36.5814 88.5605 36.5406 88.5605 36.5784 88.5605H36.6076H36.5784H36.5959C36.6061 88.5605 36.6367 88.578 36.6046 88.5605C36.5726 88.543 36.6046 88.5605 36.6046 88.5605C36.6159 88.5696 36.6281 88.5774 36.641 88.5838C36.609 88.5591 36.6236 88.5838 36.641 88.5838L36.6672 88.61C36.6753 88.6216 36.6845 88.6323 36.6949 88.642C36.6716 88.61 36.6803 88.6333 36.6949 88.642C36.7182 88.674 36.7254 88.6871 36.74 88.7104C36.8027 88.8035 36.8591 88.9008 36.9088 89.0015C36.9144 89.0165 36.9212 89.0311 36.9292 89.0451C36.9117 89.0029 36.9205 89.0451 36.9292 89.0451C36.9466 89.0873 36.9481 89.1004 36.9554 89.1281C36.9655 89.1526 36.9714 89.1787 36.9728 89.2052C36.9728 89.1761 36.9728 89.1703 36.9728 89.1863C36.9721 89.1945 36.9721 89.2028 36.9728 89.211V89.2271C36.9816 89.1921 36.9816 89.1863 36.9728 89.2096L37.0281 89.1121L37.0951 89.0757H37.1286C37.1203 89.075 37.1121 89.075 37.1038 89.0757H37.05C37.0252 89.0757 37.0922 89.0888 37.0718 89.0757H37.0485C37.0267 89.0757 37.0878 89.0946 37.0689 89.0844C37.05 89.0742 37.1126 89.1223 37.0834 89.0946C37.1168 89.1252 37.1303 89.1718 37.1184 89.2154C37.1257 89.1878 37.1184 89.2154 37.1111 89.2314C37.1227 89.2052 37.1111 89.2314 37.0995 89.2431C37.1184 89.2212 37.0995 89.2431 37.0878 89.2431C37.0989 89.2384 37.1092 89.232 37.1184 89.2241L37.1766 89.1965C37.2801 89.1353 37.3146 89.0019 37.2537 88.8982C37.191 88.7968 37.0599 88.7622 36.9554 88.8196C36.8412 88.8639 36.7509 88.9542 36.7065 89.0684C36.6635 89.1895 36.6967 89.3245 36.7909 89.4119C36.8788 89.4836 36.9906 89.5195 37.1038 89.5123C37.1676 89.5138 37.2305 89.4977 37.2857 89.4657C37.3645 89.4129 37.4106 89.3233 37.408 89.2285C37.3952 89.0209 37.3285 88.8203 37.2144 88.6464C37.1297 88.4727 37.0062 88.3208 36.8535 88.2025C36.764 88.1452 36.6582 88.1186 36.5522 88.1268C36.4185 88.1356 36.2961 88.2053 36.2204 88.316C36.1607 88.4202 36.1957 88.5531 36.299 88.6144C36.4035 88.6717 36.5346 88.6371 36.5974 88.5358L36.593 88.5474Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M37.0165 102.967C37.4259 102.042 37.7343 101.076 37.9363 100.085C38.1652 99.0959 38.3362 98.0939 38.4486 97.0845C38.4748 96.8502 38.2303 96.6479 38.012 96.6479C37.7734 96.654 37.5815 96.8459 37.5754 97.0845C37.5521 97.2999 37.5303 97.4702 37.5084 97.6288C37.4749 97.8616 37.4386 98.0916 37.3993 98.323C37.3105 98.8353 37.2101 99.3417 37.0936 99.854C36.9772 100.366 36.8535 100.845 36.7051 101.333C36.6367 101.555 36.5595 101.778 36.4824 101.996C36.4446 102.098 36.4067 102.199 36.366 102.298C36.3543 102.325 36.3543 102.327 36.366 102.298L36.3311 102.376C36.3092 102.427 36.2859 102.478 36.2612 102.522C36.1464 102.731 36.2154 102.994 36.4184 103.12C36.6266 103.241 36.8936 103.171 37.0151 102.963L37.0165 102.967Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M42.8029 103.98C43.206 102.9 43.4418 101.763 43.8464 100.684C43.9103 100.451 43.7734 100.21 43.5408 100.147C43.3081 100.083 43.0676 100.219 43.0037 100.452C42.5991 101.532 42.3648 102.667 41.9603 103.747C41.9295 103.859 41.9444 103.978 42.0017 104.079C42.0591 104.18 42.1541 104.253 42.2659 104.284C42.4974 104.342 42.7339 104.208 42.8029 103.98Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M42.6966 104C44.5886 103.724 46.6683 103.473 48.355 104.572C49.8598 105.553 50.7214 107.259 51.1696 108.953C51.4509 110.114 51.6454 111.294 51.7518 112.483C51.7586 112.722 51.9501 112.913 52.1884 112.92C52.4052 112.92 52.6526 112.719 52.625 112.483C52.3819 110.315 52.0982 108.066 50.9674 106.154C50.4829 105.316 49.8357 104.584 49.0638 104C48.2251 103.398 47.2419 103.029 46.2142 102.931C44.9641 102.785 43.7008 102.974 42.4638 103.153C42.2309 103.187 42.1029 103.484 42.1596 103.69C42.2286 103.919 42.4648 104.053 42.6966 103.996V104Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M42.5948 87.9638L44.9044 87.9944L44.4678 87.5578C44.5478 88.677 44.6133 89.7976 44.7094 90.9153C44.7763 91.7419 44.9655 92.733 45.8038 93.1201C46.2797 93.3413 46.8007 93.3093 47.3028 93.2002C47.8049 93.091 48.4001 92.9469 48.4904 92.359C48.5083 92.0905 48.4942 91.8208 48.4482 91.5556L48.3681 90.6912L48.2124 89.0364L48.1236 88.1021C48.1076 87.9333 48.0916 87.7659 48.0771 87.5971C48.0791 87.5391 48.0752 87.4811 48.0654 87.4239C48.0534 87.498 48.0112 87.5638 47.949 87.6058C47.9267 87.6204 47.9398 87.6204 47.9883 87.6058C48.1473 87.5988 48.3053 87.5758 48.4598 87.5374L48.8848 87.4748L49.8773 87.3293C50.1116 87.2958 50.2397 86.9989 50.1829 86.7923C50.1133 86.5641 49.8776 86.43 49.6459 86.4867L48.0858 86.7152C47.8398 86.7515 47.5837 86.7646 47.3916 86.9451C47.1995 87.1256 47.1849 87.4108 47.2097 87.6728L47.5007 90.8381L47.575 91.6298C47.5866 91.7506 47.5982 91.87 47.6084 91.9893C47.6093 92.0541 47.6147 92.1188 47.6244 92.1829C47.6477 92.2877 47.5822 92.2411 47.6492 92.1829C47.687 92.1552 47.5851 92.2076 47.6244 92.2018C47.5749 92.2145 47.5263 92.2305 47.4789 92.2498C47.3814 92.2775 47.2839 92.3037 47.1878 92.327C46.9922 92.3799 46.7909 92.4092 46.5882 92.4143C46.4151 92.4202 46.2441 92.3751 46.0963 92.2848C45.9882 92.21 45.8998 92.1101 45.8387 91.9937C45.7002 91.7011 45.6173 91.3852 45.5942 91.0623C45.4778 89.898 45.424 88.7221 45.3396 87.5534C45.3334 87.3149 45.1415 87.1229 44.9029 87.1168L42.5933 87.0863C42.0316 87.0863 42.0316 87.9595 42.5933 87.9595L42.5948 87.9638Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M46.0498 94.2087C45.3352 94.2757 44.689 93.9569 44.0749 93.6266C43.4607 93.2962 42.7927 92.9557 42.2426 92.4929C41.9646 92.26 41.4931 92.3983 41.496 92.8014C41.5105 94.1112 41.9806 95.421 43.0707 96.2171C43.3116 96.3901 43.5763 96.5273 43.8566 96.6246C44.1753 96.7381 44.5755 96.8327 44.8491 96.5693C45.1227 96.3059 45.079 95.8707 45.0616 95.5505C45.0437 95.1776 44.9691 94.8095 44.8404 94.459C44.7708 94.2308 44.5351 94.0967 44.3033 94.1534C44.1916 94.184 44.0965 94.2578 44.0392 94.3586C43.9819 94.4593 43.9669 94.5787 43.9977 94.6904C44.0896 94.924 44.1503 95.1687 44.1782 95.4181C44.1913 95.5511 44.1957 95.6848 44.1913 95.8183C44.1833 95.8845 44.1794 95.9511 44.1796 96.0177C44.2306 96.0701 44.3543 95.811 44.4096 95.8722C44.3571 95.8541 44.303 95.841 44.248 95.8329C44.1942 95.8183 44.1418 95.8009 44.0894 95.7834C44.003 95.7525 43.9193 95.7145 43.8391 95.6699C43.6588 95.5742 43.4915 95.4559 43.3414 95.3177C42.6443 94.673 42.3794 93.727 42.3692 92.8014L41.6241 93.1099C42.2649 93.6163 42.9582 94.0525 43.6921 94.411C44.4198 94.7938 45.2086 95.1576 46.0498 95.0776C46.2883 95.0714 46.4802 94.8795 46.4864 94.6409C46.4864 94.3998 46.2909 94.2043 46.0498 94.2043V94.2087Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M42.4246 95.1926C42.6604 95.3716 42.9084 95.534 43.1668 95.6786C43.3205 95.7596 43.4806 95.8278 43.6456 95.8824C43.7111 95.9042 43.778 95.9202 43.8464 95.9362L43.9076 95.9537C43.957 95.9639 43.8275 95.9144 43.8712 95.9392C43.8915 95.9508 43.8857 95.9392 43.8566 95.9246C43.8366 95.9138 43.82 95.8977 43.8086 95.878C43.7915 95.8613 43.7794 95.8401 43.7737 95.8169C43.7591 95.7762 43.7562 95.7718 43.7649 95.8038L43.7504 95.6874C43.7518 95.7004 43.7518 95.7136 43.7504 95.7267L43.7649 95.6117C43.7562 95.6539 43.7649 95.6379 43.7882 95.5608L44.4737 95.4734L44.3747 95.389C44.2904 95.31 44.1802 95.2645 44.0647 95.261C43.8876 95.2605 43.7278 95.3671 43.6601 95.5308C43.5925 95.6945 43.6304 95.8828 43.7562 96.0076L43.8566 96.0905C43.9537 96.1851 44.0892 96.2291 44.2234 96.2098C44.3558 96.1929 44.4733 96.1162 44.5421 96.0017C44.6226 95.857 44.6398 95.6854 44.5897 95.5276C44.5395 95.3697 44.4265 95.2396 44.2772 95.1678C44.172 95.1229 44.0629 95.0878 43.9512 95.063C43.909 95.0514 43.8668 95.0383 43.8261 95.0237L43.7533 94.9961C43.6791 94.9684 43.8217 95.0267 43.7722 95.0048C43.4517 94.8462 43.1476 94.6566 42.8641 94.4387C42.7107 94.3486 42.5179 94.3606 42.3768 94.469C42.2358 94.5774 42.1746 94.7606 42.2223 94.9321C42.2586 95.0387 42.3292 95.1303 42.4231 95.1926H42.4246Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M91.3168 66.6867C93.8479 68.0691 96.7865 68.5109 99.6122 67.934C100.399 67.7691 101.167 67.5253 101.904 67.2063C102.121 67.1132 102.169 66.793 102.06 66.6082C101.935 66.4053 101.672 66.3368 101.463 66.4524C99.0244 67.4612 96.309 67.5832 93.7894 66.7974C93.0847 66.5761 92.4045 66.2835 91.7592 65.9241C91.2673 65.652 90.8263 66.4059 91.3226 66.678L91.3168 66.6867Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M102.296 69.7153C102.858 69.7153 102.859 68.8421 102.296 68.8421C101.733 68.8421 101.733 69.7153 102.296 69.7153Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M40.7247 86.0995C41.9457 86.5361 43.3152 86.4226 44.4998 85.9293C45.6845 85.4359 46.6581 84.5714 47.4294 83.5469C47.8393 82.9906 48.1891 82.3925 48.4729 81.7626C48.5875 81.5536 48.5185 81.2914 48.3157 81.1659C48.1079 81.0445 47.841 81.1141 47.719 81.3216C46.8095 83.3126 45.1693 85.2176 42.8611 85.4635C42.2225 85.5369 41.5756 85.4642 40.9692 85.2511C40.7369 85.1869 40.4965 85.323 40.4321 85.5552C40.368 85.7875 40.5041 86.0279 40.7363 86.0923L40.7247 86.0995Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M27.334 103.817C25.8365 104.728 24.4845 106.271 24.5805 108.132C24.6082 108.968 24.9351 109.766 25.5017 110.382C25.8079 110.682 26.1705 110.918 26.5685 111.076C26.9192 111.222 27.3311 111.38 27.5392 111.693C27.7648 112.035 27.8419 112.456 28.0122 112.839C28.1947 113.259 28.5136 113.606 28.9174 113.822C29.3508 114.037 29.8189 114.174 30.3 114.225C30.8314 114.314 31.3749 114.3 31.9009 114.183C33.6371 113.747 34.359 111.913 34.848 110.382C35.2816 109.029 35.7134 107.677 36.1432 106.326C36.1848 106.175 36.1429 106.014 36.0334 105.903C35.9238 105.792 35.7632 105.747 35.6121 105.786C35.4609 105.826 35.3422 105.943 35.3006 106.093L34.3313 109.111C34.0912 109.862 33.8656 110.672 33.5571 111.37C33.266 112.019 32.8934 112.67 32.336 113.041C31.6418 113.502 30.7497 113.477 29.9362 113.272C29.5854 113.186 29.2318 113.061 28.9917 112.788C28.7515 112.514 28.6889 112.166 28.5667 111.839C28.4287 111.406 28.1647 111.024 27.8085 110.741C27.4825 110.498 27.0924 110.373 26.7301 110.196C26.1188 109.895 25.6786 109.331 25.5352 108.665C25.3524 107.887 25.4842 107.068 25.902 106.387C26.3689 105.635 27.015 105.011 27.7823 104.571C28.2611 104.28 27.823 103.523 27.3457 103.817H27.334Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M36.1941 104.786C36.7559 104.786 36.7574 103.913 36.1941 103.913C35.6309 103.913 35.6309 104.786 36.1941 104.786Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M47.9592 83.9849C48.5035 84.5574 49.1064 85.071 49.758 85.5174C50.0746 85.7612 50.4493 85.9182 50.8452 85.9729C51.2654 86.0217 51.676 85.8232 51.8988 85.4635C52.1899 84.9804 51.4331 84.5409 51.145 85.0269C51.1173 85.0721 51.113 85.0808 51.1319 85.0502C51.0926 85.0866 51.0868 85.0939 51.1115 85.0691C51.0766 85.0982 51.0708 85.1012 50.998 85.1113C50.8918 85.1115 50.7865 85.0913 50.688 85.0517C50.4447 84.9434 50.2178 84.8013 50.0142 84.6296C49.4991 84.2555 49.0183 83.8361 48.5778 83.3766C48.4057 83.2163 48.1376 83.221 47.9714 83.3873C47.8051 83.5535 47.8004 83.8216 47.9607 83.9936L47.9592 83.9849Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M11.6935 48.5997C11.2801 50.9094 13.4704 52.8202 15.3886 53.6352C17.5018 54.5212 19.9039 54.3936 21.9114 53.2889C22.9447 52.7198 24.01 51.8335 24.2298 50.6067C24.2857 50.375 24.1519 50.1398 23.9242 50.0696C23.8124 50.0389 23.693 50.0538 23.5923 50.1111C23.4915 50.1684 23.4177 50.2635 23.3871 50.3753C23.2256 51.279 22.4906 51.9208 21.7368 52.3822C19.1924 53.9462 15.9139 53.6009 13.7513 51.541C13.0382 50.8613 12.3513 49.8644 12.5361 48.8311C12.592 48.5995 12.4582 48.3643 12.2305 48.2941C12.1187 48.2633 11.9993 48.2783 11.8986 48.3356C11.7979 48.3929 11.7241 48.4879 11.6935 48.5997Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M70.3715 36.9279C70.7513 38.4356 71.7424 39.7105 72.9911 40.6084C74.3708 41.5981 76.056 42.0754 77.7268 42.2559C79.1915 42.435 80.6776 42.299 82.0855 41.8571C83.5406 41.3944 84.8015 40.4631 85.6715 39.2084C86.1802 38.4287 86.589 37.5882 86.8882 36.7066C87.2345 35.7549 87.5241 34.7419 87.4208 33.7188C87.4147 33.4803 87.2228 33.2883 86.9842 33.2822C86.7431 33.2822 86.5476 33.4777 86.5476 33.7188C86.632 34.5615 86.4268 35.3721 86.1561 36.1624C85.9193 36.8832 85.6147 37.58 85.2465 38.2435C84.581 39.4312 83.5293 40.3555 82.266 40.8631C80.9992 41.3453 79.6414 41.5412 78.29 41.4365C76.7881 41.3463 75.2629 40.9766 73.9618 40.2038C72.6607 39.4311 71.5896 38.1969 71.2127 36.7023C71.0759 36.158 70.2332 36.3879 70.3715 36.9337V36.9279Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M35.4084 108.753C38.2636 109.886 41.3307 110.387 44.398 110.22C45.2766 110.172 46.1515 110.07 47.0176 109.915C47.2499 109.85 47.386 109.61 47.3218 109.378C47.2535 109.149 47.0164 109.014 46.7848 109.074C43.8746 109.583 40.8884 109.456 38.0324 108.7C37.2201 108.485 36.4216 108.222 35.6412 107.911C35.4229 107.823 35.1624 108.007 35.1042 108.216C35.0467 108.448 35.1811 108.684 35.4098 108.753H35.4084Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M45.67 103.507C46.436 106.141 46.8903 108.856 47.0235 111.596C47.0603 112.384 47.071 113.171 47.0555 113.958C47.0453 114.519 47.9185 114.519 47.9287 113.958C47.9804 111.137 47.701 108.319 47.0962 105.563C46.9274 104.794 46.7334 104.031 46.5141 103.274C46.3584 102.736 45.5157 102.964 45.6715 103.507H45.67Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M98.3911 87.3745C97.5685 87.974 96.8535 88.7087 96.2765 89.5473C96.0728 89.8383 96.3522 90.1774 96.6534 90.2036C97.6503 90.291 98.6458 90.3739 99.6427 90.4627C99.8406 90.4816 99.6078 90.4467 99.6427 90.419C99.6769 90.5211 99.7167 90.6212 99.762 90.7188L100.04 91.4203L100.595 92.8262C100.652 93.0124 100.822 93.1416 101.017 93.1478C101.213 93.1475 101.385 93.0159 101.437 92.8262C101.759 91.3644 101.97 89.8807 102.07 88.3874L101.859 88.7643L104.333 86.9728C104.535 86.8469 104.604 86.5852 104.49 86.3761C104.432 86.2758 104.336 86.2028 104.224 86.1733C104.112 86.1438 103.992 86.1602 103.892 86.2189L102.339 87.3468L101.562 87.9115C101.376 88.0468 101.228 88.1501 101.203 88.3932C101.185 88.5562 101.18 88.7206 101.166 88.8851C101.06 90.1348 100.871 91.376 100.6 92.6006H101.443L100.835 91.0608L100.517 90.2575C100.407 89.9781 100.28 89.7336 99.9702 89.6433C99.7102 89.5887 99.4455 89.5594 99.1799 89.556L98.3518 89.4832L96.6593 89.3377L97.0362 89.9955C97.5283 89.279 98.1373 88.6502 98.8379 88.1356C99.04 88.0097 99.1089 87.748 98.9951 87.5389C98.9367 87.4386 98.8409 87.3656 98.7286 87.3362C98.6164 87.3067 98.497 87.3231 98.3969 87.3817L98.3911 87.3745Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M98.2107 92.9004C98.7724 92.9004 98.7739 92.0272 98.2107 92.0272C97.6475 92.0272 97.6489 92.9004 98.2107 92.9004Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M98.8744 94.7021C99.4361 94.7021 99.4376 93.8289 98.8744 93.8289C98.3112 93.8289 98.3126 94.7021 98.8744 94.7021Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M128.469 13.769C128.323 11.3822 127.942 7.89522 125.629 6.54466C124.768 6.04257 123.726 5.95234 122.73 6.00764C119.869 6.16336 116.976 6.44424 114.137 6.83282C111.841 7.14572 109.383 7.61725 107.497 9.05222C105.221 10.7841 104.525 13.6744 104.275 16.3901C104.108 18.2121 104.105 20.1041 104.787 21.8025C105.47 23.5009 106.96 24.9722 108.779 25.1745L106.525 30.0834L110.687 26.1612C110.912 25.9309 111.165 25.7308 111.441 25.566C111.834 25.3535 112.288 25.2895 112.731 25.2298L119.491 24.3173C122.017 23.9768 124.766 23.5227 126.476 21.6264C128.106 19.8028 128.656 16.7161 128.469 13.769Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M129.56 13.769C129.476 12.449 129.348 11.1116 129.01 9.82941C128.662 8.50359 128.058 7.13848 127.012 6.21579C126.36 5.63025 125.564 5.22846 124.705 5.05152C123.761 4.86523 122.831 4.90598 121.879 4.97002C119.976 5.09129 118.079 5.26351 116.186 5.48666C112.792 5.88397 109.006 6.22452 106.337 8.60401C103.929 10.7521 103.291 14.1852 103.118 17.2546C103.013 19.1247 103.191 21.0457 104.018 22.7485C104.73 24.2363 105.982 25.3972 107.519 25.9954C107.926 26.1377 108.35 26.2301 108.779 26.2704L107.836 24.6273L105.583 29.5362C105.441 29.7924 105.402 30.0931 105.473 30.3774C105.541 30.6027 105.678 30.8011 105.864 30.945C106.297 31.2764 106.908 31.2398 107.298 30.8591L109.826 28.468L111.09 27.2761C111.284 27.0941 111.475 26.9093 111.673 26.7318C111.721 26.6881 111.77 26.6488 111.818 26.6051C111.897 26.5353 111.601 26.7594 111.802 26.6212C111.916 26.5428 112.037 26.4761 112.165 26.4218L111.904 26.5309C112.311 26.3878 112.734 26.2964 113.164 26.2588L114.531 26.0739L117.335 25.6956C118.965 25.4758 120.616 25.3099 122.224 24.9679C123.778 24.6332 125.28 24.067 126.526 23.0759C127.748 22.1052 128.524 20.6921 128.987 19.2222C129.537 17.4758 129.672 15.5911 129.56 13.7748C129.525 13.2058 129.083 12.6557 128.469 12.6833C127.907 12.7081 127.339 13.1651 127.377 13.7748C127.447 14.8302 127.414 15.8898 127.278 16.9388L127.318 16.6477C127.195 17.6192 126.945 18.5703 126.575 19.4769L126.684 19.2149C126.525 19.5925 126.335 19.9566 126.117 20.3035C126.06 20.3908 126.003 20.4767 125.942 20.5626L125.852 20.6863C125.733 20.8493 126.027 20.4723 125.897 20.6281C125.768 20.7838 125.635 20.9351 125.491 21.0792C125.347 21.2233 125.185 21.3703 125.024 21.4969C124.862 21.6235 125.238 21.3412 125.073 21.4591C125.03 21.4911 124.988 21.5231 124.942 21.5536C124.862 21.6119 124.779 21.6657 124.696 21.7196C124.336 21.9473 123.958 22.145 123.566 22.3104L123.826 22.1998C122.82 22.6007 121.771 22.8849 120.7 23.0468C119.475 23.2549 118.238 23.399 117.006 23.5649L112.872 24.1238C112.166 24.2184 111.465 24.2926 110.834 24.6593C110.204 25.0261 109.699 25.598 109.178 26.0885L105.754 29.3164L107.468 30.6379L109.718 25.7188C109.885 25.355 109.931 24.9795 109.718 24.6171C109.506 24.2548 109.171 24.1238 108.776 24.0772L108.67 24.0627L108.961 24.102C108.611 24.0513 108.269 23.9574 107.943 23.8225L108.205 23.9331C107.897 23.8025 107.604 23.6395 107.331 23.4471L107.244 23.3743C107.139 23.2986 107.455 23.546 107.318 23.431C107.251 23.3743 107.181 23.319 107.116 23.2593C106.989 23.1472 106.869 23.0279 106.754 22.9042C106.651 22.7684 106.54 22.6391 106.422 22.5171C106.439 22.5302 106.58 22.7267 106.495 22.6088L106.416 22.4996C106.364 22.4254 106.314 22.3541 106.27 22.2755C106.083 21.9807 105.92 21.6711 105.783 21.3499L105.893 21.6104C105.623 20.9477 105.439 20.2525 105.348 19.5424L105.387 19.8334C105.195 18.3781 105.294 16.8776 105.489 15.4223L105.45 15.7134C105.59 14.5582 105.88 13.4261 106.313 12.3457L106.203 12.6062C106.383 12.1768 106.599 11.7631 106.847 11.3692C106.914 11.2644 106.984 11.1596 107.055 11.0577L107.149 10.9282C107.269 10.7652 106.992 11.1247 107.11 10.9777C107.263 10.7872 107.425 10.6045 107.596 10.4305C107.764 10.2601 107.941 10.0993 108.127 9.94874C108.324 9.79011 107.935 10.0943 108.11 9.96184L108.255 9.8556C108.36 9.77992 108.468 9.70716 108.579 9.6373C109.025 9.35565 109.494 9.11223 109.982 8.90963L109.721 9.02024C111.29 8.36824 112.975 8.08882 114.65 7.86324L114.359 7.90253C116.931 7.55713 119.513 7.30342 122.103 7.14139C122.773 7.07735 123.448 7.07735 124.119 7.14139L123.828 7.10355C124.217 7.15407 124.598 7.25535 124.961 7.4048L124.701 7.2942C124.862 7.36414 125.018 7.44536 125.168 7.53724C125.226 7.57362 125.284 7.61146 125.341 7.65076L125.415 7.70315C125.57 7.8123 125.322 7.64785 125.322 7.62893C125.322 7.65221 125.461 7.74536 125.478 7.75991C125.529 7.80502 125.578 7.8516 125.624 7.90544C125.72 8.0015 125.813 8.10046 125.9 8.19651C125.939 8.24308 125.977 8.29111 126.015 8.34205C125.773 8.05098 125.939 8.24454 125.995 8.32313C126.073 8.43519 126.149 8.55161 126.219 8.6695C126.365 8.91899 126.495 9.17761 126.607 9.44374L126.497 9.18323C126.873 10.1286 127.123 11.1195 127.24 12.1303L127.203 11.8392C127.288 12.481 127.348 13.1272 127.383 13.7734C127.419 14.3424 127.859 14.8925 128.475 14.8649C129.029 14.83 129.6 14.373 129.56 13.769Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M53.9944 20.5102C53.8751 18.6342 53.5797 15.8953 51.7634 14.8343C51.0867 14.4399 50.2673 14.3686 49.4858 14.4123C47.2373 14.536 44.9626 14.7572 42.7315 15.0614C40.9284 15.3073 38.9971 15.677 37.5156 16.8078C35.727 18.1685 35.1798 20.4461 34.9833 22.5739C34.8508 24.0059 34.8494 25.4933 35.385 26.8264C35.9205 28.1595 37.0964 29.3135 38.5227 29.4722C37.9318 30.7577 37.3414 32.0433 36.7515 33.3288L40.0217 30.2479C40.4297 29.7916 41.0105 29.5276 41.6226 29.5202L46.9346 28.8027C48.9196 28.5349 51.0808 28.1784 52.4197 26.6896C53.7092 25.256 54.1414 22.83 53.9944 20.5102Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M55.0859 20.5102C55.0412 19.4474 54.895 18.3914 54.6493 17.3564C54.3583 16.2708 53.8634 15.1458 53.0004 14.3948C52.4572 13.9067 51.7935 13.5726 51.0779 13.427C50.3197 13.2815 49.5789 13.3106 48.8134 13.3586C47.3144 13.4556 45.8188 13.5915 44.3266 13.7661C41.5847 14.0892 38.5474 14.3715 36.4052 16.3159C34.4856 18.0623 33.9718 20.8187 33.8408 23.2899C33.7622 24.7831 33.9194 26.3053 34.5758 27.6661C35.1674 28.9023 36.2131 29.8626 37.4952 30.3468C37.829 30.4592 38.1748 30.532 38.5256 30.5637L37.5825 28.9206C36.9936 30.2071 36.4032 31.4932 35.8114 32.7787C35.6705 33.0354 35.6315 33.3358 35.7022 33.6199C35.7701 33.8446 35.9064 34.0426 36.0923 34.186C36.5249 34.5172 37.135 34.4813 37.5258 34.1016L39.505 32.2373L40.4801 31.3175C40.6256 31.172 40.7814 31.0265 40.9356 30.8897C40.9749 30.8547 41.0171 30.8213 41.055 30.7849C41.1437 30.699 40.8265 30.9377 41.0084 30.8213C41.095 30.7636 41.1854 30.7121 41.2791 30.667L41.0186 30.7776C41.3201 30.6648 41.6353 30.5929 41.9558 30.5637L43.0692 30.4181L45.2944 30.1169C46.5853 29.9422 47.8922 29.8113 49.1656 29.5347C50.439 29.2582 51.612 28.7969 52.6235 27.9979C53.6117 27.2164 54.2404 26.0725 54.6202 24.8893C55.067 23.4936 55.1776 21.9713 55.0888 20.5145C55.0539 19.9455 54.6115 19.3954 53.9973 19.423C53.4356 19.4478 52.868 19.9047 52.9058 20.5145C52.9597 21.3461 52.9334 22.181 52.8272 23.0075L52.8665 22.7165C52.7701 23.4775 52.5744 24.2227 52.2844 24.933L52.395 24.6724C52.2699 24.9678 52.1209 25.2526 51.9497 25.5238C51.9075 25.5893 51.8653 25.6533 51.8201 25.7174L51.7445 25.8222C51.6601 25.9401 51.807 25.7334 51.8216 25.7218C51.7037 25.8401 51.5919 25.9644 51.4869 26.0943C51.3719 26.2093 51.2482 26.3141 51.123 26.4189C51.0241 26.5033 51.3224 26.2733 51.2162 26.3475L51.1085 26.4261L50.9076 26.5615C50.625 26.7382 50.3286 26.892 50.0213 27.0214L50.2818 26.9122C48.5907 27.6195 46.6915 27.7432 44.8971 27.9863L41.6313 28.4229C41.0681 28.4985 40.5165 28.5684 40.0159 28.8667C39.5152 29.1651 39.1165 29.6061 38.706 29.9961L35.9802 32.5575L37.6931 33.8804C38.284 32.5939 38.8744 31.3078 39.4643 30.0223C39.6316 29.6585 39.6768 29.283 39.4643 28.9206C39.2518 28.5582 38.9171 28.4272 38.5227 28.3807H38.4688L38.7599 28.42C38.482 28.3817 38.2101 28.3084 37.9507 28.2017L38.2112 28.3123C37.9693 28.2097 37.7386 28.0824 37.5229 27.9324C37.2944 27.7709 37.6757 28.0619 37.533 27.9426L37.37 27.8058C37.2784 27.7228 37.1881 27.6355 37.1037 27.5438C37.0193 27.4522 36.9393 27.3561 36.8578 27.2528C37.0921 27.5249 36.916 27.3299 36.8665 27.2528C36.817 27.1756 36.785 27.1349 36.7457 27.0752C36.6007 26.8488 36.4746 26.6107 36.3688 26.3636L36.4794 26.6255C36.2603 26.091 36.1135 25.5296 36.0428 24.9562L36.0821 25.2473C35.9607 24.1042 35.9881 22.9502 36.1636 21.8142L36.1243 22.1052C36.2348 21.1926 36.4637 20.2983 36.8054 19.4449L36.6948 19.7054C36.8374 19.3692 37.0067 19.0451 37.2012 18.7361C37.2493 18.6619 37.2987 18.5906 37.3468 18.5149C37.3715 18.4785 37.3992 18.4436 37.4239 18.4072C37.5403 18.2427 37.29 18.5717 37.3686 18.48C37.4894 18.3344 37.6102 18.1889 37.7441 18.0565C37.878 17.924 38.0104 17.8061 38.1501 17.6868C38.2898 17.5675 37.9755 17.8163 38.0861 17.7348L38.2069 17.6461C38.2869 17.5893 38.3699 17.5325 38.4543 17.4787C38.8062 17.2535 39.1767 17.0587 39.5618 16.8966L39.3013 17.0057C40.5296 16.4949 41.8467 16.278 43.1579 16.0961L42.8669 16.1354C44.165 15.9608 45.4671 15.8152 46.773 15.6988C47.4153 15.6416 48.0566 15.593 48.697 15.5533C49.3078 15.4907 49.9232 15.4849 50.5351 15.5358L50.244 15.4965C50.5493 15.5356 50.8486 15.6128 51.1347 15.7265L50.8742 15.6173C51.0018 15.6703 51.1253 15.7326 51.2438 15.8036C51.2977 15.8356 51.3486 15.8691 51.3996 15.904C51.5727 16.0233 51.3384 15.8851 51.3253 15.8414C51.3341 15.8734 51.4374 15.9346 51.4709 15.9579L51.5698 16.0495C51.6513 16.1281 51.7285 16.2111 51.8027 16.2969C51.8769 16.3828 51.97 16.5342 51.759 16.2358C51.7896 16.2795 51.8231 16.3217 51.8536 16.3654C51.9147 16.4527 51.973 16.5429 52.0268 16.636C52.1407 16.8316 52.2418 17.0343 52.3295 17.2429L52.2189 16.9824C52.5112 17.7186 52.7069 18.4896 52.801 19.276L52.7618 18.985C52.8302 19.4929 52.8724 20.0037 52.9073 20.5145C52.9437 21.0836 53.3832 21.6337 53.9988 21.606C54.5606 21.5769 55.1252 21.12 55.0859 20.5102Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M4.89406 71.8285C5.03959 69.4257 5.42526 65.9169 7.75235 64.5518C8.62556 64.0468 9.66758 63.9565 10.6703 64.0104C13.5504 64.169 16.464 64.447 19.3223 64.8428C21.632 65.1572 24.106 65.6316 26.0038 67.0768C28.2945 68.8232 28.996 71.7339 29.2478 74.4627C29.4166 76.2964 29.418 78.2014 28.7326 79.91C28.0471 81.6186 26.5496 83.1001 24.7144 83.3039C25.4702 84.9532 26.2265 86.6026 26.9832 88.252L22.7933 84.3037C22.5673 84.0716 22.3119 83.87 22.0336 83.7041C21.6392 83.4901 21.1823 83.4261 20.7369 83.3664L13.9317 82.4481C11.3893 82.1047 8.62119 81.6477 6.90534 79.7397C5.25935 77.9089 4.70486 74.8003 4.89406 71.8285Z"
                        fill="#EAC36E"
                      />
                      <path
                        d="M5.98564 71.8285C6.02785 71.1823 6.0817 70.5361 6.16611 69.8929L6.12827 70.1839C6.24493 69.1718 6.49297 68.1791 6.86613 67.231L6.75698 67.4916C6.86577 67.2318 6.99069 66.979 7.131 66.7348C7.1994 66.6154 7.27653 66.4976 7.35221 66.384C7.37113 66.3564 7.48901 66.2269 7.4861 66.1992C7.4861 66.1992 7.3071 66.4219 7.39878 66.3113L7.47155 66.2239C7.65087 66.0193 7.84548 65.8286 8.05369 65.6535C8.14537 65.5734 7.83975 65.8092 7.94163 65.7408L8.03331 65.6738C8.09007 65.6345 8.14683 65.5952 8.2065 65.5589C8.36034 65.4635 8.52084 65.3794 8.68676 65.3071L8.42625 65.4177C8.80361 65.2619 9.20005 65.1572 9.60508 65.1062L9.31401 65.1455C9.89442 65.0865 10.479 65.0811 11.0604 65.1295C11.7105 65.1674 12.3615 65.2115 13.0135 65.262C14.3175 65.359 15.62 65.4841 16.9211 65.6374C17.6517 65.7219 18.3818 65.8126 19.1114 65.9096L18.8203 65.8703C20.5114 66.0988 22.2156 66.3811 23.799 67.0433L23.5385 66.9327C24.0154 67.1327 24.4749 67.3717 24.9124 67.6473C25.0303 67.7215 25.1467 67.7928 25.2602 67.8801L25.4057 67.9864C25.5789 68.1159 25.2165 67.8408 25.365 67.9558C25.5571 68.1159 25.7434 68.2789 25.9195 68.455C26.0848 68.6222 26.2413 68.7981 26.3881 68.9818C26.5424 69.1739 26.2426 68.7897 26.3663 68.9513L26.4609 69.0822C26.5278 69.1768 26.5933 69.2729 26.6559 69.3733C26.9112 69.7731 27.1322 70.1937 27.3166 70.6307L27.2075 70.3702C27.6475 71.4669 27.9411 72.6169 28.0807 73.7903L28.0414 73.4992C28.2378 74.9706 28.3324 76.4827 28.1403 77.9584L28.1796 77.6673C28.0861 78.3724 27.9037 79.0629 27.6368 79.7223L27.7474 79.4617C27.611 79.7826 27.4484 80.0917 27.2613 80.3859C27.1696 80.5314 27.0692 80.6653 26.9702 80.8036C27.1871 80.5052 26.9979 80.7643 26.9397 80.8327C26.8815 80.9011 26.8218 80.968 26.7607 81.0335C26.6452 81.1558 26.5244 81.2736 26.3983 81.3872C26.3328 81.4454 26.2659 81.5021 26.1974 81.5589C26.129 81.6157 26.0053 81.6855 26.2717 81.5007L26.1858 81.5633C25.9019 81.767 25.5964 81.9388 25.2748 82.0755L25.5353 81.9649C25.2122 82.0986 24.874 82.1919 24.5282 82.2429L24.8192 82.2036L24.7145 82.2167C24.3186 82.2633 23.9868 82.3957 23.7714 82.7566C23.556 83.1176 23.604 83.4945 23.7714 83.8598C24.5282 85.5092 25.2845 87.1561 26.0403 88.8007L27.7547 87.4778L24.7174 84.6166C24.224 84.1523 23.7467 83.6604 23.2285 83.2253C22.8766 82.9187 22.471 82.6799 22.0323 82.5209C21.7486 82.4271 21.456 82.3632 21.159 82.3302C18.49 81.9562 15.8092 81.6535 13.1459 81.2387C11.9395 81.051 10.733 80.8021 9.60072 80.3306L9.86122 80.4412C9.46868 80.2781 9.09002 80.0834 8.72897 79.8591C8.63776 79.8008 8.54753 79.7412 8.45827 79.68L8.34912 79.6L8.26326 79.536L8.3986 79.6408C8.21949 79.5143 8.05542 79.3679 7.90961 79.2041C7.76485 79.0607 7.62785 78.9096 7.4992 78.7515C7.35367 78.5754 7.61126 78.8971 7.54286 78.8098C7.51666 78.7748 7.49047 78.7414 7.46573 78.7064C7.4046 78.622 7.34493 78.5347 7.28818 78.4474C7.05291 78.0863 6.84937 77.7055 6.67984 77.3093L6.78899 77.5713C6.41606 76.6588 6.16504 75.7012 6.0424 74.7231L6.0817 75.0142C5.94569 73.9585 5.91206 72.8921 5.98128 71.8299C6.01766 71.2594 5.45444 70.7137 4.88977 70.7384C4.29277 70.7523 3.8121 71.2329 3.79826 71.8299C3.68015 73.5041 3.8275 75.1864 4.23487 76.8145C4.62781 78.312 5.33365 79.795 6.47755 80.8647C8.87013 83.1001 12.3513 83.3257 15.4308 83.7419L18.5831 84.1669L20.1228 84.375C20.6104 84.4405 21.1096 84.487 21.5695 84.6733L21.309 84.5642C21.4271 84.6147 21.5406 84.6755 21.648 84.7461L21.7528 84.8203L21.6335 84.7301C21.6853 84.7679 21.7339 84.8097 21.779 84.8552C21.9857 85.0386 22.1822 85.2322 22.383 85.4214L23.6666 86.6293L26.2062 89.0233C26.5966 89.4035 27.2067 89.44 27.6397 89.1092C27.8306 88.9697 27.9686 88.7696 28.0312 88.5416C28.0962 88.2578 28.0597 87.9601 27.9279 87.7004C27.173 86.0511 26.4167 84.4017 25.659 82.7523L24.7174 84.3954C25.5808 84.309 26.4113 84.0187 27.1405 83.5483C27.8573 83.0677 28.4781 82.4577 28.9713 81.7495C30.0221 80.2796 30.3917 78.4168 30.4267 76.6413C30.4393 75.788 30.3966 74.9349 30.2986 74.0872C30.2191 73.2833 30.0918 72.4848 29.9173 71.696C29.5578 70.1286 28.916 68.6398 27.8958 67.3911C26.8101 66.0609 25.2515 65.2081 23.6491 64.6565C22.025 64.0991 20.3106 63.8779 18.6151 63.6567C16.729 63.4122 14.837 63.2182 12.9393 63.0746C11.0692 62.9291 9.03168 62.6293 7.30564 63.5563C5.97837 64.2694 5.15028 65.5792 4.64236 66.9618C4.16938 68.2367 3.98746 69.6134 3.87103 70.9611C3.84483 71.2522 3.82446 71.5432 3.80554 71.8343C3.76916 72.4048 4.33383 72.9505 4.89705 72.9258C5.49511 72.9103 5.97494 72.4266 5.98564 71.8285Z"
                        fill="#EAC36E"
                      />
                      <path
                        d="M49.3796 60.1057C49.2341 57.179 49.1963 52.8872 51.8203 50.9196C52.7968 50.1919 54.0513 49.9314 55.2709 49.8586C58.7739 49.6476 62.3337 49.5865 65.841 49.6592C68.6775 49.7174 71.7323 49.9503 74.2282 51.4275C77.2393 53.2146 78.4923 56.6318 79.1763 59.9019C79.6362 62.0951 79.904 64.396 79.3131 66.5572C78.7223 68.7184 77.1185 70.7166 74.9355 71.2172C76.0774 73.1033 77.2208 74.989 78.3657 76.8741C76.4903 75.478 74.6192 74.0818 72.7525 72.6857C72.4468 72.4372 72.1102 72.2293 71.7512 72.0671C71.2447 71.8634 70.683 71.8503 70.1372 71.8401L61.7792 71.6771C58.6575 71.6174 55.2505 71.4501 52.9103 69.3835C50.6662 67.4013 49.5645 63.7237 49.3796 60.1057Z"
                        fill="#81E2D2"
                      />
                      <path
                        d="M50.4711 60.1057C50.3954 58.6343 50.3707 57.1543 50.5671 55.6916L50.5279 55.9827C50.6336 55.1288 50.8483 54.292 51.1667 53.4926L51.0576 53.7531C51.1743 53.4719 51.3105 53.199 51.4651 52.9367C51.5408 52.8115 51.6194 52.6878 51.7038 52.5685L51.7722 52.4753C51.8842 52.3182 51.7125 52.5699 51.6994 52.5685C51.7527 52.5134 51.8014 52.454 51.8449 52.3909C52.0389 52.1697 52.2512 51.9652 52.4795 51.7797C52.625 51.6574 52.2801 51.9252 52.3951 51.8452L52.5231 51.7535C52.6061 51.6967 52.6919 51.6429 52.7793 51.5919C52.9532 51.4906 53.1336 51.4007 53.3192 51.3227L53.0587 51.4318C53.6072 51.2104 54.1819 51.0607 54.7687 50.9865L54.4777 51.0244C55.4455 50.8963 56.4336 50.8788 57.4087 50.8395C58.4207 50.7959 59.4336 50.7643 60.4475 50.7449C62.4486 50.7056 64.4526 50.7027 66.4537 50.7638C67.4462 50.7959 68.4388 50.8555 69.4255 50.9865L69.1344 50.9472C70.3661 51.0971 71.5731 51.4068 72.7247 51.8685L72.4613 51.7535C72.948 51.9583 73.4177 52.2017 73.8657 52.4812C73.9661 52.5452 74.0666 52.6121 74.1641 52.6805C74.2538 52.7595 74.3513 52.8293 74.4551 52.8886C74.4697 52.8886 74.2543 52.7315 74.3402 52.8013L74.4042 52.8523C74.4537 52.8916 74.5017 52.9323 74.5497 52.9731C74.6385 53.0487 74.7258 53.1186 74.8102 53.2045C75.148 53.5194 75.4608 53.86 75.746 54.2232C75.8537 54.3585 75.5845 54.0093 75.7213 54.1926C75.7519 54.2348 75.7839 54.277 75.8144 54.3207C75.8872 54.4211 75.96 54.523 76.0269 54.6263C76.155 54.8184 76.2758 55.0134 76.3907 55.2085C76.6535 55.6656 76.8878 56.1385 77.0922 56.6245L76.9816 56.364C77.7355 58.1555 78.1852 60.0955 78.4501 62.0166L78.4108 61.7255C78.589 62.9242 78.608 64.1412 78.4675 65.3449L78.5068 65.0539C78.4076 65.7951 78.2119 66.5202 77.9247 67.2107L78.0353 66.9502C77.8778 67.3194 77.6914 67.6756 77.4779 68.0155C77.377 68.1939 77.2596 68.3625 77.1272 68.519C77.165 68.4797 77.2945 68.3066 77.1839 68.4448C77.1563 68.4797 77.1286 68.5147 77.0995 68.5481C77.0311 68.6296 76.9612 68.7082 76.8899 68.7868C76.759 68.9323 76.6222 69.0648 76.4781 69.1943C76.4063 69.2583 76.3335 69.3209 76.2598 69.382C76.2263 69.4097 76.0662 69.5276 76.2263 69.4097C76.3864 69.2918 76.2481 69.3922 76.2117 69.4184C75.8874 69.6495 75.539 69.8447 75.1726 70.0006L75.4331 69.89C75.1748 69.9976 74.9081 70.0837 74.6356 70.1476C73.9545 70.3076 73.6285 71.1663 73.9836 71.7484L77.4139 77.4039L78.907 75.9107L75.2687 73.1907L73.4742 71.8532C72.8543 71.3904 72.2241 70.9596 71.4368 70.8345C70.6494 70.7093 69.8359 70.7224 69.0398 70.7064L66.752 70.6628L62.2143 70.574C60.82 70.5478 59.4229 70.5201 58.0389 70.3353L58.3299 70.3746C57.2817 70.2473 56.2544 69.9846 55.2737 69.5931L55.5342 69.7022C55.0226 69.4892 54.5348 69.2228 54.0789 68.9076L53.9435 68.8101C53.7107 68.6398 54.0891 68.9294 53.9435 68.8101C53.8431 68.7271 53.7427 68.6442 53.6525 68.5583C53.4631 68.3874 53.2829 68.2067 53.1125 68.0169C53.0325 67.9267 52.9539 67.835 52.8782 67.7419C52.8244 67.6778 52.6716 67.4595 52.887 67.7579L52.7603 67.5891C52.6148 67.3863 52.477 67.1787 52.347 66.9662C52.0603 66.4909 51.8088 65.9952 51.5946 65.4832L51.7038 65.7437C51.1512 64.3834 50.7789 62.9567 50.5963 61.4999L50.6355 61.791C50.5618 61.2253 50.5099 60.6573 50.4798 60.0868C50.4493 59.5163 49.9981 58.9676 49.3883 58.9953C48.8222 59.02 48.2633 59.4755 48.2968 60.0868C48.3987 62.0369 48.7174 64.0162 49.4087 65.847C50.0461 67.5381 50.9732 69.2089 52.4067 70.3586C53.188 70.9871 54.0651 71.4863 55.0045 71.8372C55.8371 72.1414 56.7004 72.3542 57.579 72.4717C59.5495 72.7628 61.5361 72.7628 63.5226 72.7992L67.2992 72.872L69.1912 72.9083C69.8134 72.8998 70.4357 72.9241 71.0555 72.9811L70.7644 72.9418C71.0225 72.9775 71.275 73.0464 71.5154 73.147L71.2548 73.0364C71.853 73.3057 72.3682 73.7641 72.8892 74.1483L74.5104 75.3577L77.8083 77.8172C78.0163 77.9447 78.264 77.9908 78.5039 77.9467C78.7414 77.9224 78.9631 77.8164 79.1312 77.6469C79.4732 77.2917 79.5424 76.7544 79.3014 76.324L75.8712 70.6729L75.2265 72.2738C77.1184 71.827 78.6815 70.4183 79.6041 68.7388C80.6578 66.8177 80.8892 64.5736 80.6782 62.4211C80.4943 60.4359 80.0671 58.4808 79.4062 56.5998C78.7761 54.8534 77.8868 53.1695 76.5523 51.8539C73.4772 48.8239 68.9147 48.6085 64.8513 48.5546C62.5635 48.5236 60.2748 48.5517 57.985 48.639C56.8819 48.6812 55.7642 48.6973 54.6668 48.8239C53.5695 48.9505 52.4256 49.2124 51.4753 49.8426C48.4918 51.8073 48.1571 55.7935 48.2444 59.0433C48.2546 59.3969 48.2692 59.752 48.2881 60.1057C48.3157 60.6747 48.7683 61.2234 49.3796 61.1972C49.9457 61.171 50.5017 60.7155 50.4711 60.1057Z"
                        fill="#81E2D2"
                      />
                      <path
                        d="M35.5073 21.1534C36.8302 21.3135 38.2389 20.7328 39.1543 19.7854C40.1148 18.7651 40.625 17.4017 40.5704 16.0015C40.55 15.431 40.0814 14.8823 39.4789 14.91C38.904 14.9347 38.3655 15.3903 38.3874 16.0015C38.3956 16.2563 38.3835 16.5113 38.351 16.7641L38.3903 16.473C38.3379 16.8417 38.2401 17.2024 38.0992 17.5471L38.2084 17.2866C38.1165 17.5022 38.0064 17.7096 37.8795 17.9066C37.8474 17.956 37.8125 18.0026 37.7805 18.0521C37.6772 18.2049 37.9115 17.8935 37.8271 17.9939C37.7427 18.0943 37.6815 18.1714 37.5942 18.2544C37.5069 18.3373 37.4487 18.3999 37.3657 18.4669C37.2828 18.5338 37.1416 18.6124 37.4094 18.4378C37.3628 18.4683 37.3177 18.5047 37.2639 18.5367C37.0753 18.663 36.8756 18.7716 36.6672 18.8613L36.9277 18.7521C36.6478 18.8689 36.3544 18.9505 36.0545 18.9951L36.3455 18.9573C36.0653 18.9929 35.7817 18.9929 35.5014 18.9573C35.2424 18.9267 34.9047 19.1028 34.7301 19.2775C34.5253 19.4822 34.4102 19.7599 34.4102 20.0495C34.4102 20.3391 34.5253 20.6169 34.7301 20.8216C34.9439 21.0118 35.2157 21.1241 35.5014 21.1403L35.5073 21.1534Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M35.059 25.6373C37.0805 25.8265 39.233 25.5165 41.0158 24.5094C41.9674 23.9711 42.7795 23.2169 43.3865 22.3075C43.9811 21.3789 44.3807 20.3391 44.561 19.2512C44.7924 18.0026 44.852 16.735 44.871 15.4674C44.8812 14.8969 44.3601 14.3496 43.7795 14.3758C43.1815 14.3875 42.6996 14.8694 42.6879 15.4674C42.6827 16.4401 42.6235 17.4118 42.5104 18.378L42.5497 18.087C42.4495 18.8985 42.244 19.6935 41.9384 20.4519L42.0476 20.1914C41.8884 20.5635 41.6934 20.9193 41.4655 21.2538C41.4102 21.3353 41.349 21.411 41.2937 21.491C41.5048 21.1839 41.3097 21.4648 41.2472 21.5376C41.1264 21.6758 40.9983 21.8083 40.8644 21.9349C40.7305 22.0615 40.6024 22.1619 40.47 22.274C40.7611 22.0295 40.4962 22.2507 40.4176 22.3046C40.339 22.3584 40.2721 22.4035 40.2008 22.4501C39.8824 22.65 39.5485 22.8243 39.2024 22.9711L39.4644 22.8605C38.7526 23.154 38.0055 23.3532 37.2421 23.4528L37.5331 23.4135C36.7125 23.5191 35.8827 23.5327 35.059 23.4543C34.7697 23.4545 34.4922 23.5697 34.2877 23.7744C34.0826 23.9787 33.9673 24.2563 33.9673 24.5458C33.9673 24.8353 34.0826 25.1128 34.2877 25.3171C34.4994 25.5109 34.7724 25.6242 35.059 25.6373Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M47.7627 16.3653C48.3332 16.3653 48.8804 15.8632 48.8542 15.2738C48.8441 14.6752 48.3613 14.1924 47.7627 14.1823C47.1922 14.1823 46.645 14.6844 46.6712 15.2738C46.6813 15.8724 47.1641 16.3552 47.7627 16.3653Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M47.2839 20.3486C47.8559 20.3486 48.4016 19.8465 48.3754 19.2571C48.3653 18.6585 47.8825 18.1757 47.2839 18.1656C46.7134 18.1656 46.1662 18.6677 46.1924 19.2571C46.2033 19.8554 46.6857 20.3377 47.2839 20.3486Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M50.9877 16.2198L50.7462 17.7712C50.6516 18.3766 50.4871 19.001 50.6326 19.6093C50.7898 20.2613 51.3108 20.6455 51.874 20.9307L53.2712 21.6351C53.7805 21.8927 54.4777 21.7807 54.7644 21.2436C55.0263 20.7474 54.9172 20.0255 54.3729 19.7505L53.2304 19.1683C53.0631 19.0839 52.8942 19.0024 52.7298 18.9136C52.692 18.8933 52.5668 18.7885 52.526 18.7885L52.6716 18.8918C52.6163 18.8336 52.6206 18.8452 52.6861 18.9267C52.804 19.0854 52.7007 18.934 52.6861 18.9005L52.7967 19.161C52.7673 19.0895 52.7463 19.0148 52.7342 18.9384L52.772 19.2294C52.7611 19.0897 52.7655 18.9491 52.7851 18.8103L52.7458 19.1014C52.8564 18.3315 52.9845 17.5631 53.1038 16.7947C53.1715 16.5102 53.1321 16.2108 52.9932 15.9535C52.6885 15.4337 52.0206 15.2586 51.5 15.562C51.2774 15.7075 51.0416 15.9404 50.9994 16.2154L50.9877 16.2198Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M42.356 23.3437C42.9685 23.8496 43.7306 24.1396 44.5245 24.1688C45.2522 24.2169 45.9798 24.0539 46.6915 23.9564L46.4004 23.9957C46.8733 23.9266 47.353 23.9178 47.8281 23.9695L47.5371 23.9316C48.0379 24.0031 48.5272 24.1401 48.9924 24.3391L48.7319 24.23C49.0915 24.3848 49.4393 24.5657 49.7725 24.7714C49.9413 24.8732 50.1057 24.9824 50.2673 25.0944L50.4943 25.2574C50.5627 25.3069 50.8378 25.531 50.57 25.3113C50.8649 25.5414 51.1471 25.7872 51.4155 26.0477C51.4854 26.119 51.5538 26.1932 51.6193 26.2689C51.656 26.303 51.6883 26.3416 51.7153 26.3839C51.7052 26.3577 51.5698 26.1816 51.6528 26.3053C51.7629 26.4698 51.8602 26.6425 51.9438 26.8219C52.0879 27.0672 52.3217 27.2468 52.5958 27.3226C52.8751 27.3998 53.1736 27.3628 53.4256 27.2197C53.6775 27.0767 53.8623 26.8393 53.9391 26.56C54.0013 26.2757 53.9622 25.9787 53.8285 25.7202C53.556 25.1593 53.174 24.6585 52.705 24.2474C52.223 23.8158 51.7098 23.4203 51.1696 23.0642C50.1151 22.3355 48.8937 21.885 47.6186 21.7544C46.8356 21.6875 46.0584 21.8563 45.29 21.9611L45.5811 21.9218C45.1582 21.9862 44.7289 21.997 44.3033 21.9538L44.5943 21.9931C44.3717 21.963 44.1534 21.9068 43.9438 21.8257L44.2043 21.9349C44.1195 21.8991 44.0369 21.8583 43.9569 21.8126L43.8623 21.7544C43.6833 21.6467 44.0661 21.9247 43.9045 21.7908C43.6958 21.5924 43.421 21.4783 43.1332 21.4706C42.8441 21.4726 42.5673 21.5875 42.3619 21.7908C41.9907 22.1939 41.8932 22.9434 42.3619 23.3335L42.356 23.3437Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M42.7171 30.3381C43.0722 29.9699 43.4244 29.6002 43.7809 29.2335C43.9282 29.058 44.0963 28.9011 44.2816 28.7663C44.2132 28.8071 44.0924 28.9118 44.2335 28.8071C44.2757 28.7779 44.3194 28.7488 44.3631 28.7226C44.4684 28.6583 44.5783 28.6019 44.692 28.5538L44.4315 28.663C44.7983 28.5218 45.1818 28.4284 45.5725 28.385L45.2814 28.4228C45.7981 28.3318 46.3238 28.303 46.8473 28.337L46.5563 28.2977C46.7309 28.3205 46.902 28.365 47.0656 28.4301L46.8037 28.321C46.8681 28.3492 46.9308 28.3813 46.9914 28.417C47.0045 28.4243 47.0671 28.4767 47.0802 28.4738C47.054 28.4738 46.8532 28.2817 47.0016 28.4156C47.0409 28.4534 47.1937 28.6324 47.07 28.4752C46.9463 28.3181 47.0904 28.5305 47.1137 28.5844L47.0045 28.3224C47.0234 28.3719 47.0394 28.4185 47.054 28.468C47.2083 29.0166 47.8326 29.4125 48.3958 29.2291C48.9706 29.0611 49.3082 28.4671 49.1584 27.8873C48.8963 27.0435 48.198 26.4076 47.3334 26.2253C46.5112 26.0434 45.6569 26.1758 44.8375 26.2995C44.5198 26.3431 44.208 26.4217 43.9075 26.5338C43.463 26.7052 43.051 26.9513 42.6894 27.2615C42.1422 27.7185 41.6707 28.2802 41.173 28.794C40.7771 29.2058 40.7364 29.9335 41.173 30.3366C41.6031 30.7538 42.2869 30.7538 42.7171 30.3366V30.3381Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M37.3323 29.0719C37.9028 29.0719 38.45 28.5713 38.4238 27.9804C38.4137 27.3818 37.9309 26.899 37.3323 26.8889C36.7603 26.8889 36.2146 27.391 36.2408 27.9804C36.2501 28.5793 36.7334 29.0626 37.3323 29.0719Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M105.467 16.2722C107.138 13.8146 108.781 11.3376 110.396 8.84125C110.695 8.32114 110.523 7.65735 110.009 7.34806C109.486 7.05777 108.828 7.23028 108.515 7.73955C106.901 10.2359 105.258 12.7129 103.587 15.1705C103.265 15.6435 103.48 16.4003 103.978 16.6637C104.501 16.9531 105.158 16.7807 105.471 16.2722H105.467Z"
                        fill="#81E2D2"
                      />
                      <path
                        d="M106.585 22.8693C108.023 20.9657 109.405 19.0252 110.732 17.0479C112.06 15.0706 113.327 13.051 114.534 10.9893C115.213 9.83375 115.873 8.66948 116.515 7.49647C116.788 6.99438 116.66 6.28417 116.123 6.00183C115.586 5.7195 114.921 5.8563 114.63 6.39478C113.49 8.4798 112.289 10.5357 111.028 12.5625C109.767 14.5893 108.449 16.5759 107.074 18.5221C106.298 19.6166 105.507 20.6979 104.702 21.7661C104.541 21.9771 104.525 22.3657 104.591 22.6073C104.669 22.881 104.849 23.1147 105.093 23.2607C105.347 23.4099 105.65 23.4508 105.934 23.3743C106.201 23.2838 106.43 23.1078 106.586 22.8736L106.585 22.8693Z"
                        fill="#81E2D2"
                      />
                      <path
                        d="M109.088 28.1362C111.047 25.5515 112.934 22.9149 114.749 20.2264C116.549 17.5582 118.276 14.8416 119.932 12.0765C120.869 10.5095 121.782 8.92806 122.672 7.33204C122.95 6.83285 122.809 6.11828 122.281 5.83885C121.752 5.55943 121.084 5.69332 120.787 6.23034C119.209 9.06244 117.554 11.8499 115.822 14.5927C114.103 17.3162 112.311 19.9901 110.446 22.6146C109.388 24.1049 108.307 25.5777 107.203 27.033C107.043 27.2426 107.027 27.6326 107.093 27.8742C107.171 28.1475 107.35 28.3807 107.595 28.5262C107.849 28.6739 108.152 28.7132 108.436 28.6353C108.702 28.5448 108.932 28.3688 109.088 28.1347V28.1362Z"
                        fill="#81E2D2"
                      />
                      <path
                        d="M118.414 24.8412C119.79 23.0211 121.114 21.1631 122.387 19.2673C123.66 17.3714 124.885 15.431 126.063 13.4459C126.723 12.3389 127.364 11.2231 127.987 10.0986C128.264 9.59797 128.133 8.88485 127.596 8.60397C127.058 8.32308 126.398 8.45843 126.102 8.99545C124.998 10.9932 123.84 12.9593 122.627 14.894C121.414 16.8286 120.142 18.7365 118.811 20.6178C118.067 21.6715 117.306 22.7125 116.529 23.741C116.37 23.952 116.353 24.3406 116.418 24.5822C116.58 25.1629 117.18 25.5038 117.762 25.3448C118.029 25.2542 118.258 25.0776 118.414 24.8427V24.8412Z"
                        fill="#81E2D2"
                      />
                      <path
                        d="M125.103 23.5751C126.414 22.0941 127.568 20.4812 128.546 18.7623C128.827 18.2645 128.68 17.5471 128.154 17.2691C127.632 16.9748 126.971 17.148 126.66 17.6606C126.202 18.4704 125.703 19.2563 125.165 20.0153C125.036 20.1958 124.906 20.3748 124.774 20.5523L124.653 20.711L124.616 20.759L124.58 20.8056L124.477 20.9365C124.186 21.3091 123.874 21.6744 123.56 22.031C123.181 22.4588 123.106 23.1589 123.56 23.5751C123.973 23.9549 124.699 24.0321 125.103 23.5751Z"
                        fill="#81E2D2"
                      />
                      <path
                        d="M10.5494 64.4426C10.5465 64.8997 10.5144 65.3561 10.4534 65.8091L10.4927 65.5181C10.4157 66.0652 10.2975 66.6057 10.139 67.135C9.97604 67.6822 10.3355 68.3487 10.9016 68.4768C11.4811 68.6244 12.0737 68.2885 12.2449 67.7156C12.5616 66.6532 12.7258 65.5512 12.7325 64.4426C12.7325 63.8706 12.2275 63.3249 11.641 63.3511C11.0424 63.3612 10.5596 63.844 10.5494 64.4426Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M7.34344 64.1311L6.81951 66.0231C6.65361 66.6227 6.46296 67.2223 6.32761 67.8306C6.17189 68.5365 6.12677 69.3587 6.56337 69.9831C6.99998 70.6074 7.64615 70.8999 8.37237 71.0295C9.70906 71.2753 11.0723 71.3439 12.427 71.2332C13.1095 71.1735 13.7804 71.0877 14.3946 70.7602C15.0728 70.3978 15.4861 69.7313 15.6753 69.0036C15.8557 68.3138 15.9663 67.605 16.1119 66.9079L16.5761 64.706C16.6911 64.1486 16.4146 63.4995 15.815 63.3627C15.2692 63.239 14.5954 63.5272 14.4717 64.1253L13.974 66.5412L13.7295 67.7316C13.6704 68.0936 13.5793 68.4496 13.4573 68.7955L13.5679 68.535C13.5343 68.6166 13.4944 68.6954 13.4486 68.7708C13.3511 68.9294 13.4835 68.7708 13.4981 68.7184C13.4894 68.7518 13.4282 68.7941 13.4049 68.8173C13.3817 68.8406 13.2696 68.9294 13.4137 68.8173C13.5578 68.7053 13.4311 68.8013 13.3933 68.8246C13.3162 68.8713 13.2359 68.9126 13.1532 68.9483L13.4137 68.8392C13.1544 68.9403 12.8836 69.0088 12.6074 69.0429L12.8985 69.0036C11.6898 69.1546 10.4666 69.1463 9.26012 68.9789L9.55119 69.0182C9.12691 68.9804 8.70868 68.892 8.30542 68.7548L8.56593 68.8639C8.50125 68.8373 8.43852 68.8061 8.37819 68.7708L8.33453 68.7431C8.24284 68.6791 8.27631 68.7053 8.43058 68.8188C8.4102 68.8013 8.39274 68.7839 8.37382 68.7649C8.31706 68.7038 8.34471 68.7431 8.45969 68.8828C8.43058 68.8202 8.38401 68.7635 8.3549 68.7009L8.46405 68.9614C8.42557 68.8638 8.39776 68.7623 8.3811 68.6587L8.42039 68.9498C8.40049 68.7682 8.40391 68.5848 8.43058 68.404L8.39129 68.6951C8.49025 68.0475 8.71292 67.4115 8.88756 66.7813L9.44495 64.706C9.59776 64.1573 9.25721 63.4951 8.68235 63.3642C8.10265 63.2152 7.50918 63.5525 7.34053 64.1268L7.34344 64.1311Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M18.3225 64.591L17.4304 68.9265L16.9938 71.0586L16.7755 72.1239C16.7279 72.4481 16.6504 72.7672 16.5441 73.0771L16.6547 72.8152C16.6402 72.8472 16.6242 72.8763 16.6096 72.9083C16.5368 73.0538 16.7653 72.7511 16.6765 72.8312C16.646 72.8588 16.5514 72.9418 16.6882 72.8312C16.825 72.7206 16.6882 72.8108 16.6489 72.8312L16.9109 72.7206C16.8163 72.7532 16.7188 72.7766 16.6198 72.7904L16.9109 72.7511C16.1148 72.8486 15.31 72.8967 14.5081 72.9709L13.29 73.0815C12.7806 73.1281 12.2552 73.1353 11.7924 73.3726C10.8959 73.8354 10.7868 74.9109 10.583 75.7884L10.0373 78.1403L9.40856 80.8428L11.0094 80.1908L10.7548 80.0089C10.5001 79.8619 10.1973 79.8226 9.91356 79.8998C9.63999 79.9774 9.40631 80.1565 9.26012 80.4004C8.96905 80.9607 9.15242 81.5429 9.6516 81.895L9.91065 82.0755C10.4782 82.4743 11.366 82.0755 11.5115 81.4235L12.2698 78.1592L12.6452 76.5438L12.8315 75.7375C12.8785 75.4906 12.9432 75.2474 13.0251 75.0098L12.9159 75.2703C12.964 75.1612 13.0993 75.0346 12.8854 75.2572C12.9625 75.1786 12.9305 75.199 12.7893 75.3154C12.8218 75.2944 12.8559 75.2759 12.8912 75.2601L12.6292 75.3707C12.7388 75.3279 12.8531 75.2986 12.9698 75.2834L12.6787 75.3227C13.6189 75.2077 14.5707 75.1481 15.5094 75.0637C15.9663 75.0229 16.4233 74.9909 16.8788 74.9385C17.2199 74.9184 17.5526 74.8246 17.8539 74.6634C18.1339 74.4954 18.3625 74.2538 18.5146 73.9649C18.7431 73.5283 18.8057 73.0378 18.9061 72.5619L19.1972 71.1415L19.7648 68.3764L20.4197 65.1746C20.5332 64.6172 20.2581 63.9696 19.6571 63.8328C19.1128 63.7091 18.4375 63.9972 18.3138 64.5954L18.3225 64.591Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M4.52733 74.2312C5.63863 74.7515 6.85131 75.0194 8.07837 75.0156C8.65032 75.0156 9.19753 74.5179 9.16988 73.9241C9.16052 73.3252 8.67727 72.842 8.07837 72.8326C7.72848 72.8367 7.37876 72.8153 7.03198 72.7686L7.32305 72.8064C6.72051 72.7212 6.13124 72.5598 5.56936 72.3261L5.83132 72.4353C5.76292 72.4076 5.69597 72.3771 5.62903 72.3465C5.37198 72.2067 5.07205 72.1678 4.78784 72.2374C4.50837 72.3135 4.27077 72.4979 4.12765 72.7498C3.98452 73.0016 3.94767 73.3001 4.02524 73.5792C4.09761 73.8554 4.27873 74.0906 4.52733 74.2312Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M6.51233 79.4734C7.08428 79.4734 7.63004 78.9713 7.60384 78.3819C7.59373 77.7833 7.11092 77.3005 6.51233 77.2903C5.94184 77.2903 5.39463 77.7924 5.42083 78.3819C5.43169 78.9801 5.91407 79.4625 6.51233 79.4734Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M15.518 82.6504C15.65 82.0187 15.7834 81.3881 15.9183 80.7584C16.0318 80.2199 16.1016 79.6422 16.3083 79.1299L16.1992 79.3904C16.2233 79.332 16.251 79.2751 16.2821 79.2201C16.3403 79.1197 16.4276 79.1037 16.2152 79.2914C16.2483 79.2624 16.2789 79.2308 16.3068 79.1968C16.1409 79.3191 16.1016 79.3511 16.1933 79.2929C16.2189 79.2779 16.2456 79.2653 16.2734 79.255L16.0114 79.3642C16.059 79.3481 16.1076 79.3355 16.1569 79.3263L15.8659 79.3656C16.0332 79.3496 16.1962 79.3787 16.3636 79.3787C16.6139 79.3779 16.8628 79.3416 17.1029 79.271C17.4531 79.1559 17.7961 79.0203 18.1304 78.865L20.229 77.9918C20.6656 77.8084 21.1531 77.6673 21.5053 77.3296C21.8575 76.992 21.9885 76.5641 22.1122 76.1275C22.3144 75.4166 22.4747 74.6945 22.5925 73.9649C22.7408 73.0712 22.8327 72.169 22.8675 71.2637C22.8628 70.6629 22.3769 70.177 21.776 70.1722C21.1787 70.1853 20.6976 70.6664 20.6845 71.2637C20.6632 71.8886 20.6117 72.5095 20.5303 73.1266L20.5695 72.8355C20.4958 73.3837 20.3988 73.929 20.2785 74.4713C20.1831 74.997 20.0413 75.5133 19.855 76.014L19.9641 75.7535C19.9437 75.7957 19.9176 75.835 19.8972 75.8772C19.8768 75.9194 19.8783 75.9092 19.9306 75.8335C19.974 75.7595 20.039 75.7006 20.1169 75.6647C20.034 75.7055 19.9568 75.7549 19.871 75.7928L20.1315 75.6822C19.4824 75.9558 18.8319 76.225 18.1813 76.4972L17.215 76.9003C16.9137 77.0439 16.5967 77.1518 16.2705 77.2219L16.5615 77.1826C16.3287 77.2103 16.1002 77.1637 15.8688 77.1826C15.4574 77.2086 15.0675 77.3751 14.7642 77.6542C14.3887 77.9947 14.182 78.5041 14.0685 78.9887C13.8299 80.0074 13.6319 81.0422 13.4136 82.0697C13.2972 82.6271 13.5766 83.2761 14.1762 83.413C14.722 83.5367 15.3943 83.2485 15.518 82.6504Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M23.1557 68.094C23.7262 68.094 24.2734 67.5919 24.2473 67.0025C24.2364 66.4043 23.754 65.9219 23.1557 65.911C22.5838 65.911 22.0366 66.4131 22.0642 67.0025C22.0744 67.6011 22.5572 68.0839 23.1557 68.094Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M25.5658 67.5832L25.5556 67.6531L25.5949 67.362C25.3795 68.9561 25.0884 70.5371 24.7217 72.1049C24.63 72.4979 24.5354 72.8879 24.4306 73.2692C24.3214 73.6942 24.1395 74.1628 24.1555 74.6052C24.1861 75.2543 24.5718 75.7026 25.1073 76.0256C25.4348 76.2236 25.7695 76.4113 26.1071 76.5932C26.9372 77.0338 27.7897 77.4307 28.6613 77.7822C28.9058 77.8827 29.2856 77.7997 29.5025 77.6731C29.7528 77.527 29.9347 77.2873 30.0082 77.007C30.0816 76.7266 30.0405 76.4285 29.8939 76.1784C29.7373 75.9447 29.5082 75.7688 29.242 75.6778L28.9916 75.5745L29.2521 75.6836C28.639 75.4246 28.0374 75.1418 27.4475 74.8352C27.1564 74.6838 26.8697 74.5266 26.5874 74.3636C26.4506 74.285 26.3153 74.205 26.1799 74.1235C26.0882 74.0667 25.9485 73.9168 26.1916 74.1482C26.113 74.0711 26.1363 74.1075 26.2614 74.2589C26.2422 74.2313 26.2266 74.2015 26.2148 74.1701L26.3254 74.4306C26.3109 74.3938 26.3021 74.355 26.2993 74.3156L26.3385 74.6067C26.3342 74.567 26.3342 74.527 26.3385 74.4873L26.2993 74.7784C26.3558 74.4891 26.4277 74.2029 26.5146 73.9212C26.5864 73.6466 26.6553 73.3716 26.7213 73.096C26.862 72.5139 26.993 71.9255 27.1142 71.3307C27.3675 70.0864 27.5669 68.8362 27.7357 67.5788C27.7691 67.3227 27.5901 66.9792 27.4155 66.806C26.989 66.3812 26.2993 66.3812 25.8728 66.806C25.6828 67.0207 25.5701 67.2927 25.5527 67.5788L25.5658 67.5832Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M28.9872 73.7844C29.5577 73.7844 30.1049 73.2823 30.0787 72.6929C30.0686 72.0943 29.5858 71.6115 28.9872 71.6014C28.4152 71.6014 27.8695 72.1035 27.8957 72.6929C27.9058 73.2915 28.3886 73.7743 28.9872 73.7844Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M20.7558 83.2136C20.7493 83.1478 20.7493 83.0815 20.7558 83.0157L20.7165 83.3067C20.7277 83.2432 20.7447 83.1808 20.7675 83.1205L20.6569 83.381C20.6908 83.3066 20.7297 83.2347 20.7733 83.1656C20.865 83.0069 20.635 83.3213 20.7122 83.2456C20.7427 83.2151 20.7704 83.1816 20.8009 83.151C20.8571 83.0818 20.9239 83.0218 20.9989 82.9735C20.9523 82.9924 20.7806 83.1365 20.9276 83.0302L21.0367 82.9546C21.418 82.694 21.8139 82.4525 22.201 82.2021L23.3871 81.4395L23.9954 81.0481C24.1867 80.9119 24.387 80.7888 24.595 80.6799L24.3345 80.789C24.3702 80.7741 24.4072 80.7629 24.4451 80.7555L24.1541 80.7948C24.1931 80.789 24.2329 80.789 24.2719 80.7948L23.9809 80.7555C24.0392 80.7662 24.0962 80.7828 24.1511 80.805L23.8906 80.6944C24.3651 80.9156 24.8148 81.2052 25.2718 81.4614L26.6791 82.2502C27.1783 82.5296 27.8943 82.3855 28.1723 81.8587C28.4714 81.3361 28.2981 80.6702 27.7822 80.3597L25.9689 79.3409C25.6632 79.1692 25.362 78.9844 25.0491 78.8272C24.5221 78.5375 23.8808 78.5497 23.3653 78.8592C22.7715 79.2129 22.201 79.6087 21.6188 79.9827C21.0367 80.3568 20.4546 80.7104 19.8943 81.0961C19.1899 81.5865 18.5117 82.2822 18.5699 83.2122C18.6048 83.7812 19.0458 84.3313 19.6614 84.3037C20.2217 84.2789 20.7893 83.8234 20.7529 83.2122L20.7558 83.2136Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M24.5804 86.1592C25.1509 86.1592 25.6982 85.6571 25.672 85.0677C25.6618 84.4691 25.179 83.9863 24.5804 83.9762C24.01 83.9762 23.4627 84.4783 23.4889 85.0677C23.4991 85.6663 23.9819 86.1491 24.5804 86.1592Z"
                        fill="#ED7A7A"
                      />
                      <path
                        d="M51.1769 53.3005C51.7474 53.3005 52.2946 52.7984 52.2684 52.209C52.2583 51.6104 51.7755 51.1276 51.1769 51.1175C50.6064 51.1175 50.0592 51.6196 50.0854 52.209C50.0947 52.8079 50.578 53.2911 51.1769 53.3005Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M55.0176 51.736C55.5881 51.736 56.1353 51.2339 56.1091 50.6445C56.099 50.0459 55.6162 49.5631 55.0176 49.553C54.4456 49.553 53.8999 50.0551 53.9261 50.6445C53.9354 51.2434 54.4187 51.7266 55.0176 51.736Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M54.8749 56.2883C55.4454 56.2883 55.9926 55.7862 55.9664 55.1968C55.9563 54.5982 55.4735 54.1154 54.8749 54.1053C54.3044 54.1053 53.7572 54.6074 53.7834 55.1968C53.7935 55.7954 54.2763 56.2782 54.8749 56.2883Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M59.142 53.7284C59.7125 53.7284 60.2597 53.2263 60.2335 52.6369C60.2241 52.038 59.7409 51.5547 59.142 51.5453C58.5715 51.5453 58.0243 52.0474 58.0505 52.6369C58.0606 53.2354 58.5434 53.7182 59.142 53.7284Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M50.4652 58.2792C51.0357 58.2792 51.5829 57.7771 51.5567 57.1877C51.5466 56.5891 51.0638 56.1063 50.4652 56.0962C49.8947 56.0962 49.3475 56.5983 49.3737 57.1877C49.3838 57.7863 49.8666 58.2691 50.4652 58.2792Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M53.7369 60.5554H53.8824C54.0285 60.5618 54.1737 60.5291 54.303 60.4608C54.7005 60.286 54.9617 59.8979 54.9739 59.4639L54.9346 59.1728C54.8843 58.9906 54.7875 58.8246 54.6538 58.6911L54.4325 58.5194C54.2653 58.4231 54.0754 58.3728 53.8824 58.3738H53.7369C53.5908 58.3675 53.4456 58.4001 53.3163 58.4684C52.9188 58.6432 52.6576 59.0313 52.6454 59.4653L52.6847 59.7564C52.735 59.9386 52.8318 60.1046 52.9656 60.2381L53.1868 60.4099C53.3541 60.5062 53.5439 60.5564 53.7369 60.5554Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M58.4303 58.2792C59.0023 58.2792 59.5495 57.7771 59.5218 57.1877C59.5117 56.5891 59.0289 56.1063 58.4303 56.0962C57.8598 56.0962 57.3126 56.5983 57.3388 57.1877C57.3489 57.7863 57.8317 58.2691 58.4303 58.2792Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M56.7246 63.258C57.2951 63.258 57.8423 62.7559 57.8161 62.1665C57.8052 61.5682 57.3229 61.0858 56.7246 61.075C56.1526 61.075 55.6054 61.577 55.6331 62.1665C55.6432 62.765 56.126 63.2479 56.7246 63.258Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M51.3194 64.8224C51.8899 64.8224 52.4371 64.3203 52.4109 63.7309C52.4001 63.1326 51.9177 62.6503 51.3194 62.6394C50.7475 62.6394 50.2003 63.1415 50.2279 63.7309C50.238 64.3295 50.7209 64.8123 51.3194 64.8224Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M55.0176 67.3824C55.5881 67.3824 56.1353 66.8803 56.1091 66.2909C56.099 65.6923 55.6162 65.2095 55.0176 65.1994C54.4456 65.1994 53.8999 65.7015 53.9261 66.2909C53.9354 66.8898 54.4187 67.3731 55.0176 67.3824Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M60.7064 62.1198C61.2784 62.1198 61.8241 61.6177 61.7979 61.0283C61.7878 60.4298 61.305 59.9469 60.7064 59.9368C60.1359 59.9368 59.5887 60.4389 59.6149 61.0283C59.625 61.6269 60.1078 62.1097 60.7064 62.1198Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M62.6988 56.4309C63.2693 56.4309 63.8165 55.9288 63.7903 55.3394C63.7802 54.7408 63.2974 54.258 62.6988 54.2479C62.1269 54.2479 61.5797 54.75 61.6073 55.3394C61.6174 55.938 62.1003 56.4208 62.6988 56.4309Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M63.5516 51.736C64.1221 51.736 64.6693 51.2339 64.6431 50.6445C64.633 50.0459 64.1502 49.5631 63.5516 49.553C62.9811 49.553 62.4339 50.0551 62.4601 50.6445C62.4702 51.2431 62.9531 51.7259 63.5516 51.736Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M59.2846 50.4568C59.855 50.4568 60.4023 49.9547 60.3761 49.3652C60.3659 48.7667 59.8831 48.2839 59.2846 48.2737C58.7141 48.2737 58.1668 48.7758 58.193 49.3652C58.2032 49.9638 58.686 50.4466 59.2846 50.4568Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M69.3832 51.4522C69.9551 51.4522 70.5009 50.9501 70.4747 50.3607C70.4653 49.7618 69.9821 49.2786 69.3832 49.2692C68.8127 49.2692 68.2655 49.7713 68.2917 50.3607C68.3018 50.9593 68.7846 51.4421 69.3832 51.4522Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M66.6807 54.5812C67.2526 54.5812 67.7984 54.0791 67.7722 53.4897C67.7621 52.8911 67.2793 52.4083 66.6807 52.3982C66.1102 52.3982 65.563 52.9003 65.5892 53.4897C65.5993 54.0883 66.0821 54.5711 66.6807 54.5812Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M71.0903 55.2929C71.6608 55.2929 72.208 54.7908 72.1818 54.2014C72.1725 53.6025 71.6892 53.1192 71.0903 53.1099C70.5198 53.1099 69.9726 53.612 69.9988 54.2014C70.0089 54.8 70.4918 55.2828 71.0903 55.2929Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M74.4988 52.5903C75.0693 52.5903 75.6165 52.0882 75.5903 51.4988C75.5802 50.9002 75.0974 50.4174 74.4988 50.4073C73.9268 50.4073 73.3811 50.9094 73.4073 51.4988C73.4174 52.0974 73.9002 52.5802 74.4988 52.5903Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M76.4955 56.1457C77.066 56.1457 77.6132 55.6436 77.587 55.0542C77.5769 54.4556 77.0941 53.9728 76.4955 53.9626C75.925 53.9626 75.3778 54.4647 75.404 55.0542C75.4141 55.6527 75.8969 56.1355 76.4955 56.1457Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M68.2407 59.1335C68.8127 59.1335 69.3584 58.6314 69.3322 58.042C69.3229 57.4431 68.8396 56.9599 68.2407 56.9505C67.6702 56.9505 67.123 57.4526 67.1492 58.042C67.1601 58.6403 67.6425 59.1226 68.2407 59.1335Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M64.2633 60.1289C64.8338 60.1289 65.381 59.6268 65.3548 59.0374C65.3447 58.4388 64.8619 57.956 64.2633 57.9459C63.6914 57.9459 63.1456 58.448 63.1718 59.0374C63.1819 59.636 63.6647 60.1188 64.2633 60.1289Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M73.7929 59.5599C74.3633 59.5599 74.9106 59.0578 74.8844 58.4684C74.875 57.8695 74.3918 57.3863 73.7929 57.3769C73.2224 57.3769 72.6751 57.879 72.7013 58.4684C72.7115 59.067 73.1943 59.5498 73.7929 59.5599Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M70.3787 62.5463C70.9506 62.5463 71.4978 62.0442 71.4702 61.4548C71.4601 60.8562 70.9772 60.3734 70.3787 60.3633C69.8082 60.3633 69.261 60.8654 69.2872 61.4548C69.2973 62.0534 69.7801 62.5362 70.3787 62.5463Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M66.2543 64.1108C66.8248 64.1108 67.372 63.6087 67.3458 63.0193C67.3357 62.4207 66.8529 61.9379 66.2543 61.9278C65.6838 61.9278 65.1366 62.4299 65.1628 63.0193C65.1729 63.6179 65.6557 64.1007 66.2543 64.1108Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M62.4194 65.6767C62.9899 65.6767 63.5371 65.1746 63.5109 64.5852C63.5016 63.9863 63.0183 63.5031 62.4194 63.4937C61.8489 63.4937 61.3017 63.9958 61.3279 64.5852C61.338 65.1838 61.8209 65.6666 62.4194 65.6767Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M59.142 66.956C59.7125 66.956 60.2597 66.4539 60.2335 65.8645C60.2234 65.2659 59.7406 64.7831 59.142 64.7729C58.5715 64.7729 58.0243 65.275 58.0505 65.8645C58.0606 66.463 58.5434 66.9458 59.142 66.956Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M52.0297 69.0895C52.6016 69.0895 53.1474 68.5874 53.1212 67.998C53.1111 67.3994 52.6283 66.9166 52.0297 66.9065C51.4592 66.9065 50.912 67.4086 50.9382 67.998C50.9483 68.5966 51.4311 69.0794 52.0297 69.0895Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M55.8704 71.5083C56.4409 71.5083 56.9881 71.0062 56.9619 70.4168C56.9525 69.8179 56.4693 69.3346 55.8704 69.3253C55.2999 69.3253 54.7527 69.8273 54.7789 70.4168C54.789 71.0153 55.2718 71.4982 55.8704 71.5083Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M60.28 70.9392C60.8505 70.9392 61.3977 70.4371 61.3715 69.8477C61.3614 69.2491 60.8786 68.7663 60.28 68.7562C59.7095 68.7562 59.1623 69.2583 59.1885 69.8477C59.1986 70.4463 59.6815 70.9291 60.28 70.9392Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M64.2633 68.9483C64.8338 68.9483 65.381 68.4462 65.3548 67.8568C65.3447 67.2582 64.8619 66.7754 64.2633 66.7653C63.6914 66.7653 63.1456 67.266 63.1718 67.8568C63.1819 68.4554 63.6647 68.9382 64.2633 68.9483Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M68.2407 68.094C68.8127 68.094 69.3584 67.5919 69.3322 67.0025C69.3221 66.4039 68.8393 65.9211 68.2407 65.911C67.6702 65.911 67.123 66.4131 67.1492 67.0025C67.1601 67.6008 67.6425 68.0832 68.2407 68.094Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M72.371 65.9605C72.9415 65.9605 73.4887 65.4584 73.4625 64.869C73.4516 64.2708 72.9692 63.7884 72.371 63.7775C71.799 63.7775 71.2533 64.2796 71.2795 64.869C71.2896 65.4676 71.7724 65.9504 72.371 65.9605Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M76.0691 63.1153C76.6396 63.1153 77.1868 62.6132 77.1606 62.0238C77.1505 61.4252 76.6677 60.9424 76.0691 60.9323C75.4986 60.9323 74.9514 61.4344 74.9776 62.0238C74.9869 62.6227 75.4702 63.106 76.0691 63.1153Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M78.3452 59.2747H78.4907C79.0874 59.2601 79.5676 58.7798 79.5822 58.1832L79.5444 57.8921C79.4937 57.71 79.397 57.5441 79.2635 57.4104L79.0423 57.2401C78.8745 57.1436 78.6842 57.0934 78.4907 57.0946H78.3452C78.058 57.1073 77.7844 57.2207 77.5724 57.4147C77.3777 57.6257 77.2646 57.8992 77.2537 58.1861L77.2915 58.4771C77.3421 58.6592 77.4389 58.8251 77.5724 58.9589L77.7936 59.1291C77.9611 59.2263 78.1516 59.2765 78.3452 59.2747Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M79.3407 66.2458C79.9112 66.2458 80.4584 65.7437 80.4322 65.1543C80.4221 64.5557 79.9393 64.0729 79.3407 64.0627C78.7702 64.0627 78.223 64.5634 78.2492 65.1543C78.2593 65.7528 78.7421 66.2356 79.3407 66.2458Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M75.6427 68.2367C76.2132 68.2367 76.7604 67.7346 76.7342 67.1452C76.7241 66.5466 76.2413 66.0638 75.6427 66.0536C75.0708 66.0536 74.525 66.5557 74.5512 67.1452C74.5613 67.7437 75.0441 68.2265 75.6427 68.2367Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M72.2284 70.5128C72.7989 70.5128 73.3461 70.0108 73.3199 69.4213C73.3098 68.8228 72.827 68.3399 72.2284 68.3298C71.6579 68.3298 71.1107 68.8319 71.1369 69.4213C71.147 70.0199 71.6298 70.5027 72.2284 70.5128Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M67.8187 72.2185C68.3892 72.2185 68.9364 71.7178 68.9102 71.127C68.9001 70.5284 68.4173 70.0456 67.8187 70.0355C67.2482 70.0355 66.701 70.5376 66.7272 71.127C66.7373 71.7256 67.2201 72.2084 67.8187 72.2185Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M63.978 72.6464C64.55 72.6464 65.0957 72.1443 65.0695 71.5549C65.0602 70.956 64.5769 70.4727 63.978 70.4634C63.4075 70.4634 62.8603 70.9655 62.8865 71.5549C62.8966 72.1535 63.3794 72.6363 63.978 72.6464Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M73.9356 73.9256C74.506 73.9256 75.0533 73.4235 75.0271 72.8341C75.0169 72.2355 74.5341 71.7527 73.9356 71.7426C73.3651 71.7426 72.8178 72.2447 72.844 72.8341C72.8534 73.433 73.3366 73.9163 73.9356 73.9256Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M76.7807 76.3488C77.3512 76.3488 77.8984 75.8467 77.8723 75.2573C77.8614 74.659 77.379 74.1766 76.7807 74.1658C76.2088 74.1658 75.6616 74.6679 75.6892 75.2573C75.6994 75.8559 76.1822 76.3387 76.7807 76.3488Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M47.9679 35.637C48.7046 36.7723 49.1679 38.0631 49.3214 39.4077C49.3282 39.646 49.5197 39.8375 49.758 39.8444C49.9734 39.8444 50.2208 39.6435 50.1946 39.4077C50.036 37.9084 49.5308 36.4665 48.7189 35.196C48.5938 34.9916 48.3295 34.9228 48.1207 35.0403C47.9132 35.1622 47.8435 35.4291 47.965 35.637H47.9679Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M51.4607 37.1418C52.0224 37.1418 52.0239 36.2686 51.4607 36.2686C50.8975 36.2686 50.8989 37.1418 51.4607 37.1418Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M18.6471 13.7428C18.7406 13.9254 18.8241 14.113 18.8974 14.3046C18.9786 14.5163 19.0491 14.7319 19.1084 14.9508C19.2233 15.3656 19.294 15.7915 19.3194 16.2213C19.3194 16.4624 19.5149 16.6579 19.756 16.6579C19.9972 16.6579 20.1926 16.4624 20.1926 16.2213C20.1284 15.2075 19.8591 14.2172 19.4009 13.3106C19.2795 13.1025 19.0124 13.0322 18.8043 13.1534C18.6002 13.2779 18.5309 13.5412 18.6471 13.7501V13.7428Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M23.8528 10.3897L23.5618 15.5154C23.5618 15.7565 23.7572 15.952 23.9984 15.952C24.2395 15.952 24.435 15.7565 24.435 15.5154L24.726 10.3941C24.726 10.1529 24.5306 9.95746 24.2894 9.95746C24.0483 9.95746 23.8528 10.1529 23.8528 10.3941V10.3897Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M27.7255 13.833L27.3297 15.8312C27.2658 16.0639 27.4026 16.3043 27.6353 16.3682C27.868 16.4321 28.1084 16.2953 28.1723 16.0626L28.5667 14.06C28.6157 13.9074 28.577 13.7401 28.466 13.6244C28.355 13.5087 28.1895 13.4631 28.0349 13.5058C27.8803 13.5484 27.7615 13.6724 27.7255 13.8286V13.833Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M60.1462 6.36861C61.3232 8.288 62.6513 10.1105 64.1179 11.8189C64.1998 11.9011 64.3111 11.9473 64.4271 11.9473C64.5432 11.9473 64.6545 11.9011 64.7364 11.8189C64.9014 11.6457 64.9014 11.3735 64.7364 11.2004C63.3186 9.54829 62.0357 7.78505 60.9001 5.92764C60.609 5.45029 59.8522 5.88835 60.1462 6.36425V6.36861Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M64.7363 3.64271C65.3242 4.94909 65.8335 6.28942 66.2615 7.65655C66.4303 8.19066 67.2802 7.96363 67.1041 7.42515C66.6503 5.98518 66.1114 4.57344 65.4902 3.19738C65.3941 2.98199 65.0812 2.93105 64.8935 3.0402C64.6905 3.1662 64.6215 3.42886 64.7363 3.63835V3.64271Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M70.7688 0.436603L71.2054 4.2758C71.2115 4.51435 71.4034 4.70628 71.642 4.7124C71.8559 4.7124 72.1048 4.51156 72.0786 4.2758L71.642 0.436603C71.6358 0.198055 71.4439 0.00611962 71.2054 0C70.99 0 70.7426 0.200837 70.7688 0.436603Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M84.7154 57.7422C85.1291 59.0537 85.8658 60.2402 86.8576 61.1928C87.2637 61.5814 87.8764 60.9643 87.4747 60.5743C86.5892 59.7295 85.9306 58.6755 85.5595 57.5093C85.4952 57.2766 85.2544 57.1401 85.0217 57.2044C84.789 57.2687 84.6525 57.5095 84.7168 57.7422H84.7154Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M88.5022 54.5608C88.9012 55.4929 89.2163 56.4587 89.4438 57.4467C89.5081 57.6794 89.7488 57.8159 89.9815 57.7516C90.2142 57.6873 90.3507 57.4466 90.2864 57.2139C90.0353 56.154 89.6905 55.1186 89.256 54.1198C89.1614 53.903 88.8442 53.8535 88.6579 53.9627C88.4548 54.0887 88.3863 54.3518 88.5022 54.5608Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M93.7311 51.899C94.0246 53.2242 94.2481 54.564 94.4005 55.9128C94.4074 56.151 94.5989 56.3426 94.8371 56.3494C95.0525 56.3494 95.2999 56.1486 95.2738 55.9128C95.1157 54.4862 94.8816 53.0691 94.5723 51.6676C94.5363 51.5113 94.4175 51.3874 94.2629 51.3447C94.1083 51.3021 93.9428 51.3476 93.8318 51.4633C93.7208 51.579 93.6821 51.7463 93.7311 51.899Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M38.9214 70.133C38.9952 72.22 38.967 74.3059 38.837 76.391C38.837 76.6321 39.0325 76.8276 39.2736 76.8276C39.5125 76.8222 39.7049 76.6298 39.7102 76.391C39.8412 74.3069 39.8694 72.2209 39.7947 70.133C39.7743 69.5727 38.9011 69.5698 38.9214 70.133Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M43.6456 68.2847C43.4989 69.4948 43.2611 70.6921 42.9339 71.8663C42.7884 72.4091 43.6266 72.6405 43.7765 72.0991C44.119 70.848 44.3671 69.5729 44.5188 68.2847C44.5479 68.0504 44.299 67.8481 44.0822 67.8481C43.8436 67.8542 43.6517 68.0461 43.6456 68.2847Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M48.9429 69.4563L48.045 72.8559C47.8995 73.4002 48.7436 73.6316 48.8876 73.0873L49.7856 69.6862C49.9311 69.1419 49.087 68.9105 48.9429 69.4534V69.4563Z"
                        fill="#C4C4C4"
                      />
                      <path
                        d="M30.7643 94.6205C30.6388 95.3574 30.4298 96.0776 30.1415 96.7672C29.8504 97.4512 29.4487 98.077 29.0922 98.7231C28.7356 99.3693 28.4314 100.062 28.4256 100.806C28.4203 101.49 28.6941 102.147 29.1838 102.625C29.7148 103.157 30.451 103.432 31.201 103.379C31.4392 103.372 31.6307 103.18 31.6376 102.942C31.6376 102.701 31.4421 102.506 31.201 102.506C30.71 102.557 30.2206 102.395 29.8577 102.06C29.4658 101.717 29.2601 101.208 29.3032 100.689C29.3381 100.087 29.6452 99.5163 29.9377 98.9997C30.2944 98.4108 30.618 97.8025 30.907 97.1776C31.2294 96.431 31.4644 95.6496 31.607 94.849C31.6637 94.6173 31.5296 94.3816 31.3014 94.312C31.1896 94.2812 31.0702 94.2961 30.9695 94.3535C30.8688 94.4108 30.795 94.5058 30.7643 94.6176V94.6205Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M33.0331 102.763C33.5949 102.763 33.5963 101.89 33.0331 101.89C32.4699 101.89 32.4699 102.763 33.0331 102.763Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M20.8868 40.9839C20.8564 41.1003 20.8359 41.2191 20.8257 41.339C20.817 41.4586 20.8228 41.5788 20.8432 41.697C20.8778 41.9161 20.9736 42.1209 21.1197 42.2879C21.2537 42.447 21.4337 42.5609 21.6349 42.6139C22.0158 42.7138 22.418 42.5599 22.6347 42.2311C22.7125 42.1092 22.7576 41.9694 22.7657 41.8251C22.7656 41.7093 22.7195 41.5983 22.6376 41.5165C22.5553 41.4354 22.4447 41.3895 22.3291 41.3885C22.2133 41.3886 22.1024 41.4346 22.0206 41.5165L21.9522 41.6053C21.9132 41.672 21.8926 41.7478 21.8925 41.8251V41.8396L21.9085 41.7247C21.9028 41.7538 21.895 41.7825 21.8852 41.8105L21.9289 41.7057C21.9153 41.7376 21.8982 41.7679 21.8779 41.796L21.9463 41.7072C21.9217 41.7386 21.8939 41.7673 21.8634 41.7931L21.9507 41.7247C21.9142 41.7524 21.8746 41.7758 21.8328 41.7945L21.9376 41.7494C21.9001 41.7647 21.8611 41.776 21.8212 41.7829L21.9361 41.7669C21.896 41.772 21.8555 41.772 21.8154 41.7669L21.9303 41.7829C21.884 41.7759 21.8386 41.7637 21.795 41.7465L21.8998 41.7901C21.8509 41.77 21.8049 41.7436 21.763 41.7116L21.8517 41.78C21.8056 41.744 21.764 41.7024 21.728 41.6562L21.7964 41.745C21.7572 41.6942 21.7249 41.6384 21.7004 41.5791L21.744 41.6839C21.716 41.6132 21.6965 41.5394 21.6858 41.4641L21.7018 41.5806C21.6895 41.4839 21.6895 41.3861 21.7018 41.2895L21.6858 41.4059C21.6951 41.3417 21.7083 41.278 21.7251 41.2153C21.7555 41.1014 21.7398 40.9801 21.6815 40.8776C21.5927 40.7263 21.4219 40.6427 21.248 40.6656C21.074 40.6885 20.9306 40.8133 20.8839 40.9824L20.8868 40.9839Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M37.2682 33.7509C37.8401 33.7509 38.3859 33.2488 38.3597 32.6594C38.3496 32.0608 37.8668 31.578 37.2682 31.5679C36.6977 31.5679 36.1505 32.07 36.1767 32.6594C36.1868 33.258 36.6696 33.7408 37.2682 33.7509Z"
                        fill="#6573C9"
                      />
                      <path
                        d="M20.8214 25.8265C20.9279 25.5855 21.0653 25.3595 21.2304 25.1542C21.3014 25.0625 21.3932 24.9892 21.4982 24.9402C21.4574 24.9591 21.5069 24.9402 21.5229 24.9315C21.552 24.9222 21.5816 24.9149 21.6117 24.9097C21.5724 24.9097 21.715 24.9097 21.6845 24.9097C21.7136 24.9149 21.7423 24.9222 21.7703 24.9315C21.8373 24.9519 21.7238 24.9053 21.7863 24.9315C21.8111 24.9431 21.8358 24.9591 21.8606 24.9737C21.9202 25.0115 21.8227 24.9388 21.878 24.9839C21.9233 25.0224 21.9652 25.0648 22.0032 25.1105C22.0032 25.1105 22.0556 25.1789 22.0861 25.2298C22.2161 25.4496 22.3142 25.6868 22.3772 25.9342C22.4242 26.1032 22.5678 26.2276 22.7417 26.2502C22.9157 26.2727 23.0862 26.189 23.1747 26.0376C23.3203 25.796 23.4905 25.5486 23.7409 25.4845C23.8209 25.4641 23.6899 25.4845 23.7627 25.4845C23.7787 25.4845 23.8675 25.4962 23.8049 25.4845C23.8354 25.489 23.8652 25.4973 23.8937 25.5093C23.8427 25.4889 23.9184 25.5238 23.9344 25.534C23.9228 25.5267 24.0086 25.6082 23.9839 25.5748C24.0028 25.6024 24.0217 25.6126 23.9941 25.5849C24.0232 25.6126 23.9941 25.6359 24.0072 25.566C23.9511 25.7972 24.0842 26.0322 24.3114 26.103C24.5166 26.1583 24.8164 26.0332 24.8484 25.7974C24.909 25.4872 24.8107 25.1673 24.5864 24.9446C24.3775 24.7403 24.0998 24.6214 23.8078 24.6113C23.1791 24.5968 22.7105 25.0974 22.4209 25.601L23.2184 25.7043C23.0205 25.0319 22.6523 24.1849 21.8708 24.0568C20.9801 23.9113 20.4154 24.6681 20.0661 25.3812C19.9513 25.5907 20.0204 25.8533 20.2233 25.9793C20.4315 26.1005 20.6985 26.0302 20.82 25.8222L20.8214 25.8265Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M25.7623 26.4305C26.3241 26.4305 26.3255 25.5573 25.7623 25.5573C25.1991 25.5573 25.2006 26.4305 25.7623 26.4305Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M83.5817 23.7599C85.6788 25.4016 87.8313 27.0039 90.3359 27.9688C90.5682 28.033 90.8086 27.8968 90.873 27.6646C90.9312 27.4327 90.7965 27.1959 90.5673 27.1276C88.2155 26.2195 86.1678 24.6841 84.1987 23.1429C84.0255 22.9795 83.7549 22.9795 83.5817 23.1429C83.4362 23.2884 83.3954 23.6129 83.5817 23.7599Z"
                        fill="#282A3A"
                      />
                      <path
                        d="M38.8022 85.7881C39.364 85.7881 39.364 84.9149 38.8022 84.9149C38.2405 84.9149 38.239 85.7881 38.8022 85.7881Z"
                        fill="#282A3A"
                      />
                    </svg>
                  }
                  title={useFormatMessage(
                    "modules.workspace.display.empty_post.title"
                  )}
                  text={useFormatMessage(
                    "modules.workspace.display.empty_post.description"
                  )}
                />
              </div>
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
