import {
  ErpAsyncSelect,
  ErpCheckboxList,
  ErpDate,
  ErpDatetime,
  ErpEditor,
  ErpFileUpload,
  ErpImageUpload,
  ErpInput,
  ErpNumber,
  ErpRadioList,
  ErpSelect,
  ErpSwitch,
  ErpTime,
  ErpUserSelect
} from "@apps/components/common/ErpField"
import {
  addComma,
  fieldLabel,
  removeComma,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { commonApi } from "@apps/utility/commonApi"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { Parser } from "expr-eval"
import {
  filter,
  isArray,
  isBoolean,
  isEmpty,
  isObject,
  isString,
  isUndefined,
  map
} from "lodash"
import Proptypes from "prop-types"
import { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import notification from "./notification"
/*
 *TODO:
 * type upload* - option to set allow file type upload
 * Improve validate case
 *
 */

export const loadOptions = async (
  search,
  loadedOptions,
  {
    page,
    field_select_field_show,
    field_select_module,
    isPaginate = true,
    iconField = null,
    apiProps = {}
  }
) => {
  let result = {
    options: [],
    hasMore: true
  }
  const sendProps = {
    isLoadOption: field_select_field_show,
    search,
    page,
    isPaginate,
    ...loadedOptions,
    ...apiProps
  }
  if (!isEmpty(iconField)) sendProps.optionImgKey = iconField
  await defaultModuleApi.getList(field_select_module, sendProps).then((res) => {
    result = {
      options: res.data.results,
      hasMore: res.data.hasMore,
      additional: {
        page: page + 1,
        field_select_field_show,
        field_select_module
      }
    }
  })
  return result
}

export const FieldHandle = (props) => {
  const optionsModules = useSelector((state) => state.app.optionsModules)
  const userSetting = useSelector((state) => state.auth.settings)
  return (
    <FieldHandleBase
      optionsModules={optionsModules}
      userSetting={userSetting}
      {...props}
    />
  )
}

export const FieldHandleBase = (props) => {
  const {
    module,
    fieldData,
    options,
    updateData,
    onFileDelete,
    updateDataId,
    labelInline,
    optionsModules,
    userSetting,
    useForm,
    ...rest
  } = props

  const setValue = isUndefined(useForm) ? undefined : useForm.setValue
  const watch = isUndefined(useForm) ? undefined : useForm.watch
  const {
    field,
    field_type,
    field_select_field_show,
    field_select_module,
    field_icon_type,
    field_icon,
    field_form_require,
    field_default_value,
    field_readonly,
    field_options,
    field_options_values,
    field_form_unique,
    field_validate_rules
  } = fieldData

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

  //HANDLE VALIDATION
  const validateUnique = async (validateValue) => {
    const validateData = {
      [field]: validateValue
    }
    if (!isEmpty(updateDataId)) {
      validateData.id = updateDataId
    }
    let result = false
    await defaultModuleApi
      .postValidate(module, { data: validateData })
      .then((res) => {
        if (res.data === true) result = true
      })
    return result
  }
  const validateRules = {}
  if (field_form_unique) {
    validateRules.validate = {
      checkUnique: async (v) =>
        (await validateUnique(v)) ||
        useFormatMessage("validate.exists", { name: v })
    }
  }

  if (["select_option", "select_module"].includes(field_type)) {
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
    id: field + "_" + Math.floor(100000 + Math.random() * 900000),
    placeholder: "",
    label: fieldLabel(module, field),
    placeholder: fieldLabel(module, field),
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
  let defaultValState = []
  const { dateFormat, datetimeFormat, timeFormat } = userSetting
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
      const editorMode = field_options?.editorMode
      return editorMode === true ? (
        <ErpEditor {...commonProps} {...normalInputProps} {...overrideProps} />
      ) : (
        <ErpInput
          type="textarea"
          rows="3"
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
          {...overrideProps}
        />
      )
    case "datetime":
      return (
        <ErpDatetime
          {...commonProps}
          format={datetimeFormat}
          defaultValue={isEmpty(updateData) ? field_default_value : updateData}
          {...overrideProps}
        />
      )
    case "time":
      return (
        <ErpTime
          {...commonProps}
          format={timeFormat}
          defaultValue={isEmpty(updateData) ? field_default_value : updateData}
          {...overrideProps}
        />
      )
    case "select_option":
      if (field_options.hasOwnProperty("multiple") && field_options.multiple) {
        select_option_multiple = true
      }

      if (!isEmpty(field_default_value) && isString(field_default_value)) {
        defaultOptionValues = field_default_value.split(",").map(Number)
      }
      if (
        !isEmpty(field_options_values) &&
        isObject(field_options_values) &&
        field_options_values.hasOwnProperty("default")
      ) {
        const defaultMultiple = map(
          filter(
            options[field],
            (item) =>
              item.label ===
                `modules.${module}.app_options.${field}.${field_options_values.default}` &&
              !defaultOptionValues.includes(parseInt(item.value))
          ),
          (item) => parseInt(item.value)
        )
        defaultOptionValues = [...defaultOptionValues, ...defaultMultiple]
      }
      return (
        <ErpSelect
          {...commonProps}
          options={options[field]}
          isMulti={select_option_multiple}
          formatOptionLabel={({ value, label, icon }) => {
            return useFormatMessage(`${label}`, {}, label)
          }}
          defaultValue={
            !isEmpty(updateData)
              ? updateData
              : !isEmpty(defaultOptionValues)
              ? filter(options[field], (item) =>
                  defaultOptionValues.includes(parseInt(item.value))
                )
              : ""
          }
          {...overrideProps}
        />
      )

    case "select_module":
      select_option_multiple = field_options?.multiple ?? false
      const loadOptionsApi = field_options?.loadOptions ?? {}
      if (["users", "employees"].includes(field_select_module)) {
        const exceptSelf = field_options?.condition?.exceptSelf ?? false
        const rankType = field_options?.condition?.rankType ?? "subordinate"
        const rankDirectOnly = field_options?.condition?.rankDirectOnly ?? false
        const rankTarget = field_options?.condition?.rankTarget ?? []
        const filters = field_options?.condition?.filters ?? {}
        const excepts = field_options?.condition?.excepts ?? []
        return (
          <ErpUserSelect
            cacheOptions
            {...commonProps}
            isMulti={select_option_multiple}
            defaultValue={
              !isEmpty(updateData) ? updateData : field_default_value
            }
            exceptSelf={exceptSelf}
            rankType={rankType}
            rankTarget={rankTarget}
            rankDirectOnly={rankDirectOnly}
            filters={filters}
            excepts={excepts}
            loadOptionsApi={loadOptionsApi}
            {...overrideProps}
          />
        )
      } else {
        const isFormatLabel = field_options?.formatLabel ?? false
        let formatLabel = {}
        if (isFormatLabel) {
          formatLabel = {
            formatOptionLabel: ({ value, label, icon }) => {
              return useFormatMessage(
                `modules.${field_select_module}.formatLabel.${label}`,
                {},
                label
              )
            }
          }
        }
        const isLoadPaginate = field_options?.form?.loadPaginate ?? true
        let optionsLists =
          optionsModules?.[field_select_module]?.[field_select_field_show] ?? []
        const creatable = field_options?.form?.allowCreate ?? false
        const creatableProps = {
          allowCreate: creatable
        }
        if (creatable) {
          const [selectedValues, onChangeValues] = useState(
            !isEmpty(updateData) ? updateData : []
          )
          creatableProps.onCreateOption = async (val) => {
            await commonApi
              .addOptionSelect(field_select_module, {
                [field_select_field_show]: val
              })
              .then((res) => {
                const newOpt = {
                  value: res.data.toString(),
                  label: val
                }
                if (select_option_multiple)
                  onChangeValues([...selectedValues, newOpt])
                else onChangeValues(newOpt)
                if (!isUndefined(setValue)) {
                  setValue(field, newOpt)
                }
                if (!isLoadPaginate) {
                  optionsLists = [...optionsLists, newOpt]
                }
              })
              .catch((err) => {
                console.log(err)
                notification.showError({
                  text: useFormatMessage("notification.save.error")
                })
              })
          }
          creatableProps.value = selectedValues
          creatableProps.onChange = onChangeValues
        }

        if (isLoadPaginate) {
          return (
            <ErpAsyncSelect
              cacheOptions
              {...commonProps}
              loadOptions={loadOptions}
              isMulti={select_option_multiple}
              defaultValue={
                !isEmpty(updateData) ? updateData : field_default_value
              }
              additional={{
                page: 1,
                field_select_module,
                field_select_field_show,
                apiProps: loadOptionsApi
              }}
              {...creatableProps}
              {...formatLabel}
              {...overrideProps}
            />
          )
        } else {
          if (!isEmpty(field_default_value) && isString(field_default_value)) {
            defaultOptionValues = field_default_value.split(",").map(Number)
          }
          return (
            <ErpSelect
              {...commonProps}
              options={optionsLists}
              isMulti={select_option_multiple}
              defaultValue={
                !isEmpty(updateData)
                  ? updateData
                  : filter(optionsLists, (item) =>
                      defaultOptionValues.includes(parseInt(item.value))
                    )
              }
              {...creatableProps}
              {...formatLabel}
              {...overrideProps}
            />
          )
        }
      }
    case "checkbox":
      if (!isEmpty(field_default_value) && isString(field_default_value)) {
        defaultOptionValues = field_default_value.split(",").map(Number)
      }
      if (
        !isEmpty(field_options_values) &&
        isObject(field_options_values) &&
        field_options_values.hasOwnProperty("default")
      ) {
        const defaultMultiple = options[field]
          .filter(
            (item) =>
              item.name_option === field_options_values.default &&
              !defaultOptionValues.includes(parseInt(item.value))
          )
          .map((item) => parseInt(item.value))
        defaultOptionValues = [...defaultOptionValues, ...defaultMultiple]
      }

      defaultValState = []
      if (!isEmpty(options[field])) {
        options[field].forEach((item) => {
          const itemVal = parseInt(item.value)
          if (isEmpty(updateData)) {
            if (defaultOptionValues.some((dataItem) => dataItem === itemVal))
              defaultValState.push(itemVal.toString())
          } else {
            if (
              isObject(updateData) &&
              updateData.hasOwnProperty("value") &&
              parseInt(updateData.value) === itemVal
            ) {
              defaultValState.push(itemVal.toString())
            }
            if (isArray(updateData)) {
              if (
                updateData.some(
                  (dataItem) => parseInt(dataItem.value) === itemVal
                )
              )
                defaultValState.push(itemVal.toString())
            }
          }
        })
      }
      return (
        <Fragment>
          <ErpCheckboxList
            defaultValue={defaultValState}
            optionsList={options[field]}
            inline={false}
            {...commonProps}
            {...overrideProps}
          />
        </Fragment>
      )
    case "checkbox_module":
      if (!isEmpty(field_default_value) && isString(field_default_value)) {
        defaultOptionValues = field_default_value.split(",").map(Number)
      }
      if (
        !isEmpty(field_options_values) &&
        isObject(field_options_values) &&
        field_options_values.hasOwnProperty("default")
      ) {
        const defaultMultiple = optionsModules[field_select_module][
          field_select_field_show
        ]
          .filter(
            (item) =>
              item.name_option === field_options_values.default &&
              !defaultOptionValues.includes(parseInt(item.value))
          )
          .map((item) => parseInt(item.value))
        defaultOptionValues = [...defaultOptionValues, ...defaultMultiple]
      }

      defaultValState = []
      if (
        !isEmpty(optionsModules[field_select_module][field_select_field_show])
      ) {
        optionsModules[field_select_module][field_select_field_show].forEach(
          (item) => {
            const itemVal = parseInt(item.value)
            if (isEmpty(updateData)) {
              if (defaultOptionValues.some((dataItem) => dataItem === itemVal))
                defaultValState.push(itemVal.toString())
            } else {
              if (
                isObject(updateData) &&
                updateData.hasOwnProperty("value") &&
                parseInt(updateData.value) === itemVal
              ) {
                defaultValState.push(itemVal.toString())
              }
              if (isArray(updateData)) {
                if (
                  updateData.some((dataItem) => {
                    if (_.isObject(dataItem)) {
                      return parseInt(dataItem.value) === itemVal
                    } else {
                      return parseInt(dataItem) === itemVal
                    }
                  })
                )
                  defaultValState.push(itemVal.toString())
              }
            }
          }
        )
      }

      return (
        <Fragment>
          <ErpCheckboxList
            defaultValue={defaultValState}
            optionsList={
              optionsModules[field_select_module][field_select_field_show]
            }
            {...commonProps}
            {...overrideProps}
          />
        </Fragment>
      )
    case "radio":
      defaultOptionValues = ""
      if (
        !isEmpty(field_options_values) &&
        isObject(field_options_values) &&
        field_options_values.hasOwnProperty("default")
      ) {
        const defaultMultiple = options[field]
          .filter((item) => item.name_option === field_options_values.default)
          .map((item) => item.value)
        defaultOptionValues = !isEmpty(defaultMultiple)
          ? defaultMultiple[0]
          : ""
      }
      if (!isEmpty(updateData)) {
        defaultOptionValues = updateData?.value
      }
      return (
        <Fragment>
          <ErpRadioList
            defaultValue={defaultOptionValues}
            optionsList={options[field]}
            inline={false}
            {...commonProps}
            {...overrideProps}
          />
        </Fragment>
      )
    case "radio_module":
      defaultOptionValues = ""
      if (!isEmpty(field_default_value)) {
        defaultOptionValues = field_default_value
      }
      if (!isEmpty(updateData)) {
        defaultOptionValues = updateData?.value
      }
      return (
        <Fragment>
          <ErpRadioList
            defaultValue={defaultOptionValues}
            optionsList={
              optionsModules[field_select_module][field_select_field_show]
            }
            {...commonProps}
            {...overrideProps}
          />
        </Fragment>
      )
    case "switch":
      const checkStatus = isEmpty(field_default_value)
        ? false
        : field_default_value
      return (
        <ErpSwitch
          {...commonProps}
          defaultValue={isBoolean(updateData) ? updateData : checkStatus}
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
              currentFile: state.currentFile.filter(
                (item, index) => item.fileName !== file.fileName
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
          multiple={true}
          default={updateData}
          {...overrideProps}
        />
      )
    default:
      return <ErpInput type="text" {...commonProps} {...overrideProps} />
  }
}

const defaultProps = {
  nolabel: false,
  labelInline: false
}

const defaultPropType = {
  module: Proptypes.object.isRequired,
  fieldData: Proptypes.object.isRequired,
  useForm: Proptypes.object,
  validateRules: Proptypes.object,
  options: Proptypes.object,
  updateData: Proptypes.object,
  onFileDelete: Proptypes.func,
  updateDataId: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
  nolabel: Proptypes.bool,
  labelInline: Proptypes.bool
}

FieldHandle.defaultProps = {
  ...defaultProps
}

FieldHandle.propType = {
  ...defaultPropType
}

FieldHandleBase.defaultProps = {
  ...defaultProps,
  userSetting: {
    dateFormat: "DD/MM/YYYY",
    datetimeFormat: "DD/MM/YYYY HH:mm",
    timeFormat: "HH:mm"
  },
  optionsModules: {}
}

FieldHandleBase.propType = {
  ...defaultPropType
}
