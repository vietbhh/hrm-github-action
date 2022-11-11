// ** React Imports
import { Fragment, useRef, useState } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
// ** Vertical Menu Components
import VerticalMenuHeader from "./VerticalMenuHeader"
import VerticalNavMenuItems from "@layouts/components/menu/vertical-menu/VerticalNavMenuItems"

const Sidebar = (props) => {
  // ** Props
  const { menuCollapsed, menuData } = props

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  // ** Scroll Menu
  const scrollMenu = (container) => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.add("d-block")
      }
    } else {
      if (shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.remove("d-block")
      }
    }
  }

  return (
    <Fragment>
      {/* Vertical Menu Header */}
      <VerticalMenuHeader
        setGroupOpen={setGroupOpen}
        menuHover={menuHover}
        {...props}
      />
      {/* Vertical Menu Header Shadow */}
      <div className="shadow-bottom" ref={shadowRef}></div>
      {/* Perfect Scrollbar */}
      <PerfectScrollbar
        className="main-menu-content"
        options={{ wheelPropagation: false }}
        onScrollY={(container) => scrollMenu(container)}>
        <ul className="navigation navigation-main">
          <VerticalNavMenuItems
            items={menuData}
            menuData={menuData}
            menuHover={menuHover}
            groupOpen={groupOpen}
            activeItem={activeItem}
            groupActive={groupActive}
            setGroupOpen={setGroupOpen}
            menuCollapsed={menuCollapsed}
            setActiveItem={setActiveItem}
            setGroupActive={setGroupActive}
            currentActiveGroup={currentActiveGroup}
            setCurrentActiveGroup={setCurrentActiveGroup}
          />
        </ul>
      </PerfectScrollbar>
    </Fragment>
  )
}

export default Sidebar
