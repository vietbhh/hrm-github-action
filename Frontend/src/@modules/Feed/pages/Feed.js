import { useMergedState } from "@apps/utility/common"
import SidebarWidget from "layouts/components/custom/SidebarWidget"
import { Fragment, useEffect } from "react"
import CreatePost from "../components/CreatePost"
import "../assets/scss/feed.scss"

const Feed = () => {
  const [state, setState] = useMergedState({
    prevScrollY: 0
  })
  const offsetTop = 90
  const offsetBottom = 30

  const handleScroll = (e) => {
    if (window.scrollY < state.prevScrollY) {
      scrollUpwards()
    } else {
      scrollDownwards()
    }
    setState({ prevScrollY: window.scrollY })
  }

  const scrollUpwards = () => {
    document.getElementById("div-sticky").style.top = offsetTop + "px"
  }

  const scrollDownwards = () => {
    const sticky = document.getElementById("div-sticky")
    if (sticky.offsetHeight > window.innerHeight) {
      const offset =
        (sticky.offsetHeight - window.innerHeight + offsetBottom) * -1
      document.getElementById("div-sticky").style.top = offset + "px"
    } else {
      document.getElementById("div-sticky").style.top = offsetTop + "px"
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [state.prevScrollY])

  return (
    <Fragment>
      <div className="div-content">
        <div className="div-left feed">
          <CreatePost />
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
