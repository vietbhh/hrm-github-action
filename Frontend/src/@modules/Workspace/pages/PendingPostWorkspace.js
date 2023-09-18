import { useParams } from "react-router-dom"
import PendingPost from "../../Feed/components/PendingPost"
import { workspaceApi } from "../common/api"
import WorkspaceSettingLayout from "../components/detail/WorkspaceSettingLayout/WorkspaceSettingLayout"
import MenuSettingWorkspace from "../components/detail/MenuSettingWorkspace"

const checkMediaWidth = (x) => {
  if (x.matches) {
    return true
  }

  return false
}
const PendingPostWorkspace = () => {
  const params = useParams()
  const checkMobile = checkMediaWidth(
    window.matchMedia("(max-width: 767.98px)")
  )
  return (
    <WorkspaceSettingLayout>
      {checkMobile && (
        <div className="row">
          <div className="col-md-12 ">
            <MenuSettingWorkspace menu={"approvals"} idWorkgroup={params.id} />
          </div>
        </div>
      )}

      <PendingPost loadPost={workspaceApi.loadPost} idWorkspace={params.id} />
    </WorkspaceSettingLayout>
  )
}

export default PendingPostWorkspace
