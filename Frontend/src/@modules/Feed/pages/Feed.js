import { useMergedState } from "@apps/utility/common"
import SidebarWidget from "layouts/components/custom/SidebarWidget"
import { Fragment, useEffect, useMemo } from "react"
import FeedCreateAndLoad from "../components/FeedCreateAndLoad"

const Feed = (props) => {
  const {
    workspace = [], // arr workspace: []
    apiLoadFeed = null, // api load feed
    approveStatus = "approved", // approved / rejected / pending
    customAction = {} // custom dropdown post header
  } = props
  const [state, setState] = useMergedState({
    prevScrollY: 0
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

  // ** useEffect
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [state.prevScrollY])

  // ** render
  const renderLoadFeed = useMemo(
    () => (
      <FeedCreateAndLoad
        workspace={workspace}
        apiLoadFeed={apiLoadFeed}
        approveStatus={approveStatus}
        customAction={customAction}
      />
    ),
    []
  )

  return (
    <Fragment>
      <div className="div-content">
        <div className="div-left">{renderLoadFeed}</div>
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
