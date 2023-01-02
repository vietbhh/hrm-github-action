// ** React Imports
// ** Styles
import { Collapse } from "antd"
// ** Components
import RecordSkipContent from "./RecordSkipContent"

const { Panel } = Collapse

const RecordSkip = (props) => {
  const {
    // ** props
    recordSkip,
    // ** methods
    renderCollapseHeader
  } = props

  const number = Object.keys(recordSkip).length
  const collapseHeader = renderCollapseHeader(number, "skipped", true, "red")

  // ** render
  return (
    <Collapse defaultActiveKey={["1"]}>
      <Panel header={collapseHeader} key="1">
        <RecordSkipContent recordSkip={recordSkip} />
      </Panel>
    </Collapse>
  )
}

export default RecordSkip
