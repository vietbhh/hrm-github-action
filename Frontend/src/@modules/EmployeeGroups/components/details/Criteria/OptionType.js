// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { useEffect } from "react"
// ** Styles
// ** Components
import { ErpRadio } from "@apps/components/common/ErpField"

const OptionType = (props) => {
  const {
    // ** props
    employeeGroup,
    groupSettingData,
    methods,
    optionType,
    // ** methods
    setOptionType,
    setShowPreviewButton,
    setShowListEmployeeGroup
  } = props

  const { watch } = methods

  // ** effect
  useEffect(() => {
    const subscription = watch((value) => {
      const watchOption = value["option-type"]
      if (watchOption !== undefined) {
        setOptionType(watchOption)
        if (watchOption === "match_criteria") {
          setShowPreviewButton(true)
          setShowListEmployeeGroup(true)
        } else if (watchOption === "specific_employee") {
          setShowPreviewButton(false)
          setShowListEmployeeGroup(false)
        }
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [watch])

  // ** render
  return (
    <div className="d-flex align-items-center">
      <div className="me-3 d-flex">
        <ErpRadio
          className="me-50"
          name="option-type"
          id="option-type-match-criteria"
          defaultValue="match_criteria"
          defaultChecked={optionType === "match_criteria"}
          useForm={methods}
        />
        <span>
          {useFormatMessage(
            "modules.employee_groups.text.option_match.match_criteria.option"
          )}
        </span>
      </div>
      <div>
        <div className="d-flex">
          <ErpRadio
            className="me-50"
            name="option-type"
            id="option-type-specific-employee"
            defaultValue="specific_employee"
            defaultChecked={optionType === "specific_employee"}
            useForm={methods}
          />
          <span>
            {useFormatMessage(
              "modules.employee_groups.text.option_match.specific_employee.option"
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OptionType
