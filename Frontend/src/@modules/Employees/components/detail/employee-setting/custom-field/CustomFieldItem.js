// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { getTypeOption } from "@modules/Employees/common/common"
// ** Styles
import { Collapse } from "antd"
import { Col, Row } from "reactstrap"
// ** Components
import ActionCustomField from "./ActionCustomField"
import { ErpCheckbox } from "@apps/components/common/ErpField"

const { Panel } = Collapse

const ListCustomFieldItem = (props) => {
  const {
    // ** props
    customField,
    // ** methods
    handleModal,
    setModalData,
    loadTabContent
  } = props

  const fieldOptions = customField.field_options
  const fieldOptionsValues = customField.field_options?.option_values
  const typeOption = getTypeOption()
  const [fieldTypeInfo] = typeOption.filter((item) => {
    return item.value === customField.field_type
  })

  // ** render
  const renderActionCustomField = () => {
    return (
      <ActionCustomField
        customField={customField}
        handleModal={handleModal}
        setModalData={setModalData}
        loadTabContent={loadTabContent}
      />
    )
  }

  const renderPanelHeader = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center justify-content-between w-100">
          <div>
            <p className="mb-0">
              <i className={`${fieldTypeInfo.icon} me-50 text-primary`} />
              {fieldOptions.name_show}
            </p>
          </div>
          <div>
            <Fragment>{renderActionCustomField()}</Fragment>
          </div>
        </div>
      </Fragment>
    )
  }

  const renderFieldOptionValues = () => {
    if (fieldOptionsValues !== undefined && fieldOptionsValues.length > 0) {
      return (
        <div className="d-flex align-items-start mb-25">
          <div className="me-4">
            <p className="mb-0">
              {useFormatMessage("modules.employee_setting.text.options")}
            </p>
          </div>
          <div className="ms-2">
            {fieldOptionsValues.map((item) => {
              return <p key={`option_values_${item.id}`}>{item.name}</p>
            })}
          </div>
        </div>
      )
    }

    return ""
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
                {useFormatMessage("modules.employee_setting.text.type")}
              </p>
              <p className="mt-0 ms-3">
                <i className={`${fieldTypeInfo.icon} me-50 text-primary`} />
                <span>
                  {useFormatMessage(
                    `modules.employee_setting.modal.field_options.type.${fieldTypeInfo.label}`
                  )}
                </span>
              </p>
            </div>
            <div>
              <Fragment>{renderFieldOptionValues()}</Fragment>
            </div>
            <div>
              <Row className="mb-1">
                <Col sm={12}>
                  <div className="d-flex align-items-center">
                    <ErpCheckbox
                      name="required_field"
                      disabled={true}
                      defaultChecked={fieldOptions.required_field}
                    />
                    <span>
                      {useFormatMessage(
                        "modules.employee_setting.modal.fields.required_field"
                      )}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col sm={12}>
                  <div className="d-flex align-items-center">
                    <ErpCheckbox
                      name="show_in_hiring"
                      disabled={true}
                      defaultChecked={fieldOptions.show_in_hiring}
                    />
                    <span>
                      {useFormatMessage(
                        "modules.employee_setting.modal.fields.show_in_hiring"
                      )}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col sm={12}>
                  <div className="d-flex align-items-center">
                    <ErpCheckbox
                      name="show_in_onboarding"
                      disabled={true}
                      defaultChecked={fieldOptions.show_in_onboarding}
                    />
                    <span>
                      {useFormatMessage(
                        "modules.employee_setting.modal.fields.show_in_onboarding"
                      )}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Panel>
      </Collapse>
    </Fragment>
  )
}

export default ListCustomFieldItem
