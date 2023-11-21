import { PushpinOutlined } from "@ant-design/icons"
import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import LoadFeed from "@modules/Feed/components/LoadFeed"
import { workspaceApi } from "@modules/Workspace/common/api"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import { Dropdown } from "antd"
import { stripHTML } from "layouts/_components/vertical/common/common"
import { map } from "lodash-es"
import moment from "moment"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Col, CardTitle } from "reactstrap"
import { getTabByNameOrId } from "../../../common/common"
import AboutWorkgroup from "./AboutWorkgroup"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  A11y
} from "swiper"
import { Collapse } from "antd"
import LoadPost from "@src/components/hrm/LoadPost/LoadPost"

const TabFeed = (props) => {
  const {
    searchTextFeed,
    detailWorkspace,
    tabActive,
    handleUnPinPost,
    setSearchTextFeed,
    tabToggle
  } = props
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    dataCreateNew: {},
    approveStatus: "pending",
    dataPinned: [],
    joined: false,
    loading: false
  })

  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0
  const params = useParams()
  const workspaceID = params?.id

  const navigate = useNavigate()

  const apiLoadFeed = workspaceApi.loadFeed
  const setDataCreateNew = (data) => {
    setState({
      dataCreateNew: data
    })
  }

  const loadData = (paramsX = {}) => {
    paramsX.id = workspaceID
    paramsX.text = searchTextFeed
    workspaceApi.loadPinned(paramsX).then((res) => {
      setState({ dataPinned: res.data.dataPost })
    })
  }
  useEffect(() => {
    loadData()
    const arrAdmin = detailWorkspace?.administrators
      ? detailWorkspace?.administrators
      : []
    const arrMember = detailWorkspace?.members
      ? detailWorkspace?.members.map((x) => parseInt(x["id_user"]))
      : []
    const isAdmin = arrAdmin.includes(userId)
    const isMember = arrMember.includes(userId)
    let isJoined = false
    if (isAdmin || isMember) {
      isJoined = true
    }
    if (isAdmin) {
      setState({ approveStatus: "approved", joined: isJoined })
    } else {
      if (detailWorkspace?.review_post) {
        setState({ approveStatus: "pending", joined: isJoined })
      } else {
        setState({ approveStatus: "approved", joined: isJoined })
      }
    }
  }, [detailWorkspace])

  const handlePinTop = (idPost) => {
    const arrPinned = [...state.dataPinned]
    const index = arrPinned.findIndex((p) => p._id === idPost)
    const pinUp = arrPinned[index]
    arrPinned.splice(index, 1)
    arrPinned.unshift(pinUp)
    setState({ dataPinned: arrPinned })
    const dataPinnedUpdate = [...detailWorkspace.pinPosts]
    dataPinnedUpdate.splice(index, 1)
    dataPinnedUpdate.unshift({ post: idPost, stt: 1 })

    let numStt = 1
    map(dataPinnedUpdate, (item, key) => {
      dataPinnedUpdate[key].stt = numStt
      numStt += 1
    })

    const dataUpdate = {
      pinPosts: JSON.stringify(dataPinnedUpdate)
    }

    workspaceApi.update(params.id, dataUpdate).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
    })
  }
  const handlePinPost = (idPost) => {
    const dataPinned = [...detailWorkspace.pinPosts]

    dataPinned.unshift({ post: idPost, stt: 1 })
    let numStt = 1
    map(dataPinned, (item, key) => {
      dataPinned[key].stt = numStt
      numStt += 1
    })
    detailWorkspace.pinPosts = dataPinned
    const dataUpdate = {
      pinPosts: JSON.stringify(dataPinned)
    }

    workspaceApi.update(params.id, dataUpdate).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      loadData()
    })
  }

  const handleClickRemoveSearch = () => {
    setSearchTextFeed("")
    //window.history.replaceState(null, "", "?tab=feed")
  }

  const handleClickLoadMorePinned = () => {
    const tabId = getTabByNameOrId({
      value: "pinned",
      type: "name"
    })

    window.history.replaceState(
      "Object",
      "Title",
      `/workspace/${detailWorkspace._id}/information`
    )
    tabToggle(parseInt(tabId))
  }
  // added
  const renderPostPined = (data = []) => {
    return data.map((item, key) => {
      const customAction = {
        un_pin_post: {
          label: (
            <div className="d-flex">
              <PushpinOutlined style={{ fontSize: "18px" }} />
              <span>
                {useFormatMessage("modules.workspace.text.unpin_post")}
              </span>
            </div>
          ),
          onClick: () => handleUnPinPost(item?._id),
          condition: true
        }
      }

      return (
        <SwiperSlide key={key}>
          <div className="announcement-item workspace-post-pined">
            <LoadPost
              data={item}
              dataMention={state.dataMention}
              dataLink={item.dataLink}
              customAction={customAction}
            />
          </div>
        </SwiperSlide>
      )
    })
  }
  const items = [
    {
      key: "1",
      label: (
        <>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8V13"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.9941 16H12.0031"
              stroke="#696760"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {"  "}
          Post Were Pinned
        </>
      ),
      children: (
        <>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={3}
            spaceBetween={10}
            autoplay
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 40
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 22
              }
            }}
            className="announcements">
            {renderPostPined(state.dataPinned)}
          </Swiper>
        </>
      )
    }
  ]

  const checkPinPost = (_id) => {
    const arr = [...detailWorkspace.pinPosts].map((v) => v.post)
    return arr.includes(_id)
  }
  const customActionPost = {
    pin_post: {
      label: (
        <a>
          <i className="fa-light fa-thumbtack"></i>
          <span>{useFormatMessage("modules.workspace.text.pin_post")}</span>
        </a>
      ),
      condition: (e) => !checkPinPost(e._id),
      onClick: (e) => handlePinPost(e?._id)
    },
    un_pin_post: {
      label: (
        <a>
          <i className="fa-light fa-thumbtack"></i>
          <span>{useFormatMessage("modules.workspace.text.unpin_post")}</span>
        </a>
      ),
      condition: (e) => checkPinPost(e._id),
      onClick: (e) => handleUnPinPost(e?._id)
    }
  }

  const renderSearchText = () => {
    if (searchTextFeed.trim().length > 0) {
      return (
        <div className="d-flex align-items-center mb-1 mt-1">
          <h5 className="ms-50 me-1 mb-0 search-text">
            {useFormatMessage("modules.workspace.display.result_search", {
              text: searchTextFeed
            })}
          </h5>
          <Button.Ripple
            size="sm"
            color="danger"
            onClick={() => handleClickRemoveSearch()}>
            <i className="fas fa-times me-50"></i>
            {useFormatMessage("modules.workspace.buttons.cancel")}
          </Button.Ripple>
        </div>
      )
    }

    return ""
  }
  return (
    <div className="div-content tab-feed">
      <div className="div-left feed">
        {state.joined && (
          <CreatePost
            setDataCreateNew={setDataCreateNew}
            workspace={workspaceID}
            approveStatus={state.approveStatus}
            allowPostType={["event", "poll"]}
            detailWorkspace={detailWorkspace}
          />
        )}
        <Fragment>
          <div className="workspace">
            {state.dataPinned.length !== 0 && (
              <div className="workspace-pined">
                <Card className="card-announcement mb-1 rounded">
                  <CardTitle className="mb-0">
                    <Collapse
                      defaultActiveKey={["1"]}
                      ghost
                      items={items}
                      expandIconPosition={"end"}
                      expandIcon={(panelProps) => {
                        return panelProps.isActive ? (
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M27.9201 16.95L21.4001 23.47C20.6301 24.24 19.3701 24.24 18.6001 23.47L12.0801 16.95"
                              stroke="#696760"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M27.9201 16.95L21.4001 23.47C20.6301 24.24 19.3701 24.24 18.6001 23.47L12.0801 16.95"
                              stroke="#696760"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )
                      }}
                    />
                  </CardTitle>
                </Card>
              </div>
            )}
          </div>
        </Fragment>
        <Fragment>{renderSearchText()}</Fragment>
        <LoadFeed
          searchTextFeed={searchTextFeed}
          dataCreateNew={state.dataCreateNew}
          setDataCreateNew={setDataCreateNew}
          workspace={[workspaceID]}
          apiLoadFeed={apiLoadFeed}
          customAction={customActionPost}
          setSearchTextFeed={setSearchTextFeed}
          handleUnPinPost={handleUnPinPost}
        />
      </div>
      <div className="div-right">
        <div id="div-sticky">
          <AboutWorkgroup
            loading={state.loading}
            workspaceInfo={detailWorkspace}
            introduction={detailWorkspace.description}
            tabActive={tabActive}
            tabToggle={tabToggle}
          />
        </div>
      </div>
    </div>
  )
}

export default TabFeed
