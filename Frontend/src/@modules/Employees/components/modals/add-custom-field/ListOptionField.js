// ** React Imports
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
// ** Styles
import { Row, Col, Button } from "reactstrap"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"

const ListOptionField = (props) => {
  const {
    // ** props
    listOption,
    // ** methods
    setListOption
  } = props

  const methodsOption = useForm({
    mode: "onSubmit"
  })
  const { reset, watch, getValues } = methodsOption

  const handleRemoveOption = (key) => {
    const newListOption = _.filter({ ...listOption }, (item, index) => {
      return parseInt(index) !== parseInt(key)
    })
    setListOption(newListOption)
  }

  const handleChangeInputValue = (listOption, key, value) => {
    const newListOption = {...listOption}
    const newOption = { ...newListOption[key] }
    newOption.value = value
    newListOption[key] = newOption
    setListOption(newListOption)
  }

  // ** effect
  useEffect(() => {
    if (listOption.length > 0) {
      const optionValue = {}
      _.map(listOption, (item, key) => {
        optionValue[`option_${key}`] = item.value
      })

      reset(optionValue)
    }
  }, [listOption])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        const inputValue = getValues(name)
        const key = name.split("option_").pop()

        handleChangeInputValue(listOption, key, inputValue)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, listOption])

  // ** render
  const renderComponent = () => {
    return (
      <Fragment>
        <div className="list-option-value">
          {_.map(listOption, (item, key) => {
            return (
              <Row key={`option_${key}`} className="mt-0 mb-0">
                <Col sm="10" >
                  <ErpInput
                    name={`option_${key}`}
                    useForm={methodsOption}
                    defaultValue={item.value}
                    className=""
                  />
                </Col>
                <Col sm="2" className="d-flex align-items-center pt-1">
                  <Button.Ripple
                    size="sm"
                    color="danger"
                    outline
                    onClick={() => handleRemoveOption(key)}>
                    {useFormatMessage(
                      "modules.employee_setting.buttons.remove"
                    )}
                  </Button.Ripple>
                </Col>
              </Row>
            )
          })}
        </div>
      </Fragment>
    )
  }
  return <Fragment>{renderComponent()}</Fragment>
}

export default ListOptionField
