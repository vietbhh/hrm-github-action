// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import moment from "moment"
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import { ErpDate, ErpSelect } from "@apps/components/common/ErpField"

const Header = (props) => {
  const {
    // ** props
    title,
    from,
    to,
    type,
    // ** methods
    setFilter
  } = props

  // ** render
  const handleChange = (value, type) => {
    setFilter({
      [value]: e
    })
  }

  const handleChangeType = (value) => {
    setFilter({
      type: value
    })
  }

  const renderFilterType = () => {
    const options = [
      {
        label: useFormatMessage(
          "modules.feed.manage_post.options.type.all_posts"
        ),
        value: "all"
      },
      {
        label: useFormatMessage(
          "modules.feed.manage_post.options.type.personal_posts"
        ),
        value: "personal"
      },
      {
        label: useFormatMessage(
          "modules.feed.manage_post.options.type.workspace_posts"
        ),
        value: "workspace"
      }
    ]

    const [defaultValue] = options.filter((item) => {
      return item.value === type
    })

    return (
      <div className="w-30 me-50">
        <ErpSelect
          nolabel={true}
          options={options}
          value={defaultValue}
          onChange={(value) => handleChangeType(value)}
          isClearable={false}
        />
      </div>
    )
  }

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between header-card">
        <h5>{title}</h5>
        <div className="w-50 d-flex align-item-center justify-content-end filter">
          <Fragment>{renderFilterType()}</Fragment>
          <div className="w-30 me-50">
            <ErpDate
              nolabel={true}
              allowClear={false}
              value={from}
              onChange={(e) => handleChange(e, "from")}
            />
          </div>
          <div className="w-30 me-50">
            <ErpDate
              nolabel={true}
              allowClear={false}
              value={to}
              onChange={(e) => handleChange(e, "to")}
            />
          </div>
        </div>
      </div>
      <div>
        <p>
          <i className="far fa-calendar-alt me-50" />
          {useFormatMessage("modules.feed.manage_post.text.time_update", {
            date: moment().format("DD/MM/YYYY")
          })}
        </p>
      </div>
    </Fragment>
  )
}

export default Header
