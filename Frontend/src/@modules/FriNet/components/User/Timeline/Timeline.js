import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import FeedCreateAndLoad from "@modules/Feed/components/FeedCreateAndLoad"
import { introductionApi } from "@modules/FriNet/common/api"
import SidebarWidget from "layouts/components/custom/SidebarWidget"
import { Fragment, useContext, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { Card, CardBody } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import TimelineProfile from "./TimelineProfile"
import "../../../assets/scss/timeline.scss"

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
        apiLoadFeed={null}
        approveStatus={"approved"}
      />
    ),
    []
  )

  return (
    <Fragment>
      <div className="div-timeline">
        <div className="div-left">
          <div id="div-sticky">
            <TimelineProfile />
          </div>
        </div>
        <div className="div-right">{renderLoadFeed}</div>
      </div>
    </Fragment>
  )
}

export default index
