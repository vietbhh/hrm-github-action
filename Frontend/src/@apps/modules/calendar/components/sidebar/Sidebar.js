// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { CardBody, Button } from "reactstrap"
// ** Components
import FilterCalendarTag from "./FilterCalendarTag"

const Sidebar = (props) => {
  const {
    // ** props
    listCalendarTag,
    listCalendar,
    calendarYear,
    filters,
    // ** methods
    setFilter,
    handleShowAddEventModal,
    setListCalendar,
    setCalendarYear,
    setChangeYearType
  } = props

  const handleAddEvent = () => {
    handleShowAddEventModal({
      calendarInfo: {},
      viewOnly: false
    })
  }

  const handleIncreaseYear = () => {
    const newCalendarYear = calendarYear + 1
    setCalendarYear(newCalendarYear)
    setChangeYearType("increase")
  }

  const handleDecreaseYear = () => {
    const newCalendarYear = calendarYear - 1
    setCalendarYear(newCalendarYear)
    setChangeYearType("decrease")
  }

  // ** render
  const renderFilterCalendarTag = () => {
    return (
      <FilterCalendarTag
        listCalendarTag={listCalendarTag}
        listCalendar={listCalendar}
        filters={filters}
        setFilter={setFilter}
        setListCalendar={setListCalendar}
      />
    )
  }

  return (
    <Fragment>
      <div className="calendar-sidebar mt-2">
        <CardBody className="pb-0 mb-1 sidebar-header">
          <div className="d-flex align-items-center mt-50">
            <div className="me-1">
              <h1 className="mb-0 calendar-year ">{calendarYear}</h1>
            </div>
            <div className="d-flex flex-column">
              <i
                className="fas fa-chevron-up year-icon"
                onClick={() => handleIncreaseYear()}
              />
              <i
                className="fas fa-chevron-down year-icon"
                onClick={() => handleDecreaseYear()}
              />
            </div>
          </div>
        </CardBody>
        <CardBody className="ps-25">
          <div>{renderFilterCalendarTag()}</div>
        </CardBody>
      </div>
    </Fragment>
  )
}

export default Sidebar
