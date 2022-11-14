// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { getTypeOption } from "../../../common/common"
// ** Styles
// ** Components
import { ErpSelect } from "@apps/components/common/ErpField"

const SelectFieldType = (props) => {
  const {
    // ** props
    disableType,
    methods,
    // ** methods
    setType
  } = props

  const { watch } = methods

  const typeOption = getTypeOption()

  // ** effect
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && name === "type") {
        setType(value.type?.value)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // ** render
  return (
    <Fragment>
      <ErpSelect
        name="type"
        label={useFormatMessage("modules.employee_setting.modal.fields.type")}
        useForm={methods}
        placeholder={useFormatMessage(
          "modules.employee_setting.modal.text.select_type_placeholder"
        )}
        options={typeOption}
        formatOptionLabel={({ value, label, icon }) => {
          return (
            <div className="d-flex align-items-center">
              <i className={`${icon} me-50`} />
              <span>
                {useFormatMessage(
                  `modules.employee_setting.modal.field_options.type.${label}`
                )}
              </span>
            </div>
          )
        }}
        required
        readOnly={disableType}
      />
    </Fragment>
  )
}

export default SelectFieldType
