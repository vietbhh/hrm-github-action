// ** React Imports
import { FormProvider, useForm } from "react-hook-form"
import {
  useFormatMessage,
  useMergedState,
  getOptionValue
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { useEffect, useState } from "react"
import { MyAttendanceApi } from "@modules/Attendances/common/api"
import { getCurrentOfficeName } from "@modules/Attendances/common/common"
// ** Styles
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap"
import { Space } from "antd"
// ** Components

const AttendanceLogModal = (props) => {
  const {
    // ** props
    modal,
    infoAttendance,
    attendanceToDay,
    attendanceLocation,
    isOutsideAttendance,
    isNAAttendance,
    employeeOffice,
    isBreakTime,
    moduleName,
    metas,
    options,
    optionsAttendanceLog,
    optionsModules,
    // ** methods
    handleModal,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    clockType: 0
  })

  const [time, setTime] = useState(new Date())
  const [intervalState, setIntervalState] = useState(null)

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const clockTypeClockIn = getOptionValue(options, "clock_type", "clockin")

  const getClockLocationType = (isOutside, isNA) => {
    if (isOutside) {
      return getOptionValue(
        optionsAttendanceLog,
        "clock_location_type",
        "outside"
      )
    } else if (isNA) {
      return getOptionValue(optionsAttendanceLog, "clock_location_type", "na")
    }

    return getOptionValue(optionsAttendanceLog, "clock_location_type", "inside")
  }

  const onSubmit = (values) => {
    setState({
      loading: true
    })
    values.attendance_id = infoAttendance?.id ? infoAttendance.id : 0
    values.type = getOptionValue(options, "type", "attendance")
    values.clock_type = state.clockType
    values.attendance_detail =
      attendanceToDay.id === undefined ? 0 : attendanceToDay.id
    values.clock = time
    values.work_schedule_today = attendanceToDay.work_schedule
    values.clock_location = attendanceLocation
    values.clock_location_type = getClockLocationType(
      isOutsideAttendance,
      isNAAttendance
    )
    values.is_break_time = isBreakTime
    values.office_id = employeeOffice
    MyAttendanceApi.addNewAttendanceLog(values)
      .then((res) => {
        setState({
          loading: false
        })
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleModal()
        loadData()
      })
      .catch((err) => {
        setState({
          loading: false
        })
        notification.showSuccess({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const handleCancelModal = () => {
    clearInterval(intervalState)
    handleModal()
  }

  // ** effect
  useEffect(() => {
    const intervalTemp = setInterval(() => {
      setTime(new Date())
    }, 1000)
    setIntervalState(intervalTemp)
  }, [])

  useEffect(() => {
    if (
      attendanceToDay.is_clock_in_attendance === true ||
      parseInt(attendanceToDay.is_clock_in_attendance) === 1
    ) {
      setState({
        clockType: getOptionValue(options, "clock_type", "clockout")
      })
    } else {
      setState({
        clockType: clockTypeClockIn
      })
    }
  }, [])

  // ** render
  const renderCurrentTime = () => {
    const hour = time.getHours()
    const minute = time.getMinutes()
    const seconds = time.getSeconds()

    return (
      <span>
        {hour}:{minute < 10 ? "0" + minute : minute}:
        {seconds < 10 ? "0" + seconds : seconds}
      </span>
    )
  }

  const renderOutside = () => {
    return (
      <Row className="mt-1">
        <Col sm={12}>
          <p>
            <i className="far fa-map-marker-alt-slash" />{" "}
            {useFormatMessage("modules.attendance_logs.text.outside_clock")}
          </p>
        </Col>
      </Row>
    )
  }

  const renderInside = () => {
    return (
      <Row className="mt-1">
        <Col sm={12}>
          <p>
            <i className="fal fa-map-marker-alt" />{" "}
            {useFormatMessage("modules.attendance_logs.text.at_upper")}{" "}
            <b>{getCurrentOfficeName(optionsModules, employeeOffice)}</b>
          </p>
        </Col>
      </Row>
    )
  }

  const renderNA = () => {
    return (
      <Row className="mt-1">
        <Col sm={12}>
          <p>
            <i className="fal fa-map-marker-exclamation" />{" "}
            {useFormatMessage("modules.attendance_logs.text.na_clock")}
          </p>
        </Col>
      </Row>
    )
  }

  const renderModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="modal-md"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>
          {parseInt(state.clockType) === clockTypeClockIn
            ? useFormatMessage("modules.attendance.modals.title.clock_in")
            : useFormatMessage(
                "modules.attendance.modals.title.clock_out"
              )}{" "}
          {renderCurrentTime()}
        </ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            {isOutsideAttendance && renderOutside()}
            {isNAAttendance && renderNA()}
            {!isOutsideAttendance && !isNAAttendance && renderOutside()}
            <Row className="mt-1">
              <Col sm={12} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.note
                  }}
                  nolabel={true}
                  useForm={methods}
                />
              </Col>
            </Row>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space>
              <Button type="submit" color="primary">
                {parseInt(state.clockType) === clockTypeClockIn
                  ? useFormatMessage("modules.attendance_logs.buttons.clock_in")
                  : useFormatMessage(
                      "modules.attendance_logs.buttons.clock_out"
                    )}
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

  return renderModal()
}

export default AttendanceLogModal
