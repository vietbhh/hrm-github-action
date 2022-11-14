// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import ListOptionField from "./ListOptionField"

const OptionField = (props) => {
  const {
    // ** props
    listOption,
    methods,
    // ** methods
    setListOption
  } = props

  const handleAddOption = () => {
    let index = 0
    if (Object.keys(listOption).length > 0) {
      const lastKey = Object.keys(listOption).pop()
      index = parseInt(lastKey) + 1
    }

    setListOption({
      ...listOption,
      [index]: {
        value: ""
      }
    })
  }

  // ** render
  const renderListOptionField = () => {
    return (
      <ListOptionField
        listOption={listOption}
        methods={methods}
        setListOption={setListOption}
      />
    )
  }

  return (
    <Fragment>
      <div className="mt-1">
        <div>
          <p className="text-primary mb-0">
            {useFormatMessage("modules.employee_setting.title.options")}
          </p>
        </div>
        <div>
          <Fragment>{renderListOptionField()}</Fragment>
        </div>
        <div className="mt-2">
          <Button.Ripple
            color="flat-primary"
            size="sm"
            onClick={() => handleAddOption()}>
            {useFormatMessage("modules.employee_setting.buttons.add_option")}
          </Button.Ripple>
        </div>
      </div>
    </Fragment>
  )
}

export default OptionField
