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
      const height = window.pageYOffset - offsetTop
      sticky_div_height.style.height = height + "px"

      if (window.scrollY === 0) {
        sticky_div_height.style.height = "0px"
      }

      if (sticky) {
        if (sticky.offsetHeight > window.innerHeight - offsetTop) {
          sticky.style.top = "unset"
          const offset = (sticky_div_height.offsetHeight + offsetBottom) * -1
          sticky.style.bottom = offsetBottom + "px"
        } else {
          sticky_div_height.style.height = "0px"
          sticky.style.top = offsetTop + "px"
        }
      }
    }
  }

  const scrollDownwards = () => {
    const sticky = document.getElementById("div-sticky")
    const sticky_div_height = document.getElementById("div-sticky-height")
    if (sticky_div_height) {
      sticky_div_height.style.height = "0px"
    }
    if (sticky) {
      sticky.style.bottom = "unset"
      if (sticky.offsetHeight > window.innerHeight - offsetTop) {
        const offset =
          (sticky.offsetHeight - window.innerHeight + offsetBottom) * -1
        sticky.style.top = offset + "px"
      } else {
        sticky.style.top = offsetTop + "px"
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
      <div className="div-timeline div-content">
        <div className="div-left">{renderLoadFeed}</div>
        <div className="div-right">
          <div id="div-sticky-height"></div>
          <div id="div-sticky">
            <TimelineProfile employeeData={employeeData} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default index
