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
import { Button, Card, CardBody, CardHeader } from "reactstrap"
import WorkspaceIntroduction from "../sidebarComponents/WorkspaceIntroduction"
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
  console.log("detailWorkspace", detailWorkspace)
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

  const handlePinPost = (idPost) => {
    const dataPinned = [...state.dataPin]
    dataPinned.push({ post: "64182f3180c579024eec029b", stt: 1 })
    const dataUpdate = {
      pinPosts: dataPinned
    }
    workspaceApi.update(params.id, dataUpdate).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
    })
  }
  return (
    <div className="div-content">
      <div className="div-left">
        <Card>
          <CardBody>
            feedsss 2<Button onClick={() => handlePinPost("")}>Up</Button>
          </CardBody>
        </Card>
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
