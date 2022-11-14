// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { ErpCheckbox } from "@apps/components/common/ErpField"

const FilterCalendarTag = (props) => {
  const {
    // ** props
    listCalendarTag,
    filters,
    // ** methods
    setFilter
  } = props

  const listCalendarTagFilter = [...listCalendarTag]
  const calendarTagFilter = filters.calendarTag

  /*const handleChangeFilter = (value, checked) => {
    let newCalendarTagFilter = []
    if (value === "all") {
      newCalendarTagFilter = checked ? ["all"] : []
    } else {
      const newCalendarTag =
        calendarTagFilter.length === 1 && calendarTagFilter[0] === "all"
          ? listCalendarTagFilter.map((item) => item.id)
          : calendarTagFilter
      newCalendarTagFilter = checked
        ? [...newCalendarTag, value]
        : newCalendarTag.filter((item) => item !== value)
      if (newCalendarTagFilter.length === listCalendarTagFilter.length) {
        newCalendarTagFilter = ["all"]
      }
    }
    setFilter({
      calendarTag: newCalendarTagFilter
    })
  }*/

  const handleChangeFilter = (value) => {
    setFilter({
      calendarTag: value
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
                  calendarTagFilter === item.id
                    ? "filter-calendar-tag-active"
                    : ""
                } mb-50 mt-25`}
                key={`filter_calendar_${index}`}
                onClick={() => handleChangeFilter(item.id)}>
                <div
                  className={`filter-calendar-tag calendar-tag-${item.value} me-50`}></div>
                <span>
                  {useFormatMessage(
                    `modules.calendar_tags.fields.value.${item.value}`
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
