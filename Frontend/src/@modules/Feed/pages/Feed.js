import { useMergedState } from "@apps/utility/common"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import SidebarWidget from "layouts/components/custom/SidebarWidget"
import { Fragment, useEffect, useMemo } from "react"
import LoadFeed from "../components/LoadFeed"

const Feed = (props) => {
  const {
    workspace = [], // arr workspace: []
    apiLoadFeed = null, // api load feed
    approveStatus = "approved" // approved / rejected / pending
  } = props
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    dataCreateNew: {}
  })
  const offsetTop = 90
  const offsetBottom = 30

  // ** function
  const handleScroll = (e) => {
    if (window.scrollY < state.prevScrollY) {
      scrollUpwards()
    } else {
      scrollDownwards()
    }
    setState({ prevScrollY: window.scrollY })
  }

  const scrollUpwards = () => {
    if (document.getElementById("div-sticky")) {
      document.getElementById("div-sticky").style.top = offsetTop + "px"
    }
  }

  const scrollDownwards = () => {
    const sticky = document.getElementById("div-sticky")
    if (sticky) {
      if (sticky.offsetHeight > window.innerHeight) {
        const offset =
          (sticky.offsetHeight - window.innerHeight + offsetBottom) * -1
        document.getElementById("div-sticky").style.top = offset + "px"
      } else {
        document.getElementById("div-sticky").style.top = offsetTop + "px"
      }
    }
  }

  const setDataCreateNew = (value) => {
    setState({ dataCreateNew: value })
  }

  // ** useEffect
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [state.prevScrollY])

  // ** render
  const renderLoadFeed = useMemo(
    () => (
      <LoadFeed
        dataCreateNew={state.dataCreateNew}
        setDataCreateNew={setDataCreateNew}
        workspace={workspace}
        apiLoadFeed={apiLoadFeed}
      />
    ),
    [state.dataCreateNew]
  )

  return (
    <Fragment>
      <div className="div-content">
        <div className="div-left feed">
          <CreatePost
            setDataCreateNew={setDataCreateNew}
            workspace={workspace}
            approveStatus={approveStatus}
          />

          {renderLoadFeed}
        </div>
        <div className="div-right">
          <div id="div-sticky">
            <SidebarWidget />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Feed
