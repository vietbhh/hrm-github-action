import { ErpCheckbox, ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import { getTaskTypeContent } from "@modules/Checklist/common/common"
import { Space } from "antd"
import { forEach } from "lodash"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Button, Card, CardBody, CardFooter } from "reactstrap"

const SelectEmployeeInformation = (props) => {
  const {
    // ** props
    chosenEmployeeFields,
    // ** methods
    handleOpenSelect,
    updateTaskContent,
    updateChosenEmployeeFields
  } = props

  const employeeData = useSelector((state) => state.app.modules.employees)
  const [searchText, setSearchText] = useState("")
  const [listEmployeeFields, setListEmployeeFields] = useState([])
  const [chosenEmployeeFieldsTemp, setChosenEmployeeFieldsTemp] = useState([])

  const handleCheckOption = (id) => {
    const [fieldsInfo] = listEmployeeFields.filter((item) => {
      return item.id === id
    })
    if (!chosenEmployeeFields.some((item) => item.id === id)) {
      setChosenEmployeeFieldsTemp((oldState) => [...oldState, fieldsInfo])
    } else {
      setChosenEmployeeFieldsTemp((oldState) => {
        return oldState.filter((item) => {
          return item.id !== id
        })
      })
    }
  }

  const getEmployeeOption = () => {
    const employeeOptionField = []

    forEach(employeeData.metas, (value, item) => {
      let checkPush = true
      const showText = useFormatMessage(
        `modules.${value.moduleName}.fields.${value.field}`
      )
      if (value.field_options.show_in_onboarding !== true) {
        checkPush = false
      }

      if (
        searchText !== "" &&
        showText.toLowerCase().search(searchText) === -1
      ) {
        checkPush = false
      }

      if (checkPush) {
        const fieldOption = value.field_options
        employeeOptionField.push({
          id: value.id,
          moduleName: value.moduleName,
          field: fieldOption?.is_custom_field ? fieldOption.name_show : value.field,
          showText: showText
        })
      }
    })
    setListEmployeeFields(employeeOptionField)
  }

  const renderEmployeeOption = () => {
    return listEmployeeFields.map((item) => {
      return (
        <div className="mt-1" key={item.id}>
          <ErpCheckbox
            className="checkbox-employee-info"
            name={`field-${item.field}`}
            label={item.field}
            onChange={() => handleCheckOption(item.id)}
            checked={chosenEmployeeFieldsTemp.some(
              (itemField) => itemField.id === item.id
            )}
          />
        </div>
      )
    })
  }

  const handleSelectAllOption = () => {
    setChosenEmployeeFieldsTemp([...listEmployeeFields])
  }

  const handleClearAllOption = () => {
    setChosenEmployeeFieldsTemp([])
  }

  const handleApply = () => {
    updateChosenEmployeeFields(chosenEmployeeFieldsTemp)
    handleOpenSelect()
    updateTaskContent(getTaskTypeContent(chosenEmployeeFieldsTemp))
  }

  const handleCancel = () => {
    setChosenEmployeeFieldsTemp(chosenEmployeeFields)
    handleOpenSelect()
  }

  useEffect(() => {
    getEmployeeOption()
  }, [searchText])

  useEffect(() => {
    setSearchText("")
  }, [props.showSelect])

  useEffect(() => {
    setChosenEmployeeFieldsTemp(chosenEmployeeFields)
  }, [])

  return (
    <Card className="select-employee-info-popover custom-search-box">
      <CardBody>
        <ErpInput
          placeholder="search..."
          formGroupClass="search-filter"
          prepend={<i className="iconly-Search icli" />}
          nolabel
          onKeyUp={(e) => setSearchText(e.target.value.toLowerCase())}
        />
        <p>{useFormatMessage("modules.checklist.text.system_field")}</p>
        {renderEmployeeOption()}
      </CardBody>
      <CardFooter>
        <Space>
          <Button.Ripple color="success" size="sm" onClick={handleApply}>
            {useFormatMessage("modules.checklist.buttons.apply")}
          </Button.Ripple>
          <Button.Ripple color="warning" size="sm" onClick={handleCancel}>
            {useFormatMessage("modules.checklist.buttons.cancel")}
          </Button.Ripple>
          <Button.Ripple
            size="sm"
            outline
            onClick={() => handleSelectAllOption()}>
            {useFormatMessage("modules.checklist.buttons.select_all")}
          </Button.Ripple>
          <Button.Ripple
            size="sm"
            outline
            onClick={() => handleClearAllOption()}>
            {useFormatMessage("modules.checklist.buttons.clear_all")}
          </Button.Ripple>
        </Space>
      </CardFooter>
    </Card>
  )
}

export default SelectEmployeeInformation
