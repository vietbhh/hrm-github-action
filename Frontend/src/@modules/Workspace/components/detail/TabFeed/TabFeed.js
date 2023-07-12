import { PushpinOutlined } from "@ant-design/icons"
import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import LoadFeed from "@modules/Feed/components/LoadFeed"
import { workspaceApi } from "@modules/Workspace/common/api"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import { Dropdown } from "antd"
import { map } from "lodash-es"
import moment from "moment"
import { Fragment, useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import { useSelector } from "react-redux"
import { useParams, useSearchParams, useLocation } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Col } from "reactstrap"
import Introduction from "../TabIntroduction/Introduction"

const TabFeed = (props) => {
  const {
    searchTextFeed,
    detailWorkspace,
    handleUnPinPost,
    setSearchTextFeed
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

  const apiLoadFeed = workspaceApi.loadFeed
  const setDataCreateNew = () => {}

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
    const arrMember = detailWorkspace?.members ? detailWorkspace?.members : []
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
  const handleUnPinPostOLD = (idPost) => {
    const dataPinned = [...detailWorkspace.pinPosts]
    const index = dataPinned.findIndex((p) => p.post === idPost)
    dataPinned.splice(index, 1)
    let numStt = 1
    const dataPinnedUpdate = []
    map(dataPinned, (item, key) => {
      dataPinnedUpdate.push({ post: item.post, stt: numStt })
      numStt += 1
    })
    detailWorkspace.pinPosts = dataPinnedUpdate
    const dataUpdate = {
      pinPosts: JSON.stringify(dataPinnedUpdate)
    }
    workspaceApi.update(params.id, dataUpdate).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      loadData()
    })
  }

  const handleClickRemoveSearch = () => {
    window.history.replaceState(null, "", "?tab=feed")
    setSearchTextFeed("")
  }

  const renderPinned = (data = []) => {
    let count = 0
    return data.map((item, key) => {
      count += 1
      if (count >= 4) return
      const items = [
        {
          label: (
            <div className="d-flex">
              <PushpinOutlined style={{ fontSize: "18px" }} className="me-50" />
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
        }
      ]

      return (
        <Card className="mb-1" key={`item-pinned-${key}`}>
          <CardHeader>
            <h2 className="card-title">
              <i className="fa-regular fa-thumbtack me-50"></i>
              {useFormatMessage(
                "modules.workspace.display.workspace_pinned_post"
              )}
            </h2>
          </CardHeader>
          <CardBody>
            <Col sm={12} key={key}>
              <div className="post-pinned">
                <div className="content-post d-flex align-items-center mb-50">
                  <div>
                    {ReactHtmlParser(item?.content)}
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
                    {item?.thumb && <Photo src={item?.thumb} width={"60px"} />}
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
          </CardBody>
        </Card>
      )
    })
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

  const setIntroduction = (data) => {
    setState({ loading: true })
    detailWorkspace.introduction = data
    setState({ loading: false })
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
          />
        )}
        <Fragment>{renderPinned(state.dataPinned)}</Fragment>
        <Fragment>{renderSearchText()}</Fragment>
        <LoadFeed
          searchTextFeed={searchTextFeed}
          dataCreateNew={state.dataCreateNew}
          setDataCreateNew={setDataCreateNew}
          workspace={[workspaceID]}
          apiLoadFeed={apiLoadFeed}
          customAction={customActionPost}
        />
      </div>
      <div className="div-right">
        <div id="div-sticky">
          <Introduction
            id={workspaceID}
            loading={state.loading}
            workspaceInfo={detailWorkspace}
            introduction={detailWorkspace.introduction}
            setIntroduction={setIntroduction}
          />
        </div>
      </div>
    </div>
  )
}

export default TabFeed
