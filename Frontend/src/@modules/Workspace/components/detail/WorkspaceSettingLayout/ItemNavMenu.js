// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
import classnames from "classnames"
// ** Styles
// ** Components

const ItemNavMenu = (props) => {
  const {
    // ** props
    code,
    isActive
    // ** methods
  } = props

  // ** render
  const renderIcon = () => {
    if (code === "feed") {
      return (
        <svg
          width={36}
          height={36}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.8"
            d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
            fill="#DBE7FF"
          />
          <path
            d="M13.1309 24.3096H21.1309C23.8909 24.3096 26.1309 22.0696 26.1309 19.3096C26.1309 16.5496 23.8909 14.3096 21.1309 14.3096H10.1309"
            stroke="#4986FF"
            strokeWidth="1.5"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.4291 16.8104L9.86914 14.2504L12.4291 11.6904"
            stroke="#4986FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    } else if (code === "approvals") {
      return (
        <svg
          width={36}
          height={36}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.8"
            d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
            fill="#FFEDE1"
          />
          <path
            d="M21.19 9H12.81C9.17 9 7 11.17 7 14.81V23.19C7 26.83 9.17 29 12.81 29H21.19C24.83 29 27 26.83 27 23.19V14.81C27 11.17 24.83 9 21.19 9ZM14.97 21.9L12.72 24.15C12.57 24.3 12.38 24.37 12.19 24.37C12 24.37 11.8 24.3 11.66 24.15L10.91 23.4C10.61 23.11 10.61 22.63 10.91 22.34C11.2 22.05 11.67 22.05 11.97 22.34L12.19 22.56L13.91 20.84C14.2 20.55 14.67 20.55 14.97 20.84C15.26 21.13 15.26 21.61 14.97 21.9ZM14.97 14.9L12.72 17.15C12.57 17.3 12.38 17.37 12.19 17.37C12 17.37 11.8 17.3 11.66 17.15L10.91 16.4C10.61 16.11 10.61 15.63 10.91 15.34C11.2 15.05 11.67 15.05 11.97 15.34L12.19 15.56L13.91 13.84C14.2 13.55 14.67 13.55 14.97 13.84C15.26 14.13 15.26 14.61 14.97 14.9ZM22.56 23.62H17.31C16.9 23.62 16.56 23.28 16.56 22.87C16.56 22.46 16.9 22.12 17.31 22.12H22.56C22.98 22.12 23.31 22.46 23.31 22.87C23.31 23.28 22.98 23.62 22.56 23.62ZM22.56 16.62H17.31C16.9 16.62 16.56 16.28 16.56 15.87C16.56 15.46 16.9 15.12 17.31 15.12H22.56C22.98 15.12 23.31 15.46 23.31 15.87C23.31 16.28 22.98 16.62 22.56 16.62Z"
            fill="#FF9149"
          />
        </svg>
      )
    } else if (code === "request") {
      return (
        <svg
          width={36}
          height={36}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.8"
            d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
            fill="#DBFFFF"
          />
          <path
            d="M18 8C15.38 8 13.25 10.13 13.25 12.75C13.25 15.32 15.26 17.4 17.88 17.49C17.96 17.48 18.04 17.48 18.1 17.49C18.12 17.49 18.13 17.49 18.15 17.49C18.16 17.49 18.16 17.49 18.17 17.49C20.73 17.4 22.74 15.32 22.75 12.75C22.75 10.13 20.62 8 18 8Z"
            fill="#00B3B3"
          />
          <path
            d="M23.0809 20.1596C20.2909 18.2996 15.7409 18.2996 12.9309 20.1596C11.6609 20.9996 10.9609 22.1496 10.9609 23.3796C10.9609 24.6096 11.6609 25.7496 12.9209 26.5896C14.3209 27.5296 16.1609 27.9996 18.0009 27.9996C19.8409 27.9996 21.6809 27.5296 23.0809 26.5896C24.3409 25.7396 25.0409 24.5996 25.0409 23.3596C25.0309 22.1396 24.3409 20.9896 23.0809 20.1596ZM20.3309 22.5596L17.8109 25.0796C17.6909 25.1996 17.5309 25.2596 17.3709 25.2596C17.2109 25.2596 17.0509 25.1896 16.9309 25.0796L15.6709 23.8196C15.4309 23.5796 15.4309 23.1796 15.6709 22.9396C15.9109 22.6996 16.3109 22.6996 16.5509 22.9396L17.3709 23.7596L19.4509 21.6796C19.6909 21.4396 20.0909 21.4396 20.3309 21.6796C20.5809 21.9196 20.5809 22.3196 20.3309 22.5596Z"
            fill="#00B3B3"
          />
        </svg>
      )
    } else if (code === "setting") {
      return (
        <svg
          width={36}
          height={36}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.8"
            d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
            fill="#F4DBFF"
          />
          <path
            d="M24.9401 11.4204L19.7701 8.43043C18.7801 7.86043 17.2301 7.86043 16.2401 8.43043L11.0201 11.4404C8.95008 12.8404 8.83008 13.0504 8.83008 15.2804V20.7104C8.83008 22.9404 8.95008 23.1604 11.0601 24.5804L16.2301 27.5704C16.7301 27.8604 17.3701 28.0004 18.0001 28.0004C18.6301 28.0004 19.2701 27.8604 19.7601 27.5704L24.9801 24.5604C27.0501 23.1604 27.1701 22.9504 27.1701 20.7204V15.2804C27.1701 13.0504 27.0501 12.8404 24.9401 11.4204ZM18.0001 21.2504C16.2101 21.2504 14.7501 19.7904 14.7501 18.0004C14.7501 16.2104 16.2101 14.7504 18.0001 14.7504C19.7901 14.7504 21.2501 16.2104 21.2501 18.0004C21.2501 19.7904 19.7901 21.2504 18.0001 21.2504Z"
            fill="#C750FF"
          />
        </svg>
      )
    }

    return ""
  }

  return (
    <div
      className={classnames(
        "d-flex align-items-center w-100 item-nav-menu-container",
        {
          active: isActive
        }
      )}>
      <div className={`me-1 nav-item-icon bg-icon-${code}`}>
        <Fragment>{renderIcon()}</Fragment>
      </div>
      <div>
        <span className="text-bold">
          {useFormatMessage(
            `modules.workspace.display.nav_menu_setting_layout.${code}`
          )}
        </span>
      </div>
    </div>
  )
}

export default ItemNavMenu
