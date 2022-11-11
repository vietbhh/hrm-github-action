// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import { ErpRadio } from "@apps/components/common/ErpField"

const SelectViewPermission = (props) => {
  const {
    // ** props
    currentCalendar,
    arrViewPermission,
    viewOnly,
    moduleName,
    metas,
    options,
    optionsModules,
    methods
    // ** methods
  } = props

  const [currentOption, setCurrentOptions] = useState(
    currentCalendar?.view_permission_type === undefined ||
      currentCalendar?.view_permission_type === null
      ? "everyone"
      : currentCalendar?.view_permission_type
  )

  // ** effect
  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (type === "change") {
        setCurrentOptions(value.view_permission_type)
      }
    })
    return () => subscription.unsubscribe()
  }, [methods.watch])

  useEffect(() => {
    if (Object.keys(currentCalendar).length > 0) {
      methods.reset({
        view_permission_type: currentOption,
        office: currentCalendar?.office,
        department: currentCalendar?.department,
        specific_employee: currentCalendar?.specific_employee
      })
    } else {
      methods.reset({
        view_permission_type: currentOption
      })
    }
  }, [currentOption])

  // ** render
  const renderOffice = () => {
    return (
      <FieldHandle
        module={moduleName}
        fieldData={metas.office}
        useForm={methods}
        optionsModules={optionsModules}
        nolabel={true}
        isMulti={true}
        required={true}
        readOnly={viewOnly}
      />
    )
  }

  const renderDepartment = () => {
    return (
      <FieldHandle
        module={moduleName}
        fieldData={metas.department}
        useForm={methods}
        optionsModules={optionsModules}
        nolabel={true}
        isMulti={true}
        required={true}
        readOnly={viewOnly}
      />
    )
  }

  const renderSpecificEmployee = () => {
    return (
      <FieldHandle
        module={moduleName}
        fieldData={metas.specific_employee}
        useForm={methods}
        optionsModules={optionsModules}
        nolabel={true}
        isMulti={true}
        required={true}
        readOnly={viewOnly}
      />
    )
  }

  const renderOptions = () => {
    return (
      <Fragment>
        {arrViewPermission.map((item, index) => {
          return (
            <Col sm={3} key={`select_guest_${index}`}>
              <div className="d-flex align-items-center">
                <ErpRadio
                  name="view_permission_type"
                  value={item.value}
                  className="me-50"
                  useForm={methods}
                  disabled={viewOnly}
                />
                <span>
                  {useFormatMessage(
                    `modules.calendar.field_options.view_permissions.${item.label}`
                  )}
                </span>
              </div>
            </Col>
          )
        })}
      </Fragment>
    )
  }

  const renderSelect = () => {
    if (currentOption === "office") {
      return renderOffice()
    } else if (currentOption === "department") {
      return renderDepartment()
    } else if (currentOption === "specific_employee") {
      return renderSpecificEmployee()
    }

    return ""
  }

  return (
    <Fragment>
      <hr />
      <Row>
        <Col sm={12}>
          <h5 className="mb-1">
            {useFormatMessage("modules.calendar.fields.view_permissions")}
          </h5>
          <Row className="mb-2">{renderOptions()}</Row>
          <Row>{renderSelect()}</Row>
        </Col>
      </Row>
    </Fragment>
  )
}

export default SelectViewPermission
