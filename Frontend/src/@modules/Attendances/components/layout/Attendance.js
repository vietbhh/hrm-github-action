import AppSpinner from "@apps/components/spinner/AppSpinner"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { EmployeeAttendanceApi } from "@modules/Attendances/common/EmployeeAttendanceApi"
import classNames from "classnames"
import { Fragment, useContext, useEffect } from "react"
import { ArrowLeft } from "react-feather"
import { useSelector, useDispatch } from "react-redux"
import { Navigate } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Spinner } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import AttendanceFilter from "../details/myAttendance/AttendanceFilter"
import InfoAttendanceEmployee from "../details/myAttendance/InfoAttendanceEmployee"
import FilterAttendance from "../employeeAttendance/FilterAttendance"
import ModalAction from "../employeeAttendance/modal/ModalAction"
import TableAttendance from "../employeeAttendance/TableAttendance"
import EditOvertimeModal from "../modals/EditOvertimeModal"
import EditPaidTimeModal from "../modals/EditPaidTimeModal"
import ListNoteLogAttendanceModal from "../modals/ListNoteLogAttendanceModal"
import {
  showEditOvertimeAttendanceModal,
  hideEditOvertimeAttendanceModal,
  showEditPaidTimeAttendanceModal,
  hideEditPaidTimeAttendanceModal
} from "@modules/Attendances/common/reducer/attendance"

const Attendance = (props) => {
  const perPage = useSelector((state) => state.auth.settings.perPage)
  const moduleData = useSelector(
    (state) => state.app.modules.attendance_details
  )
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  const ability = useContext(AbilityContext)
  const metas_status_options = metas.status.field_options.color_settings

  const optionsModules = useSelector((state) => state.app.optionsModules)
  const moduleAttendanceDetailData = useSelector(
    (state) => state.app.modules.attendance_details
  )
  const moduleAttendanceDetail = moduleAttendanceDetailData.config
  const moduleNameAttendanceDetail = moduleAttendanceDetail.name
  const metasAttendanceDetail = moduleAttendanceDetailData.metas
  const optionsAttendanceDetail = moduleAttendanceDetailData.options

  const moduleAttendanceLogData = useSelector(
    (state) => state.app.modules.attendance_logs
  )
  const moduleAttendanceLog = moduleAttendanceLogData.config
  const moduleNameAttendanceLog = moduleAttendanceLog.name
  const metasAttendanceLog = moduleAttendanceLogData.metas
  const optionsAttendanceLog = moduleAttendanceLogData.options

  const dispatch = useDispatch()

  if (ability.can("accessTeamAttendance", "attendances") === false) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

  const { type } = props

  const [state, setState] = useMergedState({
    loadPage: true,
    loading_table: false,
    disabled_approve_reject: true,
    disabled_revert: true,
    disabled_confirm: true,
    attendanceOptions: {},
    filter: {
      attendance: "",
      status: "all_status",
      record: "all_records"
    },
    searchVal: "",
    pagination: {
      current: 1,
      pageSize: perPage
    },
    arr_date: [],
    data_table: [],
    date_from: "",
    date_to: "",
    modal: false,
    action_status: "",
    action_status_ed: "",
    action_employee_id: 0,
    action_employee_detail: {},
    checked_employee_id: [],
    checked_employee_id_approve_reject: [],
    checked_action_employee_detail_approve_reject: [],
    checked_employee_id_confirm_revert: [],
    checked_action_employee_detail_confirm_revert: [],
    submit_type: "",
    showInfoEmployeeAttendance: false,
    reloadAttendanceBodyAfterLoading: false,
    currentAttendanceDetailData: {},
    chosenEmployee: {},
    paidTimeModal: false,
    overtimeModal: false,
    listLogModal: false,
    loading_export: false
  })

  const [filterEmployeeAttendance, setFilterEmployeeAttendance] =
    useMergedState({
      employeeId: 0,
      attendanceId: "",
      status: "",
      location: "",
      records: ""
    })

  const attendanceState = useSelector((state) => state.attendance)
  const { modalPaidTime, modalOvertime } = attendanceState

  const setSearchVal = (props) => {
    setState({ searchVal: props })
  }

  const setDisabledApproveReject = (props) => {
    setState({ disabled_approve_reject: props })
  }

  const setDisabledConfirmReject = (props) => {
    setState({ disabled_revert: props, disabled_confirm: props })
  }

  const setDisabledButtonHeader = (props) => {
    setState({
      disabled_approve_reject: true,
      disabled_revert: true,
      disabled_confirm: true,
      checked_employee_id: []
    })
  }

  const setCheckedEmployeeId = (props) => {
    setState({ checked_employee_id: props })
  }

  const setCheckedActionEmployeeApproveReject = (id, detail) => {
    setState({
      checked_employee_id_approve_reject: id,
      checked_action_employee_detail_approve_reject: detail
    })
  }

  const setCheckedActionEmployeeConfirmRevert = (id, detail) => {
    setState({
      checked_employee_id_confirm_revert: id,
      checked_action_employee_detail_confirm_revert: detail
    })
  }

  const setStateAction = (props) => {
    setState({
      action_employee_id: 0,
      action_status: "",
      action_status_ed: "",
      action_employee_detail: {},
      submit_type: "",
      ...props
    })
  }

  const setFilter = (props) => {
    setState({ filter: { ...state.filter, ...props } })
  }

  const setShowInfoEmployeeAttendance = (status) => {
    setState({
      showInfoEmployeeAttendance: status
    })
  }

  const setReloadAttendanceBodyAfterLoading = (status) => {
    setState({
      reloadAttendanceBodyAfterLoading: status
    })
  }

  const setCurrentAttendanceDetailData = (data) => {
    setState({
      currentAttendanceDetailData: data
    })
  }

  const setArrDate = (data) => {
    setState({
      arr_date: data
    })
  }

  const setChosenEmployee = (data) => {
    setState({
      chosenEmployee: data
    })
  }

  const loadConfig = () => {
    setState({ loadPage: true })
    EmployeeAttendanceApi.getConfig()
      .then((res) => {
        setState({
          attendanceOptions: res.data.data_attendances,
          loadPage: false,
          filter: {
            ...state.filter,
            attendance: res.data.data_attendances[0].value
          }
        })
      })
      .catch((err) => {
        setState({ loadPage: false })
      })
  }

  const loadDataInfoEmployee = () => {
    setReloadAttendanceBodyAfterLoading(true)
  }

  useEffect(() => {
    loadConfig()
  }, [])

  useEffect(() => {
    if (state.listLogModal === false) {
      document.body.style.overflow = "unset"
    }
  }, [state.listLogModal])

  const loadTableAttendance = (props) => {
    setState({ loading_table: true })
    const params = {
      filter: state.filter,
      searchVal: state.searchVal,
      pagination: state.pagination,
      type: type,
      ...props
    }

    EmployeeAttendanceApi.getTableAttendance(params)
      .then((res) => {
        setState({
          loading_table: false,
          arr_date: res.data.arr_date,
          data_table: res.data.data_table,
          date_from: res.data.date_from,
          date_to: res.data.date_to,
          pagination: {
            ...params.pagination,
            total: res.data.total
          }
        })
      })
      .catch((err) => {
        setState({ loading_table: false })
      })
  }

  useEffect(() => {
    if (
      state.loadPage === false &&
      state.showInfoEmployeeAttendance === false
    ) {
      loadTableAttendance({ pagination: { ...state.pagination, current: 1 } })
    }
  }, [state.filter, state.searchVal, state.showInfoEmployeeAttendance])

  const toggleModal = () => {
    setState({
      modal: !state.modal
    })
  }

  const showEditPaidTimeModal = () => {
    dispatch(showEditPaidTimeAttendanceModal())
  }

  const hideEditPaidTimeModal = () => {
    dispatch(hideEditPaidTimeAttendanceModal())
  }

  const showEditOvertimeModal = () => {
    dispatch(showEditOvertimeAttendanceModal())
  }

  const hideEditOvertimeModal = () => {
    dispatch(hideEditOvertimeAttendanceModal())
  }

  const toggleListLogModal = () => {
    setState({
      listLogModal: !state.listLogModal
    })
  }

  const handleBackToAttendance = () => {
    setDisabledButtonHeader()
    setShowInfoEmployeeAttendance(false)
  }

  const renderEditPaidTimeModal = () => {
    return (
      <EditPaidTimeModal
        modal={state.paidTimeModal}
        filters={filterEmployeeAttendance}
        employeeAttendance={filterEmployeeAttendance.employeeId}
        currentAttendanceDetailData={state.currentAttendanceDetailData}
        metasAttendanceDetail={metasAttendanceDetail}
        moduleNameAttendanceDetail={moduleNameAttendanceDetail}
        metasAttendanceLog={metasAttendanceLog}
        moduleNameAttendanceLog={moduleNameAttendanceLog}
        handleModal={hideEditPaidTimeModal}
        setReloadAttendanceBodyAfterLoading={loadDataInfoEmployee}
      />
    )
  }

  const renderOvertimeModal = () => {
    return (
      <EditOvertimeModal
        modal={state.overtimeModal}
        filters={filterEmployeeAttendance}
        employeeAttendance={filterEmployeeAttendance.employeeId}
        currentAttendanceDetailData={state.currentAttendanceDetailData}
        metasAttendanceDetail={metasAttendanceDetail}
        moduleNameAttendanceDetail={moduleNameAttendanceDetail}
        metasAttendanceLog={metasAttendanceLog}
        moduleNameAttendanceLog={moduleNameAttendanceLog}
        handleModal={hideEditOvertimeModal}
        setReloadAttendanceBodyAfterLoading={loadDataInfoEmployee}
      />
    )
  }

  const renderListNoteAttendanceLogModal = () => {
    return (
      <ListNoteLogAttendanceModal
        modal={state.listLogModal}
        optionsAttendanceLog={optionsAttendanceLog}
        currentAttendanceDetailData={state.currentAttendanceDetailData}
        handleModal={toggleListLogModal}
      />
    )
  }

  const renderBackButton = () => {
    return (
      <div>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          onClick={() => handleBackToAttendance()}>
          <ArrowLeft size={14} />
          <span className="align-middle ms-25">
            {" "}
            {useFormatMessage(
              `modules.attendance_details.buttons.back_to_${type}`
            )}
          </span>
        </Button.Ripple>
      </div>
    )
  }

  const renderEmployee = () => {
    return (
      <div className="d-flex align-items-center">
        <Avatar
          className="my-0 me-50"
          height="35"
          width="35"
          src={state.chosenEmployee?.icon}
        />
        <div className="d-flex flex-column">
          <p className="user-name text-truncate mb-0">
            <span className="fw-bold">{state.chosenEmployee?.full_name}</span>{" "}
          </p>
          <p className="user-name text-truncate mb-0 mt-0">
            <small>{state.chosenEmployee?.email}</small>
          </p>
        </div>
      </div>
    )
  }

  const renderInfoEmployee = () => {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center">
        {renderBackButton()}
        {renderEmployee()}
      </div>
    )
  }

  const renderInfoAttendanceEmployee = () => {
    return (
      <InfoAttendanceEmployee
        filters={filterEmployeeAttendance}
        reloadAttendanceBodyAfterLoading={
          state.reloadAttendanceBodyAfterLoading
        }
        showCheckBoxCell={true}
        optionsAttendanceDetail={optionsAttendanceDetail}
        optionsModules={optionsModules}
        attendanceType={type}
        chosenEmployeeInfo={state.chosenEmployee}
        chosenEmployee={filterEmployeeAttendance.employeeId}
        setCurrentAttendanceDetailData={setCurrentAttendanceDetailData}
        handleOvertimeModal={showEditOvertimeModal}
        handlePaidTimeModal={showEditPaidTimeModal}
        handleAttendanceNoteLogModal={toggleListLogModal}
        toggleModalAction={toggleModal}
        setStateAction={setStateAction}
        setDisabledApproveReject={setDisabledApproveReject}
        setDisabledConfirmReject={setDisabledConfirmReject}
        setReloadAttendanceBodyAfterLoading={
          setReloadAttendanceBodyAfterLoading
        }
        setDisabledButtonHeader={setDisabledButtonHeader}
        setCheckedActionEmployeeApproveReject={
          setCheckedActionEmployeeApproveReject
        }
        setCheckedActionEmployeeConfirmRevert={
          setCheckedActionEmployeeConfirmRevert
        }
        setArrDate={setArrDate}
      />
    )
  }

  const renderEmployeeAttendanceBody = () => {
    if (state.showInfoEmployeeAttendance === false) {
      return (
        <Fragment>
          <FilterAttendance
            options={options}
            attendanceOptions={state.attendanceOptions}
            setFilter={setFilter}
            metas_status_options={metas_status_options}
            setSearchVal={setSearchVal}
            searchVal={state.searchVal}
            filter={state.filter}
          />

          <TableAttendance
            arr_date={state.arr_date}
            loading_table={state.loading_table}
            data_table={state.data_table}
            pagination={state.pagination}
            setDisabledApproveReject={setDisabledApproveReject}
            toggleModal={toggleModal}
            setStateAction={setStateAction}
            metas_status_options={metas_status_options}
            checked_employee_id={state.checked_employee_id}
            loadTableAttendance={loadTableAttendance}
            setDisabledButtonHeader={setDisabledButtonHeader}
            type={type}
            setDisabledConfirmReject={setDisabledConfirmReject}
            setCheckedEmployeeId={setCheckedEmployeeId}
            setCheckedActionEmployeeApproveReject={
              setCheckedActionEmployeeApproveReject
            }
            setCheckedActionEmployeeConfirmRevert={
              setCheckedActionEmployeeConfirmRevert
            }
            setShowInfoEmployeeAttendance={setShowInfoEmployeeAttendance}
            setFilterEmployeeAttendance={setFilterEmployeeAttendance}
            setChosenEmployee={setChosenEmployee}
          />
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {renderInfoEmployee()}
          <AttendanceFilter
            optionsAttendanceDetail={optionsAttendanceDetail}
            setFilters={setFilterEmployeeAttendance}
            setReloadAttendanceBodyAfterLoading={
              setReloadAttendanceBodyAfterLoading
            }
          />
          {renderInfoAttendanceEmployee()}
          {modalPaidTime && renderEditPaidTimeModal()}
          {modalOvertime && renderOvertimeModal()}
          {state.listLogModal && renderListNoteAttendanceLogModal()}
        </Fragment>
      )
    }
  }

  const exportExcel = () => {
    setState({ loading_export: true })
    const params = {
      filter: state.filter,
      searchVal: state.searchVal,
      pagination: state.pagination,
      type: type
    }
    EmployeeAttendanceApi.getExportExcel(params)
      .then((response) => {
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `Attendance.xlsx`)
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
            <>
              <CardHeader className="btn-header">
                <div className="d-flex flex-wrap w-100 mb-7">
                  <div className="d-flex align-items-center">
                    <i className="far fa-file-alt icon-circle bg-icon-green"></i>
                    <span className="instruction-bold">
                      {type === "team" &&
                        useFormatMessage("modules.team_attendance.title")}
                      {type === "employee" &&
                        useFormatMessage("modules.employee_attendance.title")}
                    </span>
                  </div>

                  <div
                    className="d-flex align-items-center"
                    style={{ marginLeft: "auto" }}>
                    {type === "employee" && (
                      <>
                        <Button.Ripple
                          color="secondary"
                          className="ms-10 btn-secondary-edit"
                          disabled={state.loading_export}
                          onClick={() => {
                            exportExcel()
                          }}>
                          <span className="align-self-center">
                            {state.loading_export ? (
                              <Spinner size="sm" />
                            ) : (
                              <i className="far fa-download"></i>
                            )}
                          </span>
                        </Button.Ripple>

                        <Button.Ripple
                          color="warning"
                          className="ms-10"
                          disabled={state.disabled_revert}
                          onClick={() => {
                            setStateAction({
                              action_status: "revert",
                              action_status_ed: "reverted",
                              action_employee_id: 0,
                              action_employee_detail: {},
                              submit_type: "checkbox"
                            })
                            toggleModal()
                          }}>
                          <span className="align-self-center">
                            {useFormatMessage(
                              "modules.employee_attendance.button.revert"
                            )}
                          </span>
                        </Button.Ripple>
                      </>
                    )}

                    <Button.Ripple
                      color="danger"
                      className="ms-10"
                      disabled={state.disabled_approve_reject}
                      onClick={() => {
                        setStateAction({
                          action_status: "reject",
                          action_status_ed: "rejected",
                          action_employee_id: 0,
                          action_employee_detail: {},
                          submit_type: "checkbox"
                        })
                        toggleModal()
                      }}>
                      <span className="align-self-center">
                        {useFormatMessage(
                          "modules.team_attendance.button.reject"
                        )}
                      </span>
                    </Button.Ripple>

                    <Button.Ripple
                      color="primary"
                      className="ms-10"
                      disabled={state.disabled_approve_reject}
                      onClick={() => {
                        setStateAction({
                          action_status: "approve",
                          action_status_ed: "approved",
                          action_employee_id: 0,
                          action_employee_detail: {},
                          submit_type: "checkbox"
                        })
                        toggleModal()
                      }}>
                      <span className="align-self-center">
                        {useFormatMessage(
                          "modules.team_attendance.button.approve"
                        )}
                      </span>
                    </Button.Ripple>

                    {type === "employee" && (
                      <Button.Ripple
                        color="primary"
                        className="ms-10"
                        disabled={state.disabled_confirm}
                        onClick={() => {
                          setStateAction({
                            action_status: "confirm",
                            action_status_ed: "confirmed",
                            action_employee_id: 0,
                            action_employee_detail: {},
                            submit_type: "checkbox"
                          })
                          toggleModal()
                        }}>
                        <span className="align-self-center">
                          {useFormatMessage(
                            "modules.employee_attendance.button.confirm"
                          )}
                        </span>
                      </Button.Ripple>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody style={{ minHeight: "200px" }}>
                {!state.loadPage && renderEmployeeAttendanceBody()}
              </CardBody>
            </>
          </div>
        </div>
      </Card>

      <ModalAction
        attendance_id={state.filter.attendance}
        arr_date={state.arr_date}
        action_employee_id={state.action_employee_id}
        action_status_ed={state.action_status_ed}
        action_status={state.action_status}
        modal={state.modal}
        toggleModal={toggleModal}
        action_employee_detail={state.action_employee_detail}
        moduleName={moduleName}
        metas={metas}
        date_from={state.date_from}
        date_to={state.date_to}
        metas_status_options={metas_status_options}
        loadTableAttendance={loadTableAttendance}
        setDisabledButtonHeader={setDisabledButtonHeader}
        checked_employee_id={state.checked_employee_id}
        submit_type={state.submit_type}
        setCheckedEmployeeId={setCheckedEmployeeId}
        checked_employee_id_approve_reject={
          state.checked_employee_id_approve_reject
        }
        checked_action_employee_detail_approve_reject={
          state.checked_action_employee_detail_approve_reject
        }
        checked_employee_id_confirm_revert={
          state.checked_employee_id_confirm_revert
        }
        checked_action_employee_detail_confirm_revert={
          state.checked_action_employee_detail_confirm_revert
        }
        showInfoEmployeeAttendance={state.showInfoEmployeeAttendance}
        loadData={loadDataInfoEmployee}
      />
    </Fragment>
  )
}

export default Attendance
