// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
//import Layout from "../other/separateSidebar/Layout"
import Layout from "layouts/_components/vertical/Layout"

import navigation from "./menu"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import Navbar from "./Navbar"
import "./assets/scss/layout.scss"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Fragment, useEffect } from "react"


const SeparateSidebarLayout = (props) => {

  const [state, setState] = useMergedState({
    loading: false,
    menuYourWorkspace: [
      {
        header: useFormatMessage("layout.your_workgroup")
      }
    ]
  })

  const renderWorkspaceTitle = (item) => {
    if (item.is_admin_group) {
      return `${item.name} *`
    }

    return item.name
  }

  const loadWorkspace = () => {
    setState({
      loading: true
    })

    workspaceApi
      .getList({
        page: 1,
        limit: 0,
        workspace_type: "both"
      })
      .then((res) => {
        const temp = res.data.results.map((item) => {
          return {
            id: `workspace-sidebar-${item._id}`,
            title: renderWorkspaceTitle(item),
            type: "dropdown",
            action: "login",
            resource: "app",
            icon: (
              <div className="menu-icon purple">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none">
                  <path
                    d="M8.4375 13.6875H6.75C5.925 13.6875 5.25 14.3625 5.25 15.1875V15.375H4.5C4.1925 15.375 3.9375 15.63 3.9375 15.9375C3.9375 16.245 4.1925 16.5 4.5 16.5H13.5C13.8075 16.5 14.0625 16.245 14.0625 15.9375C14.0625 15.63 13.8075 15.375 13.5 15.375H12.75V15.1875C12.75 14.3625 12.075 13.6875 11.25 13.6875H9.5625V11.97C9.375 11.9925 9.1875 12 9 12C8.8125 12 8.625 11.9925 8.4375 11.97V13.6875Z"
                    fill="white"
                  />
                  <path
                    d="M13.86 8.73C14.355 8.5425 14.79 8.235 15.135 7.89C15.8325 7.1175 16.29 6.195 16.29 5.115C16.29 4.035 15.4425 3.1875 14.3625 3.1875H13.9425C13.455 2.19 12.435 1.5 11.25 1.5H6.75002C5.56502 1.5 4.54502 2.19 4.05752 3.1875H3.63752C2.55752 3.1875 1.71002 4.035 1.71002 5.115C1.71002 6.195 2.16752 7.1175 2.86502 7.89C3.21002 8.235 3.64502 8.5425 4.14002 8.73C4.92002 10.65 6.79502 12 9.00002 12C11.205 12 13.08 10.65 13.86 8.73ZM11.13 6.3375L10.665 6.9075C10.59 6.99 10.5375 7.155 10.545 7.2675L10.59 8.0025C10.62 8.4525 10.2975 8.685 9.87752 8.52L9.19502 8.25C9.09002 8.2125 8.91002 8.2125 8.80502 8.25L8.12252 8.52C7.70252 8.685 7.38002 8.4525 7.41002 8.0025L7.45502 7.2675C7.46252 7.155 7.41002 6.99 7.33502 6.9075L6.87002 6.3375C6.57752 5.9925 6.70502 5.61 7.14002 5.4975L7.85252 5.3175C7.96502 5.2875 8.10002 5.1825 8.16002 5.085L8.55752 4.47C8.80502 4.0875 9.19502 4.0875 9.44252 4.47L9.84002 5.085C9.90002 5.1825 10.035 5.2875 10.1475 5.3175L10.86 5.4975C11.295 5.61 11.4225 5.9925 11.13 6.3375Z"
                    fill="white"
                  />
                </svg>
              </div>
            ),
            navLink: `/workspace/${item._id}`
          }
        })

        setState({
          menuYourWorkspace:
            temp.length > 0 ? [...state.menuYourWorkspace, ...temp] : [],
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadWorkspace()
  }, [])

  const renderComponent = () => {
    if (state.loading) {
      return ""
    }

    return (
      <Layout
        menuData={[...navigation, ...state.menuYourWorkspace]}
        navbar={(navProps) => <Navbar {...navProps} />}
        /* customMenuComponent={(customProps) => (
      <CustomMenuComponent {...customProps} />
    )} */
        className="separate-sidebar-layout"
        notMenuCollapsed={true}
        hideQuickAccess={true}
        hideVerticalMenuHeader={true}
        {...props}>
        <Outlet />
      </Layout>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default SeparateSidebarLayout
