import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import LoadFeed from "@modules/Feed/components/LoadFeed"
import { workspaceApi } from "@modules/Workspace/common/api"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import moment from "moment"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Col } from "reactstrap"
import WorkspaceIntroduction from "../sidebarComponents/WorkspaceIntroduction"
import ReactHtmlParser from "react-html-parser"
import notification from "@apps/utility/notification"
import { Dropdown } from "antd"
import { PushpinOutlined } from "@ant-design/icons"
import { map } from "lodash-es"
const findKeyByID = (arr = [], id) => {
  const index = arr.findIndex((p) => p.id === id)
  return index
}
const TabFeed = (props) => {
  const { detailWorkspace } = props
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    dataCreateNew: {},
    approveStatus: "pending",
    dataPinned: [],
    joined: false
  })

  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0
  const params = useParams()
  const workspaceID = params?.id
  const apiLoadFeed = workspaceApi.loadFeed
  const setDataCreateNew = () => {}

  const loadData = (paramsX = {}) => {
    paramsX.id = workspaceID
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

    //  setState({ dataPinned: dataPinned })
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
      pinPosts: dataPinned
    }

    workspaceApi.update(params.id, dataUpdate).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      loadData()
    })
  }
  const handleUnPinPost = (idPost) => {
    const dataPinned = [...detailWorkspace.pinPosts]

    dataPinned.push({ post: idPost, stt: dataPinned.length + 1 })
    detailWorkspace.pinPosts = dataPinned
    const dataUpdate = {
      pinPosts: dataPinned
    }
    workspaceApi.update(params.id, dataUpdate).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
    })
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
          key: "0"
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
        <Col sm={12}>
          <div className="post-pinned">
            <div className="content-post d-flex align-items-center mb-50">
              <div>
                {ReactHtmlParser(item?.content)}
                <div
                  className="post-info d-flex align-items-center mt-50"
                  style={{ fontSize: "12px" }}>
                  <div className="me-50 d-flex align-items-center">
                    <Avatar src={item.created_by?.avatar} size="sm" />{" "}
                    <div className="ms-50">{item.created_by?.full_name}</div>
                  </div>
                  <div className="me-50">
                    <i className="fa-duotone fa-calendar-days me-50"></i>{" "}
                    {moment(item?.created_at).format("DD MMM, YYYY")}
                  </div>
                  <div>
                    <i className="fa-regular fa-eye me-50"></i>{" "}
                    {item.seen_count}
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
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </Button>
              </Dropdown>
            </div>
            <hr className="pd-0"></hr>
          </div>
        </Col>
      )
    })
  }
  const customActionPost = {
    pin_post: {
      label: (
        <a>
          <i className="fa-light fa-thumbtack"></i>
          <span>{useFormatMessage("modules.workspace.text.pin_post")}</span>
        </a>
      ),
      condition: true,
      onClick: (e) => handlePinPost(e?._id)
    }
  }
  return (
    <div className="div-content ">
      <div className="div-left feed">
        {state.joined && (
          <CreatePost
            setDataCreateNew={setDataCreateNew}
            workspace={workspaceID}
            approveStatus={state.approveStatus}
          />
        )}

        <Card className="mb-1">
          <CardHeader>
            <h2 className="card-title">
              <i className="fa-regular fa-thumbtack me-50"></i>
              {useFormatMessage(
                "modules.workspace.display.workspace_pinned_post"
              )}
            </h2>
          </CardHeader>
          <CardBody>{renderPinned(state.dataPinned)}</CardBody>
        </Card>
        <LoadFeed
          dataCreateNew={state.dataCreateNew}
          setDataCreateNew={setDataCreateNew}
          workspace={[workspaceID]}
          apiLoadFeed={apiLoadFeed}
          customAction={customActionPost}
        />
      </div>
      <div className="div-right">
        <div id="div-sticky">
          <WorkspaceIntroduction />
        </div>
      </div>
    </div>
  )
}

export default TabFeed
