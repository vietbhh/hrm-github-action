// ** React Imports
import { FormProvider, useForm } from "react-hook-form"
import { useFormatMessage } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { useEffect, useState } from "react"
import { MyAttendanceApi } from "@modules/Attendances/common/api"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { setCurrentAttendanceDetailDataUpdate } from "@modules/Attendances/common/reducer/attendance"
// ** Styles
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
// ** Components
import { Space, TimePicker } from "antd"

const EditOvertimeModal = (props) => {
  const {
    // ** props
    filters,
    employeeAttendance,
    currentAttendanceDetailData,
    metasAttendanceDetail,
    moduleNameAttendanceDetail,
    metasAttendanceLog,
    moduleNameAttendanceLog,
    // ** methods
    handleModal
  } = props

  const attendanceState = useSelector((state) => state.attendance)
  const { modalOvertime, workSchedule } = attendanceState

  const [loading, setLoading] = useState(false)
  const [chosenHours, setChosenHours] = useState(0)
  const [chosenMinutes, setChosenMinutes] = useState(0)

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState } = methods

  const dispatch = useDispatch()

  const onSubmit = (values) => {
    setLoading(true)
    values.employee = employeeAttendance
    values.attendance_id = filters.attendanceId
    values.attendance_detail = currentAttendanceDetailData
    values.hours = chosenHours
    values.minutes = chosenMinutes
    values.work_schedule_today = workSchedule
    MyAttendanceApi.editAttendanceDetailOvertime(
      currentAttendanceDetailData.id.includes("empty_attendance")
        ? 0
        : currentAttendanceDetailData.id,
      values
    )
      .then((res) => {
        setLoading(false)
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        dispatch(setCurrentAttendanceDetailDataUpdate(res.data.info_attendance_detail))
        handleCancelModal()
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
        handleCancelModal()
      })
  }

  const format = "HH:mm"

  const handleSelectHour = (el) => {
    if (el !== undefined) {
      setChosenHours(el.hours())
      setChosenMinutes(el.minutes())
    } else {
      setChosenHours(0)
      setChosenMinutes(0)
    }
  }

  const handleCancelModal = () => {
    document.body.style.overflow = "unset"
    handleModal()
  }

  // ** effect
  useEffect(() => {
    if (modalOvertime === true) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [modalOvertime])

  // ** render
  return (
    <Modal
      isOpen={modalOvertime}
      toggle={() => handleModal()}
      className="modal-md edit-time-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage(
          "modules.attendance_details.modals.title.edit_overtime"
        )}
      </ModalHeader>
      <ModalBody>
        <FormProvider {...methods}>
          <Row className="mt-2">
            <Col sm={6} className="mb-25">
              <FieldHandle
                module={moduleNameAttendanceDetail}
                fieldData={{
                  ...metasAttendanceDetail.date
                }}
                nolabel={false}
                useForm={methods}
                updateData={currentAttendanceDetailData.date}
                readOnly={true}
              />
            </Col>
            <Col sm={6} className="mb-25">
              <div className="form-group time-picker">
                <label htmlFor="hours" title="Hours">
                  {useFormatMessage(
                    "modules.attendance_details.fields.overtime"
                  )}
                </label>
                <TimePicker
                  name="hours"
                  format={format}
                  showNow={false}
                  onSelect={(el) => handleSelectHour(el)}
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={12} className="mb-25">
              <FieldHandle
                module={moduleNameAttendanceLog}
                fieldData={{
                  ...metasAttendanceLog.note
                }}
                nolabel={false}
                useForm={methods}
              />
            </Col>
          </Row>
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space>
            <Button
              type="submit"
              color="primary"
              disabled={
                loading || formState.isSubmitting || formState.isValidating
              }>
              {(loading ||
                formState.isSubmitting ||
                formState.isValidating) && (
                <Spinner size="sm" className="me-50" />
              )}
              {useFormatMessage("button.save")}
            </Button>
            <Button color="flat-danger" onClick={() => handleCancelModal()}>
              {useFormatMessage("button.cancel")}
            </Button>
          </Space>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default EditOvertimeModal
