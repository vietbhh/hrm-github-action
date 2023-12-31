import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { Card, CardBody } from "reactstrap"
import SidebarWidget from "../../../components/custom/SidebarWidget"

const test2 = () => {
  const [state, setState] = useMergedState({
    prevScrollY: 0
  })
  const offsetTop = 95
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [state.prevScrollY])

  return (
    <Fragment>
      <div className="div-content">
        <div className="div-left">
          <Card>
            <CardBody>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
            </CardBody>
          </Card>
        </div>
        <div className="div-right">
          <div id="div-sticky-height"></div>
          <div id="div-sticky">
            <SidebarWidget />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default test2
