// ** React Imports
import moment from "moment"
// ** Styles
import { Space } from "antd"
import "react-datepicker/dist/react-datepicker.css"
// ** Components
import DatePicker from "react-datepicker"
import { useState } from "react"

const CalendarPickerFilter = (props) => {
  const {
    // ** props
    filter,
    // ** methods
    setFilter
  } = props

  const [currentMonth, setCurrentMonth] = useState(filter.from)

  const currentDate = new Date(filter.from)

  const handleChangeDate = (values) => {
    setCurrentMonth(values)
    setFilter({
      from: moment(values).format("YYYY-MM-DD")
    })
  }

  // ** render
  return (
    <div className="calendar-picker-filter">
      <div className="p-50 pt-0">
        <DatePicker
          inline
          showDisabledMonthNavigation
          selected={currentDate}
          onChange={(date) => handleChangeDate(date)}
          renderCustomHeader={({ decreaseMonth, increaseMonth }) => {
            return (
              <div className="d-flex align-items-center justify-content-between pb-50 custom-header-calendar">
                <p className="mb-0 time">
                  {moment(currentMonth).format("MMMM, YYYY")}
                </p>
                <div className="action">
                  <Space>
                    <div
                      className="me-0 action-filter cursor-pointer"
                      onClick={() => {
                        const newMonth = moment(currentMonth).subtract(1, "months")
                        setCurrentMonth(newMonth.format("YYYY-MM-DD"))
                        decreaseMonth()
                      }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        id="Layer_1"
                        x="0px"
                        y="0px"
                        width="6px"
                        height="10px"
                        viewBox="0 0 6 10"
                        enableBackground="new 0 0 6 10"
                        xmlSpace="preserve">
                        {" "}
                        <image
                          id="image0"
                          width="6"
                          height="10"
                          x="0"
                          y="0"
                          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKBAMAAABlIDIAAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAFVBMVEUAAAAQECgREy0RFS4Q GDARFC3////hvtEhAAAABXRSTlMAIN/fINlCIpoAAAABYktHRAZhZrh9AAAACXBIWXMAAAsTAAAL EwEAmpwYAAAAB3RJTUUH5wcaCykjoGXrCQAAAClJREFUCNdjYGBUYmAQCmZgVDUBUg4MQIrBVJGB wTlIgIEFwmBgYDEGAEtPBAK1QaIJAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTI2VDA5OjQx OjM1KzAyOjAwVkdLQQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNy0yNlQwOTo0MTozNSswMjow MCca8/0AAAAASUVORK5CYII="
                        />
                      </svg>
                    </div>
                    <div
                      className="action-filter cursor-pointer"
                      onClick={() => {
                        const newMonth = moment(currentMonth).add(1, "months")
                        setCurrentMonth(newMonth.format("YYYY-MM-DD"))
                        increaseMonth()
                      }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        id="Layer_1"
                        x="0px"
                        y="0px"
                        width="6px"
                        height="10px"
                        viewBox="0 0 6 10"
                        enableBackground="new 0 0 6 10"
                        xmlSpace="preserve">
                        {" "}
                        <image
                          id="image0"
                          width="6"
                          height="10"
                          x="0"
                          y="0"
                          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKBAMAAABlIDIAAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAFVBMVEUAAAAREy0QECgRFS4Q GDARFC3/////mqxyAAAABXRSTlMA3yDfILnfEIYAAAABYktHRAZhZrh9AAAACXBIWXMAAAsTAAAL EwEAmpwYAAAAB3RJTUUH5wcaCyYyTU3XNAAAAClJREFUCNdjEFRgYDAVYmBwDlRgYIEwGBgUgxmY RE2AlAMDkGIwdmAAAE/eBDsPAW3FAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTI2VDA5OjM4 OjUwKzAyOjAwFz5TKAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNy0yNlQwOTozODo1MCswMjow MGZj65QAAAAASUVORK5CYII="
                        />
                      </svg>
                    </div>
                  </Space>
                </div>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}

export default CalendarPickerFilter
