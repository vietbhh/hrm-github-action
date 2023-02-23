// ** React Imports
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"
import { Col, Row } from "reactstrap"

const FormEditGroupRule = (props) => {
  const {
    // ** props
    methods,
    showInputLabel,
    formEditData
    // ** methods
  } = props

  // ** effect
  useEffect(() => {
    if (formEditData !== undefined) {
      methods.reset({
        title: formEditData.title,
        description: formEditData.description
      })
    }
  }, [])

  // ** render
  return (
    <div className="form-edit-group-rule">
      <FormProvider {...methods}>
        <Row className="p-0 m-0">
          <Col sm={12} className="p-0 pe-1">
            <ErpInput
              name="title"
              nolabel={!showInputLabel}
              label={useFormatMessage(
                "modules.workspace.text.group_rule_title"
              )}
              placeholder={useFormatMessage(
                "modules.workspace.text.group_rule_title"
              )}
              required={true}
              useForm={methods}
            />
          </Col>
        </Row>
        <Row className="p-0 m-0">
          <Col sm={12} className="p-0 pe-1">
            <ErpInput
              name="description"
              type="textarea"
              nolabel={!showInputLabel}
              label={useFormatMessage(
                "modules.workspace.text.group_rule_description"
              )}
              placeholder={useFormatMessage(
                "modules.workspace.text.group_rule_description"
              )}
              required={true}
              useForm={methods}
            />
          </Col>
        </Row>
      </FormProvider>
    </div>
  )
}

export default FormEditGroupRule
