import { useFormatMessage } from "@apps/utility/common"

const menuConfig = [
  {
    header: useFormatMessage("layout.navigation"),
    header_short: useFormatMessage("layout.nav"),
    action: "login",
    resource: "app"
  },
  {
    id: "home",
    title: "layout.home",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
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
          d="M26.04 12.8201L20.28 8.79006C18.71 7.69006 16.3 7.75006 14.79 8.92006L9.77999 12.8301C8.77999 13.6101 7.98999 15.2101 7.98999 16.4701V23.3701C7.98999 25.9201 10.06 28.0001 12.61 28.0001H23.39C25.94 28.0001 28.01 25.9301 28.01 23.3801V16.6001C28.01 15.2501 27.14 13.5901 26.04 12.8201ZM18.75 24.0001C18.75 24.4101 18.41 24.7501 18 24.7501C17.59 24.7501 17.25 24.4101 17.25 24.0001V21.0001C17.25 20.5901 17.59 20.2501 18 20.2501C18.41 20.2501 18.75 20.5901 18.75 21.0001V24.0001Z"
          fill="#4986FF"
        />
      </svg>
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
          d="M21.14 9.96004L12.11 12.96C6.04 14.99 6.04 18.3 12.11 20.32L14.79 21.21L15.68 23.89C17.7 29.96 21.02 29.96 23.04 23.89L26.05 14.87C27.39 10.82 25.19 8.61004 21.14 9.96004ZM21.46 15.34L17.66 19.16C17.51 19.31 17.32 19.38 17.13 19.38C16.94 19.38 16.75 19.31 16.6 19.16C16.31 18.87 16.31 18.39 16.6 18.1L20.4 14.28C20.69 13.99 21.17 13.99 21.46 14.28C21.75 14.57 21.75 15.05 21.46 15.34Z"
          fill="#FF9149"
        />
      </svg>
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
          d="M22.75 9.56V8C22.75 7.59 22.41 7.25 22 7.25C21.59 7.25 21.25 7.59 21.25 8V9.5H14.75V8C14.75 7.59 14.41 7.25 14 7.25C13.59 7.25 13.25 7.59 13.25 8V9.56C10.55 9.81 9.23999 11.42 9.03999 13.81C9.01999 14.1 9.25999 14.34 9.53999 14.34H26.46C26.75 14.34 26.99 14.09 26.96 13.81C26.76 11.42 25.45 9.81 22.75 9.56Z"
          fill="#00B3B3"
        />
        <path
          d="M26 15.84H10C9.45 15.84 9 16.29 9 16.84V23C9 26 10.5 28 14 28H22C25.5 28 27 26 27 23V16.84C27 16.29 26.55 15.84 26 15.84ZM15.21 24.21C15.11 24.3 15 24.37 14.88 24.42C14.76 24.47 14.63 24.5 14.5 24.5C14.37 24.5 14.24 24.47 14.12 24.42C14 24.37 13.89 24.3 13.79 24.21C13.61 24.02 13.5 23.76 13.5 23.5C13.5 23.24 13.61 22.98 13.79 22.79C13.89 22.7 14 22.63 14.12 22.58C14.36 22.48 14.64 22.48 14.88 22.58C15 22.63 15.11 22.7 15.21 22.79C15.39 22.98 15.5 23.24 15.5 23.5C15.5 23.76 15.39 24.02 15.21 24.21ZM15.42 20.38C15.37 20.5 15.3 20.61 15.21 20.71C15.11 20.8 15 20.87 14.88 20.92C14.76 20.97 14.63 21 14.5 21C14.37 21 14.24 20.97 14.12 20.92C14 20.87 13.89 20.8 13.79 20.71C13.7 20.61 13.63 20.5 13.58 20.38C13.53 20.26 13.5 20.13 13.5 20C13.5 19.87 13.53 19.74 13.58 19.62C13.63 19.5 13.7 19.39 13.79 19.29C13.89 19.2 14 19.13 14.12 19.08C14.36 18.98 14.64 18.98 14.88 19.08C15 19.13 15.11 19.2 15.21 19.29C15.3 19.39 15.37 19.5 15.42 19.62C15.47 19.74 15.5 19.87 15.5 20C15.5 20.13 15.47 20.26 15.42 20.38ZM18.71 20.71C18.61 20.8 18.5 20.87 18.38 20.92C18.26 20.97 18.13 21 18 21C17.87 21 17.74 20.97 17.62 20.92C17.5 20.87 17.39 20.8 17.29 20.71C17.11 20.52 17 20.26 17 20C17 19.74 17.11 19.48 17.29 19.29C17.39 19.2 17.5 19.13 17.62 19.08C17.86 18.97 18.14 18.97 18.38 19.08C18.5 19.13 18.61 19.2 18.71 19.29C18.89 19.48 19 19.74 19 20C19 20.26 18.89 20.52 18.71 20.71Z"
          fill="#00B3B3"
        />
      </svg>
    ),
    navLink: "/calendar"
  },
  /* {
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
    navLink: "/drive"
  }, */
  {
    id: "workgroup",
    title: "layout.workgroup",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
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
          d="M26.36 18.7299C25.99 18.7299 25.68 18.45 25.64 18.08C25.4 15.88 24.22 13.9 22.4 12.64C22.07 12.41 21.99 11.96 22.22 11.63C22.45 11.3 22.9 11.22 23.23 11.45C25.4 12.96 26.8 15.32 27.09 17.93C27.13 18.33 26.84 18.6899 26.44 18.7299C26.41 18.7299 26.39 18.7299 26.36 18.7299Z"
          fill="#C750FF"
        />
        <path
          d="M9.73998 18.78C9.71998 18.78 9.68998 18.78 9.66998 18.78C9.26998 18.74 8.97998 18.38 9.01998 17.98C9.28998 15.37 10.67 13.01 12.82 11.49C13.14 11.26 13.6 11.34 13.83 11.66C14.06 11.99 13.98 12.44 13.66 12.67C11.86 13.95 10.69 15.93 10.47 18.12C10.43 18.5 10.11 18.78 9.73998 18.78Z"
          fill="#C750FF"
        />
        <path
          d="M21.99 27.1C20.76 27.69 19.44 27.99 18.06 27.99C16.62 27.99 15.25 27.67 13.97 27.02C13.61 26.85 13.47 26.41 13.65 26.05C13.82 25.69 14.26 25.55 14.62 25.72C15.25 26.04 15.92 26.26 16.6 26.39C17.52 26.57 18.46 26.58 19.38 26.42C20.06 26.3 20.73 26.09 21.35 25.79C21.72 25.62 22.16 25.76 22.32 26.13C22.5 26.49 22.36 26.93 21.99 27.1Z"
          fill="#C750FF"
        />
        <path
          d="M18.05 8.01001C16.5 8.01001 15.23 9.27001 15.23 10.83C15.23 12.39 16.49 13.65 18.05 13.65C19.61 13.65 20.87 12.39 20.87 10.83C20.87 9.27001 19.61 8.01001 18.05 8.01001Z"
          fill="#C750FF"
        />
        <path
          d="M11.05 19.87C9.49998 19.87 8.22998 21.13 8.22998 22.69C8.22998 24.25 9.48998 25.51 11.05 25.51C12.61 25.51 13.87 24.25 13.87 22.69C13.87 21.13 12.6 19.87 11.05 19.87Z"
          fill="#C750FF"
        />
        <path
          d="M24.95 19.87C23.4 19.87 22.13 21.13 22.13 22.69C22.13 24.25 23.39 25.51 24.95 25.51C26.51 25.51 27.77 24.25 27.77 22.69C27.77 21.13 26.51 19.87 24.95 19.87Z"
          fill="#C750FF"
        />
      </svg>
    ),
    navLink: "/workspace/list"
  },
  {
    id: "approvepost",
    title: "menu.approve_post",
    type: "dropdown",
    action: "ApprovalPost",
    resource: "feed",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          opacity="0.8"
          d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
          fill="#69DCA1"
        />
        <path
          d="M18.3083 15.3999H22.6834"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.3167 15.3999L13.9417 16.0249L15.8167 14.1499"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.3083 21.2334H22.6834"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.3167 21.2334L13.9417 21.8584L15.8167 19.9834"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.5 26.3334H20.5C24.6666 26.3334 26.3333 24.6667 26.3333 20.5001V15.5001C26.3333 11.3334 24.6666 9.66675 20.5 9.66675H15.5C11.3333 9.66675 9.66663 11.3334 9.66663 15.5001V20.5001C9.66663 24.6667 11.3333 26.3334 15.5 26.3334Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    navLink: "/feed/approve-post"
  },
  /* {
    id: "setting-member",
    title: "layout.setting_member",
    type: "dropdown",
    action: "manage",
    resource: "fri_net",
    icon: (
      <div className="menu-icon green">
        <i className="fa-solid fa-user-gear"></i>
      </div>
    ),
    navLink: "/fri-net/setting-member"
  },
  {
    id: "manage-endorsement",
    title: "layout.manage_endorsement",
    type: "dropdown",
    action: "manage",
    resource: "fri_net",
    icon: (
      <div className="menu-icon blue">
        <i className="fa-solid fa-medal"></i>
      </div>
    ),
    navLink: "/fri-net/manage-endorsement"
  } */
  {
    id: "post_saved",
    title: "menu.posts_saved",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          opacity="0.8"
          d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
          fill="#FFC66F"
        />
        <path
          d="M24.9667 18.6084C24.6584 18.6084 24.4 18.3751 24.3667 18.0667C24.1667 16.2334 23.1834 14.5834 21.6667 13.5334C21.3917 13.3417 21.325 12.9667 21.5167 12.6917C21.7084 12.4167 22.0834 12.3501 22.3584 12.5417C24.1667 13.8001 25.3334 15.7667 25.575 17.9417C25.6084 18.2751 25.3667 18.5751 25.0334 18.6084C25.0084 18.6084 24.9917 18.6084 24.9667 18.6084Z"
          fill="white"
        />
        <path
          d="M11.1166 18.65C11.1 18.65 11.075 18.65 11.0583 18.65C10.725 18.6167 10.4833 18.3167 10.5166 17.9834C10.7416 15.8084 11.8916 13.8417 13.6833 12.575C13.95 12.3834 14.3333 12.45 14.525 12.7167C14.7166 12.9917 14.65 13.3667 14.3833 13.5584C12.8833 14.625 11.9083 16.275 11.725 18.1C11.6916 18.4167 11.425 18.65 11.1166 18.65Z"
          fill="white"
        />
        <path
          d="M21.325 25.5833C20.3 26.075 19.2 26.325 18.05 26.325C16.85 26.325 15.7083 26.0583 14.6416 25.5167C14.3416 25.375 14.225 25.0083 14.375 24.7083C14.5166 24.4083 14.8833 24.2917 15.1833 24.4333C15.7083 24.7 16.2666 24.8833 16.8333 24.9917C17.6 25.1417 18.3833 25.15 19.15 25.0167C19.7166 24.9167 20.275 24.7417 20.7916 24.4917C21.1 24.35 21.4666 24.4667 21.6 24.775C21.75 25.075 21.6333 25.4417 21.325 25.5833Z"
          fill="white"
        />
        <path
          d="M18.0417 9.67505C16.75 9.67505 15.6917 10.725 15.6917 12.025C15.6917 13.325 16.7417 14.375 18.0417 14.375C19.3417 14.375 20.3917 13.325 20.3917 12.025C20.3917 10.725 19.3417 9.67505 18.0417 9.67505Z"
          fill="white"
        />
        <path
          d="M12.2083 19.5583C10.9166 19.5583 9.85828 20.6084 9.85828 21.9083C9.85828 23.2083 10.9083 24.2583 12.2083 24.2583C13.5083 24.2583 14.5583 23.2083 14.5583 21.9083C14.5583 20.6084 13.4999 19.5583 12.2083 19.5583Z"
          fill="white"
        />
        <path
          d="M23.7917 19.5583C22.5 19.5583 21.4417 20.6084 21.4417 21.9083C21.4417 23.2083 22.4917 24.2583 23.7917 24.2583C25.0917 24.2583 26.1417 23.2083 26.1417 21.9083C26.1417 20.6084 25.0917 19.5583 23.7917 19.5583Z"
          fill="white"
        />
      </svg>
    ),
    action: "login",
    resource: "app",
    navLink: "/feed/post-saved"
  }
]

export default menuConfig
