import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Popover, Progress, Table } from "antd"
import { filter, isEmpty, isUndefined, map } from "lodash"
import { Fragment } from "react"
import { Button, Col, Row } from "reactstrap"
import moment from "moment"

const TableAttendance = (props) => {
  const {
    arr_date,
    loading_table,
    data_table,
    pagination,
    setDisabledApproveReject,
    setCheckedEmployeeId,
    toggleModal,
    setStateAction,
    metas_status_options,
    checked_employee_id,
    loadTableAttendance,
    setDisabledButtonHeader,
    type,
    setDisabledConfirmReject,
    setCheckedActionEmployeeApproveReject,
    setCheckedActionEmployeeConfirmRevert,
    setShowInfoEmployeeAttendance,
    setFilterEmployeeAttendance,
    setChosenEmployee
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  const convertDate = (date) => {
    return moment(date).format("DD MMM")
  }

  const minsToStr = (t) => {
    if (isUndefined(t) || t === 0) {
      return "0h"
    }
    const time = Math.floor(t % 60)
    return (
      Math.trunc(t / 60) +
      "h " +
      ("00" + (time === 0 ? "" : time)).slice(-2) +
      "m"
    )
  }

  const handleClickEmployee = (rowData) => {
    setFilterEmployeeAttendance({
      employeeId: rowData.employee.value
    })
    setChosenEmployee(rowData.employee)
    setShowInfoEmployeeAttendance(true)
  }

  const drawTable = () => {
    const column_employee = [
      {
        title: useFormatMessage("modules.team_attendance.table.employee_name"),
        dataIndex: "employee_name",
        key: "employee_name",
        width: 200,
        fixed: "left",
        render: (text, record) => {
          return (
            <span
              className="cell-employee-name"
              onClick={() => handleClickEmployee(record)}>
              {text[0]}
            </span>
          )
        }
      },
      {
        title: useFormatMessage("modules.team_attendance.table.emp_type"),
        dataIndex: "emp_type",
        key: "emp_type",
        width: 130,
        fixed: "left",
        render: (text, record) => {
          return text
        }
      },
      {
        title: useFormatMessage("modules.team_attendance.table.paid_time"),
        dataIndex: "paid_time",
        key: "paid_time",
        width: 230,
        fixed: "left",
        render: (text, record) => {
          const paid_time = isUndefined(text[0]) ? 0 : text[0]
          const time_work = isUndefined(text[1]) ? 0 : text[1]
          let percent = 0
          if (time_work > 0) {
            percent = (paid_time / time_work) * 100
          }
          return (
            <>
              <Progress percent={percent} showInfo={false} />
              <span className="progress-span">
                {minsToStr(text[0])} / {minsToStr(text[1])}
              </span>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.team_attendance.table.overtime"),
        dataIndex: "overtime",
        key: "overtime",
        width: 130,
        fixed: "left",
        render: (text, record) => {
          return <>{minsToStr(text)}</>
        }
      },
      {
        title: useFormatMessage("modules.team_attendance.table.status"),
        dataIndex: "status",
        key: "status",
        width: 150,
        fixed: "left",
        render: (text, record) => {
          return map(
            filter(text, (value, status) => {
              return (
                value.count > 0 &&
                value.label !== "confirm" &&
                value.label !== "total"
              )
            }),
            (val, status) => {
              const color = metas_status_options[val.label]
                ? metas_status_options[val.label]
                : metas_status_options["all_status"]
              return (
                <Fragment key={status}>
                  <div
                    className="select-status"
                    style={{ backgroundColor: color }}></div>
                  <span className="count-status">{val.count}</span>
                </Fragment>
              )
            }
          )
        }
      }
    ]

    const column_date = [
      ...map(arr_date, (value, index) => {
        return {
          title: convertDate(value),
          dataIndex: index,
          key: index,
          width: 130,
          render: (text, record) => {
            if (text) {
              // check false working day
              if (
                text.working_day === false ||
                text.holiday === true ||
                text.leave === true
              ) {
                return <>{minsToStr(text.paid_time)}</>
              }
              let color = metas_status_options[text.status]
                ? metas_status_options[text.status]
                : metas_status_options["all_status"]

              if (!text.status) {
                color = metas_status_options["pending"]
              }
              return (
                <>
                  <span style={{ color: color }}>
                    {minsToStr(text.paid_time)}
                  </span>
                </>
              )
            }
            return <>0h</>
          }
        }
      })
    ]

    const popover_action = (params) => {
      const employee_id = params[0]
      const employee_detail = params[2]
      const status = params[1]
      const disabled_approve_reject = status.pending.count === 0
      const disabled_confirm_revert =
        (status.approved.count === 0 && status.rejected.count === 0) ||
        status.total.count === status.confirm.count
      return (
        <>
          {type === "employee" && (
            <Button.Ripple
              color="flat-warning"
              onClick={() => {
                toggleModal()
                setStateAction({
                  action_employee_id: employee_id,
                  action_status: "revert",
                  action_status_ed: "reverted",
                  action_employee_detail: employee_detail,
                  submit_type: "record"
                })
              }}
              className="popover-btn-cancel"
              disabled={disabled_confirm_revert}>
              <i className="fal fa-history table-icon"></i>
              {useFormatMessage("modules.employee_attendance.button.revert")}
            </Button.Ripple>
          )}

          <Button.Ripple
            color="flat-primary"
            onClick={() => {
              toggleModal()
              setStateAction({
                action_employee_id: employee_id,
                action_status: "approve",
                action_status_ed: "approved",
                action_employee_detail: employee_detail,
                submit_type: "record"
              })
            }}
            className="popover-btn-cancel"
            disabled={disabled_approve_reject}>
            <i className="fal fa-check table-icon"></i>
            {useFormatMessage("modules.team_attendance.button.approve")}
          </Button.Ripple>

          {type === "employee" && (
            <Button.Ripple
              color="flat-primary"
              onClick={() => {
                toggleModal()
                setStateAction({
                  action_employee_id: employee_id,
                  action_status: "confirm",
                  action_status_ed: "confirmed",
                  action_employee_detail: employee_detail,
                  submit_type: "record"
                })
              }}
              className="popover-btn-cancel"
              disabled={disabled_confirm_revert}>
              <i className="fal fa-check table-icon"></i>
              {useFormatMessage("modules.employee_attendance.button.confirm")}
            </Button.Ripple>
          )}
          <hr />
          <Button.Ripple
            color="flat-danger"
            onClick={() => {
              toggleModal()
              setStateAction({
                action_employee_id: employee_id,
                action_status: "reject",
                action_status_ed: "rejected",
                action_employee_detail: employee_detail,
                submit_type: "record"
              })
            }}
            className="popover-btn-cancel"
            disabled={disabled_approve_reject}>
            <i className="fal fa-times table-icon"></i>
            {useFormatMessage("modules.team_attendance.button.reject")}
          </Button.Ripple>
        </>
      )
    }

    const column_action = [
      {
        title: "",
        dataIndex: "action",
        key: "action",
        width: 60,
        fixed: "right",
        render: (text, record) => {
          return (
            <Fragment>
              <Popover
                placement="bottom"
                title={null}
                content={popover_action(text)}
                trigger="click"
                overlayClassName="attendance-popover">
                <Button.Ripple
                  color="secondary"
                  className="btn-table-action btn-secondary-table"
                  style={{ marginLeft: "5px", float: "right" }}>
                  <i className="far fa-ellipsis-h"></i>
                </Button.Ripple>
              </Popover>
            </Fragment>
          )
        }
      }
    ]

    const columns = [...column_employee, ...column_date, ...column_action]

    const data = [
      ...map(data_table, (value, key) => {
        const data_employee = {
          key: key,
          employee_name: [value.full_name, key],
          emp_type: value.employee_type,
          paid_time: [value.paid_time, value.time_work],
          overtime: value.overtime,
          status: value.status
        }
        const data_date = map(value.date, (val, index) => {
          return val
        })
        const data_action = {
          action: [key, value.status, value.employee],
          employee: value.employee
        }

        const data = { ...data_employee, ...data_date, ...data_action }

        return data
      })
    ]

    const rowSelection = {
      selectedRowKeys: checked_employee_id,
      onChange: (newSelectedRowKeys, selectedRows) => {
        setCheckedEmployeeId(newSelectedRowKeys)
        if (!isEmpty(newSelectedRowKeys)) {
          const id_approve_reject = []
          const detail_approve_reject = []
          const id_confirm_revert = []
          const detail_confirm_revert = []
          let disabled_approve_reject = true
          let disabled_confirm_revert = true
          for (let index = 0; index < selectedRows.length; index++) {
            const data_row = selectedRows[index]
            if (data_row.status.pending.count > 0) {
              id_approve_reject.push(data_row.key)
              detail_approve_reject.push(data_row.employee)

              disabled_approve_reject = false
            }

            if (
              (data_row.status.approved.count > 0 ||
                data_row.status.rejected.count > 0) &&
              data_row.status.total.count !== data_row.status.confirm.count
            ) {
              id_confirm_revert.push(data_row.key)
              detail_confirm_revert.push(data_row.employee)

              disabled_confirm_revert = false
            }
          }
          setCheckedActionEmployeeApproveReject(
            id_approve_reject,
            detail_approve_reject
          )
          setCheckedActionEmployeeConfirmRevert(
            id_confirm_revert,
            detail_confirm_revert
          )
          setDisabledApproveReject(disabled_approve_reject)
          setDisabledConfirmReject(disabled_confirm_revert)
        } else {
          setDisabledApproveReject(true)
          setDisabledConfirmReject(true)
          setCheckedActionEmployeeApproveReject([], [])
          setCheckedActionEmployeeConfirmRevert([], [])
        }
      },
      getCheckboxProps: (record) => {
        const disabled_approve_reject = record.status.pending.count === 0
        const disabled_confirm_revert =
          (record.status.approved.count === 0 &&
            record.status.rejected.count === 0) ||
          record.status.total.count === record.status.confirm.count
        let disabled = {
          disabled: disabled_approve_reject && disabled_confirm_revert
        }
        if (type === "team") {
          disabled = {
            disabled: disabled_approve_reject
          }
        }
        return disabled
      }
    }

    const changeTable = (pagination, filters, sorter) => {
      setDisabledButtonHeader()
      loadTableAttendance({ pagination: pagination })
    }

    return (
      <Table
        loading={loading_table}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        rowSelection={{
          type: "checkbox",
          ...rowSelection
        }}
        scroll={{
          x: 1500
        }}
        onChange={changeTable}
      />
    )
  }

  return (
    <Fragment>
      <Row className="team-attendance">
        <Col sm={12} style={{ overflow: "auto" }}>
          {drawTable()}
        </Col>
      </Row>
    </Fragment>
  )
}

export default TableAttendance
