// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/HorizontalLayout"

// ** Menu Items Array
import navigation from "@src/navigation/menuConfig"

import NavbarComponent from "./components/navbar"
import MenuComponent from "./components/menu/horizontal-menu"

const HorizontalLayout = (props) => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout
      menuData={navigation}
      menu={(menuProps) => <MenuComponent {...menuProps} />}
      navbar={(navProps) => <NavbarComponent {...navProps} />}
      {...props}>
      <Outlet />
    </Layout>
  )
}

export default HorizontalLayout
