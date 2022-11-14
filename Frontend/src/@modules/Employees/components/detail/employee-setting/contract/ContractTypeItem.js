// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Collapse } from "antd"
import { Badge } from "reactstrap"
// ** Components
import ActionContractType from "./ActionContractType"

const { Panel } = Collapse

const ContractTypeItem = (props) => {
  const {
    // ** props
    contractType,
    // ** methods
    handleModal,
    setModalData,
    loadTabContent
  } = props

  // ** render
  const renderContractTypeAction = () => {
    return (
      <ActionContractType
        contractType={contractType}
        handleModal={handleModal}
        setModalData={setModalData}
        loadTabContent={loadTabContent}
      />
    )
  }

  const renderNoEndDate = () => {
    if (contractType.no_end_date === "1") {
      return (
        <Badge color="primary" className="ms-1">
          {useFormatMessage("modules.contract_type.fields.no_end_date")}
        </Badge>
      )
    }

    return ""
  }

  const renderPanelHeader = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center">
            <p className="mb-0">
              <i className="icpega Briefcase-Portfolio me-50 text-primary" />
              {contractType.name}
            </p>
            <Fragment>{renderNoEndDate()}</Fragment>
          </div>
          <div>
            <Fragment>{renderContractTypeAction()}</Fragment>
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
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
              <p className="mt-0">{contractType.description}</p>
            </div>
          </div>
        </Panel>
      </Collapse>
    </Fragment>
  )
}

export default ContractTypeItem
