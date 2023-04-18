import { Alert } from "reactstrap"
import WorkspaceInfo from "./TabIntroduction/WorkspaceInfo"
const TabPrivate = (props) => {
  const { data } = props

  return (
    <div
      className="tab-introduction"
      style={{ maxWidth: "600px", margin: "auto" }}>
      <Alert severity="error" style={{ padding: "10px" }}>
        Your are not joined in this group, please join group to view the posts
      </Alert>
      <WorkspaceInfo workspaceInfo={data} />
    </div>
  )
}

export default TabPrivate
