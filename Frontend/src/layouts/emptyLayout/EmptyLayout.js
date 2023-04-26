// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "../components/vertical/Layout"

// ** Menu Items Array

// ** import component
import NavBar from "../separateSidebar/Navbar"
import "./assets/scss/layout.scss"

const EmptyLayout = (props) => {
  return (
    <Layout
      menuData={[]}
      navbar={(navProps) => <NavBar {...navProps} />}
      /* customMenuComponent={(customProps) => (
        <CustomMenuComponent {...customProps} />
      )} */
      className="navbar-2 empty-layout"
      hideSidebar={true}
      {...props}>
      <Outlet />
    </Layout>
  )
}

export default EmptyLayout
