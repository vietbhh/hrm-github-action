const settingMenu = {
  general: {
    id: "general",
    title: "common.comInfo",
    type: "item",
    action: "manage",
    resource: "manage",
    icon: "iconly-Info-Circle icli",
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
    navLink: "/settings/offices",
    order: 2
  },
  departments: {
    id: "departments",
    title: "modules.departments.title",
    type: "item",
    action: "manage",
    resource: "departments",
    icon: "iconly-Category icli",
    navLink: "/settings/departments",
    order: 3
  },
  "job-titles": {
    id: "job-titles",
    title: "modules.job_titles.title",
    type: "item",
    action: "manage",
    resource: "job_titles",
    icon: "icpega Briefcase-Portfolio",
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
    action: "manage_permit",
    resource: "sys",
    icon: "iconly-User3 icli",
    navLink: "/settings/users",
    order: 6
  },
  permissions: {
    id: "permissions",
    title: "app.permissions",
    type: "item",
    action: "manage_permit",
    resource: "sys",
    icon: "iconly-Unlock icli",
    navLink: "/settings/permissions",
    order: 7
  }
}

export default settingMenu
