// ** React Imports
import { Outlet } from "react-router-dom"
import { driveApi } from "../@apps/modules/drive/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "./components/vertical/Layout"

// ** Menu Items Array
import navigation from "@src/navigation/menuChat"
import menuDrive from "../@apps/modules/drive/components/details/LeftMenu/menuDrive"

// ** import component
import Navbar2 from "./components/custom/Navbar2"
import NewFiles from "../@apps/modules/drive/components/details/LeftMenu/NewFiles"
import { useEffect } from "react"

const DriveLayout = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    menuData: []
  })

  // ** effect
  useEffect(() => {
    setState({
      loading: true
    })
    driveApi
      .getMyDriveFolder()
      .then((res) => {
        const menuDriveFolder = [
          {
            id: "my_file",
            title: "menu.drive.my_file",
            type: "dropdown",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M14.4302 15.3H9.43018C9.02018 15.3 8.68018 14.96 8.68018 14.55C8.68018 14.14 9.02018 13.8 9.43018 13.8H14.4302C14.8402 13.8 15.1802 14.14 15.1802 14.55C15.1802 14.96 14.8402 15.3 14.4302 15.3Z"
                  fill="#292D32"
                />
                <path
                  d="M17 22.75H7C2.59 22.75 1.25 21.41 1.25 17V7C1.25 2.59 2.59 1.25 7 1.25H8.5C10.25 1.25 10.8 1.82 11.5 2.75L13 4.75C13.33 5.19 13.38 5.25 14 5.25H17C21.41 5.25 22.75 6.59 22.75 11V17C22.75 21.41 21.41 22.75 17 22.75ZM7 2.75C3.42 2.75 2.75 3.43 2.75 7V17C2.75 20.57 3.42 21.25 7 21.25H17C20.58 21.25 21.25 20.57 21.25 17V11C21.25 7.43 20.58 6.75 17 6.75H14C12.72 6.75 12.3 6.31 11.8 5.65L10.3 3.65C9.78 2.96 9.62 2.75 8.5 2.75H7V2.75Z"
                  fill="#292D32"
                />
              </svg>
            )
          }
        ]
        setState({
          menuData: [...menuDriveFolder, ...menuDrive],
          loading: false
        })
      })
      .catch((err) => {
        setState({
          menuData: [...menuDrive],
          loading: false
        })
      })
  }, [])

  return (
    !state.loading && (
      <Layout
        menuData={state.menuData}
        navbar={(navProps) => <Navbar2 {...navProps} />}
        outerCustomMenuComponent={(customProps) => (
          <NewFiles {...customProps} />
        )}
        className="navbar-2 drive-page"
        fixedSidebar={true}
        {...props}>
        <Outlet />
      </Layout>
    )
  )
}

export default DriveLayout
