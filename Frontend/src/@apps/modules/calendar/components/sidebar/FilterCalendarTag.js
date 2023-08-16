// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components

const FilterCalendarTag = (props) => {
  const {
    // ** props
    filters,
    // ** methods
    setFilter
  } = props

  const listCalendarTagFilter = [
    {
      value: "5398ff",
      text: "meetings"
    },
    {
      value: "ff6f2c",
      text: "interviews"
    },
    {
      value: "44d38a",
      text: "family"
    },
    {
      value: "ffc66f",
      text: "time_off"
    },
    {
      value: "f066b9",
      text: "business"
    }
  ]
  const calendarTagFilter = filters.calendarTag

  const handleChangeFilter = (value) => {
    setFilter({
      color: value
    })
  }

  // ** render
  const renderComponent = () => {
    return (
      <Fragment>
        <div className="filter-calendar-container">
          <div
            className={`d-flex align-items-center filter-calendar-item ${
              calendarTagFilter === "all" ? "filter-calendar-tag-active" : ""
            } mb-50`}
            onClick={() => handleChangeFilter("all")}>
            <div className="filter-calendar-tag calendar-tag-all me-50"></div>
            <span>
              {useFormatMessage(`modules.calendar_tags.fields.value.all`)}
            </span>
          </div>
          {listCalendarTagFilter.map((item, index) => {
            return (
              <div
                className={`d-flex align-items-center filter-calendar-item ${
                  calendarTagFilter === item.value
                    ? "filter-calendar-tag-active"
                    : ""
                } mb-50 mt-25`}
                key={`filter_calendar_${index}`}
                onClick={() => handleChangeFilter(item.value)}>
                <div
                  className={`filter-calendar-tag calendar-tag-${item.value} me-50`}></div>
                <span>
                  {useFormatMessage(
                    `modules.calendar_tags.fields.value.${item.text}`
                  )}
                </span>
              </div>
            )
          })}
        </div>
      </Fragment>
    )
  }

  return renderComponent()
}

export default FilterCalendarTag
