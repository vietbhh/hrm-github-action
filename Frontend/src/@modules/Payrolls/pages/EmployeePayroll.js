import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import classNames from "classnames"
import { Fragment, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { PayrollApi } from "../common/api"
import FilterPayroll from "../components/FilterPayroll"
import TablePayroll from "../components/TablePayroll"
import SendPayslip from "../components/SendPayslip"

const EmployeePayroll = () => {
  const ability = useContext(AbilityContext)

  if (ability.can("accessEmployeePayroll", "payrolls") === false) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

  const settingMail = useSelector(
    (state) => state.auth.settings.payslip_employee_email_body
  )

  const [state, setState] = useMergedState({
    loadPage: true,
    loading_table: false,
    options_payroll: [],
    filter: {
      payroll: "",
      type: "all_type"
    },
    searchVal: "",
    data_table: [],
    data_total: [],
    total_row: 0,
    date_from: "",
    date_to: "",
    dateCutOff: "",
    loading_close: false,
    modal_close: false,
    closed: "1",
    loading_export: false,
    modal_send_payslip: false,
    modal_send_payslip_confirm: false
  })

  const toggleModalClose = () => {
    setState({ modal_close: !state.modal_close })
  }

  const toggleModalSendPayslip = () => {
    setState({ modal_send_payslip: !state.modal_send_payslip })
  }

  const toggleModalSendPayslipConfirm = () => {
    setState({ modal_send_payslip_confirm: !state.modal_send_payslip_confirm })
  }

  const setFilter = (props) => {
    setState({ filter: { ...state.filter, ...props } })
  }

  const setSearchVal = (props) => {
    setState({ searchVal: props })
  }

  const loadConfig = () => {
    setState({ loadPage: true })
    PayrollApi.getConfig()
      .then((res) => {
        setState({
          options_payroll: res.data.data_payrolls,
          loadPage: false,
          filter: {
            ...state.filter,
            payroll: res.data.data_payrolls[0].value
          }
        })
      })
      .catch((err) => {
        setState({ loadPage: false })
      })
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const loadTablePayroll = (props) => {
    setState({ loading_table: true })
    const params = {
      filter: state.filter,
      searchVal: state.searchVal,
      ...props
    }

    PayrollApi.getPayrollTable(params)
      .then((res) => {
        setState({
          loading_table: false,
          data_table: res.data.data_table,
          data_total: res.data.data_total,
          total_row: res.data.total_row,
          date_from: res.data.date_from,
          date_to: res.data.date_to,
          dateCutOff: res.data.dateCutOff,
          closed: res.data.closed
        })
      })
      .catch((err) => {
        setState({ loading_table: false })
      })
  }

  useEffect(() => {
    if (state.loadPage === false) {
      loadTablePayroll()
    }
  }, [state.filter, state.searchVal])

  const closePayroll = () => {
    setState({ loading_close: true })
    const payroll = state.filter.payroll
    PayrollApi.getClosePayroll(payroll)
      .then((res) => {
        setState({ loading_close: false, modal_close: false })
        loadTablePayroll()
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        setState({ loading_close: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const exportExcel = () => {
    setState({ loading_export: true })
    const payroll = state.filter.payroll
    PayrollApi.getExportExcel(payroll)
      .then((response) => {
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `Payroll.xlsx`)
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

  return (
    <Fragment>
      <Breadcrumbs
        className="team-attendance-breadcrumbs"
        list={[
          {
            title: useFormatMessage("modules.payrolls.title")
          }
        ]}
      />

      <Card>
        <CardBody>
          <p className="mb-0">
            <span className="title-icon">
              <i className="fas fa-bell-on" />
            </span>
            {useFormatMessage("modules.payrolls.noti")}
          </p>
        </CardBody>
      </Card>

      <Card className="team-attendance">
        <div className="ant-spin-nested-loading">
          {state.loadPage && (
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
              "ant-spin-blur": state.loadPage
            })}>
            <CardHeader className="btn-header">
              <div className="d-flex flex-wrap w-100 mb-7">
                <div className="d-flex align-items-center">
                  <i className="far fa-file-alt icon-circle bg-icon-green"></i>
                  <span className="instruction-bold">
                    {useFormatMessage("modules.payrolls.title")}
                  </span>
                </div>

                <div
                  className="d-flex align-items-center"
                  style={{ marginLeft: "auto" }}>
                  <Button.Ripple
                    color="secondary"
                    className="ms-10 btn-secondary-edit"
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

                  <Button.Ripple
                    color="secondary"
                    className="ms-10 btn-secondary-edit"
                    disabled={_.isEmpty(state.data_table)}
                    onClick={() => {
                      toggleModalSendPayslipConfirm()
                    }}>
                    <span className="align-self-center">
                      {useFormatMessage("modules.payrolls.button.send_payslip")}
                    </span>
                  </Button.Ripple>

                  <Button.Ripple
                    color="primary"
                    className="ms-10"
                    onClick={() => {
                      toggleModalClose()
                    }}
                    disabled={state.closed === "1"}>
                    <span className="align-self-center">
                      {useFormatMessage(
                        "modules.payrolls.button.close_payroll"
                      )}
                    </span>
                  </Button.Ripple>
                </div>
              </div>
            </CardHeader>
            <CardBody className="attendance-body">
              {!state.loadPage && (
                <>
                  <FilterPayroll
                    options_payroll={state.options_payroll}
                    setFilter={setFilter}
                    setSearchVal={setSearchVal}
                    loading_table={state.loading_table}
                  />

                  <TablePayroll
                    loading_table={state.loading_table}
                    data_table={state.data_table}
                    data_total={state.data_total}
                    total_row={state.total_row}
                    date_from={state.date_from}
                    date_to={state.date_to}
                    payroll={state.filter.payroll}
                    loadTablePayroll={loadTablePayroll}
                    closed={state.closed}
                  />
                </>
              )}
            </CardBody>
          </div>
        </div>
      </Card>

      <SendPayslip
        modal={state.modal_send_payslip}
        toggleModal={toggleModalSendPayslip}
        data_table={state.data_table}
        settingMail={settingMail}
        dateCutOff={state.dateCutOff}
      />

      <Modal
        isOpen={state.modal_close}
        toggle={() => toggleModalClose()}
        className="modal-sm modal-close-payroll"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader>
          {useFormatMessage(`modules.payrolls.modal.confirmation`)}
        </ModalHeader>
        <ModalBody className="modal-body">
          <p>{useFormatMessage(`modules.payrolls.modal.modal_close_body`)}</p>
        </ModalBody>
        <ModalFooter>
          <Button.Ripple
            color="primary"
            onClick={() => {
              closePayroll()
            }}
            disabled={state.loading_close}>
            {state.loading_close && <Spinner size="sm" className="me-50" />}
            {useFormatMessage(`modules.payrolls.button.close_payroll`)}
          </Button.Ripple>
          <Button.Ripple
            color="flat-danger"
            onClick={() => {
              toggleModalClose()
            }}
            disabled={state.loading_close}>
            {useFormatMessage("button.cancel")}
          </Button.Ripple>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={state.modal_send_payslip_confirm}
        toggle={() => toggleModalSendPayslipConfirm()}
        className="modal-sm modal-close-payroll"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader>
          {useFormatMessage(`modules.payrolls.modal.confirmation`)}
        </ModalHeader>
        <ModalBody className="modal-body">
          <p>
            {useFormatMessage(
              `modules.payrolls.modal.modal_send_payslip_confirm`
            )}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button.Ripple
            color="primary"
            onClick={() => {
              toggleModalSendPayslip()
              toggleModalSendPayslipConfirm()
            }}>
            {useFormatMessage(`modules.payrolls.button.send_payslip`)}
          </Button.Ripple>
          <Button.Ripple
            color="flat-danger"
            onClick={() => {
              toggleModalSendPayslipConfirm()
            }}>
            {useFormatMessage("button.cancel")}
          </Button.Ripple>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default EmployeePayroll
