import { useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import FeedCreateAndLoad from "@modules/Feed/components/FeedCreateAndLoad"
import { Fragment, useEffect, useMemo } from "react"
import "../../../assets/scss/timeline.scss"
import TimelineProfile from "./TimelineProfile"

const index = (props) => {
  const { employeeData } = props
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
        workspace={[]}
        apiLoadFeed={feedApi.getLoadFeedProfile}
        approveStatus={"approved"}
      />
    ),
    []
  )

  return (
    <Fragment>
      <div className="div-timeline div-content">
        <div className="div-left">{renderLoadFeed}</div>
        <div className="div-right">
          <div id="div-sticky">
            <TimelineProfile employeeData={employeeData} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default index
