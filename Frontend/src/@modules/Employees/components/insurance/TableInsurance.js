import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import { Table, Tooltip } from "antd"
import { map } from "lodash"
import { Link } from "react-router-dom"
import { Col, Row } from "reactstrap"
import { convertNumberCurrency } from "../../../Payrolls/common/common"

const TableInsurance = (props) => {
  const { loading_table, data_table, request_type, loadTable, pagination } =
    props

  const renderNumber = (num) => {
    return <Tooltip title={num}>{num}</Tooltip>
  }

  const drawTable = () => {
    const columns = [
      {
        title: useFormatMessage(
          `modules.insurance.fields.${
            request_type === "profile" ? "period" : "employee_name"
          }`
        ),
        dataIndex: "employee_name",
        key: "employee_name",
        render: (text, record) => {
          return (
            <>
              {request_type === "profile" ? (
                record.period
              ) : (
                <Link
                  to={`/employees/u/${text[2]}/insurance`}
                  style={{ color: "#32434f" }}>
                  <div className="payroll-table-cell-div">
                    <Avatar className="img" size="sm" src={text[1]} />
                    {text[0]}
                  </div>
                </Link>
              )}
            </>
          )
        }
      },
      {
        title: useFormatMessage(`modules.insurance.fields.insurance_salary`),
        dataIndex: "insurance_salary",
        key: "insurance_salary",
        render: (text, record) => {
          return renderNumber(convertNumberCurrency(text))
        }
      },
      {
        title: useFormatMessage(`modules.insurance.fields.employee_pays`),
        dataIndex: "employee_pays",
        key: "employee_pays",
        render: (text, record) => {
          return renderNumber(convertNumberCurrency(text))
        }
      },
      {
        title: useFormatMessage(`modules.insurance.fields.company_pays`),
        dataIndex: "company_pays",
        key: "company_pays",
        render: (text, record) => {
          return renderNumber(convertNumberCurrency(text))
        }
      },
      {
        title: useFormatMessage(`modules.insurance.fields.insurance_status`),
        dataIndex: "insurance_status",
        key: "insurance_status",
        render: (text, record) => {
          return (
            <>
              {(text === 1 || text === "1") &&
                useFormatMessage("modules.insurance.fields.yes")}
              {(text === 0 || text === "0") &&
                useFormatMessage("modules.insurance.fields.no")}
            </>
          )
        }
      }
    ]

    const data = [
      ...map(data_table, (value, key) => {
        return {
          key: key,
          employee_name: [value.full_name, value.avatar, value.username],
          insurance_salary: value.insurance_salary,
          employee_pays: value.employee_pays,
          company_pays: value.company_pays,
          insurance_status: value.insurance_status,
          period: value.period
        }
      })
    ]

    const changeTable = (pagination) => {
      loadTable({ pagination: pagination })
    }

    return (
      <Table
        className="table-payroll"
        loading={loading_table}
        columns={columns}
        dataSource={data}
        onChange={changeTable}
        pagination={_.isUndefined(pagination) ? false : pagination}
      />
    )
  }

  return (
    <Row className="employee-payroll">
      <Col sm={12} style={{ overflow: "auto" }}>
        {drawTable()}
      </Col>
    </Row>
  )
}

export default TableInsurance
