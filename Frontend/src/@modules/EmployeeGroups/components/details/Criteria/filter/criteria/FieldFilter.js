// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import moment from "moment"
// ** Styles
import { Space, Tooltip } from "antd"
import { Button } from "reactstrap"
// ** Components
import { ErpSelect } from "@apps/components/common/ErpField"
import { FieldHandle } from "@apps/utility/FieldHandler"

const FieldFilter = (props) => {
  const {
    // ** props
    filter,
    filterKey,
    filterName,
    filterFieldName,
    filterItem,
    filterIndex,
    fieldFilter,
    operator,
    defaultCriteriaFieldFilter,
    methods,
    methodGroup,
    employeeMetas,
    employeeOptions,
    employeeModuleName,
    // ** methods
    handleSetFilterValue,
    setFilter
  } = props

  const [fieldName, setFieldName] = useState("")
  const [fieldType, setFieldType] = useState("")
  const [optionOperator, setOptionOperator] = useState([])

  const { setValue } = methods

  const optionField = fieldFilter.map((item) => {
    return {
      value: { field: item.field, fieldType: item.fieldType },
      label: item.label
    }
  })

  const handleAddMoreFieldFilter = () => {
    const newFilter = { ...filter }
    const newFilterKey = [
      ...newFilter[filterKey],
      { ...defaultCriteriaFieldFilter }
    ]
    newFilter[filterKey] = newFilterKey
    setFilter(newFilter)
  }

  const handleRemoveFieldFilter = () => {
    const newFilter = { ...filter }
    const newFilterKey = [...newFilter[filterKey]]
    let newCurrentFilter = []
    if (newFilterKey.length > 1) {
      newCurrentFilter = newFilterKey.filter((item, index) => {
        return index !== filterIndex
      })
    } else {
      newFilterKey[0] = defaultCriteriaFieldFilter
      newCurrentFilter = newFilterKey
    }
    newFilter[filterKey] = newCurrentFilter
    setFilter(newFilter)
  }

  const handleChangeField = (el) => {
    const fieldType = el.value.fieldType
    let fieldValue = ""
    if (fieldType === "date") {
      fieldValue = moment()
    }
    handleSetFilterValue(filterKey, filterIndex, {
      field: el,
      operator: "",
      value: fieldValue
    })
  }

  const handleChangeOperator = (el) => {
    handleSetFilterValue(filterKey, filterIndex, {
      operator: el
    })
  }

  const handleChangeValue = (el) => {
    handleSetFilterValue(filterKey, filterIndex, {
      value: el
    })
  }

  // ** effect
  useEffect(() => {
    setValue(`field-${filterFieldName}-${filterIndex}`, filterItem.field)
    const  fieldType = filterItem.field?.value?.fieldType
    let keyOperator = fieldType
    if (fieldType === "select_module") {
      keyOperator = "selectModule"
    } else if (fieldType === "select_option") {
      keyOperator = "selectOption"
    }
    const optionOperatorNew = operator[keyOperator]
    setOptionOperator(optionOperatorNew)
    setValue(`operator-${filterFieldName}-${filterIndex}`, filterItem.operator)
    setFieldName(filterItem?.field?.value?.field)
    setFieldType(filterItem?.field?.value?.fieldType)
    if (filterItem?.field?.value?.fieldType === "date") {
      setValue(
        `value-${filterFieldName}-${filterIndex}`,
        moment(filterItem.value, "YYYY-MM-DD")
      )
    } else if (filterItem?.field?.value?.fieldType === "text") {
      methodGroup.setValue(`value-${filterFieldName}-${filterIndex}`, filterItem.value)
    } else {
      setValue(`value-${filterFieldName}-${filterIndex}`, filterItem.value)
    }
  }, [filterItem])

  // ** render
  const renderType = () => {
    if (filterIndex === 0) {
      return (
        <p className="mb-0">
          {useFormatMessage(
            `modules.employee_groups.text.match_criterial_filter.column.${filterName}`
          )}
          <Tooltip
            placement="top"
            title={useFormatMessage(
              `modules.employee_groups.text.match_criterial_filter.columns_description.${filterName}`
            )}>
            <i className="fal fa-info-circle ms-50 type-icon" />
          </Tooltip>
        </p>
      )
    }

    return ""
  }

  const renderValueField = () => {
    if (fieldType !== "" && fieldType !== "text") {
      return (
        <FieldHandle
          module={employeeModuleName}
          fieldData={{
            ...employeeMetas[fieldName]
          }}
          name={`value-${filterFieldName}-${filterIndex}`}
          nolabel={true}
          useForm={methods}
          className="mt-1"
          options={employeeOptions}
          onChange={(el) => handleChangeValue(el)}
        />
      )
    }
    
    return (
      <FieldHandle
        module={employeeModuleName}
        fieldData={{
          ...employeeMetas[fieldName]
        }}
        name={`value-${filterFieldName}-${filterIndex}`}
        nolabel={true}
        useForm={methodGroup}
        className="mt-1"
        options={employeeOptions}
      />
    )
  }

  const renderAction = () => {
    return (
      <Space>
        <Button.Ripple
          color="primary"
          size="sm"
          onClick={() => handleAddMoreFieldFilter()}>
          <i className="fas fa-plus" />
        </Button.Ripple>
        <Button.Ripple
          color="danger"
          size="sm"
          onClick={() => handleRemoveFieldFilter()}>
          <i className="far fa-times" />
        </Button.Ripple>
      </Space>
    )
  }

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center fly-item">
          <div className="column column-width-type">{renderType()}</div>
          <div className="column column-width">
            <ErpSelect
              name={`field-${filterFieldName}-${filterIndex}`}
              options={optionField}
              nolabel={true}
              isClearable={false}
              useForm={methods}
              className="mt-1"
              onChange={(el) => handleChangeField(el)}
            />
          </div>
          <div className="column column-width">
            <ErpSelect
              name={`operator-${filterFieldName}-${filterIndex}`}
              options={optionOperator}
              nolabel={true}
              isClearable={false}
              useForm={methods}
              className="mt-1"
              onChange={(el) => handleChangeOperator(el)}
            />
          </div>
          <div className="column column-width">{renderValueField()}</div>
        </div>
        <div className="d-flex align-items-center">{renderAction()}</div>
      </div>
    </Fragment>
  )
}

export default FieldFilter
