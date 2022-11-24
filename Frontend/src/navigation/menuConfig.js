import React from "react"
import * as Icon from "react-feather"
import { useFormatMessage } from "@apps/utility/common"

const menuConfig = [
  {
    header: useFormatMessage("layout.admin_tools"),
    header_short: useFormatMessage("layout.tools")
  },
  {
    id: "overview",
    title: "layout.overview",
    icon: <i className="iconly-Activity icli"></i>,
    action: "login",
    resource: "app",
    navLink: "/dashboard"
  },
  {
    id: "hrm",
    title: "menu.hrm",
    type: "dropdown",
    icon: <i className="iconly-Category icli"></i>,
    children: [
      {
        id: "employees",
        title: "menu.employees",
        type: "item",
        action: "access",
        resource: "employees",
        icon: <Icon.Circle size={2} />,
        navLink: "/employees/list",
        exactActive: true
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
      },
      {
        id: "insurance",
        title: "menu.insurance",
        type: "item",
        action: "manage",
        resource: "employees",
        icon: <Icon.Circle size={6} />,
        navLink: "/employees/insurance"
      },
      {
        id: "employee-setting",
        title: "menu.employee_setting",
        type: "item",
        action: "accessEmployeeSettings",
        resource: "employees",
        icon: <Icon.Circle size={6} />,
        navLink: "/employees/setting"
      }
    ]
  },
  {
    id: "checklist",
    title: "menu.checklist",
    type: "dropdown",
    icon: <i className="iconly-Tick-Square icli"></i>,
    children: [
      {
        id: "checklist-todo",
        title: "menu.checklistToDo",
        type: "item",
        action: "access",
        resource: "checklist",
        icon: <Icon.Circle size={6} />,
        navLink: "/checklist/my-tasks"
      },
      {
        id: "checklist-onboarding",
        title: "menu.checklistOnboarding",
        type: "item",
        action: "access",
        resource: "checklist",
        icon: <Icon.Circle size={6} />,
        navLink: "/checklist/onboarding"
      },
      {
        id: "checklist-offboarding",
        title: "menu.checklistOffboarding",
        type: "item",
        action: "access",
        resource: "checklist",
        icon: <Icon.Circle size={6} />,
        navLink: "/checklist/offboarding"
      },
      {
        id: "checklist-setting",
        title: "menu.checklistSetting",
        type: "item",
        action: "access",
        resource: "checklist_template",
        icon: <Icon.Circle size={6} />,
        navLink: "/checklist/setting"
      }
    ]
  },
  {
    id: "recruitment",
    title: "menu.recruitments",
    type: "dropdown",
    icon: <i className="iconly-User2 icli"></i>,
    children: [
      {
        id: "recruitments-approval",
        title: "menu.approval",
        type: "item",
        action: "access",
        resource: "recruitments",
        icon: <Icon.Circle size={6} />,
        navLink: "/recruitments/approval"
      },
      {
        id: "recruitments-request",
        title: "menu.recruitmentsRequest",
        type: "item",
        action: "access",
        resource: "recruitments",
        icon: <Icon.Circle size={6} />,
        navLink: "/recruitments/request"
      },
      {
        id: "recruitments",
        title: "menu.recruitmentsList",
        type: "item",
        action: "access",
        resource: "recruitments",
        icon: <Icon.Circle size={6} />,
        navLink: "/recruitments/jobs"
      },
      {
        id: "candidates",
        title: "menu.candidates",
        type: "item",
        action: "access",
        resource: "candidates",
        icon: <Icon.Circle size={6} />,
        navLink: "/candidates"
      },
      {
        id: "recruitments-settings",
        title: "menu.settings",
        type: "item",
        action: "access",
        resource: "recruitments",
        icon: <Icon.Circle size={6} />,
        navLink: "/recruitments/settings"
      }
    ]
  },
  {
    id: "time-off",
    title: "menu.timeOff",
    type: "dropdown",
    icon: <i className="iconly-Calendar icli"></i>,
    children: [
      {
        id: "my-time-off",
        title: "menu.myTimeOff",
        type: "item",
        action: "login",
        resource: "app",
        icon: <Icon.Circle size={6} />,
        navLink: "/time-off/my-time-off"
      },
      {
        id: "team-time-off",
        title: "menu.teamTimeOff",
        type: "item",
        action: "accessTeamTimeOff",
        resource: "time_off",
        icon: <Icon.Circle size={6} />,
        navLink: "/time-off/team-time-off"
      },
      {
        id: "employee-time-off",
        title: "menu.employeesTimeOff",
        type: "item",
        action: "accessEmployeeTimeOff",
        resource: "time_off",
        icon: <Icon.Circle size={6} />,
        navLink: "/time-off/employee-time-off"
      },
      {
        id: "approval-time-off",
        title: "menu.approvalTimeOff",
        type: "item",
        action: "accessApprovalTimeOff",
        resource: "time_off",
        icon: <Icon.Circle size={6} />,
        navLink: "/time-off/approval-time-off"
      },
      {
        id: "time-off-setting",
        title: "menu.settings",
        type: "item",
        action: "accessSettingTimeOff",
        resource: "time-off",
        icon: <Icon.Circle size={6} />,
        navLink: "/time-off/setting"
      }
    ]
  },
  {
    id: "attendance",
    title: "menu.attendance",
    type: "dropdown",
    icon: <i className="iconly-Time-Circle icli"></i>,
    children: [
      {
        id: "my-attendances",
        title: "menu.myAttendance",
        type: "item",
        action: "login",
        resource: "app",
        icon: <Icon.Circle size={6} />,
        navLink: "/attendances/my-attendance"
      },
      {
        id: "team-attendance",
        title: "menu.teamAttendance",
        type: "item",
        action: "accessTeamAttendance",
        resource: "attendances",
        icon: <Icon.Circle size={6} />,
        navLink: "/attendances/team-attendance"
      },
      {
        id: "employee-attendance",
        title: "menu.employeeAttendance",
        type: "item",
        action: "accessEmployeeAttendance",
        resource: "attendances",
        icon: <Icon.Circle size={6} />,
        navLink: "/attendances/employee-attendance"
      },
      {
        id: "attendance-setting",
        title: "menu.settings",
        type: "item",
        action: "manage",
        resource: "attendances",
        icon: <Icon.Circle size={6} />,
        navLink: "/attendances/settings"
      }
    ]
  },
  {
    id: "payrolls",
    title: "menu.payrolls",
    type: "dropdown",
    icon: <i className="iconly-Wallet icli"></i>,
    children: [
      {
        id: "employee-payroll",
        title: "menu.employeePayrolls",
        type: "item",
        action: "accessEmployeePayroll",
        resource: "payrolls",
        icon: <Icon.Circle size={6} />,
        navLink: "/payrolls/employee-payroll"
      },
      {
        id: "payrolls-setting",
        title: "menu.settings",
        type: "item",
        action: "accessPayrollsSetting",
        resource: "payrolls",
        icon: <Icon.Circle size={6} />,
        navLink: "/payrolls/settings"
      }
    ]
  },
  {
    id: "documents",
    title: "menu.documents",
    type: "dropdown",
    action: "login",
    resource: "app",
    icon: <i className="iconly-Folder icli"></i>,
    navLink: "/documents"
  },
  {
    id: "overtimes",
    title: "menu.overtime",
    type: "dropdown",
    icon: <i className="iconly-Time-Square icli"></i>,
    children: [
      {
        id: "overtimes-manage",
        title: "menu.manage_overtime",
        type: "item",
        action: "accessManageOvertime",
        resource: "overtimes",
        icon: <Icon.Circle size={6} />,
        navLink: "/overtimes/manage"
      },
      {
        id: "overtimes-request",
        title: "menu.request_overtime",
        type: "item",
        action: "accessOvertimeRequest",
        resource: "overtimes",
        icon: <Icon.Circle size={6} />,
        navLink: "/overtimes/request"
      }
    ]
  },
  {
    id: "reports",
    title: "menu.reports",
    type: "dropdown",
    icon: <i className="iconly-Chart"></i>,
    children: [
      {
        id: "reports-employees",
        title: "menu.reportsEmployees",
        type: "item",
        action: "employee",
        resource: "reports",
        icon: <Icon.Circle size={6} />,
        navLink: "/reports/employee"
      },
      {
        id: "reports-onboarding",
        title: "menu.reportsOnboarding",
        type: "item",
        action: "onboarding",
        resource: "reports",
        icon: <Icon.Circle size={6} />,
        navLink: "/reports/onboarding"
      },
      {
        id: "reports-offboarding",
        title: "menu.reportsOffboarding",
        type: "item",
        action: "offboarding",
        resource: "reports",
        icon: <Icon.Circle size={6} />,
        navLink: "/reports/offboarding"
      },
      {
        id: "reports-time-off-schedule",
        title: "menu.reportsTimeOffSchedule",
        type: "item",
        action: "timeOffSchedule",
        resource: "reports",
        icon: <Icon.Circle size={6} />,
        navLink: "/reports/time-off-schedule"
      },
      {
        id: "reports-time-off-balance",
        title: "menu.reportsTimeOffBalance",
        type: "item",
        action: "timeOffBalance",
        resource: "reports",
        icon: <Icon.Circle size={6} />,
        navLink: "/reports/time-off-balance"
      },
      {
        id: "reports-attendance",
        title: "menu.reportsAttendance",
        type: "item",
        action: "attendance",
        resource: "reports",
        icon: <Icon.Circle size={6} />,
        navLink: "/reports/attendance"
      },
      {
        id: "reports-recruitment",
        title: "menu.reportsRecruitment",
        type: "item",
        action: "recruitment",
        resource: "reports",
        icon: <Icon.Circle size={6} />,
        navLink: "/reports/recruitment"
      }
    ]
  }
]

export default menuConfig
