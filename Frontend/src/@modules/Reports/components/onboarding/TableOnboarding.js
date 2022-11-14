import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { convertDate } from "@modules/Payrolls/common/common"
import {
  ReportOnboardingApi,
  ReportOffboardingApi
} from "@modules/Reports/common/OnboardingApi"
import { Table } from "antd"
import { Fragment } from "react"
import { Link } from "react-router-dom"
import { Button, Col, Row, Spinner } from "reactstrap"
import { ReportEmployeeTurnoverRateApi } from "../../common/OnboardingApi"

const TableOnboarding = (props) => {
  const { type, loading, data, filters } = props

  const [state, setState] = useMergedState({
    loading_export: false
  })

  const drawTable = () => {
    const column_default = [
      {
        title: useFormatMessage(`modules.payrolls.fields.employee_name`),
        dataIndex: "employee_name",
        key: "employee_name",
        width: 300,
        fixed: "left",
        render: (text, record) => {
          return (
            <>
              <Link to={`/employees/u/${text[2]}`} target="_blank">
                <div>
                  <Avatar className="img me-50" size="sm" src={text[1]} />
                  {text[0]}
                </div>
              </Link>
            </>
          )
        }
      },
      {
        title: useFormatMessage(`modules.reports.onboarding.text.employee_id`),
        dataIndex: "employee_id",
        key: "employee_id",
        width: 150,
        render: (text) => {
          return text
        }
      }
    ]

    let column_custom = []
    if (type === "onboarding" || type === "offboarding") {
      column_custom = [
        ...column_custom,
        {
          title: useFormatMessage(`modules.employees.fields.job_title_id`),
          dataIndex: "job_title_id",
          key: "job_title_id",
          render: (text) => {
            return text
          }
        },
        {
          title: useFormatMessage(`modules.employees.fields.employee_type`),
          dataIndex: "employee_type",
          key: "employee_type",
          render: (text) => {
            return text
          }
        },
        {
          title: useFormatMessage(`modules.employees.fields.department_id`),
          dataIndex: "department_id",
          key: "department_id",
          render: (text) => {
            return text
          }
        },
        {
          title: useFormatMessage(`modules.reports.onboarding.text.office`),
          dataIndex: "office",
          key: "office",
          render: (text) => {
            return text
          }
        }
      ]

      if (type === "onboarding") {
        column_custom = [
          ...column_custom,
          {
            title: useFormatMessage(`modules.employees.fields.status`),
            dataIndex: "status",
            key: "status",
            render: (text) => {
              return useFormatMessage(text)
            }
          },
          {
            title: useFormatMessage(`modules.employees.fields.join_date`),
            dataIndex: "join_date",
            key: "join_date",
            render: (text) => {
              return convertDate(text)
            }
          }
        ]
      }
      if (type === "offboarding") {
        column_custom = [
          ...column_custom,
          {
            title: useFormatMessage(
              `modules.employees.fields.reason_of_leaving`
            ),
            dataIndex: "reason_of_leaving",
            key: "reason_of_leaving",
            render: (text) => {
              return useFormatMessage(text)
            }
          },
          {
            title: useFormatMessage(
              `modules.employees.fields.last_working_date`
            ),
            dataIndex: "last_working_date",
            key: "last_working_date",
            render: (text) => {
              return convertDate(text)
            }
          }
        ]
      }
    }

    if (type === "employee_turnover_rate") {
      column_custom = [
        {
          title: useFormatMessage(`modules.employees.fields.email`),
          dataIndex: "email",
          key: "email",
          width: 250,
          render: (text) => {
            return text
          }
        },
        {
          title: useFormatMessage(
            `modules.reports.employee_turnover_rate.text.length_of_service`
          ),
          dataIndex: "length_of_service",
          key: "length_of_service",
          width: 230,
          render: (text) => {
            if (_.isEmpty(text)) return "-"

            return _.map(text, (val) => {
              return (
                val["number"] +
                " " +
                useFormatMessage(
                  `modules.reports.employee_turnover_rate.text.${val.text}`
                ) +
                " "
              )
            })
          }
        },
        {
          title: useFormatMessage(`modules.employees.fields.join_date`),
          dataIndex: "join_date",
          key: "join_date",
          width: 130,
          render: (text) => {
            return convertDate(text) || "-"
          }
        },
        {
          title: useFormatMessage(`modules.employees.fields.last_working_date`),
          dataIndex: "last_working_date",
          key: "last_working_date",
          width: 170,
          render: (text) => {
            return convertDate(text)
          }
        },
        {
          title: useFormatMessage(`modules.employees.fields.reason_of_leaving`),
          dataIndex: "reason_of_leaving",
          key: "reason_of_leaving",
          width: 200,
          render: (text) => {
            return useFormatMessage(text)
          }
        },
        {
          title: useFormatMessage(`modules.employees.fields.status`),
          dataIndex: "status",
          key: "status",
          width: 150,
          render: (text) => {
            return useFormatMessage(text)
          }
        },
        {
          title: useFormatMessage(`modules.employees.fields.employee_type`),
          dataIndex: "employee_type",
          key: "employee_type",
          width: 170,
          render: (text) => {
            return text
          }
        },
        {
          title: useFormatMessage(`modules.employees.fields.department_id`),
          dataIndex: "department_id",
          key: "department_id",
          width: 150,
          render: (text) => {
            return text
          }
        },
        {
          title: useFormatMessage(`modules.employees.fields.job_title_id`),
          dataIndex: "job_title_id",
          key: "job_title_id",
          width: 150,
          render: (text) => {
            return text
          }
        }
      ]
    }

    const columns = [...column_default, ...column_custom]

    const dataTable = [
      ..._.map(data, (value) => {
        const data_default = {
          key: value.id,
          employee_name: [value.full_name, value.avatar, value.username],
          employee_id: value.employee_code
        }

        let data_custom = {}
        if (type === "onboarding" || type === "offboarding") {
          data_custom = {
            ...data_custom,
            job_title_id: value.job_title_id?.label || "-",
            employee_type: value.employee_type?.label || "-",
            department_id: value.department_id?.label || "-",
            office: value.office?.label || "-"
          }
          if (type === "onboarding") {
            data_custom = {
              ...data_custom,
              status: value.status?.label || "-",
              join_date: value.join_date
            }
          }
          if (type === "offboarding") {
            data_custom = {
              ...data_custom,
              reason_of_leaving: value.reason_of_leaving?.label || "-",
              last_working_date: value.last_working_date
            }
          }
        }

        if (type === "employee_turnover_rate") {
          data_custom = {
            email: value.email,
            length_of_service: value.length_of_service,
            join_date: value.join_date,
            last_working_date: value.last_working_date,
            reason_of_leaving: value.reason_of_leaving?.label || "-",
            status: value.status?.label || "-",
            employee_type: value.employee_type?.label || "-",
            department_id: value.department_id?.label || "-",
            job_title_id: value.job_title_id?.label || "-"
          }
        }

        const data = { ...data_default, ...data_custom }

        return data
      })
    ]

    return (
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataTable}
        pagination={true}
        scroll={{
          x: 1500
        }}
      />
    )
  }

  const exportExcel = () => {
    setState({ loading_export: true })
    if (type === "onboarding") {
      ReportOnboardingApi.getExportExcel(filters)
        .then((response) => {
          notification.showSuccess({
            text: useFormatMessage("notification.success")
          })
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `Onboarding.xlsx`)
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link)
          setState({ loading_export: false })
        })
        .catch((err) => {
          setState({ loading_export: false })
          console.log(err)
          notification.showError({
            text: useFormatMessage("notification.error")
          })
        })
    }
    if (type === "offboarding") {
      ReportOffboardingApi.getExportExcel(filters)
        .then((response) => {
          notification.showSuccess({
            text: useFormatMessage("notification.success")
          })
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `Offboarding.xlsx`)
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link)
          setState({ loading_export: false })
        })
        .catch((err) => {
          setState({ loading_export: false })
          console.log(err)
          notification.showError({
            text: useFormatMessage("notification.error")
          })
        })
    }
    if (type === "employee_turnover_rate") {
      ReportEmployeeTurnoverRateApi.getExportExcel(filters)
        .then((response) => {
          notification.showSuccess({
            text: useFormatMessage("notification.success")
          })
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `Employee_Turnover_rate.xlsx`)
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link)
          setState({ loading_export: false })
        })
        .catch((err) => {
          setState({ loading_export: false })
          console.log(err)
          notification.showError({
            text: useFormatMessage("notification.error")
          })
        })
    }
  }

  return (
    <Fragment>
      <Row>
        <Col sm="12" className="mb-1">
          <div className="d-flex flex-wrap w-100 ms-auto">
            <div className="d-flex ms-auto">
              <Button.Ripple
                color="secondary"
                className="btn-secondary-edit"
                onClick={() => {
                  exportExcel()
                }}
                disabled={state.loading_export}>
                <span className="align-self-center">
                  {state.loading_export ? (
                    <Spinner size="sm" />
                  ) : (
                    <i className="far fa-download"></i>
                  )}
                </span>
              </Button.Ripple>
            </div>
          </div>
        </Col>
        <Col sm="12">{drawTable()}</Col>
      </Row>
    </Fragment>
  )
}

export default TableOnboarding
