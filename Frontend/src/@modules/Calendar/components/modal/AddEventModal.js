// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { Fragment, useState } from "react"
import { calendarApi } from "../../common/api"
// ** Styles
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { Space } from "antd"
// ** Components
import EventForm from "../addEvent/EventForm"
import notification from "@apps/utility/notification"

const AddEventModal = (props) => {
  const {
    // ** props
    // ** methods
    handleHideAddEventModal,
    loadCalendar
  } = props

  const calendarState = useSelector((state) => state.calendar)
  const { modal, currentCalendar, viewOnly } = calendarState

  const [loading, setLoading] = useState(false)
  const [fileRemove, setFileRemove] = useState([])

  const methods = useForm()
  const { handleSubmit, formState } = methods

  const moduleData = useSelector((state) => state.app.modules["calendars"])
  const moduleName = moduleData.config.name
  const metas = moduleData.metas
  const options = moduleData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const handleCancelModal = () => {
    handleHideAddEventModal()
  }

  const handleSubmitEvent = (values) => {
    setLoading(true)
    if (Object.keys(currentCalendar).length === 0) {
      calendarApi
        .addCalendar(values)
        .then((res) => {
          setLoading(false)
          handleCancelModal()
          notification.showSuccess("notification.create.success")
          loadCalendar()
        })
        .catch((err) => {
          notification.showError("notification.create.error")
          setLoading(false)
        })
    } else {
      values.fileWillDelete = {
        other: {
          attachments: fileRemove
        }
      }
      calendarApi
        .updateCalendar(currentCalendar.id, values)
        .then((res) => {
          setLoading(false)
          handleCancelModal()
          notification.showSuccess("notification.update.success")
          loadCalendar()
        })
        .catch((err) => {
          notification.showError("notification.update.error")
          setLoading(false)
        })
    }
  }

  const handleDelete = () => {
    setLoading(true)
    calendarApi
      .removeCalendar(currentCalendar.id)
      .then((res) => {
        setLoading(false)
        handleCancelModal()
        notification.showSuccess("notification.delete.success")
        loadCalendar()
      })
      .catch((err) => {
        notification.showError("notification.delete.error")
        setLoading(false)
      })
  }

  // ** render
  const renderForm = () => {
    return (
      <EventForm
        currentCalendar={currentCalendar}
        fileRemove={fileRemove}
        viewOnly={viewOnly}
        moduleName={moduleName}
        metas={metas}
        options={options}
        optionsModules={optionsModules}
        methods={methods}
        setFileRemove={setFileRemove}
      />
    )
  }

  const renderSubmitButton = () => {
    if (Object.keys(currentCalendar).length > 0 && !viewOnly) {
      return (
        <Fragment>
          <Button.Ripple
            type="submit"
            color="primary"
            size="md"
            disabled={
              loading || formState.isSubmitting || formState.isValidating
            }>
            {useFormatMessage("modules.calendar.buttons.update")}
          </Button.Ripple>
          <Button.Ripple
            type="button"
            color="danger"
            size="md"
            disabled={
              loading || formState.isSubmitting || formState.isValidating
            }
            onClick={() => handleDelete()}>
            {useFormatMessage("modules.calendar.buttons.delete")}
          </Button.Ripple>
        </Fragment>
      )
    } else if (Object.keys(currentCalendar).length === 0) {
      return (
        <Button.Ripple
          type="submit"
          color="primary"
          size="md"
          disabled={
            loading || formState.isSubmitting || formState.isValidating
          }>
          {useFormatMessage("modules.calendar.buttons.add")}
        </Button.Ripple>
      )
    }

    return ""
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleCancelModal()}
      className="modal-lg"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleCancelModal()}>
        {Object.keys(currentCalendar).length > 0
          ? useFormatMessage("modules.calendar.modals.title.update_event")
          : useFormatMessage("modules.calendar.modals.title.create_event")}
      </ModalHeader>
      <ModalBody>{renderForm()}</ModalBody>
      <ModalFooter>
        <div className="mt-2">
          <form onSubmit={handleSubmit(handleSubmitEvent)}>
            <Space>
              {renderSubmitButton()}
              <Button.Ripple
                type="button"
                color="flat-danger"
                size="md"
                onClick={() => handleCancelModal()}>
                {useFormatMessage("modules.calendar.buttons.cancel")}
              </Button.Ripple>
            </Space>
          </form>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default AddEventModal
