import classNames from "classnames"
import { useRef, useState } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import UserDropdown from "../../../components/vertical/sidebar/UserDropdown"
import VerticalNavMenuItems from "../../../components/vertical/sidebar/VerticalNavMenuItems"

const Sidebar = (props) => {
  // ** Props
  const {
    menuData,
    windowWidth,
    windowWidthMin,
    toogleCustomizer,
    settingPermits
  } = props

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    setMenuHover(true)
  }

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
    <div
      className={classNames("menu-content", {})}
      //onMouseEnter={onMouseEnter}
      //   onClick={onMouseEnter}
      //   onMouseLeave={() => setMenuHover(false)}
    >
      {/* Vertical Menu Header Shadow */}
      <div className="shadow-bottom" ref={shadowRef}></div>
      {/* Perfect Scrollbar */}
      <div className="main-menu-content">
        <PerfectScrollbar
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
              setActiveItem={setActiveItem}
              setGroupActive={setGroupActive}
              currentActiveGroup={currentActiveGroup}
              setCurrentActiveGroup={setCurrentActiveGroup}
            />
          </ul>
        </PerfectScrollbar>

        <div className="div-sidebar-bottom">
          <div className="div-user-dropdown">
            <UserDropdown
              toogleCustomizer={toogleCustomizer}
              settingPermits={settingPermits}
              menuHover={menuHover}
              windowWidth={windowWidth}
              windowWidthMin={windowWidthMin}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
