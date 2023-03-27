import { useMergedState } from "@apps/utility/common"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import LoadFeed from "./LoadFeed"

const FeedCreateAndLoad = (props) => {
  const {
    workspace = [], // arr workspace: []
    apiLoadFeed = null, // api load feed
    paramsLoadFeed = {}, // add param load feed api
    approveStatus = "approved", // approved / rejected / pending
    customAction = {} // custom dropdown post header
  } = props
  const [state, setState] = useMergedState({
    dataCreateNew: {}
  })

  // ** function
  const setDataCreateNew = (value) => {
    setState({ dataCreateNew: value })
  }

  return (
    <div className="feed">
      <CreatePost
        setDataCreateNew={setDataCreateNew}
        workspace={workspace}
        approveStatus={approveStatus}
      />

      <LoadFeed
        dataCreateNew={state.dataCreateNew}
        setDataCreateNew={setDataCreateNew}
        workspace={workspace}
        apiLoadFeed={apiLoadFeed}
        customAction={customAction}
        paramsLoadFeed={paramsLoadFeed}
      />
    </div>
  )
}

export default FeedCreateAndLoad
