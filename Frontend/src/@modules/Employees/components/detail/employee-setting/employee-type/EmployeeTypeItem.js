// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Collapse } from "antd"
// ** Components
import ActionEmployeeType from "./ActionEmployeeType"

const { Panel } = Collapse

const EmployeeTypeItem = (props) => {
  const {
    // ** props
    employeeType,
    // ** methods
    handleModal,
    setModalData,
    loadTabContent
  } = props

  // ** render
  const renderPanelHeader = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center">
            <p className="mb-0">
              <i className="icpega Briefcase-Portfolio me-50 text-primary" />
              {employeeType.name}
            </p>
          </div>
          <div>
            <ActionEmployeeType
              employeeType={employeeType}
              handleModal={handleModal}
              setModalData={setModalData}
              loadTabContent={loadTabContent}
            />
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <Collapse
      expandIcon={(panelProps) => {
        return panelProps.isActive ? (
          <i className="fas fa-angle-down" />
        ) : (
          <i className="fas fa-angle-right" />
        )
      }}
      bordered={false}
      className="mb-1">
      <Panel header={renderPanelHeader()} key="1">
        <div className="ps-2 pe-2 pt-1">
          <div className="d-flex align-items-center mb-25">
            <p className="me-4">
              {useFormatMessage("modules.employee_setting.text.description")}:
            </p>
            <p className="mt-0">{employeeType.description}</p>
          </div>
        </div>
      </Panel>
    </Collapse>
  )
}

export default EmployeeTypeItem
