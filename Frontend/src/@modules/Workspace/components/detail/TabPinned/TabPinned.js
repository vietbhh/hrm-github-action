import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import LoadFeed from "@modules/Feed/components/LoadFeed"
import { workspaceApi } from "@modules/Workspace/common/api"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row
} from "reactstrap"
import WorkspaceIntroduction from "../sidebarComponents/WorkspaceIntroduction"
import moment from "moment"
const TabPinned = (props) => {
  const { detailWorkspace } = props
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    dataCreateNew: {},
    approveStatus: "pending",
    dataPin: []
  })

  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0
  const params = useParams()
  const workspaceID = params?.id
  const apiLoadFeed = workspaceApi.loadPinned
  const setDataCreateNew = () => {}
  console.log("workspaceID pinned", state)

  const loadData = (paramsX = {}) => {
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
    paramsX.id = workspaceID
    workspaceApi.loadPinned(paramsX).then((res) => {
      setState({ dataPin: res.data.dataPost })
    })
  }
  console.log("feed state", state)
  const renderPostPinned = (data = []) => {
    return data.map((item, key) => {
      console.log("item", item)
      return (
        <Col sm={12}>
          <Card>
            <CardBody>
              <div className="d-flex">
                <Avatar src={item.created_by?.avatar} className="me-1" />
                <div>
                  <h6 className="fw-blod mb-0">
                    {item.created_by?.full_name}{" "}
                    <i className="fa-solid fa-caret-right ms-50 me-50"></i>{" "}
                    {detailWorkspace.name}
                  </h6>
                  <small class="text-muted">
                    {moment(item?.created_at).format("DD MMM, YYYY")}
                  </small>
                </div>
              </div>
              <div className="d-flex mt-1">
                <div>{item?.content}</div>
                <div className="ms-auto">
                  {item?.thumb && <Photo src={item?.thumb} width={"100px"} />}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      )
    })
  }
  useEffect(() => {
    const arrAdmin = detailWorkspace?.administrators
      ? detailWorkspace?.administrators
      : []
    const isAdmin = arrAdmin.includes(userId)
    if (isAdmin) {
      setState({ approveStatus: "approved" })
    } else {
      if (detailWorkspace?.review_post) {
        setState({ approveStatus: "pending" })
      } else {
        setState({ approveStatus: "approved" })
      }
    }

    loadData({})
  }, [])

  useEffect(() => {
    setState({ dataPin: detailWorkspace?.pinPosts })
  }, [detailWorkspace])

  return (
    <div className="div-content">
      <div className="div-left">
        <Row>{renderPostPinned(state.dataPin)}</Row>
      </div>
      <div className="div-right">
        <div id="div-sticky">
          <Card>
            <CardBody>sidebar 2</CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TabPinned
