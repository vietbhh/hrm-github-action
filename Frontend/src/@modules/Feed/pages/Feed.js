import { useMergedState } from "@apps/utility/common"
import SidebarWidget from "layouts/components/custom/SidebarWidget"
import { Fragment, useEffect, useMemo } from "react"
import { feedApi } from "../common/api"
import CreatePost from "@src/components/hrm/CreatePost/CreatePost"
import LoadFeed from "../components/LoadFeed"

const Feed = () => {
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    dataEmployee: [],
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

  useEffect(() => {
    feedApi.getGetAllEmployeeActive().then((res) => {
      setState({ dataEmployee: res.data })
    })
  }, [])

  // ** render
  const renderLoadFeed = useMemo(
    () => (
      <LoadFeed
        dataCreateNew={state.dataCreateNew}
        setDataCreateNew={setDataCreateNew}
        workspace={[]}
        dataEmployee={state.dataEmployee}
      />
    ),
    [state.dataCreateNew, state.dataEmployee]
  )

  return (
    <Fragment>
      <div className="div-content">
        <div className="div-left feed">
          <CreatePost
            dataEmployee={state.dataEmployee}
            setDataCreateNew={setDataCreateNew}
            workspace={[]}
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
