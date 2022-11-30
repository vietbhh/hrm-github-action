import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpSelect } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import {
  addComma,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { employeesApi } from "@modules/Employees/common/api"
import TablePayroll from "@modules/Payrolls/components/TablePayroll"
import { Table } from "antd"
import moment from "moment"
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import AddEmployeeRecurringModal from "../modals/AddEmployeeRecurringModal"
import AddEmployeeSalaryModal from "../modals/AddEmployeeSalaryModal"
import EditPaycycleModal from "../modals/EditPayCycleModal"
import EmployeeRecurringEditModal from "../modals/EmployeeRecurringEditModal"
import CardRecurringEmployees from "./CardRecurringEmployees"
import EmployeeBasicInformationForm from "./EmployeeBasicInformationForm"
import SetupPayroll from "./SetupPayroll"
import { isEmpty } from "lodash-es"
const today = new Date()
const year = today.getFullYear()
const recordYear = [
  {
    value: year - 1,
    label: year - 1
  },
  {
    value: year,
    label: year
  },
  {
    value: year + 1,
    label: year + 1
  }
]

const TabPayRoll = (props) => {
  const { employeeData } = props
  const modules = useSelector((state) => state.app.modules)
  const employeesModule = modules.employees
  const settings = useSelector((state) => state.auth.settings)
  const canCreate = settings.create_new_pay_cycle
  const [state, setState] = useMergedState({
    dataRecurring: [],
    dataListRecurring: [],
    dataSalary: [],
    effective_end_salary: "",
    isEdit: false,
    updateDataRecurring: {},
    updateDataSalary: {},
    loading: true,
    loadingRecurring: true,
    recurringModal: false,
    recurringEditModal: false,
    salaryModal: false,
    isSetupPayroll: false,
    dataPayroll: [],
    payrollTotalRow: 0,
    loadingPayroll: false,
    yearPayroll: year,
    paycycleModal: false
  })
  const loadData = (props) => {
    employeesApi.getPayroll(employeeData.id).then((res) => {
      setState({
        dataRecurring: res.data.employees_recurring,
        dataSalary: res.data.employees_salary,
        loading: false,
        dataPayroll: res.data?.employees_payroll?.data_payroll,
        payrollTotalRow: res.data.employees_payroll.total_row,
        effective_end_salary: res.data.effective_end_salary
      })
    })
  }
  const loadDataRecurring = (props) => {
    defaultModuleApi.getList("recurring").then((res) => {
      setState({
        loading: false,
        loadingRecurring: false,
        dataListRecurring: res.data.results
      })
    })
  }
  const renderRecurring = () => {
    if (!state.dataRecurring.length) {
      return (
        <Col sm={12}>
          <EmptyContent />
        </Col>
      )
    }
    return state.dataRecurring?.map((item) => {
      return (
        <Col sm={4} key={item.id}>
          <CardRecurringEmployees
            item={item}
            handleDelete={handleDeleteRecurring}
            handleEdit={handleEditRecurring}
            key={item.id}
          />
        </Col>
      )
    })
  }
  const checkCompareDate = (startDate, endDate) => {
    const today = new Date()
    const compareDate = moment(moment(today).format("YYYY-MM-DD"), "YYYY/MM/DD")
    const check = compareDate.isBetween(startDate, endDate) //false in this case
    return check
  }

  const columns = [
    {
      title: "",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const startDate = moment(record.date_from, "YYYY/MM/DD")
        let endDate = moment(record.date_to, "YYYY/MM/DD")
        if (!record.date_to) {
          endDate = moment(record.date_to_next, "YYYY/MM/DD")
        }
        const check = checkCompareDate(startDate, endDate) //false in this case
        return (
          <i
            className={`fas fa-circle ${
              check ? "text-primary" : "text-secondary"
            }`}></i>
        )
      }
    },
    {
      title: useFormatMessage("modules.employee_salary.fields.effective_start"),
      dataIndex: "date_from",
      key: "date_from",
      render: (text) => {
        if (
          text === "" ||
          text === null ||
          text === "0000-00-00" ||
          text === "1970-01-01"
        ) {
          return ""
        } else {
          return moment(text).format("DD MMM YYYY")
        }
      }
    },
    {
      title: useFormatMessage("modules.employee_salary.fields.effective_end"),
      dataIndex: "date_to",
      key: "date_to",
      render: (text, _record) => {
        if (
          text === "" ||
          text === null ||
          text === "0000-00-00" ||
          text === "1970-01-01"
        ) {
          return ""
        } else {
          return moment(text).format("DD MMM YYYY")
        }
      }
    },
    {
      title: useFormatMessage("modules.employee_salary.fields.basic_salary"),
      dataIndex: "basic_salary",
      key: "basic_salary",
      render: (_, record) => {
        return <div>{addComma(record.basic_salary * 1)}</div>
      }
    },
    {
      title: useFormatMessage(
        "modules.employee_salary.fields.salary_percentage"
      ),
      dataIndex: "salary_percentage",
      key: "salary_percentage",
      render: (_, record) => {
        return <div>{addComma(record.salary_percentage * 1)}</div>
      }
    },
    {
      title: useFormatMessage("modules.employee_salary.fields.actual_salary"),
      dataIndex: "salary",
      key: "salary",
      render: (_, record) => {
        return <div>{addComma(record.salary * 1)}</div>
      }
    },
    {
      title: useFormatMessage("modules.employee_salary.fields.reason"),
      dataIndex: "reason",
      key: "reason"
    },
    {
      title: useFormatMessage("app.action"),
      key: "action",
      render: (text, record) => {
        const startDate = moment(record.date_from, "YYYY/MM/DD")
        let endDate = moment(record.date_to, "YYYY/MM/DD")
        if (!record.date_to) {
          endDate = moment(record.date_to_next, "YYYY/MM/DD")
        }
        const todayMM = moment(new Date()).format("YYYY-MM-DD")
        const check = checkCompareDate(startDate, endDate) //false in this case
        const checkDateBf = endDate.isBefore(todayMM)
        return (
          <>
            {!checkDateBf && (
              <span>
                <Button
                  className="p-50 me-1"
                  color="flat-secondary"
                  onClick={() => handleEditSalary(record?.id)}>
                  <i className="fal fa-edit"></i>
                </Button>
                {!check && (
                  <Button
                    className="p-50"
                    color="flat-danger"
                    onClick={() => handleDeleteSalary(record?.id)}>
                    <i className="fal fa-trash"></i>
                  </Button>
                )}
              </span>
            )}
          </>
        )
      }
    }
  ]
  const handleDeleteSalary = (id) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        employeesApi
          .deleteEmployeeSalary(id)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            loadData()
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }
  const handleDeleteRecurring = (id) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        employeesApi
          .deleteEmployeeRecurring(id)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            loadData()
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }

  const handleEditRecurring = (id) => {
    if (!id) {
      setState({ recurringEditModal: !state.recurringEditModal })
      return
    }
    defaultModuleApi
      .getDetail("employee_recurring", id, "employees/info-recurring")
      .then((res) => {
        setState({
          loading: false,
          updateDataRecurring: res.data.data,
          recurringEditModal: !state.recurringEditModal
        })
      })
  }

  const handleEditSalary = (id) => {
    if (!id) {
      setState({ salaryModal: !state.salaryModal, updateDataSalary: {} })
      return
    }
    defaultModuleApi.getDetail("employee_salary", id).then((res) => {
      setState({
        loading: false,
        updateDataSalary: res.data.data,
        salaryModal: !state.salaryModal
      })
    })
  }
  const handleModal = () => {
    setState({ recurringModal: !state.recurringModal })
  }
  const handleModalSalary = () => {
    setState({
      salaryModal: !state.salaryModal,
      updateDataSalary: {}
    })
  }
  const handleSetupPayroll = () => {
    setState({ isSetupPayroll: !state.isSetupPayroll })
  }

  const handleModalPaycycle = () => {
    setState({ paycycleModal: !state.paycycleModal })
  }
  useEffect(() => {
    if (!_.isUndefined(employeeData.id)) {
      loadData()
    }
  }, [employeeData])

  useEffect(() => {
    loadDataRecurring()
  }, [])

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const changeYearPayroll = () => {
    const params = { year: state.yearPayroll, employeeId: employeeData.id }
    setState({ loadingPayroll: true })
    employeesApi
      .getPayrollByYear(params)
      .then((res) => {
        setState({
          loadingPayroll: false,
          dataPayroll: res.data.employees_payroll.data_payroll,
          payrollTotalRow: res.data.employees_payroll.total_row
        })
      })
      .catch((err) => {
        setState({ loadingPayroll: false })
      })
  }

  useEffect(() => {
    if (!state.loading) {
      changeYearPayroll()
    }
  }, [state.yearPayroll])

  return (
    <Fragment>
      <EmployeeBasicInformationForm
        api={props.api}
        titleIcon={<i className="iconly-Document icli" />}
        title={useFormatMessage(
          "modules.employees.tabs.payroll.payroll_informations"
        )}
        fields={employeesModule.metas}
        options={employeesModule.options}
        employeeData={props.employeeData}
        loading={props.loading}
        permits={props.permits}
        filterField={(field) => {
          if (
            !isEmpty(field.field_options) &&
            !isEmpty(field.field_options.form) &&
            !isEmpty(field.field_options.form.tabId) &&
            field.field_options.form.tabId === "payroll"
          ) {
            return field
          }
        }}
        reload={props.reload}
      />
      {state.dataSalary.length > 0 && (
        <>
          <Card className="card-inside with-border-radius life-card">
            <CardHeader>
              <div className="d-flex flex-wrap w-100">
                <h1 className="card-title">
                  <span className="title-icon">
                    <i className="far fa-money-bill"></i>
                  </span>
                  <span>
                    {useFormatMessage(
                      "modules.employees.tabs.payroll.card_title.recurring"
                    )}
                  </span>
                </h1>
                <div className="d-flex ms-auto">
                  <Button
                    color="flat-primary"
                    tag="div"
                    className="text-primary btn-table-more btn-icon"
                    onClick={handleModal}>
                    <i className="iconly-Plus icli" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {state.loading && <DefaultSpinner center="true" />}
              <Row className="mt-2">{!state.loading && renderRecurring()}</Row>
            </CardBody>
          </Card>

          <Card className="card-inside with-border-radius life-card mt-1">
            <CardHeader>
              <div className="d-flex flex-wrap w-100">
                <h1 className="card-title">
                  <span className="title-icon">
                    <i className="far fa-money-bill"></i>
                  </span>
                  <span>
                    {useFormatMessage(
                      "modules.employees.tabs.payroll.card_title.salary"
                    )}
                  </span>
                </h1>
                <div className="d-flex ms-auto">
                  <Button
                    color="flat-primary"
                    tag="div"
                    className="text-primary btn-table-more btn-icon"
                    onClick={handleModalSalary}>
                    <i className="iconly-Plus icli" />
                  </Button>
                </div>
              </div>

              <div className="paycycle_employees">
                {employeeData.pay_cycle ? (
                  <i className="fa-solid fa-circle-small me-50"></i>
                ) : (
                  ""
                )}
                {employeeData?.pay_cycle?.label}
                {canCreate && (
                  <i
                    onClick={() => handleModalPaycycle()}
                    className="icon-edit fa-regular fa-pen-line ms-50"></i>
                )}
              </div>
            </CardHeader>
            <CardBody>
              <Table
                dataSource={state.dataSalary}
                columns={columns}
                className="mt-1"
                pagination={false}
              />
            </CardBody>
          </Card>

          <Card className="card-inside with-border-radius life-card mt-1">
            <CardHeader>
              <div className="d-flex flex-wrap w-100">
                <h1 className="card-title">
                  <span className="title-icon">
                    <i className="fal fa-clipboard-list-check" />
                  </span>
                  <span>
                    {useFormatMessage(
                      "modules.employees.tabs.payroll.card_title.payroll"
                    )}
                  </span>
                </h1>
                <div className="d-flex ms-auto">
                  <div style={{ minWidth: "90px" }}>
                    <ErpSelect
                      onChange={(e) => {
                        setState({ yearPayroll: e.value })
                      }}
                      options={recordYear}
                      defaultValue={recordYear[1]}
                      nolabel
                      isClearable={false}
                      isSearchable={false}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <TablePayroll
                loading_table={state.loadingPayroll}
                data_table={state.dataPayroll}
                total_row={state.payrollTotalRow}
                loadTablePayroll={changeYearPayroll}
                request_type="profile"
              />
            </CardBody>
          </Card>
        </>
      )}

      {state.loading && (
        <Row>
          <Col sm={12} className="text-center">
            <DefaultSpinner />
          </Col>
        </Row>
      )}
      {!state.loading && !state.dataSalary.length && !state.isSetupPayroll && (
        <Row>
          <Col sm={12} className="text-center">
            <i
              className="fal fa-usd-circle mt-3 text-primary"
              style={{ fontSize: "10rem" }}></i>
            <div
              className="mt-1"
              style={{
                fontSize: "1.5rem",
                fontWeight: "500"
              }}>
              {useFormatMessage(
                "modules.employees.tabs.payroll.text.set_up_for",
                { name: employeeData.full_name }
              )}
            </div>
            <div className="mt-25">
              {useFormatMessage(
                "modules.employees.tabs.payroll.text.enter_salary"
              )}
            </div>
            <Button
              color="primary"
              className="btn mt-1"
              onClick={() => handleSetupPayroll()}>
              <i className="fal fa-plus me-50"></i>{" "}
              {useFormatMessage(
                "modules.employees.tabs.payroll.card_title.payroll_setup"
              )}
            </Button>
          </Col>
        </Row>
      )}
      {state.isSetupPayroll && (
        <SetupPayroll
          handleSetupPayroll={handleSetupPayroll}
          employeeId={employeeData.id}
          loadDataRecurring={loadData}
        />
      )}
      <AddEmployeeRecurringModal
        modal={state.recurringModal}
        handleModal={handleModal}
        employeeRecurring={state.dataRecurring}
        employeeId={employeeData.id}
        loadDataRecurring={loadData}
      />
      <EmployeeRecurringEditModal
        modal={state.recurringEditModal}
        handleModal={handleEditRecurring}
        employeeRecurring={state.dataRecurring}
        employeeId={employeeData.id}
        updateData={state.updateDataRecurring}
        loadDataRecurring={loadData}
      />

      <AddEmployeeSalaryModal
        modal={state.salaryModal}
        handleModal={handleEditSalary}
        employeeId={employeeData.id}
        updateData={state.updateDataSalary}
        loadData={loadData}
        effective_end_salary={state.effective_end_salary}
      />
      <EditPaycycleModal
        modal={state.paycycleModal}
        handleModal={handleModalPaycycle}
        employeeId={employeeData.id}
        updateData={{ pay_cycle: employeeData.pay_cycle }}
        employeeData={employeeData}
        loadData={loadData}
      />
    </Fragment>
  )
}

export default TabPayRoll
