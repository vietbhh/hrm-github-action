import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { EmployeeAttendanceApi } from "@modules/Attendances/common/EmployeeAttendanceApi"
import { map } from "lodash"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap"
import moment from "moment"

const ModalAction = (props) => {
  const {
    attendance_id,
    arr_date,
    action_employee_id,
    action_status_ed,
    action_status,
    modal,
    toggleModal,
    action_employee_detail,
    moduleName,
    metas,
    date_from,
    date_to,
    metas_status_options,
    loadTableAttendance,
    setDisabledButtonHeader,
    checked_employee_id,
    submit_type,
    setCheckedEmployeeId,
    checked_employee_id_approve_reject,
    checked_action_employee_detail_approve_reject,
    checked_employee_id_confirm_revert,
    checked_action_employee_detail_confirm_revert,
    showInfoEmployeeAttendance,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  const convertDateDmy = (date) => {
    return moment(date).format("DD MMM YYYY")
  }

  const onSubmit = (values) => {
    values.attendance_id = attendance_id
    values.arr_date = arr_date
    values.action_employee_id = action_employee_id
    values.action_status = action_status_ed
    values.checked_employee_id = checked_employee_id
    values.submit_type = submit_type
    values.checked_employee_id_approve_reject =
      checked_employee_id_approve_reject
    values.checked_employee_id_confirm_revert =
      checked_employee_id_confirm_revert

    setState({ loading: true })
    EmployeeAttendanceApi.postSaveEmployeeAttendance(values)
      .then((res) => {
        setState({ loading: false })
        toggleModal()
        loadTableAttendance()
        setDisabledButtonHeader()
        setCheckedEmployeeId([])
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        if (showInfoEmployeeAttendance === true) {
          loadData()
        }
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const methods = useForm({
    mode: "all",
    reValidateMode: "onChange"
  })
  const { handleSubmit, reset } = methods

  useEffect(() => {
    reset()
  }, [modal])

  const bgColor = () => {
    if (action_status_ed) {
      if (action_status_ed === "reverted") {
        return metas_status_options["pending"]
      }
      if (action_status_ed === "confirmed") {
        return metas_status_options["approved"]
      }

      return metas_status_options[action_status_ed]
    }

    return ""
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="modal-lg team-attendance"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader
        toggle={() => {
          toggleModal()
        }}>
        {action_status &&
          useFormatMessage(
            `modules.team_attendance.button.${action_status}`
          )}{" "}
        {useFormatMessage(`modules.team_attendance.attendance`)}
      </ModalHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="modal-body">
            <p>
              {action_status &&
                useFormatMessage(`modules.team_attendance.modal.text_body`, {
                  team_attendance_status: action_status,
                  team_attendance_date_from: convertDateDmy(date_from),
                  team_attendance_date_to: convertDateDmy(date_to)
                })}
            </p>
            {submit_type === "record" && (
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div
                  className="select-status"
                  style={{
                    marginTop: "7px",
                    backgroundColor: `${bgColor()}`
                  }}></div>
                <div className="notify">
                  <Avatar
                    style={{ cursor: "default" }}
                    className="img"
                    size="sm"
                    src={action_employee_detail && action_employee_detail.icon}
                  />
                  <span style={{ marginLeft: "7px" }}>
                    {action_employee_detail && action_employee_detail.full_name}
                  </span>
                </div>
              </div>
            )}
            {submit_type === "checkbox" &&
              (action_status === "approve" || action_status === "reject") &&
              map(
                checked_action_employee_detail_approve_reject,
                (value, key) => {
                  return (
                    <div
                      key={key}
                      style={{ display: "flex", marginBottom: "10px" }}>
                      <div
                        className="select-status"
                        style={{
                          marginTop: "7px",
                          backgroundColor: `${bgColor()}`
                        }}></div>
                      <div className="notify">
                        <Avatar
                          style={{ cursor: "default" }}
                          className="img"
                          size="sm"
                          src={value && value.icon}
                        />
                        <span style={{ marginLeft: "7px" }}>
                          {value && value.full_name}
                        </span>
                      </div>
                    </div>
                  )
                }
              )}

            {submit_type === "checkbox" &&
              (action_status === "confirm" || action_status === "revert") &&
              map(
                checked_action_employee_detail_confirm_revert,
                (value, key) => {
                  return (
                    <div
                      key={key}
                      style={{ display: "flex", marginBottom: "10px" }}>
                      <div
                        className="select-status"
                        style={{
                          marginTop: "7px",
                          backgroundColor: `${bgColor()}`
                        }}></div>
                      <div className="notify">
                        <Avatar
                          style={{ cursor: "default" }}
                          className="img"
                          size="sm"
                          src={value && value.icon}
                        />
                        <span style={{ marginLeft: "7px" }}>
                          {value && value.full_name}
                        </span>
                      </div>
                    </div>
                  )
                }
              )}

            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.note,
                field_form_require:
                  action_status !== "approve" && action_status !== "confirm"
              }}
              useForm={methods}
              nolabel
              placeholder={useFormatMessage(
                "modules.team_attendance.fields.note"
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              type="submit"
              color="primary"
              className="btn-change-file"
              onClick={() => {}}
              disabled={state.loading}>
              {state.loading && <Spinner size="sm" className="me-50" />}
              {action_status &&
                useFormatMessage(
                  `modules.team_attendance.button.${action_status}`
                )}
            </Button.Ripple>
            <Button.Ripple
              color="flat-danger"
              onClick={() => {
                toggleModal()
              }}>
              {useFormatMessage("button.close")}
            </Button.Ripple>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default ModalAction
