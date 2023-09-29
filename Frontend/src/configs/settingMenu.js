import { useFormatMessage } from "@apps/utility/common"

const settingMenu = {
  navigation: {
    id: "navigation",
    type: "header",
    action: "manage",
    resource: "manage",
    title: useFormatMessage("layout.navigation"),
    titleShort: useFormatMessage("layout.nav"),
    navLink: "",
    order: 0
  },
  general: {
    id: "general",
    title: "common.comInfo",
    type: "item",
    action: "manage",
    resource: "manage",
    icon: "iconly-Info-Circle icli",
    menuIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none">
        <path
          opacity="0.8"
          d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
          fill="#0082FF"
        />
        <path
          d="M11.55 17.1833V21.325C11.55 22.8417 11.55 22.8417 12.9834 23.8083L16.925 26.0833C17.5167 26.425 18.4834 26.425 19.075 26.0833L23.0167 23.8083C24.45 22.8417 24.45 22.8417 24.45 21.325V17.1833C24.45 15.6667 24.45 15.6667 23.0167 14.7L19.075 12.425C18.4834 12.0833 17.5167 12.0833 16.925 12.425L12.9834 14.7C11.55 15.6667 11.55 15.6667 11.55 17.1833Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.5833 14.3583V12.1667C22.5833 10.5 21.75 9.66667 20.0833 9.66667H15.9166C14.25 9.66667 13.4166 10.5 13.4166 12.1667V14.3"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.525 17.1583L19 17.9C19.075 18.0167 19.2416 18.1333 19.3666 18.1667L20.2166 18.3833C20.7416 18.5167 20.8833 18.9667 20.5416 19.3833L19.9833 20.0583C19.9 20.1667 19.8333 20.3583 19.8416 20.4917L19.8916 21.3667C19.925 21.9083 19.5416 22.1833 19.0416 21.9833L18.225 21.6583C18.1 21.6083 17.8916 21.6083 17.7666 21.6583L16.95 21.9833C16.45 22.1833 16.0666 21.9 16.1 21.3667L16.15 20.4917C16.1583 20.3583 16.0916 20.1583 16.0083 20.0583L15.45 19.3833C15.1083 18.9667 15.25 18.5167 15.775 18.3833L16.625 18.1667C16.7583 18.1333 16.925 18.0083 16.9916 17.9L17.4666 17.1583C17.7666 16.7083 18.2333 16.7083 18.525 17.1583Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    navLink: "/settings/general",
    order: 1
  },
  offices: {
    id: "offices",
    title: "modules.offices.title",
    type: "item",
    action: "manage",
    resource: "offices",
    icon: "icpega Building-Business-Office",
    menuIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none">
        <path
          opacity="0.8"
          d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
          fill="#69DCA1"
        />
        <path
          d="M10.5 25.5H25.5"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.75 10.5H14.25C12 10.5 11.25 11.8425 11.25 13.5V25.5H24.75V13.5C24.75 11.8425 24 10.5 21.75 10.5Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.25 21.375H16.5"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.5 21.375H21.75"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.25 18H16.5"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.5 18H21.75"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.25 14.625H16.5"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.5 14.625H21.75"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    navLink: "/settings/offices",
    order: 2
  },
  /*departments: {
    id: "departments",
    title: "modules.departments.title",
    type: "item",
    action: "manage",
    resource: "departments",
    icon: "iconly-Category icli",
    navLink: "/settings/departments",
    order: 3
  },*/
  "job-titles": {
    id: "job-titles",
    title: "modules.job_titles.title",
    type: "item",
    action: "manage",
    resource: "job_titles",
    icon: "icpega Briefcase-Portfolio",
    menuIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none">
        <path
          opacity="0.8"
          d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
          fill="#FD3B4C"
          fillOpacity="0.88"
        />
        <path
          d="M14.6667 26.3333H21.3334C24.6834 26.3333 25.2834 24.9917 25.4584 23.3583L26.0834 16.6917C26.3084 14.6583 25.7251 13 22.1667 13H13.8334C10.2751 13 9.69173 14.6583 9.91673 16.6917L10.5417 23.3583C10.7167 24.9917 11.3167 26.3333 14.6667 26.3333Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.6666 13V12.3333C14.6666 10.8583 14.6666 9.66667 17.3333 9.66667H18.6666C21.3333 9.66667 21.3333 10.8583 21.3333 12.3333V13"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.6667 18.8333V19.6667C19.6667 19.675 19.6667 19.675 19.6667 19.6833C19.6667 20.5917 19.6584 21.3333 18 21.3333C16.35 21.3333 16.3334 20.6 16.3334 19.6917V18.8333C16.3334 18 16.3334 18 17.1667 18H18.8334C19.6667 18 19.6667 18 19.6667 18.8333Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.0416 17.1667C24.1166 18.5667 21.9166 19.4 19.6666 19.6833"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.1833 17.3917C12.0583 18.675 14.175 19.45 16.3333 19.6917"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    navLink: "/settings/job-titles",
    order: 4
  },
  groups: {
    id: "groups",
    title: "modules.groups.title",
    type: "item",
    action: "manage",
    resource: "groups",
    icon: "iconly-Edit-Square icli",
    navLink: "/settings/groups",
    order: 5
  },
  users: {
    id: "users",
    title: "app.users",
    type: "item",
    action: "manage",
    resource: "permits",
    icon: "iconly-User3 icli",
    navLink: "/settings/users",
    order: 6
  },
  permissions: {
    id: "permissions",
    title: "app.permissions",
    type: "item",
    action: "manage",
    resource: "permits",
    icon: "iconly-Unlock icli",
    navLink: "/settings/permissions",
    order: 7
  },
  other: {
    id: "other",
    type: "header",
    action: "manage",
    resource: "manage",
    title: useFormatMessage("layout.other"),
    titleShort: useFormatMessage("layout.other"),
    navLink: "",
    order: 8
  },
  "work-schedules": {
    id: "work-schedules",
    title: "modules.work_schedules.title",
    type: "item",
    action: "access",
    resource: "work_schedules",
    icon: "iconly-Calendar icli",
    navLink: "/work-schedules",
    order: 9,
    hideOnSetting: true,
    dividerBefore: true
  },
  "employee-level": {
    id: "employee-level",
    title: "Employee level",
    type: "item",
    action: "access",
    resource: "employee_level",
    icon: "fa-brands fa-connectdevelop",
    menuIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none">
        <path
          opacity="0.8"
          d="M18 0C4.62856 0 0 6.48672 0 17.9095C0 31.3482 6.63427 36 18 36C31.3714 36 35.9999 29.5133 35.9999 18.0905C36.0256 4.65183 29.3914 0 18 0Z"
          fill="#FFC66F"
        />
        <path
          d="M25.5667 15.15V20.85C25.5667 21.7833 25.0667 22.65 24.2584 23.125L19.3084 25.9834C18.5 26.45 17.5 26.45 16.6834 25.9834L11.7334 23.125C10.925 22.6584 10.425 21.7917 10.425 20.85V15.15C10.425 14.2167 10.925 13.35 11.7334 12.875L16.6834 10.0167C17.4917 9.55001 18.4917 9.55001 19.3084 10.0167L24.2584 12.875C25.0667 13.35 25.5667 14.2084 25.5667 15.15Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 17.1667C19.0724 17.1667 19.9417 16.2973 19.9417 15.225C19.9417 14.1526 19.0724 13.2834 18 13.2834C16.9277 13.2834 16.0583 14.1526 16.0583 15.225C16.0583 16.2973 16.9277 17.1667 18 17.1667Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.3333 21.8833C21.3333 20.3833 19.8416 19.1667 18 19.1667C16.1583 19.1667 14.6666 20.3833 14.6666 21.8833"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    navLink: "/settings/level",
    order: 10,
    hideOnSetting: false,
    dividerBefore: false
  },
  "setting-user-infomation": {
    id: "setting-user-infomation",
    title: "User Information",
    type: "item",
    action: "manage",
    resource: "fri_net",
    icon: "fa-thin fa-user-gear",
    navLink: "/fri-net/setting-member",
    order: 11,
    hideOnSetting: false,
    dividerBefore: false
  },
  "manage-endorsement": {
    id: "manage-endorsement",
    title: "Endorsement",
    type: "item",
    action: "manage",
    resource: "fri_net",
    icon: "fa-thin fa-medal",
    navLink: "/fri-net/manage-endorsement",
    order: 12,
    hideOnSetting: false,
    dividerBefore: false
  },
  "manage-meeting-room": {
    id: "manage-meeting-room",
    title: "Room Management ",
    type: "item",
    action: "manage",
    resource: "fri_net",
    icon: "fa-thin fa-medal",
    navLink: "/meeting-room/manage",
    order: 13,
    hideOnSetting: false,
    dividerBefore: false
  },
  "post-setting": {
    id: "post-setting",
    title: "Post Setting ",
    type: "item",
    action: "manage",
    resource: "fri_net",
    icon: "fa-regular fa-bars-progress",
    navLink: "/settings/posts",
    order: 14,
    hideOnSetting: false,
    dividerBefore: false
  }
}

export default settingMenu
