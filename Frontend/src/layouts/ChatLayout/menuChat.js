import { useFormatMessage } from "@apps/utility/common"

const menuConfig = [
  {
    header: useFormatMessage("layout.navigation"),
    header_short: useFormatMessage("layout.nav")
  },
  {
    id: "home",
    title: "layout.home",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
      <div className="menu-icon blue">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.8"
            d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
            fill="#DBE7FF"
          />
          <path
            d="M24.7 13.6834L19.9 10.325C18.5917 9.40836 16.5833 9.45836 15.325 10.4334L11.15 13.6917C10.3167 14.3417 9.65833 15.675 9.65833 16.725V22.475C9.65833 24.6 11.3833 26.3334 13.5083 26.3334H22.4917C24.6167 26.3334 26.3417 24.6084 26.3417 22.4834V16.8334C26.3417 15.7084 25.6167 14.325 24.7 13.6834ZM18.625 23C18.625 23.3417 18.3417 23.625 18 23.625C17.6583 23.625 17.375 23.3417 17.375 23V20.5C17.375 20.1584 17.6583 19.875 18 19.875C18.3417 19.875 18.625 20.1584 18.625 20.5V23Z"
            fill="#4986FF"
          />
        </svg>
      </div>
    ),
    navLink: "/home"
  },
  {
    id: "chat",
    title: "layout.chat",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
      <div className="menu-icon green">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.8"
            d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
            fill="#FFEDE1"
          />
          <path
            d="M24.4401 16.2346L21.1329 22.5585C18.8998 26.8078 16.4495 26.4096 15.6843 21.6731L15.3479 19.582L13.471 18.6007C9.22045 16.3751 9.61985 13.9174 14.3564 13.1522L21.3959 12.0091C24.5553 11.5043 25.9267 13.3988 24.4401 16.2346ZM20.4958 15.3505L17.2107 17.704C17.0817 17.797 17.007 17.9292 16.9841 18.0699C16.9613 18.2106 16.9902 18.3596 17.0832 18.4887C17.263 18.7383 17.6184 18.796 17.8679 18.6162L21.153 16.2627C21.4026 16.0829 21.4603 15.7276 21.2805 15.478C21.1007 15.2284 20.7454 15.1707 20.4958 15.3505Z"
            fill="#FF9149"
          />
        </svg>
      </div>
    ),
    navLink: "/chat"
  },
  {
    id: "calendar",
    title: "layout.calendar",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
      <div className="menu-icon orange">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.8"
            d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
            fill="#DBFFFF"
          />
          <path
            d="M21.9583 10.9666V9.66663C21.9583 9.32496 21.675 9.04163 21.3333 9.04163C20.9917 9.04163 20.7083 9.32496 20.7083 9.66663V10.9166H15.2917V9.66663C15.2917 9.32496 15.0083 9.04163 14.6667 9.04163C14.325 9.04163 14.0417 9.32496 14.0417 9.66663V10.9666C11.7917 11.175 10.7 12.5166 10.5333 14.5083C10.5167 14.75 10.7167 14.95 10.95 14.95H25.05C25.2917 14.95 25.4917 14.7416 25.4667 14.5083C25.3 12.5166 24.2083 11.175 21.9583 10.9666Z"
            fill="#00B3B3"
          />
          <path
            d="M24.6667 16.2H11.3333C10.875 16.2 10.5 16.575 10.5 17.0333V22.1666C10.5 24.6666 11.75 26.3333 14.6667 26.3333H21.3333C24.25 26.3333 25.5 24.6666 25.5 22.1666V17.0333C25.5 16.575 25.125 16.2 24.6667 16.2ZM15.675 23.175C15.5917 23.25 15.5 23.3083 15.4 23.35C15.3 23.3916 15.1917 23.4166 15.0833 23.4166C14.975 23.4166 14.8667 23.3916 14.7667 23.35C14.6667 23.3083 14.575 23.25 14.4917 23.175C14.3417 23.0166 14.25 22.8 14.25 22.5833C14.25 22.3666 14.3417 22.15 14.4917 21.9916C14.575 21.9166 14.6667 21.8583 14.7667 21.8166C14.9667 21.7333 15.2 21.7333 15.4 21.8166C15.5 21.8583 15.5917 21.9166 15.675 21.9916C15.825 22.15 15.9167 22.3666 15.9167 22.5833C15.9167 22.8 15.825 23.0166 15.675 23.175ZM15.85 19.9833C15.8083 20.0833 15.75 20.175 15.675 20.2583C15.5917 20.3333 15.5 20.3916 15.4 20.4333C15.3 20.475 15.1917 20.5 15.0833 20.5C14.975 20.5 14.8667 20.475 14.7667 20.4333C14.6667 20.3916 14.575 20.3333 14.4917 20.2583C14.4167 20.175 14.3583 20.0833 14.3167 19.9833C14.275 19.8833 14.25 19.775 14.25 19.6666C14.25 19.5583 14.275 19.45 14.3167 19.35C14.3583 19.25 14.4167 19.1583 14.4917 19.075C14.575 19 14.6667 18.9416 14.7667 18.9C14.9667 18.8166 15.2 18.8166 15.4 18.9C15.5 18.9416 15.5917 19 15.675 19.075C15.75 19.1583 15.8083 19.25 15.85 19.35C15.8917 19.45 15.9167 19.5583 15.9167 19.6666C15.9167 19.775 15.8917 19.8833 15.85 19.9833ZM18.5917 20.2583C18.5083 20.3333 18.4167 20.3916 18.3167 20.4333C18.2167 20.475 18.1083 20.5 18 20.5C17.8917 20.5 17.7833 20.475 17.6833 20.4333C17.5833 20.3916 17.4917 20.3333 17.4083 20.2583C17.2583 20.1 17.1667 19.8833 17.1667 19.6666C17.1667 19.45 17.2583 19.2333 17.4083 19.075C17.4917 19 17.5833 18.9416 17.6833 18.9C17.8833 18.8083 18.1167 18.8083 18.3167 18.9C18.4167 18.9416 18.5083 19 18.5917 19.075C18.7417 19.2333 18.8333 19.45 18.8333 19.6666C18.8333 19.8833 18.7417 20.1 18.5917 20.2583Z"
            fill="#00B3B3"
          />
        </svg>
      </div>
    ),
    navLink: "/calendar"
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
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.8"
            d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
            fill="#F4DBFF"
          />
          <path
            d="M24.9667 18.6084C24.6583 18.6084 24.4 18.3751 24.3667 18.0667C24.1667 16.2334 23.1833 14.5834 21.6667 13.5334C21.3917 13.3417 21.325 12.9667 21.5167 12.6917C21.7083 12.4167 22.0833 12.3501 22.3583 12.5417C24.1667 13.8001 25.3333 15.7667 25.575 17.9417C25.6083 18.2751 25.3667 18.5751 25.0333 18.6084C25.0083 18.6084 24.9917 18.6084 24.9667 18.6084Z"
            fill="#C750FF"
          />
          <path
            d="M11.1167 18.65C11.1 18.65 11.075 18.65 11.0583 18.65C10.725 18.6167 10.4833 18.3167 10.5167 17.9834C10.7417 15.8084 11.8917 13.8417 13.6833 12.575C13.95 12.3834 14.3333 12.45 14.525 12.7167C14.7167 12.9917 14.65 13.3667 14.3833 13.5584C12.8833 14.625 11.9083 16.275 11.725 18.1C11.6917 18.4167 11.425 18.65 11.1167 18.65Z"
            fill="#C750FF"
          />
          <path
            d="M21.325 25.5833C20.3 26.075 19.2 26.325 18.05 26.325C16.85 26.325 15.7083 26.0583 14.6417 25.5167C14.3417 25.375 14.225 25.0083 14.375 24.7083C14.5167 24.4083 14.8833 24.2917 15.1833 24.4333C15.7083 24.7 16.2667 24.8833 16.8333 24.9917C17.6 25.1417 18.3833 25.15 19.15 25.0167C19.7167 24.9167 20.275 24.7417 20.7917 24.4917C21.1 24.35 21.4667 24.4667 21.6 24.775C21.75 25.075 21.6333 25.4417 21.325 25.5833Z"
            fill="#C750FF"
          />
          <path
            d="M18.0417 9.67505C16.75 9.67505 15.6917 10.725 15.6917 12.025C15.6917 13.325 16.7417 14.375 18.0417 14.375C19.3417 14.375 20.3917 13.325 20.3917 12.025C20.3917 10.725 19.3417 9.67505 18.0417 9.67505Z"
            fill="#C750FF"
          />
          <path
            d="M12.2083 19.5583C10.9167 19.5583 9.85834 20.6084 9.85834 21.9083C9.85834 23.2083 10.9083 24.2583 12.2083 24.2583C13.5083 24.2583 14.5583 23.2083 14.5583 21.9083C14.5583 20.6084 13.5 19.5583 12.2083 19.5583Z"
            fill="#C750FF"
          />
          <path
            d="M23.7917 19.5583C22.5 19.5583 21.4417 20.6084 21.4417 21.9083C21.4417 23.2083 22.4917 24.2583 23.7917 24.2583C25.0917 24.2583 26.1417 23.2083 26.1417 21.9083C26.1417 20.6084 25.0917 19.5583 23.7917 19.5583Z"
            fill="#C750FF"
          />
        </svg>
      </div>
    ),
    navLink: "/workspace/list"
  }
]

export default menuConfig
