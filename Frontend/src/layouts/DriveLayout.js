// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "./components/vertical/Layout"

// ** Menu Items Array
import navigation from "@src/navigation/menuChat"

// ** import component
import Navbar2 from "./components/custom/Navbar2"

const DriveLayout = (props) => {
  return (
    <Layout
      menuData={navigation}
      navbar={(navProps) => <Navbar2 {...navProps} />}
      /* customMenuComponent={(customProps) => (
        <CustomMenuComponent {...customProps} />
      )} */
      className="navbar-2"
      fixedSidebarCollapsed={false}
      {...props}>
      <Outlet />
    </Layout>
  )
}

export default DriveLayout
