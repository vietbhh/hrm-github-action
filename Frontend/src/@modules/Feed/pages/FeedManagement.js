// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "../common/api"
import moment from "moment"
// ** Styles
// ** Components
import FeaturedPost from "../components/FeedManagement/FeaturedPost/FeaturedPost"

const FeedManagement = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    data: [],
    workspaceData: [],
    totalData: 0,
    filter: {
      type: "all",
      from: moment().subtract(1, "month"),
      to: moment(),
      page: 0,
      pageLength: 20
    }
  })

  const setFilter = (obj) => {
    setState({
      filter: {
        ...state.filter,
        ...obj
      }
    })
  }

  const setData = (data) => {
    setState({
      data: data
    })
  }

  const loadData = () => {
    setState({
      loading: true
    })

    const params = {
      ...state.filter,
      from: state.filter.from.format("YYYY-MM-DD"),
      to: state.filter.to.format("YYYY-MM-DD"),
      is_featured_post: true
    }
    feedApi
      .getLoadFeed(params)
      .then((res) => {
        setState({
          data: res.data.data,
          workspaceData: res.data.workspace_data,
          totalData: res.data.total_data
        })

        setTimeout(() => {
          setState({
            loading: false
          })
        }, 300)
      })
      .catch((err) => {
        setState({
          data: [],
          workspaceData: [],
          totalData: 0
        })

        setTimeout(() => {
          setState({
            loading: false
          })
        }, 300)
      })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.filter])

  // ** render
  return (
    <div className="manage-post-page">
      <div className="header">
        <div className="d-flex align-items-center justify-content-between mb-75">
          <h3>{useFormatMessage("modules.feed.manage_post.title.index")}</h3>
        </div>
        <div>
          <p>{useFormatMessage("modules.feed.manage_post.text.description")}</p>
        </div>
      </div>
      <div>
        <FeaturedPost
          loading={state.loading}
          filter={state.filter}
          data={state.data}
          workspaceData={state.workspaceData}
          totalData={state.totalData}
          setFilter={setFilter}
          setData={setData}
        />
      </div>
    </div>
  )
}

export default FeedManagement
