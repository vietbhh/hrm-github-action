// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useParams } from "react-router-dom"
// ** Styles
// ** Components
import InteractiveMember from "../components/detail/PostDetailDashboard/InteractiveMember/InteractiveMember"
import PostInfo from "../components/detail/PostDetailDashboard/PostInfo/PostInfo"

const PostDetailDashboard = () => {
  const { idPost } = useParams()

  // ** render
  return (
    <div className="post-detail-dashboard-page">
      <div className="page-header">
        <h3>
          {useFormatMessage("modules.posts.post_details.title.post_details")}
        </h3>
        <p>
          {useFormatMessage(
            "modules.posts.post_details.text.page_descriptions"
          )}
        </p>
      </div>
      <div className="page-body">
        <PostInfo idPost={idPost} />
        <InteractiveMember idPost={idPost} />
      </div>
    </div>
  )
}

export default PostDetailDashboard
