// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import { FieldHandleBase } from "@apps/utility/FieldHandler"
import { ErpSelect } from "@apps/components/common/ErpField"

const CustomFieldHandle = (props) => {
  const {
    // ** props
    moduleName,
    fieldName,
    fieldData,
    methods,
    options,
    required,
    readOnly,
    nolabel,
    updateData,
    placeholder
    // ** methods
  } = props

  // ** render
  const renderCustomField = () => {
    if (fieldData.field_type === "select_option") {
      const optionValue = fieldData.field_options.option_values
      const customOption = options[fieldName].map((item, index) => {
        return {
          value: item.value,
          label: optionValue[index]["name"]
        }
      })

      return (
        <ErpSelect
          module={moduleName}
          name={fieldName}
          required={required}
          readOnly={readOnly}
          nolabel={nolabel}
          useForm={methods}
          updateData={updateData}
          options={customOption}
          placeholder={placeholder}
          formatOptionLabel={(item) => {
            return (
              <div className="d-flex align-items-center">
                <span>{item.label}</span>
              </div>
            )
          }}
        />
      )
    }

    return (
      <FieldHandleBase
        module={moduleName}
        fieldData={fieldData}
        required={required}
        readOnly={readOnly}
        nolabel={nolabel}
        useForm={methods}
        updateData={updateData}
        placeholder={placeholder}
      />
    )
  }

  return <Fragment>{renderCustomField()}</Fragment>
}

export default CustomFieldHandle
