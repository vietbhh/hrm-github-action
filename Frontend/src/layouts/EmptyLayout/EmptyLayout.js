// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "layouts/_components/vertical/Layout"

// ** Menu Items Array

// ** import component
import NavBar from "layouts/SeparateSidebarLayout/Navbar"
import "./assets/scss/layout.scss"

const EmptyLayout = (props) => {
  return (
    <Layout
      menuData={[]}
      navbar={(navProps) => <NavBar {...navProps} />}
      className="separate-sidebar-layout empty-layout"
      hideSidebar={true}
      {...props}>
      <Outlet />
    </Layout>
  )
}

export default EmptyLayout
