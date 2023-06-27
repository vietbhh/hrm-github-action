import { useFormatMessage } from "@apps/utility/common"
import React from "react"

// ** Reactstrap Imports
import { UncontrolledTooltip } from "reactstrap"

const NavbarChat = () => {
  return (
    <li className="nav-item">
      <a
        href="/"
        onClick={(e) => e.preventDefault()}
        aria-haspopup="true"
        className="nav-link"
        aria-expanded="false"
        id="chat">
        <svg
          className="bell no-noti"
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.2499 22.2482C18.6844 25.8141 13.4047 26.5845 9.08413 24.5863C8.4463 24.3295 7.92338 24.122 7.42625 24.122C6.04155 24.1302 4.31801 25.4728 3.42223 24.5781C2.52646 23.6823 3.87012 21.9573 3.87012 20.5643C3.87012 20.0671 3.6708 19.5535 3.41403 18.9144C1.41495 14.5945 2.18644 9.31312 5.75195 5.74839C10.3035 1.19515 17.6983 1.19515 22.2499 5.74721C26.8097 10.3075 26.8015 17.6961 22.2499 22.2482Z"
            stroke="#32434F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 17H16"
            stroke="#32434F"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12H19"
            stroke="#32434F"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <UncontrolledTooltip target="chat">
          {useFormatMessage("layout.chat")}
        </UncontrolledTooltip>
      </a>
    </li>
  )
}

export default NavbarChat
