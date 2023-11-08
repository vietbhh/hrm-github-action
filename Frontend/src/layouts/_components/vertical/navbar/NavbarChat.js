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
          width="22"
          height="23"
          viewBox="0 0 22 23"
          fill="none">
          <path
            d="M14.9393 11.913H14.9483"
            stroke="#696760"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.9306 11.913H10.9396"
            stroke="#696760"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.92128 11.913H6.93028"
            stroke="#696760"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.071 18.5698C15.0159 21.6263 10.4896 22.2867 6.78631 20.574C6.23961 20.3539 2.70113 21.3339 1.93334 20.567C1.16555 19.7991 2.14639 16.2601 1.92631 15.7134C0.212846 12.0106 0.874111 7.4826 3.9302 4.4271C7.83147 0.5243 14.1698 0.5243 18.071 4.4271C21.9803 8.33593 21.9723 14.668 18.071 18.5698Z"
            stroke="#696760"
            strokeWidth="1.5"
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
