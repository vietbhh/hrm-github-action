import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { PayrollApi } from "@modules/Payrolls/common/api"
import {
  convertDate,
  convertNumberCurrency,
  minsToStr
} from "@modules/Payrolls/common/common"
import { Collapse, Drawer } from "antd"
import classNames from "classnames"
import { Fragment, useEffect } from "react"
import { Link } from "react-router-dom"
import { Col, Row } from "reactstrap"
import Attendance from "./table/Attendance"
import BankInfo from "./table/BankInfo"
import CarryOverOfOvertime from "./table/CarryOverOfOvertime"
import Deficit from "./table/Deficit"
import Dependents from "./table/Dependents"
import OffCycle from "./table/OffCycle"
import Offset from "./table/Offset"
import OneOff from "./table/OneOff"
import Overtime from "./table/Overtime"
import Recurring from "./table/Recurring"
import TimeOff from "./table/TimeOff"
const { Panel } = Collapse

const ModalPayroll = (props) => {
  const {
    titleModal,
    toggleAddModal,
    modal,
    date_from,
    date_to,
    employee_id,
    payroll,
    setEditOneOff,
    closed,
    request_type
  } = props
  const [state, setState] = useMergedState({
    loading: true,
    data_employee: [],
    data_contracts: [],
    total_comp: 0,
    salary: 0,
    recurring: 0,
    data_recurring: [],
    one_off: 0,
    data_one_off: [],
    count_one_off: 0,
    offset: 0,
    data_offset: [],
    time_off: 0,
    data_time_off: [],
    overtime: 0,
    data_overtime: [],
    deficit: 0,
    data_deficit: [],
    attendance: 0,
    data_attendance: [],
    dependents: 0,
    data_dependents: [],
    data_carry_over_of_overtime: [],
    off_cycle: 0,
    data_off_cycle: []
  })

  const loadData = () => {
    setState({ loading: true })
    const params = {
      payroll: payroll,
      employee_id: employee_id,
      date_from: date_from,
      date_to: date_to,
      closed: closed,
      request_type: request_type
    }

    PayrollApi.getPayrollDetail(params)
      .then((res) => {
        setState({
          loading: false,
          data_employee: res.data.data_employee,
          data_contracts: res.data.data_contracts,
          total_comp: res.data.total_comp,
          salary: res.data.salary,
          recurring: res.data.recurring,
          data_recurring: res.data.data_recurring,
          one_off: res.data.one_off,
          data_one_off: res.data.data_one_off,
          count_one_off: res.data.count_one_off,
          offset: res.data.offset,
          data_offset: res.data.data_offset,
          time_off: res.data.time_off,
          data_time_off: res.data.data_time_off,
          overtime: res.data.overtime,
          data_overtime: res.data.data_overtime,
          deficit: res.data.deficit,
          data_deficit: res.data.data_deficit,
          attendance: res.data.attendance,
          data_attendance: res.data.data_attendance,
          dependents: res.data.dependents,
          data_dependents: res.data.data_dependents,
          data_carry_over_of_overtime: res.data.data_carry_over_of_overtime,
          off_cycle: res.data.off_cycle,
          data_off_cycle: res.data.data_off_cycle
        })
      })
      .catch((err) => {
        setState({ loading: false })
      })
  }

  useEffect(() => {
    if (modal) {
      loadData()
    }
  }, [modal])

  const renderBodyModal = () => {
    return (
      <Fragment>
        <Row>
          <Col sm={6}>
            <Row>
              <Col sm={5} className="mb-7">
                {useFormatMessage("modules.payrolls.modal.employee_status")}
              </Col>
              <Col sm={6} className="mb-7 color-black">
                {state.data_employee && state.data_employee.status
                  ? useFormatMessage(state.data_employee.status.label)
                  : "-"}
              </Col>
            </Row>
            <Row>
              <Col sm={5} className="mb-7">
                {useFormatMessage("modules.payrolls.modal.employee_type")}
              </Col>
              <Col sm={6} className="mb-7 color-black">
                {state.data_employee && state.data_employee.employee_type
                  ? state.data_employee.employee_type.label
                  : "-"}
              </Col>
            </Row>
            <Row>
              <Col sm={5} className="mb-7">
                {useFormatMessage("modules.payrolls.modal.contract_end_date")}
              </Col>
              <Col sm={6} className="mb-7 color-black">
                {state.data_contracts && state.data_contracts.contract_date_end
                  ? convertDate(state.data_contracts.contract_date_end)
                  : "-"}
              </Col>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              <Col sm={5} className="mb-7">
                {useFormatMessage("modules.payrolls.modal.job_title")}
              </Col>
              <Col sm={6} className="mb-7 color-black">
                {state.data_employee && state.data_employee.job_title_id
                  ? state.data_employee.job_title_id.label
                  : "-"}
              </Col>
            </Row>
            <Row>
              <Col sm={5} className="mb-7">
                {useFormatMessage("modules.payrolls.modal.join_date")}
              </Col>
              <Col sm={6} className="mb-7 color-black">
                {state.data_employee && state.data_employee.join_date
                  ? convertDate(state.data_employee.join_date)
                  : "-"}
              </Col>
            </Row>
            <Row>
              <Col sm={5} className="mb-7">
                {useFormatMessage("modules.payrolls.modal.last_working_date")}
              </Col>
              <Col sm={6} className="mb-7 color-black">
                {state.data_employee && state.data_employee.last_working_date
                  ? convertDate(state.data_employee.last_working_date)
                  : "-"}
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    )
  }

  const renderTotalComp = () => {
    return (
      <Row className="total-comp">
        <Col sm={6}>
          {useFormatMessage("modules.payrolls.fields.total_compensation")}
        </Col>
        <Col sm={6} className="text-end">
          {convertNumberCurrency(state.total_comp)}
        </Col>
      </Row>
    )
  }

  const renderSalary = () => {
    return (
      <Row className="salary">
        <Col sm={6}>
          {useFormatMessage("modules.payrolls.fields.salary")}
          <Link
            to={`/employees/u/${state.data_employee.username}/payroll`}
            target="_blank">
            <i className="fal fa-external-link-alt icon-link"></i>
          </Link>
        </Col>
        <Col sm={6} className="text-end">
          {convertNumberCurrency(state.salary)}
        </Col>
      </Row>
    )
  }

  const setOneOff = (props) => {
    setState({ one_off: props })
  }

  const setCountOneOff = (props) => {
    setState({ count_one_off: props })
  }

  const setOvertime = (props) => {
    setState({ overtime: props })
  }

  const setOffCycle = (props) => {
    setState({ off_cycle: props })
  }

  const setOffset = (props) => {
    setState({ offset: props })
  }

  const renderCollapse = () => {
    const header = (title, amount, link = "") => {
      return (
        <>
          <span>{title}</span>
          {link !== "" && (
            <Link to={link} target="_blank">
              <i className="fal fa-external-link-alt icon-link"></i>
            </Link>
          )}
          <span className="ms-auto">{amount}</span>
        </>
      )
    }
    return (
      <Row>
        <Col sm={12}>
          <Collapse
            className="employee-payroll-collapse"
            defaultActiveKey={["recurring"]}
            ghost>
            <Panel
              header={header(
                useFormatMessage("modules.payrolls.fields.recurring"),
                convertNumberCurrency(state.recurring),
                `/employees/u/${state.data_employee.username}/payroll`
              )}
              key="recurring">
              <Recurring
                data={state.data_recurring}
                total_amount={state.recurring}
              />
            </Panel>
            <Panel
              header={header(
                useFormatMessage("modules.payrolls.fields.one_off"),
                convertNumberCurrency(state.one_off)
              )}
              key="one_off">
              <OneOff
                data={state.data_one_off}
                one_off={state.one_off}
                setOneOff={setOneOff}
                count_one_off={state.count_one_off}
                setCountOneOff={setCountOneOff}
                payroll={payroll}
                employee_id={employee_id}
                setEditOneOff={setEditOneOff}
                closed={closed}
                request_type={request_type}
              />
            </Panel>
            <Panel
              header={header(
                useFormatMessage("modules.payrolls.fields.offset"),
                convertNumberCurrency(state.offset)
              )}
              key="offset">
              <Offset
                data={state.data_offset}
                offset={state.offset}
                setOffset={setOffset}
                payroll={payroll}
                employee_id={employee_id}
                setEditOneOff={setEditOneOff}
                closed={closed}
                request_type={request_type}
              />
            </Panel>
            <Panel
              header={header(
                useFormatMessage("modules.payrolls.fields.time_off"),
                convertNumberCurrency(state.time_off, true),
                "/time-off/employee-time-off"
              )}
              key="time_off">
              <TimeOff
                data={state.data_time_off}
                total_amount={state.time_off}
              />
            </Panel>
            <Panel
              header={header(
                useFormatMessage("modules.payrolls.fields.overtime"),
                convertNumberCurrency(state.overtime),
                "/attendances/employee-attendance"
              )}
              key="overtime">
              <Overtime
                data={state.data_overtime}
                overtime={state.overtime}
                setOvertime={setOvertime}
                payroll={payroll}
                employee_id={employee_id}
                setEditOneOff={setEditOneOff}
                closed={closed}
                request_type={request_type}
              />
            </Panel>
            <Panel
              header={header(
                useFormatMessage("modules.payrolls.fields.deficit"),
                convertNumberCurrency(state.deficit, true),
                "/attendances/employee-attendance"
              )}
              key="deficit">
              <Deficit data={state.data_deficit} />
            </Panel>
            <Panel
              header={header(
                useFormatMessage("modules.payrolls.fields.attendance"),
                minsToStr(state.attendance),
                "/attendances/employee-attendance"
              )}
              key="attendance">
              <Attendance data={state.data_attendance} />
            </Panel>
            <Panel
              header={header(
                useFormatMessage(
                  "modules.payrolls.fields.carry_over_of_overtime"
                ),
                ""
              )}
              key="carry_over_of_overtime">
              <CarryOverOfOvertime data={state.data_carry_over_of_overtime} />
            </Panel>
            <Panel
              header={header(
                useFormatMessage("modules.payrolls.fields.off_cycle"),
                convertNumberCurrency(state.off_cycle)
              )}
              key="off_cycle">
              <OffCycle
                data={state.data_off_cycle}
                off_cycle={state.off_cycle}
                setOffCycle={setOffCycle}
                payroll={payroll}
                employee_id={employee_id}
                setEditOneOff={setEditOneOff}
                closed={closed}
                request_type={request_type}
              />
            </Panel>
            <Panel
              header={header(
                useFormatMessage("modules.payrolls.fields.dependents"),
                `${state.dependents} ${useFormatMessage(
                  "modules.payrolls.fields.dependents2"
                )}`,
                `/employees/u/${state.data_employee.username}/dependents`
              )}
              key="dependents">
              <Dependents data={state.data_dependents} />
            </Panel>
            <Panel
              style={{ paddingBottom: "40px" }}
              header={header(
                useFormatMessage("modules.payrolls.fields.bank_info"),
                "",
                `/employees/u/${state.data_employee.username}`
              )}
              key="bank_info">
              <BankInfo data_employee={state.data_employee} />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    )
  }

  return (
    <Drawer
      title={titleModal()}
      placement="right"
      onClose={toggleAddModal}
      visible={modal}
      width={850}
      className="employee-payroll-modal">
      <div className="ant-spin-nested-loading">
        {state.loading && (
          <div>
            <div
              className="ant-spin ant-spin-spinning"
              aria-live="polite"
              aria-busy="true"
              style={{ height: "225px" }}>
              <span className="ant-spin-dot ant-spin-dot-spin">
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
              </span>
            </div>
          </div>
        )}

        <div
          className={classNames({
            "ant-spin-blur": state.loading
          })}>
          {!state.loading && (
            <Fragment>
              {renderBodyModal()}
              {renderTotalComp()}
              {renderSalary()}
              {renderCollapse()}
            </Fragment>
          )}
        </div>
      </div>
    </Drawer>
  )
}

export default ModalPayroll
