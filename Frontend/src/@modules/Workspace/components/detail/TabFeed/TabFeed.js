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
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Col } from "reactstrap"
import { getTabByNameOrId } from "../../../common/common"
import AboutWorkgroup from "./AboutWorkgroup"
// ** redux
import { useSelector } from "react-redux"

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
    loading: false``
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

  const renderPinned = (data = []) => {
    let count = 0
    return (
      <Card className="mb-1 div-pinned-post">
        <CardHeader>
          <h2 className="card-title">
            <i className="fa-regular fa-thumbtack me-50"></i>
            {useFormatMessage(
              "modules.workspace.display.workspace_pinned_post"
            )}
          </h2>
        </CardHeader>
        <CardBody>
          {data.map((item, key) => {
            count += 1
            if (count >= 4) return
            const items = [
              {
                label: (
                  <div className="d-flex">
                    <PushpinOutlined
                      style={{ fontSize: "18px" }}
                      className="me-50"
                    />
                    <span>
                      {useFormatMessage("modules.workspace.text.unpin_post")}
                    </span>
                  </div>
                ),
                key: "0",
                onClick: () => handleUnPinPost(item?._id)
              },
              {
                label: (
                  <div>
                    <i className="fa-regular fa-arrow-up me-50"></i>
                    <span>
                      {useFormatMessage("modules.workspace.text.move_to_top")}
                    </span>
                  </div>
                ),
                key: "1",
                onClick: () => handlePinTop(item?._id)
              },
              {
                label: (
                  <div className="d-flex">
                    <i className="fa-regular fa-arrow-right me-50"></i>
                    <span>
                      {useFormatMessage(
                        "modules.posts.post_details.buttons.go_to_post"
                      )}
                    </span>
                  </div>
                ),
                key: "2",
                onClick: () => {
                  navigate(`/posts/${item._id}`)
                }
              }
            ]

            return (
              <Col sm={12} key={`item-pinned-${key}`}>
                <div className="post-pinned">
                  <div className="content-post d-flex align-items-center mb-50">
                    <div>
                      <Link
                        className="text-primary-color text-truncate"
                        to={`/posts/${item._id}`}>
                        {stripHTML(item?.content)}
                      </Link>
                      <div
                        className="post-info d-flex align-items-center mt-50"
                        style={{ fontSize: "12px" }}>
                        <div className="me-50 d-flex align-items-center">
                          <Avatar src={item.created_by?.avatar} size="sm" />{" "}
                          <div className="ms-50">
                            {item.created_by?.full_name}
                          </div>
                        </div>
                        <div className="me-50">
                          <i className="fa-duotone fa-calendar-days me-50"></i>{" "}
                          {moment(item?.created_at).format("DD MMM, YYYY")}
                        </div>
                        <div>
                          <i className="fa-regular fa-eye me-50"></i>{" "}
                          {item.seen.length}
                        </div>
                      </div>
                    </div>
                    <div className="ms-auto">
                      {item?.thumb && (
                        <Photo src={item?.thumb} width={"60px"} />
                      )}
                    </div>
                    <Dropdown
                      menu={{
                        items
                      }}
                      trigger={["click"]}>
                      <Button className="ms-1" color="flat-secondary" size="sm">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </Button>
                    </Dropdown>
                  </div>
                  <hr className="pd-0"></hr>
                </div>
              </Col>
            )
          })}
          <div>
            {data.length > 3 && (
              <Button.Ripple
                size="sm"
                className="load-more-pinned custom-secondary"
                onClick={() => handleClickLoadMorePinned()}>
                <i className="far fa-arrow-to-right me-50"></i>
                {useFormatMessage("modules.workspace.buttons.load_more")}
              </Button.Ripple>
            )}
          </div>
        </CardBody>
      </Card>
    )
  }

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
          {!_.isEmpty(state.dataPinned) && renderPinned(state.dataPinned)}
        </Fragment>
        <Fragment>{renderSearchText()}</Fragment>
        <LoadFeed
          isWorkspace={true}
          searchTextFeed={searchTextFeed}
          dataCreateNew={state.dataCreateNew}
          setDataCreateNew={setDataCreateNew}
          workspace={[workspaceID]}
          apiLoadFeed={apiLoadFeed}
          customAction={customActionPost}
          setSearchTextFeed={setSearchTextFeed}
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
