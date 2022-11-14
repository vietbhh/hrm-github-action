// ** React Imports
import {
  formatDate,
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import {
  formatHour,
  getTimeAttendance
} from "@modules/Attendances/common/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { useEffect } from "react"
// ** Styles
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap"
import { Drawer } from "antd"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import PerfectScrollbar from "react-perfect-scrollbar"

const ListNoteLogAttendanceModal = (props) => {
  const {
    // ** props
    modal,
    currentAttendanceDetailData,
    optionsAttendanceLog,
    // ** methods
    handleModal
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    page: 1,
    hasMore: false,
    attendanceLog: []
  })

  const handleLoadMore = () => {
    setState({
      page: state.page + 1
    })
  }

  // ** effect
  useEffect(() => {
    setState({
      loading: true
    })
    defaultModuleApi
      .getList("attendance_logs", {
        page: state.page,
        filters: {
          attendance_detail: currentAttendanceDetailData.id
        }
      })
      .then((res) => {
        setState({
          attendanceLog: [...state.attendanceLog, ...res.data.results],
          hasMore: res.data.hasMore,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          hasMore: false,
          loading: false
        })
      })
  }, [state.page])

  useEffect(() => {
    if (modal === true) {
      document.body.style.overflow = "hidden"
    }
  }, [modal])

  // ** render
  const renderContentNote = (item) => {
    if (
      parseInt(item.type.value) ===
      getOptionValue(optionsAttendanceLog, "type", "attendance")
    ) {
      return (
        <span>
          {useFormatMessage(item.clock_type.label)}{" "}
          {useFormatMessage("modules.attendance_logs.text.at")}{" "}
          {formatHour(item.clock)}
        </span>
      )
    } else if (
      parseInt(item.type.value) ===
      getOptionValue(optionsAttendanceLog, "type", "editpaidtime")
    ) {
      const noteItem = JSON.parse(item.note)
      const fromTime = getTimeAttendance(noteItem.time_from * 1)
      const toTime = getTimeAttendance(noteItem.time_to * 1)
      return (
        <span>
          {useFormatMessage("modules.attendance_logs.text.edited")}{" "}
          <b>
            {" "}
            {useFormatMessage("modules.attendance_details.fields.paid_time")}
          </b>{" "}
          {useFormatMessage("modules.attendance_logs.text.from")}{" "}
          <b>
            {fromTime.hours}h {fromTime.minutes}m
          </b>{" "}
          {useFormatMessage("modules.attendance_logs.text.to")}{" "}
          <b>
            {toTime.hours}h {toTime.minutes}m
          </b>
        </span>
      )
    } else if (
      parseInt(item.type.value) ===
      getOptionValue(optionsAttendanceLog, "type", "editovertime")
    ) {
      const noteItem = JSON.parse(item.note)
      const fromTime = getTimeAttendance(noteItem.time_from * 1)
      const toTime = getTimeAttendance(noteItem.time_to * 1)
      return (
        <span>
          {useFormatMessage("modules.attendance_logs.text.edited")}{" "}
          <b>
            {" "}
            {useFormatMessage("modules.attendance_details.fields.overtime")}
          </b>{" "}
          {useFormatMessage("modules.attendance_logs.text.from")}{" "}
          <b>
            {fromTime.hours}h {fromTime.minutes}m
          </b>{" "}
          {useFormatMessage("modules.attendance_logs.text.to")}{" "}
          <b>
            {toTime.hours}h {toTime.minutes}m
          </b>
        </span>
      )
    }
  }

  const renderContentMessage = (item) => {
    if (
      parseInt(item.type.value) ===
      getOptionValue(optionsAttendanceLog, "type", "attendance")
    ) {
      return item.note
    } else if (
      parseInt(item.type.value) ===
        getOptionValue(optionsAttendanceLog, "type", "editpaidtime") ||
      parseInt(item.type.value) ===
        getOptionValue(optionsAttendanceLog, "type", "editovertime")
    ) {
      const noteItem = JSON.parse(item.note)
      return noteItem.message
    }
  }

  const renderLoadMoreButton = () => {
    return (
      <p className="pt-2 pb-2 text-center">
        <Button.Ripple
          color="flat-success"
          size="md"
          onClick={() => handleLoadMore()}>
          {useFormatMessage("modules.attendance_logs.buttons.load_more")}
        </Button.Ripple>
      </p>
    )
  }

  const renderModal = () => {
    return (
      <Drawer
        title={useFormatMessage("modules.attendance_logs.title.list_note")}
        placement="right"
        onClose={() => handleModal()}
        visible={modal}
        className="attendance-note-log-modal"
        >
        {state.attendanceLog.map((item) => {
          return (
            <div
              key={`attendance-log-note-${item.id}`}
              className="attendance-note-log-item">
              <div className="left-content">
                <Avatar img={item.employee.icon} imgHeight="40" imgWidth="40" />
              </div>
              <div className="right-content">
                <p className="mb-0">
                  <b>{item.employee.full_name} </b>
                  {renderContentNote(item)}
                </p>
                <p className="mb-0">
                  {formatDate(item.created_at, "DD/MM/YYYY H:m:s")}
                </p>
                <p className="mb-0">{renderContentMessage(item)}</p>
              </div>
            </div>
          )
        })}
        {state.hasMore && renderLoadMoreButton()}
      </Drawer>
    )
  }

  return renderModal()
}

export default ListNoteLogAttendanceModal
