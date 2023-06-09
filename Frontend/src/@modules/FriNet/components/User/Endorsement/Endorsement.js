import React, { Fragment, useEffect } from "react"
import TimelineEndorsement from "../Timeline/TimelineEndorsement"
import LoadFeed from "@modules/Feed/components/LoadFeed"
import { useMergedState } from "@apps/utility/common"
import { timelineEndorsementApi } from "@modules/FriNet/common/api"

const Endorsement = (props) => {
  const { identity, employeeId } = props
  const [state, setState] = useMergedState({
    prevScrollY: 0
  })
  const offsetTop = 120
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
    const sticky = document.getElementById("div-sticky-2")
    const sticky_div_height = document.getElementById("div-sticky-height-2")
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
    const sticky = document.getElementById("div-sticky-2")
    const sticky_div_height = document.getElementById("div-sticky-height-2")
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

  return (
    <Fragment>
      <div className="div-timeline div-content user-endorsement-page">
        <div className="div-left">
          <div className="feed">
            <LoadFeed
              apiLoadFeed={timelineEndorsementApi.getLoadFeedEndorsement}
              paramsLoadFeed={{ employeeId: employeeId }}
            />
          </div>
        </div>
        <div className="div-right">
          <div id="div-sticky-height-2"></div>
          <div id="div-sticky-2">
            <TimelineEndorsement employeeId={employeeId} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Endorsement
