import { Fragment, useContext } from "react"
import { feedApi } from "../common/api"
import PendingPost from "../components/PendingPost"
import { AbilityContext } from "utility/context/Can"
import { Navigate } from "react-router-dom"
const ApprovePost = (props) => {
  const ability = useContext(AbilityContext)
  const ApprovalPost = ability.can("ApprovalPost", "feed")
  if (!ApprovalPost) {
    return <Navigate to="/not-found" replace={true} />
  }
  return (
    <Fragment>
      <div className="div-left">
        <PendingPost loadPost={feedApi.loadPendingPost} />
      </div>
    </Fragment>
  )
}

export default ApprovePost
