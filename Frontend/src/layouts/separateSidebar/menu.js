import React from "react"
import * as Icon from "react-feather"
import { useFormatMessage } from "@apps/utility/common"

const menuConfig = [
  {
    header: useFormatMessage("layout.collaboration")
  },
  {
    id: "Feed",
    title: "layout.feed",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
      <div className="menu-icon blue">
        <i className="fa-solid fa-house"></i>
      </div>
    ),
    navLink: "/feed"
  },
  {
    id: "chat",
    title: "layout.chat",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
      <div className="menu-icon blue">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none">
          <path
            d="M18.4396 9.23457L15.1324 15.5585C12.8994 19.8078 10.449 19.4096 9.6839 14.673L9.34746 12.582L7.47056 11.6007C3.22002 9.37509 3.61943 6.91734 8.35599 6.1522L15.3955 5.00907C18.5549 4.50431 19.9263 6.39882 18.4396 9.23457ZM14.4954 8.35045L11.2103 10.704C11.0812 10.797 11.0066 10.9292 10.9837 11.0699C10.9608 11.2105 10.9898 11.3596 11.0828 11.4887C11.2626 11.7383 11.6179 11.796 11.8675 11.6162L15.1526 9.26268C15.4021 9.08288 15.4599 8.72754 15.2801 8.47797C15.1003 8.2284 14.7449 8.17065 14.4954 8.35045Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    navLink: "/homepage"
  },
  {
    id: "calendar",
    title: "layout.calendar",
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
            d="M12.5625 2.67V1.5C12.5625 1.1925 12.3075 0.9375 12 0.9375C11.6925 0.9375 11.4375 1.1925 11.4375 1.5V2.625H6.56249V1.5C6.56249 1.1925 6.30749 0.9375 5.99999 0.9375C5.69249 0.9375 5.43749 1.1925 5.43749 1.5V2.67C3.41249 2.8575 2.42999 4.065 2.27999 5.8575C2.26499 6.075 2.44499 6.255 2.65499 6.255H15.345C15.5625 6.255 15.7425 6.0675 15.72 5.8575C15.57 4.065 14.5875 2.8575 12.5625 2.67Z"
            fill="white"
          />
          <path
            d="M15 7.38H3C2.5875 7.38 2.25 7.7175 2.25 8.13V12.75C2.25 15 3.375 16.5 6 16.5H12C14.625 16.5 15.75 15 15.75 12.75V8.13C15.75 7.7175 15.4125 7.38 15 7.38ZM6.9075 13.6575C6.8325 13.725 6.75 13.7775 6.66 13.815C6.57 13.8525 6.4725 13.875 6.375 13.875C6.2775 13.875 6.18 13.8525 6.09 13.815C6 13.7775 5.9175 13.725 5.8425 13.6575C5.7075 13.515 5.625 13.32 5.625 13.125C5.625 12.93 5.7075 12.735 5.8425 12.5925C5.9175 12.525 6 12.4725 6.09 12.435C6.27 12.36 6.48 12.36 6.66 12.435C6.75 12.4725 6.8325 12.525 6.9075 12.5925C7.0425 12.735 7.125 12.93 7.125 13.125C7.125 13.32 7.0425 13.515 6.9075 13.6575ZM7.065 10.785C7.0275 10.875 6.975 10.9575 6.9075 11.0325C6.8325 11.1 6.75 11.1525 6.66 11.19C6.57 11.2275 6.4725 11.25 6.375 11.25C6.2775 11.25 6.18 11.2275 6.09 11.19C6 11.1525 5.9175 11.1 5.8425 11.0325C5.775 10.9575 5.7225 10.875 5.685 10.785C5.6475 10.695 5.625 10.5975 5.625 10.5C5.625 10.4025 5.6475 10.305 5.685 10.215C5.7225 10.125 5.775 10.0425 5.8425 9.9675C5.9175 9.9 6 9.8475 6.09 9.81C6.27 9.735 6.48 9.735 6.66 9.81C6.75 9.8475 6.8325 9.9 6.9075 9.9675C6.975 10.0425 7.0275 10.125 7.065 10.215C7.1025 10.305 7.125 10.4025 7.125 10.5C7.125 10.5975 7.1025 10.695 7.065 10.785ZM9.5325 11.0325C9.4575 11.1 9.375 11.1525 9.285 11.19C9.195 11.2275 9.0975 11.25 9 11.25C8.9025 11.25 8.805 11.2275 8.715 11.19C8.625 11.1525 8.5425 11.1 8.4675 11.0325C8.3325 10.89 8.25 10.695 8.25 10.5C8.25 10.305 8.3325 10.11 8.4675 9.9675C8.5425 9.9 8.625 9.8475 8.715 9.81C8.895 9.7275 9.105 9.7275 9.285 9.81C9.375 9.8475 9.4575 9.9 9.5325 9.9675C9.6675 10.11 9.75 10.305 9.75 10.5C9.75 10.695 9.6675 10.89 9.5325 11.0325Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    navLink: "/test2"
  },
  {
    id: "drive",
    title: "layout.drive",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
      <div className="menu-icon orange">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none">
          <path
            d="M12.1425 1.5H5.8575C3.45 1.5 1.5 3.45 1.5 5.8575V7.6875C1.5 8.1 1.8375 8.4375 2.25 8.4375H15.75C16.1625 8.4375 16.5 8.1 16.5 7.6875V5.8575C16.5 3.45 14.55 1.5 12.1425 1.5ZM5.0625 6.1875C5.0625 6.495 4.8075 6.75 4.5 6.75C4.1925 6.75 3.9375 6.495 3.9375 6.1875V4.6875C3.9375 4.38 4.1925 4.125 4.5 4.125C4.8075 4.125 5.0625 4.38 5.0625 4.6875V6.1875ZM8.0625 6.1875C8.0625 6.495 7.8075 6.75 7.5 6.75C7.1925 6.75 6.9375 6.495 6.9375 6.1875V4.6875C6.9375 4.38 7.1925 4.125 7.5 4.125C7.8075 4.125 8.0625 4.38 8.0625 4.6875V6.1875ZM13.5 6H10.5C10.1925 6 9.9375 5.745 9.9375 5.4375C9.9375 5.13 10.1925 4.875 10.5 4.875H13.5C13.8075 4.875 14.0625 5.13 14.0625 5.4375C14.0625 5.745 13.8075 6 13.5 6Z"
            fill="white"
          />
          <path
            d="M1.5 12.1425C1.5 14.55 3.45 16.5 5.8575 16.5H12.135C14.55 16.5 16.5 14.55 16.5 12.1425V10.3125C16.5 9.9 16.1625 9.5625 15.75 9.5625H2.25C1.8375 9.5625 1.5 9.9 1.5 10.3125V12.1425ZM10.5 12.1875H13.5C13.8075 12.1875 14.0625 12.4425 14.0625 12.75C14.0625 13.0575 13.8075 13.3125 13.5 13.3125H10.5C10.1925 13.3125 9.9375 13.0575 9.9375 12.75C9.9375 12.4425 10.1925 12.1875 10.5 12.1875ZM6.9375 12C6.9375 11.6925 7.1925 11.4375 7.5 11.4375C7.8075 11.4375 8.0625 11.6925 8.0625 12V13.5C8.0625 13.8075 7.8075 14.0625 7.5 14.0625C7.1925 14.0625 6.9375 13.8075 6.9375 13.5V12ZM3.9375 12C3.9375 11.6925 4.1925 11.4375 4.5 11.4375C4.8075 11.4375 5.0625 11.6925 5.0625 12V13.5C5.0625 13.8075 4.8075 14.0625 4.5 14.0625C4.1925 14.0625 3.9375 13.8075 3.9375 13.5V12Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    navLink: "/dashboard"
  },
  {
    id: "workgroup",
    title: "layout.workgroup",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
      <div className="menu-icon red">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none">
          <path
            d="M15.27 9.54749C14.9925 9.54749 14.76 9.33749 14.73 9.05999C14.55 7.40999 13.665 5.92499 12.3 4.97999C12.0525 4.80749 11.9925 4.46999 12.165 4.22249C12.3375 3.97499 12.675 3.91499 12.9225 4.08749C14.55 5.21999 15.6 6.98999 15.8175 8.94749C15.8475 9.24749 15.63 9.51749 15.33 9.54749C15.3075 9.54749 15.2925 9.54749 15.27 9.54749Z"
            fill="white"
          />
          <path
            d="M2.80497 9.585C2.78997 9.585 2.76747 9.585 2.75247 9.585C2.45247 9.555 2.23497 9.285 2.26497 8.985C2.46747 7.0275 3.50247 5.2575 5.11497 4.1175C5.35497 3.945 5.69997 4.005 5.87247 4.245C6.04497 4.4925 5.98497 4.83 5.74497 5.0025C4.39497 5.9625 3.51747 7.4475 3.35247 9.09C3.32247 9.375 3.08247 9.585 2.80497 9.585Z"
            fill="white"
          />
          <path
            d="M11.9925 15.825C11.07 16.2675 10.08 16.4925 9.04501 16.4925C7.96501 16.4925 6.93751 16.2525 5.97751 15.765C5.70751 15.6375 5.60251 15.3075 5.73751 15.0375C5.86501 14.7675 6.19501 14.6625 6.46501 14.79C6.93751 15.03 7.44001 15.195 7.95001 15.2925C8.64001 15.4275 9.34501 15.435 10.035 15.315C10.545 15.225 11.0475 15.0675 11.5125 14.8425C11.79 14.715 12.12 14.82 12.24 15.0975C12.375 15.3675 12.27 15.6975 11.9925 15.825Z"
            fill="white"
          />
          <path
            d="M9.03749 1.50751C7.87499 1.50751 6.92249 2.45251 6.92249 3.62251C6.92249 4.79251 7.86749 5.73751 9.03749 5.73751C10.2075 5.73751 11.1525 4.79251 11.1525 3.62251C11.1525 2.45251 10.2075 1.50751 9.03749 1.50751Z"
            fill="white"
          />
          <path
            d="M3.78749 10.4025C2.62499 10.4025 1.67249 11.3475 1.67249 12.5175C1.67249 13.6875 2.61749 14.6325 3.78749 14.6325C4.95749 14.6325 5.90249 13.6875 5.90249 12.5175C5.90249 11.3475 4.94999 10.4025 3.78749 10.4025Z"
            fill="white"
          />
          <path
            d="M14.2125 10.4025C13.05 10.4025 12.0975 11.3475 12.0975 12.5175C12.0975 13.6875 13.0425 14.6325 14.2125 14.6325C15.3825 14.6325 16.3275 13.6875 16.3275 12.5175C16.3275 11.3475 15.3825 10.4025 14.2125 10.4025Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    navLink: "/dashboard"
  },
  {
    id: "setting-member",
    title: "layout.setting_member",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
      <div className="menu-icon green">
        <i className="fa-solid fa-user-gear"></i>
      </div>
    ),
    navLink: "/fri-net/setting-member"
  }
]

export default menuConfig
