// ** React Imports
import { FormProvider, useForm } from "react-hook-form"
import { useFormatMessage } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { useEffect, useState } from "react"
import { MyAttendanceApi } from "@modules/Attendances/common/api"
import { getRangeNumber } from "@modules/Attendances/common/common"
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
import notification from "@apps/utility/notification"

const EditPaidTimeModal = (props) => {
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
  const { modalPaidTime, workSchedule } = attendanceState

  const [loading, setLoading] = useState(false)
  const [chosenHours, setChosenHours] = useState(0)
  const [chosenMinutes, setChosenMinutes] = useState(0)
  const [arrHoursDisabled, setArrHoursDisabled] = useState([])
  const [arrMinutesDisabled, setArrMinutesDisabled] = useState([])

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
    MyAttendanceApi.editAttendanceDetailPaidTime(
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
        document.body.style.overflow = "unset"
        dispatch(setCurrentAttendanceDetailDataUpdate(res.data.info_attendance_detail))
        handleModal()
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
        document.body.style.overflow = "unset"
        handleModal()
      })
  }

  const format = "HH:mm"

  const handleDisabledTime = () => {
    const maxHours = 23
    const maxMinutes = 59
    if (currentAttendanceDetailData.work_schedule.working_day !== true) {
      setArrHoursDisabled(getRangeNumber(0, maxHours))
      setArrMinutesDisabled(getRangeNumber(0, maxMinutes))
    } else {
      const totalTime = currentAttendanceDetailData.work_schedule.total
      const totalHours = Math.floor(totalTime)
      setArrHoursDisabled(getRangeNumber(totalHours + 1, maxHours))
      if (chosenHours === totalHours) {
        const totalMinutes = totalTime - Math.floor(totalTime)
        setArrMinutesDisabled(getRangeNumber(totalMinutes + 1, maxMinutes))
      } else {
        setArrMinutesDisabled([])
      }
    }
  }

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
    handleDisabledTime()
  }, [chosenHours])

  useEffect(() => {
    if (modalPaidTime === true) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [modalPaidTime])

  // ** render
  return (
    <Modal
      isOpen={modalPaidTime}
      toggle={() => handleModal()}
      className="modal-md edit-time-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage(
          "modules.attendance_details.modals.title.edit_paid_time"
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
                  Hours
                </label>
                <TimePicker
                  name="hours"
                  format={format}
                  showNow={false}
                  disabledHours={() => arrHoursDisabled}
                  disabledMinutes={() => arrMinutesDisabled}
                  useForm={methods}
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

export default EditPaidTimeModal
