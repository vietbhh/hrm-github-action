import { useMergedState } from "@apps/utility/common"
import LoadFeed from "@modules/Feed/components/LoadFeed"
import { workspaceApi } from "@modules/Workspace/common/api"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Card, CardBody, CardHeader } from "reactstrap"
import WorkspaceIntroduction from "../sidebarComponents/WorkspaceIntroduction"
const TabFeed = (props) => {
  const { detailWorkspace } = props
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    dataCreateNew: {},
    approveStatus: "pending"
  })

  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0
  const params = useParams()
  const workspaceID = params?.id
  const apiLoadFeed = workspaceApi.loadFeed
  const setDataCreateNew = () => {}

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
  }, [detailWorkspace])

  return (
    <div className="div-content ">
      <div className="div-left feed">
        <CreatePost
          setDataCreateNew={setDataCreateNew}
          workspace={workspaceID}
          approveStatus={state.approveStatus}
        />

        <Card className="mb-1">
          <CardHeader>
            <h2 className="card-title">
              <i class="fa-duotone fa-flag-swallowtail"></i> Workspace pinned
              post
            </h2>
          </CardHeader>
          <CardBody>
            <div className="post-pinned">
              <div className="content"></div>
              <div className="d-flex">
                <div className="me-50">Long Trinh</div>
                <div className="me-50">
                  <i className="fa-duotone fa-calendar-days me-50"></i>March 3,
                  2023
                </div>
                <div>
                  <div>
                    <i className="fa-regular fa-eye me-50"></i>0
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <LoadFeed
          dataCreateNew={state.dataCreateNew}
          setDataCreateNew={setDataCreateNew}
          workspace={[workspaceID]}
          apiLoadFeed={apiLoadFeed}
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
