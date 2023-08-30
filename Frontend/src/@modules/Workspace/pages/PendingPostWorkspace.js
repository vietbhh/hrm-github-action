import { useParams } from "react-router-dom"
import PendingPost from "../../Feed/components/PendingPost"
import { workspaceApi } from "../common/api"
import WorkspaceSettingLayout from "../components/detail/WorkspaceSettingLayout/WorkspaceSettingLayout"

const PendingPostWorkspace = () => {
  const params = useParams()

  return (
    <WorkspaceSettingLayout>
      <PendingPost loadPost={workspaceApi.loadPost} idWorkspace={params.id} />
    </WorkspaceSettingLayout>
  )
}

export default PendingPostWorkspace
