import { Fragment, useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Navigate } from "react-router-dom"
import { AbilityContext } from "utility/context/Can"
import { useFormatMessage } from "../../../@apps/utility/common"
import { setAppTitle } from "../../../redux/app/app"
import { feedApi } from "../common/api"
import PendingPost from "../components/PendingPost"
const ApprovePost = (props) => {
  const ability = useContext(AbilityContext)
  const ApprovalPost = ability.can("ApprovalPost", "feed")
  if (!ApprovalPost) {
    return <Navigate to="/not-found" replace={true} />
  }

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setAppTitle(useFormatMessage("menu:menu.approve_post")))
  }, [])

  return (
    <Fragment>
      <div className="div-left">
        <PendingPost loadPost={feedApi.loadPendingPost} />
      </div>
    </Fragment>
  )
}

export default ApprovePost
