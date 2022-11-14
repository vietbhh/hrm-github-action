import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Table, Tooltip } from "antd"
import classNames from "classnames"
import { map } from "lodash"
import { Fragment, useEffect } from "react"
import { Col, Row } from "reactstrap"
import { convertNumberCurrency } from "../common/common"
import ModalPayroll from "./modals/ModalPayroll"

const TablePayroll = (props) => {
  const {
    loading_table,
    data_table,
    data_total,
    total_row,
    date_from,
    date_to,
    payroll,
    loadTablePayroll,
    closed,
    request_type
  } = props
  const [state, setState] = useMergedState({
    modal: false,
    modal_title_avatar: "",
    modal_title_name: "",
    employee_id: 0,
    edit_one_off: false,
    payroll: payroll,
    date_from: date_from,
    date_to: date_to,
    closed: closed
  })

  useEffect(() => {
    setState({
      payroll: payroll,
      closed: closed
    })
  }, [payroll, closed])

  const setEditOneOff = (props) => {
    setState({ edit_one_off: props })
  }

  const toggleAddModal = () => {
    setState({ modal: !state.modal })

    if (state.edit_one_off === true) {
      loadTablePayroll()
    }
  }

  const titleModal = () => {
    return (
      <>
        {request_type === undefined && (
          <Avatar className="img" size="sm" src={state.modal_title_avatar} />
        )}

        {state.modal_title_name}
      </>
    )
  }

  const renderNumber = (num) => {
    return <Tooltip title={num}>{num}</Tooltip>
  }

  const drawTable = () => {
    const titleTotalComp = () => {
      return (
        <>
          {useFormatMessage("modules.payrolls.fields.total_comp")}{" "}
          <Tooltip
            overlayClassName="employee-payroll-icon-tooltip"
            title={useFormatMessage(
              "modules.payrolls.fields.total_comp_title"
            )}>
            <i className="fal fa-info-circle icon-title"></i>
          </Tooltip>
        </>
      )
    }

    const columns = [
      {
        title: useFormatMessage(
          `modules.payrolls.fields.${
            request_type === "profile" ? "period" : "employee_name"
          }`
        ),
        dataIndex: "employee_name",
        key: "employee_name",
        width: 450,
        render: (text, record) => {
          return (
            <>
              <div
                className="payroll-table-cell-div"
                onClick={() => {
                  if (request_type === "profile") {
                    setState({
                      modal_title_avatar: text[1],
                      modal_title_name: text[0],
                      employee_id: text[5],
                      payroll: text[4],
                      closed: text[6],
                      edit_one_off: false,
                      modal: true
                    })
                  } else {
                    setState({
                      modal_title_avatar: text[1],
                      modal_title_name: text[0],
                      employee_id: text[3],
                      edit_one_off: false,
                      modal: true
                    })
                  }
                }}>
                {request_type === "profile" ? (
                  text[0]
                ) : (
                  <>
                    <Avatar className="img" size="sm" src={text[1]} />
                    {text[0]}
                    {text[2] === false && (
                      <div className="need-setup">
                        {useFormatMessage("modules.payrolls.need_setup")}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )
        }
      },
      {
        title: titleTotalComp(),
        dataIndex: "total_comp",
        key: "total_comp",
        width: 130,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll td-bg", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num))}
              </div>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.salary"),
        dataIndex: "salary",
        key: "salary",
        width: 100,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num))}
              </div>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.actual"),
        dataIndex: "actual",
        key: "actual",
        width: 100,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num))}
              </div>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.recurring"),
        dataIndex: "recurring",
        key: "recurring",
        width: 100,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num))}
              </div>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.one_off"),
        dataIndex: "one_off",
        key: "one_off",
        width: 100,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num))}
              </div>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.offset"),
        dataIndex: "offset",
        key: "offset",
        width: 100,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num))}
              </div>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.ot"),
        dataIndex: "ot",
        key: "ot",
        width: 100,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num))}
              </div>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.off_cycle"),
        dataIndex: "off_cycle",
        key: "off_cycle",
        width: 100,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num))}
              </div>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.unpaid"),
        dataIndex: "unpaid",
        key: "unpaid",
        width: 100,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num, true))}
              </div>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.deficit"),
        dataIndex: "deficit",
        key: "deficit",
        width: 100,
        render: (text) => {
          const num = text[0]
          const is_edit = text[1]
          return (
            <>
              <div
                className={classNames("td-payroll", {
                  "td-color": is_edit === true
                })}>
                {renderNumber(convertNumberCurrency(num, true))}
              </div>
            </>
          )
        }
      }
    ]

    const data = [
      ...map(data_table, (value, key) => {
        return {
          key: key,
          employee_name: [
            value.employee_name,
            value.avatar,
            value.is_salary,
            key,
            value.payroll_id,
            value.id,
            value.closed
          ],
          total_comp: [value.total_comp, value.is_edit],
          salary: [value.salary, value.is_edit_salary],
          actual: [value.actual, value.is_edit_actual],
          recurring: [value.recurring, value.is_edit_recurring],
          one_off: [value.one_off, value.is_edit_one_off],
          offset: [value.offset, value.is_edit_offset],
          ot: [value.ot, value.is_edit_ot],
          off_cycle: [value.off_cycle, value.is_edit_cycle],
          unpaid: [value.unpaid, value.is_edit_unpaid],
          deficit: [value.deficit, value.is_edit_deficit]
        }
      })
    ]

    return (
      <Table
        className="table-payroll"
        loading={loading_table}
        columns={columns}
        dataSource={data}
        pagination={false}
        summary={(pageData) => {
          if (request_type !== "profile") {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <span style={{ fontWeight: "bold" }}>
                      {useFormatMessage("modules.payrolls.modal.total")}
                    </span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <div className="td-payroll td-bg">
                      {renderNumber(
                        convertNumberCurrency(data_total.total_comp)
                      )}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <div className="td-payroll">
                      {renderNumber(convertNumberCurrency(data_total.salary))}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <div className="td-payroll">
                      {renderNumber(convertNumberCurrency(data_total.actual))}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <div className="td-payroll">
                      {renderNumber(
                        convertNumberCurrency(data_total.recurring)
                      )}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <div className="td-payroll">
                      {renderNumber(convertNumberCurrency(data_total.one_off))}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>
                    <div className="td-payroll">
                      {renderNumber(convertNumberCurrency(data_total.offset))}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={7}>
                    <div className="td-payroll">
                      {renderNumber(convertNumberCurrency(data_total.ot))}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={8}>
                    <div className="td-payroll">
                      {renderNumber(
                        convertNumberCurrency(data_total.off_cycle)
                      )}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={9}>
                    <div className="td-payroll">
                      {renderNumber(
                        convertNumberCurrency(data_total.unpaid, true)
                      )}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={9}>
                    <div className="td-payroll">
                      {renderNumber(
                        convertNumberCurrency(data_total.deficit, true)
                      )}
                    </div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            )
          }
        }}
      />
    )
  }

  return (
    <Fragment>
      <Row className="employee-payroll">
        <Col sm={12} style={{ overflow: "auto" }}>
          {drawTable()}
        </Col>
        <Col sm={12} className="footer-results">
          {total_row} {useFormatMessage("modules.payrolls.results")}
        </Col>
      </Row>

      <ModalPayroll
        titleModal={titleModal}
        toggleAddModal={toggleAddModal}
        modal={state.modal}
        date_from={date_from}
        date_to={date_to}
        employee_id={state.employee_id}
        payroll={state.payroll}
        setEditOneOff={setEditOneOff}
        closed={state.closed}
        request_type={request_type}
      />
    </Fragment>
  )
}

export default TablePayroll
