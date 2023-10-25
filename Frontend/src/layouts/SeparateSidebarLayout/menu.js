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
          d="M24.7 13.6834L19.9 10.325C18.5917 9.40836 16.5833 9.45836 15.325 10.4334L11.15 13.6917C10.3167 14.3417 9.65833 15.675 9.65833 16.725V22.475C9.65833 24.6 11.3833 26.3334 13.5083 26.3334H22.4917C24.6167 26.3334 26.3417 24.6084 26.3417 22.4834V16.8334C26.3417 15.7084 25.6167 14.325 24.7 13.6834ZM18.625 23C18.625 23.3417 18.3417 23.625 18 23.625C17.6583 23.625 17.375 23.3417 17.375 23V20.5C17.375 20.1584 17.6583 19.875 18 19.875C18.3417 19.875 18.625 20.1584 18.625 20.5V23Z"
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
          d="M24.4401 16.2346L21.1329 22.5585C18.8998 26.8078 16.4495 26.4096 15.6843 21.6731L15.3479 19.582L13.471 18.6007C9.22045 16.3751 9.61985 13.9174 14.3564 13.1522L21.3959 12.0091C24.5553 11.5043 25.9267 13.3988 24.4401 16.2346ZM20.4958 15.3505L17.2107 17.704C17.0817 17.797 17.007 17.9292 16.9841 18.0699C16.9613 18.2106 16.9902 18.3596 17.0832 18.4887C17.263 18.7383 17.6184 18.796 17.8679 18.6162L21.153 16.2627C21.4026 16.0829 21.4603 15.7276 21.2805 15.478C21.1007 15.2284 20.7454 15.1707 20.4958 15.3505Z"
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
          fill="#69DCA1"
        />
        <path
          d="M21.5627 11.67V10.5C21.5627 10.1925 21.3077 9.9375 21.0002 9.9375C20.6927 9.9375 20.4377 10.1925 20.4377 10.5V11.625H15.5627V10.5C15.5627 10.1925 15.3077 9.9375 15.0002 9.9375C14.6927 9.9375 14.4377 10.1925 14.4377 10.5V11.67C12.4127 11.8575 11.4302 13.065 11.2802 14.8575C11.2652 15.075 11.4452 15.255 11.6552 15.255H24.3452C24.5627 15.255 24.7427 15.0675 24.7202 14.8575C24.5702 13.065 23.5877 11.8575 21.5627 11.67Z"
          fill="white"
        />
        <path
          d="M24 16.38H12C11.5875 16.38 11.25 16.7175 11.25 17.13V21.75C11.25 24 12.375 25.5 15 25.5H21C23.625 25.5 24.75 24 24.75 21.75V17.13C24.75 16.7175 24.4125 16.38 24 16.38ZM15.9075 22.6575C15.8325 22.725 15.75 22.7775 15.66 22.815C15.57 22.8525 15.4725 22.875 15.375 22.875C15.2775 22.875 15.18 22.8525 15.09 22.815C15 22.7775 14.9175 22.725 14.8425 22.6575C14.7075 22.515 14.625 22.32 14.625 22.125C14.625 21.93 14.7075 21.735 14.8425 21.5925C14.9175 21.525 15 21.4725 15.09 21.435C15.27 21.36 15.48 21.36 15.66 21.435C15.75 21.4725 15.8325 21.525 15.9075 21.5925C16.0425 21.735 16.125 21.93 16.125 22.125C16.125 22.32 16.0425 22.515 15.9075 22.6575ZM16.065 19.785C16.0275 19.875 15.975 19.9575 15.9075 20.0325C15.8325 20.1 15.75 20.1525 15.66 20.19C15.57 20.2275 15.4725 20.25 15.375 20.25C15.2775 20.25 15.18 20.2275 15.09 20.19C15 20.1525 14.9175 20.1 14.8425 20.0325C14.775 19.9575 14.7225 19.875 14.685 19.785C14.6475 19.695 14.625 19.5975 14.625 19.5C14.625 19.4025 14.6475 19.305 14.685 19.215C14.7225 19.125 14.775 19.0425 14.8425 18.9675C14.9175 18.9 15 18.8475 15.09 18.81C15.27 18.735 15.48 18.735 15.66 18.81C15.75 18.8475 15.8325 18.9 15.9075 18.9675C15.975 19.0425 16.0275 19.125 16.065 19.215C16.1025 19.305 16.125 19.4025 16.125 19.5C16.125 19.5975 16.1025 19.695 16.065 19.785ZM18.5325 20.0325C18.4575 20.1 18.375 20.1525 18.285 20.19C18.195 20.2275 18.0975 20.25 18 20.25C17.9025 20.25 17.805 20.2275 17.715 20.19C17.625 20.1525 17.5425 20.1 17.4675 20.0325C17.3325 19.89 17.25 19.695 17.25 19.5C17.25 19.305 17.3325 19.11 17.4675 18.9675C17.5425 18.9 17.625 18.8475 17.715 18.81C17.895 18.7275 18.105 18.7275 18.285 18.81C18.375 18.8475 18.4575 18.9 18.5325 18.9675C18.6675 19.11 18.75 19.305 18.75 19.5C18.75 19.695 18.6675 19.89 18.5325 20.0325Z"
          fill="white"
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
          fill="#FA6D7D"
        />
        <path
          d="M24.2698 18.5476C23.9923 18.5476 23.7598 18.3376 23.7298 18.0601C23.5498 16.4101 22.6648 14.9251 21.2998 13.9801C21.0523 13.8076 20.9923 13.4701 21.1648 13.2226C21.3373 12.9751 21.6748 12.9151 21.9223 13.0876C23.5498 14.2201 24.5998 15.9901 24.8173 17.9476C24.8473 18.2476 24.6298 18.5176 24.3298 18.5476C24.3073 18.5476 24.2923 18.5476 24.2698 18.5476Z"
          fill="white"
        />
        <path
          d="M11.805 18.585C11.79 18.585 11.7675 18.585 11.7525 18.585C11.4525 18.555 11.235 18.285 11.265 17.985C11.4675 16.0275 12.5025 14.2575 14.115 13.1175C14.355 12.945 14.7 13.005 14.8725 13.245C15.045 13.4925 14.985 13.83 14.745 14.0025C13.395 14.9625 12.5175 16.4475 12.3525 18.09C12.3225 18.375 12.0825 18.585 11.805 18.585Z"
          fill="white"
        />
        <path
          d="M20.9925 24.825C20.07 25.2675 19.08 25.4925 18.045 25.4925C16.965 25.4925 15.9375 25.2525 14.9775 24.765C14.7075 24.6375 14.6025 24.3075 14.7375 24.0375C14.865 23.7675 15.195 23.6625 15.465 23.79C15.9375 24.03 16.44 24.195 16.95 24.2925C17.64 24.4275 18.345 24.435 19.035 24.315C19.545 24.225 20.0475 24.0675 20.5125 23.8425C20.79 23.715 21.12 23.82 21.24 24.0975C21.375 24.3675 21.27 24.6975 20.9925 24.825Z"
          fill="white"
        />
        <path
          d="M18.0374 10.5074C16.8749 10.5074 15.9224 11.4524 15.9224 12.6224C15.9224 13.7924 16.8674 14.7374 18.0374 14.7374C19.2074 14.7374 20.1524 13.7924 20.1524 12.6224C20.1524 11.4524 19.2074 10.5074 18.0374 10.5074Z"
          fill="white"
        />
        <path
          d="M12.7874 19.4025C11.6249 19.4025 10.6724 20.3475 10.6724 21.5175C10.6724 22.6875 11.6174 23.6325 12.7874 23.6325C13.9574 23.6325 14.9024 22.6875 14.9024 21.5175C14.9024 20.3475 13.9499 19.4025 12.7874 19.4025Z"
          fill="white"
        />
        <path
          d="M23.2127 19.4025C22.0502 19.4025 21.0977 20.3475 21.0977 21.5175C21.0977 22.6875 22.0427 23.6325 23.2127 23.6325C24.3827 23.6325 25.3277 22.6875 25.3277 21.5175C25.3277 20.3475 24.3827 19.4025 23.2127 19.4025Z"
          fill="white"
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
          fill="#F4DBFF"
        />
        <path
          d="M24.9667 18.6084C24.6584 18.6084 24.4 18.3751 24.3667 18.0667C24.1667 16.2334 23.1834 14.5834 21.6667 13.5334C21.3917 13.3417 21.325 12.9667 21.5167 12.6917C21.7084 12.4167 22.0834 12.3501 22.3584 12.5417C24.1667 13.8001 25.3334 15.7667 25.575 17.9417C25.6084 18.2751 25.3667 18.5751 25.0334 18.6084C25.0084 18.6084 24.9917 18.6084 24.9667 18.6084Z"
          fill="#C750FF"
        />
        <path
          d="M11.1166 18.65C11.1 18.65 11.075 18.65 11.0583 18.65C10.725 18.6167 10.4833 18.3167 10.5166 17.9834C10.7416 15.8084 11.8916 13.8417 13.6833 12.575C13.95 12.3834 14.3333 12.45 14.525 12.7167C14.7166 12.9917 14.65 13.3667 14.3833 13.5584C12.8833 14.625 11.9083 16.275 11.725 18.1C11.6916 18.4167 11.425 18.65 11.1166 18.65Z"
          fill="#C750FF"
        />
        <path
          d="M21.325 25.5833C20.3 26.075 19.2 26.325 18.05 26.325C16.85 26.325 15.7083 26.0583 14.6416 25.5167C14.3416 25.375 14.225 25.0083 14.375 24.7083C14.5166 24.4083 14.8833 24.2917 15.1833 24.4333C15.7083 24.7 16.2666 24.8833 16.8333 24.9917C17.6 25.1417 18.3833 25.15 19.15 25.0167C19.7166 24.9167 20.275 24.7417 20.7916 24.4917C21.1 24.35 21.4666 24.4667 21.6 24.775C21.75 25.075 21.6333 25.4417 21.325 25.5833Z"
          fill="#C750FF"
        />
        <path
          d="M18.0417 9.67505C16.75 9.67505 15.6917 10.725 15.6917 12.025C15.6917 13.325 16.7417 14.375 18.0417 14.375C19.3417 14.375 20.3917 13.325 20.3917 12.025C20.3917 10.725 19.3417 9.67505 18.0417 9.67505Z"
          fill="#C750FF"
        />
        <path
          d="M12.2083 19.5583C10.9166 19.5583 9.85828 20.6084 9.85828 21.9083C9.85828 23.2083 10.9083 24.2583 12.2083 24.2583C13.5083 24.2583 14.5583 23.2083 14.5583 21.9083C14.5583 20.6084 13.4999 19.5583 12.2083 19.5583Z"
          fill="#C750FF"
        />
        <path
          d="M23.7917 19.5583C22.5 19.5583 21.4417 20.6084 21.4417 21.9083C21.4417 23.2083 22.4917 24.2583 23.7917 24.2583C25.0917 24.2583 26.1417 23.2083 26.1417 21.9083C26.1417 20.6084 25.0917 19.5583 23.7917 19.5583Z"
          fill="#C750FF"
        />
      </svg>
    ),
    action: "login",
    resource: "app",
    navLink: "/feed/post-saved"
  }
]

export default menuConfig
