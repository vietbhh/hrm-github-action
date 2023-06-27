// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "layouts/_components/vertical/Layout"

// ** Menu Items Array
import navigation from "layouts/commonMenu"

const VerticalLayout = (props) => {
  return (
    <Layout menuData={navigation} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
