import { useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import FeedCreateAndLoad from "@modules/Feed/components/FeedCreateAndLoad"
import { Skeleton } from "antd"
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
    const sticky = document.getElementById("div-sticky")
    const sticky_div_height = document.getElementById("div-sticky-height")
    if (sticky_div_height) {
      if (document.getElementById("div-content-feed")) {
        console.log(document.getElementById("div-content-feed"))
      }
      document.getElementById("div-sticky-height").style.height = "600px"
    }
    if (sticky) {
      document.getElementById("div-sticky").style.top = "unset"
      if (sticky.offsetHeight > window.innerHeight) {
        const offset =
          (sticky.offsetHeight - window.innerHeight + offsetBottom) * -1
        document.getElementById("div-sticky").style.bottom = offset + "px"
      } else {
        document.getElementById("div-sticky").style.bottom = offsetTop + "px"
      }
    }
  }

  const scrollDownwards = () => {
    const sticky = document.getElementById("div-sticky")
    const sticky_div_height = document.getElementById("div-sticky-height")
    if (sticky_div_height) {
      document.getElementById("div-sticky-height").style.height = "0px"
    }
    if (sticky) {
      document.getElementById("div-sticky").style.bottom = "unset"
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
  const renderLoadFeed = useMemo(() => {
    if (employeeData.id) {
      return (
        <FeedCreateAndLoad
          workspace={[]}
          apiLoadFeed={feedApi.getLoadFeedProfile}
          approveStatus={"approved"}
          paramsLoadFeed={{ id_profile: employeeData.id }}
        />
      )
    }

    return (
      <div className="feed">
        <div className="load-feed">
          <div className="div-loading">
            <Skeleton avatar active paragraph={{ rows: 2 }} />
          </div>
        </div>
      </div>
    )
  }, [employeeData])

  return (
    <Fragment>
      <div id="div-content-feed" className="div-timeline div-content">
        <div className="div-left">{renderLoadFeed}</div>
        <div className="div-right">
          <div id="div-sticky-height"></div>
          <div id="div-sticky">
            <TimelineProfile employeeData={employeeData} />
            <TimelineProfile employeeData={employeeData} />
            <TimelineProfile employeeData={employeeData} />
            <TimelineProfile employeeData={employeeData} />
            <TimelineProfile employeeData={employeeData} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default index
