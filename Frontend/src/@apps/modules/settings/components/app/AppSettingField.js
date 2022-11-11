import {
  ErpCheckbox,
  ErpDate,
  ErpFileUpload,
  ErpImageUpload,
  ErpInput,
  ErpNumber,
  ErpRadio,
  ErpSelect,
  ErpSwitch
} from "@apps/components/common/ErpField"
import {
  addComma,
  removeComma,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { Parser } from "expr-eval"
import {
  capitalize,
  filter,
  isBoolean,
  isEmpty,
  isString,
  isUndefined,
  map
} from "lodash"
import moment from "moment"
import React, { useEffect } from "react"
import { Clock } from "react-feather"
import { Label } from "reactstrap"

export const AppSettingField = (props) => {
  const {
    fieldKey,
    type,
    options,
    value,
    onFileDelete,
    updateDataId,
    labelInline,
    useForm,
    field_icon_type,
    field_icon,
    required,
    readOnly,
    defaultValue,
    classSetting,
    id,
    ...rest
  } = props

  const field_default_value = defaultValue
  const field = fieldKey
  const field_type = type
  const field_form_require = required
  const field_readonly = readOnly
  const field_options = options
  const updateData = value
  const prepend =
    field_icon !== "" && field_icon_type === "icon_left" ? (
      <i className={field_icon} />
    ) : (
      ""
    )
  const append =
    field_icon !== "" && field_icon_type === "icon_right" ? (
      <i className={field_icon} />
    ) : (
      ""
    )

  const validateRules = {}
  if (["select_option"].includes(field_type)) {
    if (field_form_require) {
      validateRules.validate = {
        ...validateRules.validate,
        checkSelectRequire: (v) =>
          isEmpty(v) ? useFormatMessage("validate.required") : true
      }
    }
  }
  //END HANDLE VALIDATION

  const overrideProps = rest

  const commonProps = {
    name: field,
    placeholder: "",
    label: useFormatMessage(
      `settings.apps.fields.${field}`,
      {},
      capitalize(field)
    ),
    placeholder: field,
    required: field_form_require,
    labelInline: labelInline,
    readOnly: field_readonly,
    useForm,
    validateRules
  }
  const normalInputProps = {
    defaultValue: !isEmpty(updateData) ? updateData : field_default_value,
    prepend,
    append
  }
  const [state, setState] = useMergedState({
    currentFile: updateData
  })
  useEffect(() => {
    setState({
      currentFile: updateData
    })
  }, [updateData])
  let select_option_multiple = false
  let defaultOptionValues = []

  const dateFormat = "d-m-Y"
  const datetimeFormat = "d-m-Y H:i:s"
  const timeFormat = "H:i:s"

  switch (field_type) {
    case "text":
      return (
        <ErpInput
          type="text"
          {...commonProps}
          {...normalInputProps}
          {...overrideProps}
        />
      )
    case "textarea":
      return (
        <ErpInput
          type="textarea"
          {...commonProps}
          {...normalInputProps}
          {...overrideProps}
        />
      )
    case "number_int":
      const calculate = field_options?.form?.calculate
      const calculateProps = {}
      if (!isEmpty(calculate) && !isUndefined(watch)) {
        const parse = Parser.parse(calculate)
        const vars = {}
        parse.variables().map((variableItem) => {
          const varVal = watch(variableItem) || 0
          vars[variableItem] = removeComma(varVal)
        })
        useEffect(() => {
          setValue(field, addComma(parse.evaluate(vars)))
        }, [vars])
      }
      return (
        <ErpNumber
          type="number"
          {...commonProps}
          {...normalInputProps}
          {...overrideProps}
          {...calculateProps}
        />
      )
    case "number_dec":
      return (
        <ErpNumber
          type="number"
          {...commonProps}
          {...normalInputProps}
          {...overrideProps}
        />
      )
    case "date":
      return (
        <ErpDate
          {...commonProps}
          format={dateFormat}
          defaultValue={isEmpty(updateData) ? field_default_value : updateData}
          {...(isUndefined(setValue)
            ? {}
            : {
                onChange: (values) => {
                  setValue(field, moment(values[0]).format("DD-MM-YYYY"))
                }
              })}
          {...overrideProps}
        />
      )
    case "datetime":
      return (
        <ErpDate
          {...commonProps}
          format={datetimeFormat}
          defaultValue={isEmpty(updateData) ? field_default_value : updateData}
          data-enable-time
          options={{
            enableTime: true,
            time_24hr: true
          }}
          prepend={<i className="far fa-calendar-alt" />}
          {...(isUndefined(setValue)
            ? {}
            : {
                onChange: (values) => {
                  setValue(
                    field,
                    moment(values[0]).format("DD-MM-YYYY HH:mm:ss")
                  )
                }
              })}
          {...overrideProps}
        />
      )
    case "time":
      return (
        <ErpDate
          {...commonProps}
          format={timeFormat}
          defaultValue={isEmpty(updateData) ? field_default_value : updateData}
          options={{
            enableTime: true,
            noCalendar: true,
            time_24hr: true
          }}
          prepend={<Clock size={14} />}
          {...(isUndefined(setValue)
            ? {}
            : {
                onChange: (values) => {
                  setValue(field, moment(values[0]).format("HH:mm"))
                }
              })}
          {...overrideProps}
        />
      )
    case "select_option":
      if (field_options.hasOwnProperty("multiple") && field_options.multiple) {
        select_option_multiple = true
      }

      if (!isEmpty(field_default_value) && isString(field_default_value)) {
        defaultOptionValues = field_default_value.split(",")
      }
      return (
        <ErpSelect
          {...commonProps}
          options={map(options, (item) => ({ label: item, value: item }))}
          isMulti={select_option_multiple}
          defaultValue={
            !isEmpty(updateData)
              ? {
                  label: updateData,
                  value: updateData
                }
              : map(
                  filter(options, (itemFilter) =>
                    defaultOptionValues.includes(itemFilter)
                  ),
                  (itemMap) => ({ label: itemMap, value: itemMap })
                )
          }
          {...overrideProps}
        />
      )
    case "checkbox":
      if (!isEmpty(field_default_value) && isString(field_default_value)) {
        defaultOptionValues = field_default_value.split(",").map(Number)
      }
      return (
        <div>
          <Label for={commonProps.name}>
            {commonProps.label} {commonProps.required && "*"}
          </Label>
          {options.length > 0 &&
            options.map((item, index) => {
              return (
                <ErpCheckbox
                  key={`${field}_${index}`}
                  {...commonProps}
                  id={`erp_checkbox_${field}_${index}`}
                  label={item}
                  value={item}
                  defaultChecked={
                    isEmpty(updateData)
                      ? defaultOptionValues.some(
                          (dataItem) => dataItem === item
                        )
                      : updateData.some((dataItem) => dataItem === item)
                  }
                  {...overrideProps}
                />
              )
            })}
        </div>
      )
    case "radio":
      return (
        <div>
          <Label for={commonProps.name}>
            {commonProps.label} {commonProps.required && "*"}
          </Label>
          {options.length > 0 &&
            options.map((item, index) => {
              return (
                <ErpRadio
                  key={`${field}_${index}`}
                  {...commonProps}
                  label={item}
                  value={item}
                  defaultChecked={
                    isEmpty(updateData)
                      ? defaultOptionValues.includes(item)
                      : updateData.includes(item)
                  }
                  {...overrideProps}
                />
              )
            })}
        </div>
      )
    case "switch":
      const checkStatus = isEmpty(field_default_value)
        ? false
        : field_default_value
      return (
        <ErpSwitch
          {...commonProps}
          defaultChecked={isBoolean(updateData) ? updateData : checkStatus}
          {...overrideProps}
        />
      )
    case "upload_one":
      return (
        <ErpFileUpload
          {...commonProps}
          default={state.currentFile}
          onFileDelete={(file, fileIndex) => {
            setState({
              currentFile: false
            })
            onFileDelete(file, 0, field)
          }}
          {...overrideProps}
        />
      )
    case "upload_multiple":
      return (
        <ErpFileUpload
          {...commonProps}
          multiple={true}
          default={state.currentFile}
          onFileDelete={(file, fileIndex) => {
            setState({
              currentFile: updateData.filter(
                (item, index) => index !== fileIndex
              )
            })
            onFileDelete(file, fileIndex, field)
          }}
          {...overrideProps}
        />
      )
    case "upload_image":
      return (
        <ErpImageUpload
          {...commonProps}
          default={updateData}
          {...overrideProps}
        />
      )
    default:
      return <ErpInput type="text" {...commonProps} {...overrideProps} />
  }
}
AppSettingField.defaultProps = {
  onFileDelete: () => {}
}
