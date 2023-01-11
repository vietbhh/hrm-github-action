// ** React Imports
// ** Styles
import { Collapse } from "antd"
// ** Components

const { Panel } = Collapse

const UnmappedField = (props) => {
  const {
    // ** props
    unmappedField,
    // ** methods
    renderCollapseHeader
  } = props

  const number = unmappedField.length
  const collapseHeader = renderCollapseHeader(
    number,
    "unmapped",
    true,
    "orange"
  )

  // ** render
  const renderContent = () => {
    return (
      <div>
        {unmappedField.map((item, index) => {
          return (
            <div key={`unmapped-info-${index}`}>
              <p>
                {item.name} <span className="error-field"> | {item.type}</span>
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Collapse defaultActiveKey={["1"]}>
      <Panel header={collapseHeader} key="1">
        <div className="ms-2 mt-2">{renderContent()}</div>
      </Panel>
    </Collapse>
  )
}

export default UnmappedField
