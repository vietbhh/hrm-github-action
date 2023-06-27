import React from "react"
import * as Icon from "react-feather"
import { useFormatMessage } from "@apps/utility/common"

/*
 {
    id: "hrm",
    title: "menu.hrm",
    type: "dropdown",
    icon: <i className="iconly-User3"></i>,
    children: [
      {
        id: "employees",
        title: "menu.employees",
        type: "item",
        action: "access",
        resource: "employees",
        icon: <Icon.Circle size={2} />,
        navLink: "/employees"
      },
      {
        id: "directory",
        title: "menu.directory",
        type: "item",
        action: "login",
        resource: "app",
        icon: <Icon.Circle size={6} />,
        navLink: "/employees/directory"
      },
      {
        id: "org-chart",
        title: "menu.organizationalChart",
        type: "item",
        action: "login",
        resource: "app",
        icon: <Icon.Circle size={6} />,
        navLink: "/employees/org-chart"
      }
    ]
  },
  
*/

const menuConfig = [
  {
    header: useFormatMessage("layout.admin_tools"),
    header_short: useFormatMessage("layout.tools")
  },
  {
    id: "overview",
    title: "layout.overview",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: (
      <svg
        width="21"
        height="22"
        viewBox="0 0 21 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.24481 13.7815L8.23795 9.89131L11.6521 12.5732L14.5812 8.79291"
          stroke="#32434F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="17.9954"
          cy="3.20024"
          r="1.9222"
          stroke="#32434F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.9245 2.12015H5.65673C2.64529 2.12015 0.778015 4.25287 0.778015 7.26431V15.3467C0.778015 18.3581 2.60868 20.4817 5.65673 20.4817H14.2609C17.2723 20.4817 19.1396 18.3581 19.1396 15.3467V8.30779"
          stroke="#32434F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    navLink: "/dashboard"
  },
  {
    id: "payrolls",
    title: "Payrolls",
    type: "dropdown",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none">
        <g opacity="0.9">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.25 3.5C3.5 3.5 3.5 3.708 3.5 6.25V6.275C3.5 7.382 3.5 8.182 3.771 8.52C4.036 8.848 4.823 9 6.25 9C7.677 9 8.464 8.847 8.729 8.519C9 8.182 9 7.382 9 6.274C9 3.708 9 3.5 6.25 3.5ZM6.25 10.5C4.564 10.5 3.299 10.323 2.604 9.46C2 8.711 2 7.689 2 6.275L2.75 6.25H2C2 3.38 2.181 2 6.25 2C10.319 2 10.5 3.38 10.5 6.25C10.5 7.688 10.5 8.711 9.896 9.46C9.201 10.323 7.936 10.5 6.25 10.5Z"
            fill="#32434F"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.25 3.5C14.5 3.5 14.5 3.708 14.5 6.25V6.275C14.5 7.382 14.5 8.182 14.771 8.52C15.036 8.848 15.823 9 17.25 9C18.677 9 19.464 8.847 19.729 8.519C20 8.182 20 7.382 20 6.274C20 3.708 20 3.5 17.25 3.5ZM17.25 10.5C15.564 10.5 14.299 10.323 13.604 9.46C13 8.711 13 7.689 13 6.275L13.75 6.25H13C13 3.38 13.181 2 17.25 2C21.319 2 21.5 3.38 21.5 6.25C21.5 7.688 21.5 8.711 20.896 9.46C20.201 10.323 18.936 10.5 17.25 10.5Z"
            fill="#32434F"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.25 14.5C3.5 14.5 3.5 14.708 3.5 17.25V17.275C3.5 18.382 3.5 19.182 3.771 19.52C4.036 19.848 4.823 20 6.25 20C7.677 20 8.464 19.847 8.729 19.519C9 19.182 9 18.382 9 17.274C9 14.708 9 14.5 6.25 14.5ZM6.25 21.5C4.564 21.5 3.299 21.323 2.604 20.46C2 19.711 2 18.689 2 17.275L2.75 17.25H2C2 14.38 2.181 13 6.25 13C10.319 13 10.5 14.38 10.5 17.25C10.5 18.688 10.5 19.711 9.896 20.46C9.201 21.323 7.936 21.5 6.25 21.5Z"
            fill="#32434F"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.25 14.5C14.5 14.5 14.5 14.708 14.5 17.25V17.275C14.5 18.382 14.5 19.182 14.771 19.52C15.036 19.848 15.823 20 17.25 20C18.677 20 19.464 19.847 19.729 19.519C20 19.182 20 18.382 20 17.274C20 14.708 20 14.5 17.25 14.5ZM17.25 21.5C15.564 21.5 14.299 21.323 13.604 20.46C13 19.711 13 18.689 13 17.275L13.75 17.25H13C13 14.38 13.181 13 17.25 13C21.319 13 21.5 14.38 21.5 17.25C21.5 18.688 21.5 19.711 20.896 20.46C20.201 21.323 18.936 21.5 17.25 21.5Z"
            fill="#32434F"
          />
        </g>
      </svg>
    ),
    children: [
      {
        id: "payrolls1",
        title: "Payrolls",
        type: "dropdown",
        children: [
          {
            id: "employees1",
            title: "menu.employees",
            type: "item",
            action: "access",
            resource: "employees",
            icon: <Icon.Circle size={2} />,
            navLink: "/settings/departments",
            exactActive: true
          },
          {
            id: "directory1",
            title: "menu.directory",
            type: "item",
            action: "login",
            resource: "app",
            icon: <Icon.Circle size={6} />,
            navLink: "/profile"
          },
          {
            id: "org-chart1",
            title: "menu.organizationalChart",
            type: "item",
            action: "login",
            resource: "app",
            icon: <Icon.Circle size={6} />,
            navLink: "/settings/general"
          },
          {
            id: "employee-setting1",
            title: "employee_setting",
            type: "item",
            action: "login",
            resource: "app",
            icon: <Icon.Circle size={6} />,
            navLink: "/employees/setting"
          }
        ]
      },
      {
        id: "directory",
        title: "menu.directory",
        type: "item",
        action: "login",
        resource: "app",
        icon: <Icon.Circle size={6} />,
        navLink: "/settings/job-titles"
      },
      {
        id: "org-chart",
        title: "menu.organizationalChart",
        type: "item",
        action: "login",
        resource: "app",
        navLink: "/employees/org-chart",
        children: [
          {
            id: "employees12",
            title: "menu.employees",
            type: "item",
            action: "access",
            resource: "employees",
            icon: <Icon.Circle size={2} />,
            navLink: "/settings/groups",
            exactActive: true
          },
          {
            id: "directory12",
            title: "menu.directory",
            type: "item",
            action: "login",
            resource: "app",
            icon: <Icon.Circle size={6} />,
            navLink: "/employees/directory"
          },
          {
            id: "org-chart12",
            title: "menu.organizationalChart",
            type: "item",
            action: "login",
            resource: "app",
            icon: <Icon.Circle size={6} />,
            navLink: "/employees/org-chart"
          }
        ]
      },
      {
        id: "employee-setting",
        title: "employee_setting",
        type: "item",
        action: "login",
        resource: "app",
        icon: <Icon.Circle size={6} />,
        navLink: "/employees/setting"
      }
    ]
  }
]

export default menuConfig
