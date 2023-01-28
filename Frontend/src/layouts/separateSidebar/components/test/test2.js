import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { Card, CardBody } from "reactstrap"
import SidebarWidget from "../../../components/custom/SidebarWidget"

const test2 = () => {
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    stick_pos: 1
  })
  const offsetTop = 90
  const offsetBottom = 30

  const handleScroll = (e) => {
    if (window.scrollY < state.prevScrollY) {
      scrollUpwards(state.stick_pos)
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
          <div id="div-sticky">
            <SidebarWidget />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default test2
