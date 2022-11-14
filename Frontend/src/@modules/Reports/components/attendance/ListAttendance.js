// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { formatNumberToDisplay } from "../../common/common"
import PerfectScrollbar from "react-perfect-scrollbar"
// ** Styles
import { Row, Col, Button } from "reactstrap"
import { Table, Tag } from "antd"
import { ChevronRight, ChevronDown } from "react-feather"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import TimeOffRequestStatus from "./TimeOffRequestStatus"

const ListAttendance = (props) => {
  const {
    // ** props
    attendanceData
    // ** methods
  } = props

  // ** render
  const columns = [
    {
      title: useFormatMessage(
        "modules.reports.attendance.text.table.employee_name"
      ),
      key: "name",
      render: (_, record) => {
        return (
          <Fragment>
            <div>
              <Avatar
                src={record.avatar}
                imgHeight="30"
                imgWidth="30"
                className="me-50"
              />
              <span>{record.full_name}</span>
            </div>
          </Fragment>
        )
      }
    },
    {
      title: useFormatMessage(
        "modules.reports.attendance.text.table.department"
      ),
      dataIndex: "department",
      key: "department"
    },
    {
      title: useFormatMessage(
        "modules.reports.attendance.text.table.employee_type"
      ),
      dataIndex: "employee_type",
      key: "employee_type"
    },
    {
      title: useFormatMessage(
        "modules.reports.attendance.text.table.paid_day_off"
      ),
      key: "paid_day_off",
      render: (_, record) => {
        return formatNumberToDisplay(record.paid_day_off)
      }
    },
    {
      title: useFormatMessage(
        "modules.reports.attendance.text.table.unpaid_day_off"
      ),
      key: "unpaid_day_off",
      render: (_, record) => {
        return formatNumberToDisplay(record.unpaid_day_off)
      }
    },
    {
      title: useFormatMessage(
        "modules.reports.attendance.text.table.working_day"
      ),
      key: "working_day",
      render: (_, record) => {
        return formatNumberToDisplay(record.working_day)
      }
    },
    {
      title: useFormatMessage(
        "modules.reports.attendance.text.table.actual_working_day"
      ),
      key: "actual_working_day",
      render: (_, record) => {
        return formatNumberToDisplay(record.working_day - record.unpaid_day_off)
      }
    }
  ]

  const renderTimeOffRequestStatus = (status) => {
    return <TimeOffRequestStatus status={status} />
  }

  const renderExpandRecord = (timeOffData) => {
    return (
      <Fragment>
        {timeOffData.map((item) => {
          return (
            <Row
              key={`time-off-item-${item.id}`}
              className="ps-5 pb-1 pt-1 time-off-item">
              <Col sm={2}>
                {item.date_from} - {item.date_to}
              </Col>
              <Col sm={1}>{item.type_name}</Col>
              <Col sm={2}>{formatNumberToDisplay(item.time_off_total_day)}</Col>
              <Col sm={4}>{renderTimeOffRequestStatus(item.status)}</Col>
            </Row>
          )
        })}
      </Fragment>
    )
  }

  const renderTable = () => {
    return (
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div className="expand-container-time-off">
                <PerfectScrollbar
                  options={{
                    suppressScrollX: true,
                    useBothWheelAxes: false,
                    wheelPropagation: false
                  }}>
                  {renderExpandRecord(record.time_off)}
                </PerfectScrollbar>
              </div>
            )
          },
          expandIcon: ({ expanded, onExpand, record }) => {
            if (record.time_off.length > 0) {
              return expanded ? (
                <Button.Ripple
                  className="btn-icon"
                  size="sm"
                  color="flat-primary"
                  onClick={(e) => onExpand(record, e)}>
                  <ChevronDown size={15} />
                </Button.Ripple>
              ) : (
                <Button.Ripple
                  className="btn-icon"
                  size="sm"
                  color="flat-primary"
                  onClick={(e) => onExpand(record, e)}>
                  <ChevronRight size={15} />
                </Button.Ripple>
              )
            }

            return ""
          },
          rowExpandable: (record) => record.time_off.length > 0
        }}
        dataSource={attendanceData}
        pagination={false}
        rowKey="id"
        className="table-attendance-report"
      />
    )
  }

  return <Fragment>{renderTable()}</Fragment>
}

export default ListAttendance
