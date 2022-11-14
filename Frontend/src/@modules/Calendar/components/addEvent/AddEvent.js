// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { calendarApi } from "@apps/modules/calendar/common/api"
// ** Styles
import { Drawer, Space } from "antd"
import { Button, Spinner } from "reactstrap"
// ** Components
import EventForm from "./EventForm"
import notification from "@apps/utility/notification"

const AddEvent = (props) => {
  const {
    // ** props
    loadingCalendarDetail,
    visibleAddEvent,
    currentCalendar,
    // ** methods
    setVisibleAddEvent,
    loadCalendar
  } = props

  const [loading, setLoading] = useState(false)

  const methods = useForm()
  const { handleSubmit, formState } = methods

  const moduleData = useSelector((state) => state.app.modules["calendars"])
  const moduleName = moduleData.config.name
  const metas = moduleData.metas
  const options = moduleData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const handleCloseDrawer = () => {
    setVisibleAddEvent(false)
  }

  const handleSubmitEvent = (values) => {
    setLoading(true)
    if (Object.keys(currentCalendar).length === 0) {
      calendarApi
        .addCalendar(values)
        .then((res) => {
          setLoading(false)
          handleCloseDrawer()
          notification.showSuccess("notification.create.success")
          loadCalendar()
        })
        .catch((err) => {
          notification.showError("notification.create.error")
          setLoading(false)
        })
    } else {
      calendarApi
        .updateCalendar(currentCalendar.id, values)
        .then((res) => {
          setLoading(false)
          handleCloseDrawer()
          notification.showSuccess("notification.update.success")
          loadCalendar()
        })
        .catch((err) => {
          notification.showError("notification.update.error")
          setLoading(false)
        })
    }
  }

  //  ** render
  const renderEventForm = () => {
    return (
      <EventForm
        loadingCalendarDetail={loadingCalendarDetail}
        currentCalendar={currentCalendar}
        moduleName={moduleName}
        metas={metas}
        options={options}
        optionsModules={optionsModules}
        methods={methods}
      />
    )
  }

  return (
    <Drawer
      title={useFormatMessage("modules.calendar.title.add_event")}
      placement="right"
      onClose={() => handleCloseDrawer()}
      visible={visibleAddEvent}
      closable={false}>
      <div>
        <div className="mb-2">{renderEventForm()}</div>
        <div>
          <form onSubmit={handleSubmit(handleSubmitEvent)}>
            <Space>
              <Button.Ripple
                type="submit"
                color="primary"
                size="md"
                disabled={
                  loading || formState.isSubmitting || formState.isValidating
                }>
                {Object.keys(currentCalendar).length > 0
                  ? useFormatMessage("modules.calendar.buttons.update")
                  : useFormatMessage("modules.calendar.buttons.add")}
              </Button.Ripple>
              <Button.Ripple
                type="button"
                color="flat-danger"
                size="md"
                onClick={() => handleCloseDrawer()}>
                {useFormatMessage("modules.calendar.buttons.cancel")}
              </Button.Ripple>
            </Space>
          </form>
        </div>
      </div>
    </Drawer>
  )
}

export default AddEvent
