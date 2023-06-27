// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "layouts/_components/vertical/Layout"

// ** Menu Items Array
import navigation from "./menuChat"

// ** import component
import Navbar2 from "layouts/_components/custom/Navbar2"

const ChatLayout = (props) => {
  return (
    <Layout
      menuData={navigation}
      navbar={(navProps) => <Navbar2 {...navProps} />}
      /* customMenuComponent={(customProps) => (
        <CustomMenuComponent {...customProps} />
      )} */
      className="navbar-2 chat"
      fixedSidebarCollapsed={true}
      {...props}>
      <Outlet />
    </Layout>
  )
}

export default ChatLayout
