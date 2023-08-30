import { useFormatMessage } from "@apps/utility/common"
import { ListComponentConfig } from "@modules/Dashboard/components/ListComponentConfig"

export const employee_data_radio = [
  {
    value: "all_employees_including_resigned_ones",
    label:
      "modules.permissions.text.employee_data.all_employees_including_resigned_ones"
  },
  {
    value: "all_employees",
    label: "modules.permissions.text.employee_data.all_employees"
  },
  {
    value: "direct_and_indirect_reports",
    label: "modules.permissions.text.employee_data.direct_and_indirect_reports"
  },
  {
    value: "direct_reports",
    label: "modules.permissions.text.employee_data.direct_reports"
  }
]

export const features_list = [
  {
    title: useFormatMessage(
      `modules.permissions.text.features.employees.employees`
    ),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.employees.manage_employees`
        ),
        name: "employees_manage",
        des: "",
        child: [
          {
            title: useFormatMessage(
              `modules.permissions.text.features.employees.hiring`
            ),
            name: "employees_hiring",
            des: useFormatMessage(
              `modules.permissions.text.features.employees.hiring_des`
            )
          },
          {
            title: useFormatMessage(
              `modules.permissions.text.features.employees.termination`
            ),
            name: "employees_termination",
            des: useFormatMessage(
              `modules.permissions.text.features.employees.termination_des`
            )
          },
          {
            title: useFormatMessage(`modules.permissions.text.settings`),
            name: "employees_settings",
            des: useFormatMessage(
              `modules.permissions.text.features.employees.settings_des`
            ),
            child: []
          }
        ]
      }
    ]
  },
  {
    title: useFormatMessage(
      `modules.permissions.text.features.checklist.checklist`
    ),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.checklist.onboarding`
        ),
        name: "checklist_manage",
        des: useFormatMessage(
          `modules.permissions.text.features.checklist.onboarding_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(`modules.permissions.text.settings`),
        name: "checklist_settings",
        des: useFormatMessage(
          `modules.permissions.text.features.checklist.settings_des`
        ),
        child: []
      }
    ]
  },
  {
    title: useFormatMessage(
      `modules.permissions.text.features.time_off.time_off`
    ),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.time_off.employee_time_off`
        ),
        name: "employee_time_off",
        des: useFormatMessage(
          `modules.permissions.text.features.time_off.employee_time_off_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.time_off.team_time_off`
        ),
        name: "team_time_off",
        des: useFormatMessage(
          `modules.permissions.text.features.time_off.team_time_off_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.time_off.approval_time_off`
        ),
        name: "approval_time_off",
        des: useFormatMessage(
          `modules.permissions.text.features.time_off.approval_time_off_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(`modules.permissions.text.settings`),
        name: "time_off_settings",
        des: "",
        child: [
          {
            title: useFormatMessage(
              `modules.permissions.text.features.time_off.holidays`
            ),
            name: "time_off_settings_holidays",
            des: useFormatMessage(
              `modules.permissions.text.features.time_off.holidays_des`
            )
          },
          {
            title: useFormatMessage(
              `modules.permissions.text.features.time_off.types`
            ),
            name: "time_off_settings_types",
            des: useFormatMessage(
              `modules.permissions.text.features.time_off.types_des`
            )
          }
        ]
      }
    ]
  },
  {
    title: useFormatMessage(
      `modules.permissions.text.features.overtimes.title`
    ),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.overtimes.manage_overtime`
        ),
        name: "overtime_manage",
        des: useFormatMessage(
          `modules.permissions.text.features.overtimes.manage_overtime_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.overtimes.request_overtime`
        ),
        name: "overtime_request",
        des: useFormatMessage(
          `modules.permissions.text.features.overtimes.request_overtime_des`
        ),
        child: []
      }
    ]
  },
  {
    title: useFormatMessage(
      `modules.permissions.text.features.attendance.attendance`
    ),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.attendance.employee_attendance`
        ),
        name: "employee_attendance",
        des: useFormatMessage(
          `modules.permissions.text.features.attendance.employee_attendance_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.attendance.team_attendance`
        ),
        name: "team_attendance",
        des: useFormatMessage(
          `modules.permissions.text.features.attendance.team_attendance_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(`modules.permissions.text.settings`),
        name: "attendance_setting",
        des: useFormatMessage(
          `modules.permissions.text.features.attendance.settings_des`
        ),
        child: []
      }
    ]
  },
  {
    title: useFormatMessage(
      `modules.permissions.text.features.payroll.payroll`
    ),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.payroll.employee_payroll`
        ),
        name: "employee_payroll",
        des: useFormatMessage(
          `modules.permissions.text.features.payroll.employee_payroll_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(`modules.permissions.text.settings`),
        name: "payrolls_settings",
        des: useFormatMessage(
          `modules.permissions.text.features.payroll.settings_des`
        ),
        child: []
      }
    ]
  },
  {
    title: useFormatMessage(
      `modules.permissions.text.features.recruitment.recruitment`
    ),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.recruitment.recruitment_management`
        ),
        name: "recruitment_manage",
        des: "",
        child: [
          {
            title: useFormatMessage(
              `modules.permissions.text.features.recruitment.approval`
            ),
            name: "recruitment_approval",
            des: useFormatMessage(
              `modules.permissions.text.features.recruitment.approval_des`
            )
          },
          {
            title: useFormatMessage(
              `modules.permissions.text.features.recruitment.request`
            ),
            name: "recruitment_request",
            des: useFormatMessage(
              `modules.permissions.text.features.recruitment.request_des`
            )
          },
          {
            title: useFormatMessage(
              `modules.permissions.text.features.recruitment.jobs`
            ),
            name: "recruitment_jobs",
            des: useFormatMessage(
              `modules.permissions.text.features.recruitment.jobs_des`
            )
          },
          {
            title: useFormatMessage(
              `modules.permissions.text.features.recruitment.candidates`
            ),
            name: "candidates_manage",
            des: useFormatMessage(
              `modules.permissions.text.features.recruitment.candidates_des`
            )
          },
          {
            title: useFormatMessage(`modules.permissions.text.settings`),
            name: "recruitment_settings",
            des: useFormatMessage(
              `modules.permissions.text.features.recruitment.settings_des`
            ),
            child: []
          }
        ]
      }
    ]
  },
  {
    title: useFormatMessage(`modules.permissions.text.features.post.post`),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.post.create_announcement`
        ),
        name: "create_post_announcement",
        des: useFormatMessage(
          `modules.permissions.text.features.post.create_announcement`
        )
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.post.create_endorsement`
        ),
        name: "create_post_endorsement",
        des: useFormatMessage(
          `modules.permissions.text.features.post.create_endorsement`
        )
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.post.post_without_approval`
        ),
        name: "post_without_approval",
        des: useFormatMessage(
          `modules.permissions.text.features.post.post_without_approval`
        )
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.post.approval_post`
        ),
        name: "approval_post",
        des: useFormatMessage(
          `modules.permissions.text.features.post.approval_post`
        )
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.post.manage_post`
        ),
        name: "manage_post",
        des: useFormatMessage(
          `modules.permissions.text.features.post.manage_post`
        )
      }
    ]
  },
  {
    title: useFormatMessage(
      `modules.permissions.text.features.workgroup.workgroup`
    ),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.workgroup.create_workgroup`
        ),
        name: "create_workgroup",
        des: useFormatMessage(
          `modules.permissions.text.features.workgroup.create_workgroup`
        )
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.workgroup.manage_workgroup`
        ),
        name: "manage_workgroup",
        des: useFormatMessage(
          `modules.permissions.text.features.workgroup.manage_workgroup`
        )
      }
    ]
  },
  {
    title: useFormatMessage(`modules.permissions.text.features.news.news`),
    content: [
      {
        title: useFormatMessage(`modules.permissions.text.features.news.news`),
        name: "news_manage",
        des: useFormatMessage(
          `modules.permissions.text.features.news.news_des`
        ),
        child: []
      }
    ]
  },
  {
    title: useFormatMessage(`modules.permissions.text.features.assets.assets`),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.assets.asset_list.title`
        ),
        name: "asset_list",
        des: useFormatMessage(
          `modules.permissions.text.features.assets.asset_list.description`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.assets.asset_inventory.title`
        ),
        name: "asset_inventory",
        des: useFormatMessage(
          `modules.permissions.text.features.assets.asset_inventory.description`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.assets.asset_import.title`
        ),
        name: "asset_import",
        des: useFormatMessage(
          `modules.permissions.text.features.assets.asset_import.description`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.assets.asset_generate_qr_code.title`
        ),
        name: "asset_qr_code_generator",
        des: useFormatMessage(
          `modules.permissions.text.features.assets.asset_generate_qr_code.description`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.assets.asset_types.title`
        ),
        name: "asset_type",
        des: useFormatMessage(
          `modules.permissions.text.features.assets.asset_types.description`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.assets.asset_groups.title`
        ),
        name: "asset_group",
        des: useFormatMessage(
          `modules.permissions.text.features.assets.asset_groups.description`
        ),
        child: []
      }
    ]
  },
  {
    title: useFormatMessage(
      `modules.permissions.text.features.reports.reports`
    ),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.reports.employees`
        ),
        name: "reports_employees",
        des: useFormatMessage(
          `modules.permissions.text.features.reports.report_view_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.reports.onboarding`
        ),
        name: "reports_onboarding",
        des: useFormatMessage(
          `modules.permissions.text.features.reports.report_view_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.reports.offboarding`
        ),
        name: "reports_offboarding",
        des: useFormatMessage(
          `modules.permissions.text.features.reports.report_view_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.reports.time_off_schedule`
        ),
        name: "reports_time_off_schedule",
        des: useFormatMessage(
          `modules.permissions.text.features.reports.report_view_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.reports.time_off_balance`
        ),
        name: "reports_time_off_balance",
        des: useFormatMessage(
          `modules.permissions.text.features.reports.report_view_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.reports.attendance`
        ),
        name: "reports_attendance",
        des: useFormatMessage(
          `modules.permissions.text.features.reports.report_view_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.reports.recruitment`
        ),
        name: "reports_recruitment",
        des: useFormatMessage(
          `modules.permissions.text.features.reports.report_view_des`
        ),
        child: []
      }
    ]
  },
  {
    title: useFormatMessage(`modules.permissions.text.settings`),
    content: [
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.superpower`
        ),
        name: "settings_superpower",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.superpower_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.developer_mode`
        ),
        name: "settings_developer_mode",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.developer_mode_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.download`
        ),
        name: "settings_download",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.download_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.modules`
        ),
        name: "settings_modules",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.modules_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.app`
        ),
        name: "settings_app",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.app_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.users`
        ),
        name: "settings_users",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.users_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.permits`
        ),
        name: "settings_permits",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.permits_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.offices`
        ),
        name: "settings_offices",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.offices_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.departments`
        ),
        name: "settings_departments",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.departments_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.job_titles`
        ),
        name: "settings_job_titles",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.job_titles_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.groups`
        ),
        name: "settings_groups",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.groups_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.work_schedules`
        ),
        name: "settings_work_schedules",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.work_schedules_des`
        ),
        child: []
      },
      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.employee_groups`
        ),
        name: "settings_employee_groups",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.employee_groups_des`
        ),
        child: []
      },

      {
        title: useFormatMessage(
          `modules.permissions.text.features.settings.employee_level`
        ),
        name: "settings_employee_level",
        des: useFormatMessage(
          `modules.permissions.text.features.settings.employee_level_des`
        ),
        child: []
      }
    ]
  }
]

export const other_list = () => {
  let other_widget = []
  _.map(
    _.filter(ListComponentConfig(), (item) => {
      return item.action !== "login"
    }),
    (value) => {
      return (other_widget = [
        ...other_widget,
        {
          title: useFormatMessage(
            `modules.permissions.text.other.widget.${value.id}.title`
          ),
          name: `other_widget_${value.id}`,
          des: useFormatMessage(
            `modules.permissions.text.other.widget.${value.id}.des`
          ),
          child: []
        }
      ])
    }
  )

  return [
    {
      title: useFormatMessage(
        `modules.permissions.text.other.dashboard.dashboard`
      ),
      content: [
        {
          title: useFormatMessage(
            `modules.permissions.text.other.dashboard.dashboard`
          ),
          name: "other_dashboard",
          des: useFormatMessage(
            `modules.permissions.text.other.dashboard.dashboard_des`
          ),
          child: []
        }
      ]
    },
    {
      title: useFormatMessage(`modules.permissions.text.other.widget.title`),
      content: other_widget
    }
  ]
}

export const employees_manage_options = [
  "employees_hiring",
  "employees_termination",
  "employees_settings"
]

export const time_off_settings_options = [
  "time_off_settings_holidays",
  "time_off_settings_types"
]

export const recruitment_manage_options = [
  "recruitment_approval",
  "recruitment_request",
  "recruitment_jobs",
  "candidates_manage",
  "recruitment_settings"
]
