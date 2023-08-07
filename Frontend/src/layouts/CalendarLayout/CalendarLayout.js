// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "layouts/_components/vertical/Layout"
import "./assets/scss/chat.scss"

// ** Menu Items Array
import navigation from "../ChatLayout/menuChat"

// ** import component
import Navbar2 from "layouts/_components/custom/Navbar2"

const CalendarLayout = (props) => {
  return (
    <Layout
      menuData={navigation}
      navbar={(navProps) => <Navbar2 {...navProps} logoLeftTitle="Calendar" />}
      /* customMenuComponent={(customProps) => (
            <CustomMenuComponent {...customProps} />
          )} */
      className="navbar-2 chat calendar-layout"
      fixedSidebarCollapsed={true}
      logoLeft={true}
      {...props}>
      <Outlet />
    </Layout>
  )
}

export default CalendarLayout
