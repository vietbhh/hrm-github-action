import { EmptyContent } from "@apps/components/common/EmptyContent"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { employeesApi } from "@modules/Employees/common/api"
import { FormProvider } from "rc-field-form"
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner
} from "reactstrap"
import CardAddRecurring from "./CardAddRecurring"
const SetupPayroll = (props) => {
  const { handleSetupPayroll, employeeId, loadDataRecurring } = props
  const modules = useSelector((state) => state.app.modules)
  const settings = useSelector((state) => state.auth.settings)

  const canCreate = settings.create_new_pay_cycle
  /* modules.employee_salary */
  const module = modules.employee_salary
  const options = module.options
  const moduleName = module.config.name
  const metas = module.metas
  /* END modules.employee_salary */

  /* modules.employee */
  const moduleEmployee = modules.employees
  const optionsEmployee = moduleEmployee.options
  const moduleNameEmployee = moduleEmployee.config.name
  const metasEmployee = moduleEmployee.metas
  /* END modules.employee_salary */
  const [state, setState] = useMergedState({
    loading: true,
    dataList: [],
    dataAdd: [],
    submit: false
  })
  const loadData = (props) => {
    defaultModuleApi.getList("recurring").then((res) => {
      setState({
        loading: false,
        dataList: res.data.results
      })
    })
  }
  const renderRecurring = () => {
    if (!state.dataList.length) {
      return (
        <Col sm={12}>
          <EmptyContent />
        </Col>
      )
    }

    return state.dataList?.map((item) => {
      return (
        <Col sm={6} key={item.id} className="mb-2">
          <CardAddRecurring
            item={item}
            arrRecurring={state.dataAdd}
            employeeRecurring={[]}
            handleChoose={handleChoose}
            handleChooseValidFrom={handleChooseValidFrom}
            handleChooseValidTo={handleChooseValidTo}
          />
        </Col>
      )
    })
  }
  const handleChoose = (e, noEndDate = false) => {
    const data = {
      id: e.target.value,
      checked: e.target.checked,
      valid_from: "",
      valid_to: "",
      noEndDate: noEndDate,
      stt_valid_from: "success",
      stt_valid_to: "success"
    }
    const arrData = [...state.dataAdd]
    const obj = arrData.find((o, i) => {
      if (o.id === data.id) {
        arrData[i] = data
        return true
      }
    })
    if (!obj) arrData.push(data)
    setState({ dataAdd: arrData })
  }

  const handleChooseValidFrom = (date, id) => {
    const arrData = [...state.dataAdd]
    const obj = arrData.find((o, i) => {
      if (o.id === id) {
        arrData[i] = { ...arrData[i], valid_from: date }
        return true
      }
    })
    setState({ dataAdd: arrData })
  }

  const handleChooseValidTo = (date, id) => {
    const arrData = [...state.dataAdd]
    const obj = arrData.find((o, i) => {
      if (o.id === id) {
        arrData[i] = { ...arrData[i], valid_to: date }
        return true
      }
    })
    setState({ dataAdd: arrData })
  }

  const onSubmit = (values) => {
    const arrAdd = [...state.dataAdd]
    let sttCheck = true
    arrAdd.map((i, key) => {
      if (!i.valid_from) {
        arrAdd[key].stt_valid_from = "error"
        sttCheck = false
      }
      if (!i.valid_to && !i.noEndDate) {
        arrAdd[key].stt_valid_to = "error"
        sttCheck = false
      }
    })
    if (!sttCheck) {
      setState({ dataAdd: arrAdd })
      return
    }
    setState({ submit: true })
    employeesApi
      .addRecurring({
        arrRecurring: state.dataAdd,
        employeeId: employeeId,
        ...values
      })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ submit: false, dataAdd: [] })
        loadDataRecurring()
        handleSetupPayroll()
      })
      .catch((err) => {
        //props.submitError();
        setState({ submit: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods
  useEffect(() => {
    loadData()
  }, [])
  return (
    <Fragment>
      <Card className="card-setup-payroll">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">
                <i className="fal fa-clipboard-list-check" />
              </span>
              <span>
                {useFormatMessage(
                  "modules.employees.tabs.payroll.card_title.payroll_setup"
                )}
              </span>
            </h1>
          </div>
        </CardHeader>
        <CardBody>
          <FormProvider {...methods}>
            <Row>
              <Col sm={12} className="d-flex align-items-center mb-1">
                <div className="w-25">
                  {useFormatMessage("modules.employees.fields.pay_cycle")} *
                </div>
                <div className="w-50">
                  <FieldHandle
                    module={moduleNameEmployee}
                    fieldData={{
                      ...metasEmployee.pay_cycle
                    }}
                    nolabel
                    className="w-100"
                    useForm={methods}
                    readOnly={!canCreate}
                  />
                </div>
              </Col>

              <Col sm={12} className="">
                <h4>
                  {useFormatMessage("modules.employee_salary.fields.salary")}
                </h4>
              </Col>
              <Col sm={12} className="d-flex align-items-center ">
                <div className="w-25">
                  {useFormatMessage("modules.employee_salary.fields.salary")} *
                </div>
                <div className="w-50">
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.salary
                    }}
                    nolabel
                    useForm={methods}
                    options={options}
                  />
                </div>
              </Col>
              <Col sm={12} className="d-flex align-items-center">
                <div className="w-25">
                  {useFormatMessage(
                    "modules.employee_salary.fields.effective_date"
                  )}{" "}
                  *
                </div>
                <div className="w-50">
                  <div className="d-flex">
                    <div className="w-100 me-1 ">
                      <FieldHandle
                        module={moduleName}
                        fieldData={{
                          ...metas.date_from
                        }}
                        nolabel
                        useForm={methods}
                        options={options}
                      />
                    </div>
                    <div className="w-100">
                      <FieldHandle
                        module={moduleName}
                        fieldData={{
                          ...metas.date_to
                        }}
                        nolabel
                        useForm={methods}
                        options={options}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="my-1">
              <Col sm={12} className="mb-2">
                <h4>
                  {useFormatMessage(
                    "modules.employees.tabs.payroll.card_title.recurring"
                  )}
                </h4>
              </Col>
              {renderRecurring()}
            </Row>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm="12">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={state.submit}
                    className="me-1">
                    {state.submit && <Spinner size="sm" className="me-50" />}
                    {useFormatMessage("app.save")}
                  </Button>
                  <Button
                    color="flat-secondary"
                    onClick={() => handleSetupPayroll()}
                    className="btn-cancel">
                    {useFormatMessage("button.cancel")}
                  </Button>
                </Col>
              </Row>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default SetupPayroll
