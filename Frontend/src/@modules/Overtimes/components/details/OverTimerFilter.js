// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import { ErpDate, ErpSelect } from "@apps/components/common/ErpField"

const OverTimerFilter = (props) => {
  const {
    // ** props
    filter,
    options,
    // ** methods
    setFilter
  } = props

  const filterStatus = filter.status === undefined ? [] : filter.status
  const defaultStatus = options.status.filter((item) => {
    return filterStatus.includes(item.value)
  })

  const handleChangeFilter = (name, value, valueType) => {
    let fieldValue = ""
    if (valueType === "date") {
      fieldValue = value.format("YYYY-MM-DD")
    } else if (valueType === "option") {
      fieldValue = value.map((item) => {
        return item.value
      })
    }
    setFilter({
      ...filter,
      [name]: fieldValue
    })
  }

  // ** render
  return (
    <Fragment>
      <Row>
        <Col sm="3">
          <ErpDate
            name="filter_from_date"
            label={useFormatMessage("modules.overtimes.text.from_date")}
            placeholder={useFormatMessage("modules.overtimes.text.from_date")}
            onChange={(value) => handleChangeFilter("from_date", value, "date")}
          />
        </Col>
        <Col sm="3">
          <ErpDate
            name="filter_to_date"
            label={useFormatMessage("modules.overtimes.text.to_date")}
            placeholder={useFormatMessage("modules.overtimes.text.to_date")}
            onChange={(value) => handleChangeFilter("to_date", value, "date")}
          />
        </Col>
        <Col sm="3">
          <ErpSelect
            name="filter_status"
            label={useFormatMessage("modules.overtimes.fields.status")}
            placeholder={useFormatMessage("modules.overtimes.fields.status")}
            onChange={(value) => handleChangeFilter("status", value, "option")}
            options={options.status}
            value={defaultStatus}
            isMulti={true}
            useFormatMessageLabel={true}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default OverTimerFilter
