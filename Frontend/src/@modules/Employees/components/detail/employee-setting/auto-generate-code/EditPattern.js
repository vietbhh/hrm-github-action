// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { addLeadingZeros } from "@modules/Employees/common/common"
// ** Styles
import { Row, Col, Button } from "reactstrap"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"

const EditPattern = (props) => {
  const {
    // ** props
    isEdit,
    previewCode,
    methods,
    // ** methods
    setIsEdit,
    setPreviewCode
  } = props

  const { watch, setValue } = methods

  const handleEditPattern = () => {
    setIsEdit(true)
  }

  const handleValidateDecimal = async (val) => {
    if (parseInt(val) > 10) {
      return false
    }

    return true
  }

  // ** effect
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      let currentNumValue = value.current_num
      let decimalValue = value.decimals
      if (type === "change") {
        if (name === "current_num") {
          const newValue = value.current_num.replace(/[^0-9]/g, "")
          currentNumValue = newValue
          setValue("current_num", newValue)
        } else if (name === "decimals") {
          const newValue = value.decimals.replace(/[^0-9]/g, "")
          decimalValue = newValue
          setValue("decimals", newValue)
        }
      }

      if (
        currentNumValue.trim().length === 0 ||
        decimalValue.trim().length === 0
      ) {
        setPreviewCode("")
      } else if (parseInt(decimalValue) > 10) {
        setPreviewCode("")
      } else {
        const code =
          value.text_code + addLeadingZeros(currentNumValue, decimalValue)
        setPreviewCode(code)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // ** render
  const renderEditButton = () => {
    if (!isEdit) {
      return (
        <Button.Ripple
          color="primary"
          outline
          size="sm"
          onClick={() => handleEditPattern()}>
          {useFormatMessage("modules.employee_setting.buttons.edit")}
        </Button.Ripple>
      )
    }

    return ""
  }

  return (
    <Fragment>
      <div>
        <div>
          <div className="d-flex align-items-center justify-content-between mb-1">
            <h6>
              {useFormatMessage("modules.employee_setting.title.id_pattern")}
            </h6>
            <Fragment>{renderEditButton()}</Fragment>
          </div>
          <div className="w-75">
            <Row>
              <Col sm={6}>
                <ErpInput
                  name="text_code"
                  label={useFormatMessage(
                    "modules.employee_setting.fields.text_code"
                  )}
                  required
                  disabled={!isEdit}
                  useForm={methods}
                />
              </Col>
              <Col sm={6}>
                <ErpInput
                  name="decimals"
                  label={useFormatMessage(
                    "modules.employee_setting.fields.decimal"
                  )}
                  required
                  disabled={!isEdit}
                  useForm={methods}
                  validateRules={{
                    validate: {
                      checkDecimal: async (v) =>
                        (await handleValidateDecimal(v)) ||
                        useFormatMessage(
                          "modules.employee_setting.text.error_decimals"
                        )
                    }
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <ErpInput
                  name="current_num"
                  label={useFormatMessage(
                    "modules.employee_setting.fields.current_num"
                  )}
                  required
                  disabled={!isEdit}
                  useForm={methods}
                />
              </Col>
            </Row>
            <Row className="mt-1 mb-1">
              <Col sm={12}>
                <div className="d-flex align-items-center preview-code">
                  <p className="mb-0 me-50 font-weight-bold">
                    {useFormatMessage(
                      "modules.employee_setting.fields.preview"
                    )}
                    :
                  </p>
                  <p className="mb-0 mt-0">{previewCode}</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default EditPattern
