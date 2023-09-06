// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
//import Layout from "../other/separateSidebar/Layout"
import Layout from "layouts/_components/vertical/Layout"

import navigation from "./menu"
import { useFormatMessage } from "@apps/utility/common"
import Navbar from "./Navbar"
import "./assets/scss/layout.scss"
import "./assets/scss/responsiveLayout.scss"

const SeparateSidebarLayout = (props) => {
  const menuYourProjects = [
    {
      header: useFormatMessage("layout.your_projects")
    },
    {
      id: "hamsterious",
      title: "#Hamsterious",
      type: "dropdown",
      action: "login",
      resource: "app",
      icon: (
        <div className="menu-icon green">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M8.8125 5.25H8.25H5.25C3.18 5.25 1.5 6.93 1.5 9V12.75C1.5 14.82 3.18 16.5 5.25 16.5H9C11.07 16.5 12.75 14.82 12.75 12.75V9.75V9.1875C12.75 7.0125 10.9875 5.25 8.8125 5.25Z"
              fill="white"
            />
            <path
              d="M16.41 4.7475C16.7957 6.62971 15.9075 8.34089 14.4567 9.18016C14.1873 9.33597 13.875 9.12366 13.875 8.8125C13.875 6.2325 11.7675 4.125 9.18748 4.125C8.87632 4.125 8.66401 3.81266 8.81982 3.54332C9.65909 2.09246 11.3703 1.20425 13.2525 1.59C14.82 1.9125 16.0875 3.18 16.41 4.7475Z"
              fill="white"
            />
          </svg>
        </div>
      ),
      navLink: "/"
    },
    {
      id: "the_furry_tales",
      title: "#The Furry Tales",
      type: "dropdown",
      action: "login",
      resource: "app",
      icon: (
        <div className="menu-icon green">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M8.8125 5.25H8.25H5.25C3.18 5.25 1.5 6.93 1.5 9V12.75C1.5 14.82 3.18 16.5 5.25 16.5H9C11.07 16.5 12.75 14.82 12.75 12.75V9.75V9.1875C12.75 7.0125 10.9875 5.25 8.8125 5.25Z"
              fill="white"
            />
            <path
              d="M16.41 4.7475C16.7957 6.62971 15.9075 8.34089 14.4567 9.18016C14.1873 9.33597 13.875 9.12366 13.875 8.8125C13.875 6.2325 11.7675 4.125 9.18748 4.125C8.87632 4.125 8.66401 3.81266 8.81982 3.54332C9.65909 2.09246 11.3703 1.20425 13.2525 1.59C14.82 1.9125 16.0875 3.18 16.41 4.7475Z"
              fill="white"
            />
          </svg>
        </div>
      ),
      navLink: "/"
    }
  ]

  const menuYourWorkgroup = [
    {
      header: useFormatMessage("layout.your_workgroup")
    },
    {
      id: "reading_challenge",
      title: "#ReadingChallenge",
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
      navLink: "/"
    },
    {
      id: "running",
      title: "#Running",
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
      navLink: "/"
    },
    {
      id: "football",
      title: "#Football",
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
      navLink: "/"
    }
  ]

  return (
    <Layout
      menuData={[...navigation, ...menuYourProjects, ...menuYourWorkgroup]}
      navbar={(navProps) => <Navbar {...navProps} />}
      /* customMenuComponent={(customProps) => (
        <CustomMenuComponent {...customProps} />
      )} */
      className="separate-sidebar-layout"
      notMenuCollapsed={true}
      hideQuickAccess={true}
      hideVerticalMenuHeader={true}
      showVerticalMenuHeaderOnMobile={true}
      {...props}>
      <Outlet />
    </Layout>
  )
}

export default SeparateSidebarLayout
