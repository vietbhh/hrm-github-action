// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import moment from "moment"
// ** Styles
// ** Components
import Header from "../Common/Header"

const OverviewHeader = (props) => {
  const {
    // ** props
    filterOverview,
    // ** methods
    setFilterOverview
  } = props

  const handleChangeDate  = (value, type) => {
    setFilterOverview({
      [type]: value
    })
  }

  // ** render
  return (
    <div className="w-100 overview-header">
      <Header
        title={useFormatMessage("modules.workspace.title.workspace_overview")}
        from={filterOverview.from}
        to={filterOverview.to}
        handleChangeDate={handleChangeDate}
      />
      <div>
        <p className="time-update-text">
          <i className="fa-duotone fa-calendar-days me-50" />
          {useFormatMessage("modules.workspace.text.data_last_updated_on", {
            date: moment().format("DD/MM/YYYY")
          })}
        </p>
      </div>
      <hr />
    </div>
  )
}

export default OverviewHeader
