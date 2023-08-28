import Avatar from "@apps/modules/download/pages/Avatar"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { isFileList } from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { validateImage } from "@apps/utility/validate"
import "@core/scss/react/libs/flatpickr/flatpickr.scss"
import { Checkbox, DatePicker, Image, Radio, Skeleton, TimePicker } from "antd"
import classnames from "classnames"
import Cleave from "cleave.js/react"
import dayjs from "dayjs"
import "flatpickr/dist/themes/light.css"
import { isArray, isEmpty, isFunction, isObject, map } from "lodash"
import { isUndefined } from "lodash-es"
import PropTypes from "prop-types"
import React, { Fragment, useEffect, useState } from "react"
import { Camera, Paperclip, RefreshCw, X } from "react-feather"
import { Controller } from "react-hook-form"
import Select, { components } from "react-select"
import { AsyncPaginate, withAsyncPaginate } from "react-select-async-paginate"
import Creatable from "react-select/creatable"
import {
  Badge,
  Button,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupText,
  Label
} from "reactstrap"
import { Tooltip, Whisper } from "rsuite"
import Editor from "./Editor"
import CustomInput from "./custominput/CustomInput"
const commonPropsType = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  defaultValue: PropTypes.any,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  formGroupClass: PropTypes.string,
  labelInline: PropTypes.bool,
  inlineClassLabel: PropTypes.string,
  inlineClassInput: PropTypes.string,
  nolabel: PropTypes.bool,
  isInvalid: PropTypes.shape({
    message: PropTypes.string
  }),
  onChange: PropTypes.func,
  innerRef: PropTypes.func
}

const commonProps = {
  inlineClassLabel: "col-md-3",
  inlineClassInput: "col-md-9",
  validateRules: {}
}

const commonDefaultProps = {
  ...commonProps,
  defaultValue: ""
}

const defaultValidate = (required = false) => {
  return {
    required: required ? useFormatMessage("validate.required") : false
  }
}

const handleError = (name, invalid = false, useForm) => {
  let isInvalid = invalid

  if (!isUndefined(useForm)) {
    const {
      formState: { errors }
    } = useForm
    if (!isUndefined(errors?.[name])) isInvalid = errors?.[name]
  }
  return isInvalid
}

const HandleController = (props) => {
  const {
    useForm,
    required,
    validateRules,
    name,
    render,
    defaultValue,
    shouldUnregister
  } = props

  let controllerProps = {}
  if (!isUndefined(useForm)) {
    const { control } = useForm
    controllerProps = {
      ...controllerProps,
      name: name,
      defaultValue: defaultValue,
      control: control,
      shouldUnregister: shouldUnregister,
      rules: { ...defaultValidate(required), ...validateRules },
      render: render
    }
  }
  return isUndefined(useForm) ? (
    render({ name, required })
  ) : (
    <Controller {...controllerProps} />
  )
}

const handleInputId = (name, id) => {
  return isUndefined(id)
    ? name + "_" + Math.floor(100000 + Math.random() * 900000)
    : id
}

export const ErpInput = (props) => {
  const {
    name,
    id,
    type,
    defaultValue,
    required,
    readOnly,
    placeholder,
    formGroupClass,
    labelInline,
    inlineClassLabel,
    inlineClassInput,
    append,
    prepend,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    useForm,
    validateRules,
    render,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  let defaultProps = {
    name,
    type,
    required,
    readOnly,
    placeholder,
    id: inputId
  }
  if (isUndefined(useForm)) {
    defaultProps = {
      ...defaultProps,
      defaultValue: defaultValue
    }
  }
  const controllerProps = {
    name,
    defaultValue,
    useForm,
    required,
    validateRules,
    shouldUnregister: true
  }

  const isInvalid = handleError(name, invalid, useForm)
  const renderInput = () => {
    if (prepend || append) {
      return (
        <React.Fragment>
          <InputGroup
            className={classnames("input-group-merge", {
              [formGroupClass]: formGroupClass,
              "field-locked": readOnly,
              "is-invalid": isInvalid
            })}>
            {prepend && <InputGroupText>{prepend}</InputGroupText>}
            <HandleController
              {...controllerProps}
              render={(useFormProps) => {
                const { field } = useFormProps
                const renderProps = {
                  className: classnames({
                    [className]: className,
                    "is-invalid": isInvalid,
                    "form-control": type === "number"
                  }),
                  ...field,
                  ...defaultProps,
                  ...rest
                }
                if (!isUndefined(render) && isFunction(render)) {
                  return render(renderProps, useFormProps)
                } else {
                  return type === "number" ? (
                    <Cleave
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: "thousand"
                      }}
                      {...renderProps}
                    />
                  ) : (
                    <Input {...renderProps} />
                  )
                }
              }}
            />
            {append && <InputGroupText>{append}</InputGroupText>}
          </InputGroup>
          {isInvalid && (
            <FormFeedback
              style={{
                marginTop: "10px",
                marginBottom: "0px",
                marginLeft: "5px"
              }}>
              {isInvalid.message}
            </FormFeedback>
          )}
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <HandleController
            {...controllerProps}
            render={(useFormProps) => {
              const { field } = useFormProps
              const renderProps = {
                className: classnames({
                  [className]: className,
                  "is-invalid": isInvalid,
                  "form-control": type === "number"
                }),
                ...field,
                ...defaultProps,
                ...rest
              }
              if (!isUndefined(render) && isFunction(render)) {
                return render(renderProps, useFormProps)
              } else {
                return type === "number" ? (
                  <Cleave
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: "thousand"
                    }}
                    {...renderProps}
                  />
                ) : (
                  <Input {...renderProps} />
                )
              }
            }}
          />
          {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
        </React.Fragment>
      )
    }
  }

  return (
    <React.Fragment>
      <div
        className={classnames("form-group", {
          [formGroupClass]: formGroupClass,
          row: labelInline,
          "field-locked": readOnly
        })}>
        {!nolabel && (
          <Fragment>
            <Label
              for={name}
              className={classnames({
                "col-form-label": labelInline,
                [inlineClassLabel]: labelInline
              })}
              title={label}>
              {label} {required && "*"}
            </Label>{" "}
            {labelNote && (
              <Whisper
                trigger="click"
                followCursor
                placement="auto"
                speaker={<Tooltip>{labelNote}</Tooltip>}>
                <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
              </Whisper>
            )}
          </Fragment>
        )}
        {loading && (
          <Skeleton.Input
            active
            block
            size="large"
            {...(type === "textarea" && { style: { height: "80px" } })}
          />
        )}
        {!labelInline && !loading && renderInput()}
        {labelInline && !loading && (
          <div className={classnames(inlineClassInput)}>{renderInput()}</div>
        )}
      </div>
    </React.Fragment>
  )
}
ErpInput.propsTypes = {
  ...commonPropsType,
  type: PropTypes.string
}
ErpInput.defaultProps = {
  ...commonDefaultProps
}

export const ErpNumber = (props) => {
  const {
    name,
    id,
    type,
    defaultValue,
    required,
    readOnly,
    placeholder,
    formGroupClass,
    labelInline,
    inlineClassLabel,
    inlineClassInput,
    append,
    prepend,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    useForm,
    validateRules,
    render,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  let defaultProps = {
    name,
    required,
    readOnly,
    placeholder,
    id: inputId
  }
  if (isUndefined(useForm)) {
    defaultProps = {
      ...defaultProps,
      defaultValue: defaultValue
    }
  }
  const controllerProps = {
    name,
    defaultValue,
    useForm,
    required,
    validateRules,
    shouldUnregister: true
  }
  const isInvalid = handleError(name, invalid, useForm)
  const renderInput = () => {
    if (prepend || append) {
      return (
        <React.Fragment>
          <InputGroup
            className={classnames("input-group-merge", {
              [formGroupClass]: formGroupClass,
              "field-locked": readOnly,
              "is-invalid": isInvalid
            })}>
            {prepend && <InputGroupText>{prepend}</InputGroupText>}
            <HandleController
              {...controllerProps}
              render={(useFormProps) => {
                const { field } = useFormProps
                const renderProps = {
                  className: classnames("form-control", {
                    [className]: className,
                    "is-invalid": isInvalid
                  }),
                  ...field,
                  ...defaultProps,
                  ...rest
                }
                if (!isUndefined(render) && isFunction(render)) {
                  return render(renderProps, useFormProps)
                } else {
                  return (
                    <Cleave
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: "thousand"
                      }}
                      {...renderProps}
                    />
                  )
                }
              }}
            />
            {append && <InputGroupText>{append}</InputGroupText>}
          </InputGroup>
          {isInvalid && (
            <FormFeedback style={{ marginTop: "-1rem", marginBottom: "1rem" }}>
              {isInvalid.message}
            </FormFeedback>
          )}
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <HandleController
            {...controllerProps}
            render={(useFormProps) => {
              const { field } = useFormProps
              const renderProps = {
                className: classnames("form-control", {
                  [className]: className,
                  "is-invalid": isInvalid
                }),
                ...field,
                ...defaultProps,
                ...rest
              }
              if (!isUndefined(render) && isFunction(render)) {
                return render(renderProps, useFormProps)
              } else {
                return (
                  <Cleave
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: "thousand"
                    }}
                    {...renderProps}
                  />
                )
              }
            }}
          />
          {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
        </React.Fragment>
      )
    }
  }
  return (
    <React.Fragment>
      <div
        className={classnames("form-group", {
          [formGroupClass]: formGroupClass,
          row: labelInline,
          "field-locked": readOnly
        })}>
        {!nolabel && (
          <Fragment>
            <Label
              for={name}
              className={classnames({
                "col-form-label": labelInline,
                [inlineClassLabel]: labelInline
              })}
              title={label}>
              {label} {required && "*"}
            </Label>{" "}
            {labelNote && (
              <Whisper
                trigger="click"
                followCursor
                placement="auto"
                speaker={<Tooltip>{labelNote}</Tooltip>}>
                <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
              </Whisper>
            )}
          </Fragment>
        )}
        {loading && <Skeleton.Input active block size="large" />}
        {!labelInline && !loading && renderInput()}
        {labelInline && !loading && (
          <div className={classnames(inlineClassInput)}>{renderInput()}</div>
        )}
      </div>
    </React.Fragment>
  )
}
ErpNumber.propsTypes = {
  ...commonPropsType
}
ErpNumber.defaultProps = {
  ...commonDefaultProps
}

export const ErpDate = (props) => {
  const {
    name,
    id,
    type,
    defaultValue,
    required,
    readOnly,
    placeholder,
    formGroupClass,
    labelInline,
    inlineClassLabel,
    inlineClassInput,
    append,
    prepend,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    format,
    options,
    control,
    useForm,
    validateRules,
    render,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  const formatDefaultValue =
    isUndefined(defaultValue) || isEmpty(defaultValue)
      ? {}
      : {
          defaultValue:
            type === "time" ? dayjs(defaultValue, "HH:mm") : dayjs(defaultValue)
        }
  const defaultProps = {
    name,
    type,
    required,
    readOnly,
    placeholder,
    id: inputId,
    disabled: readOnly,
    ...formatDefaultValue
  }
  const controllerProps = {
    name,
    useForm,
    required,
    validateRules,
    shouldUnregister: true,
    ...formatDefaultValue
  }
  const isInvalid = handleError(name, invalid, useForm)
  const TagName = type === "time" ? TimePicker : DatePicker
  const renderInput = () => {
    return (
      <Fragment>
        <InputGroup className="input-group-merge erp-date">
          <HandleController
            {...controllerProps}
            render={(useFormProps) => {
              const { field } = useFormProps
              const renderProps = {
                className: classnames("form-control", {
                  [className]: className,
                  "is-invalid": isInvalid
                }),
                ...field,
                ...defaultProps,
                ...rest
              }
              if (!isUndefined(render) && isFunction(render)) {
                return render(renderProps, useFormProps)
              } else {
                return <TagName format={format} {...renderProps} />
              }
            }}
          />
          {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
        </InputGroup>
      </Fragment>
    )
  }

  return (
    <div
      className={classnames("form-group", {
        [formGroupClass]: formGroupClass,
        row: labelInline,
        "field-locked": readOnly
      })}>
      {!nolabel && (
        <Fragment>
          <Label
            for={name}
            className={classnames({
              "col-form-label": labelInline,
              [inlineClassLabel]: labelInline
            })}
            title={label}>
            {label} {required && "*"}
          </Label>
          {labelNote && (
            <Whisper
              trigger="click"
              followCursor
              placement="auto"
              speaker={<Tooltip>{labelNote}</Tooltip>}>
              <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
            </Whisper>
          )}
        </Fragment>
      )}
      {loading && <Skeleton.Input active block size="large" />}
      {!labelInline && !loading && renderInput()}
      {labelInline && !loading && (
        <div className={classnames(inlineClassInput)}>{renderInput()}</div>
      )}
    </div>
  )
}
ErpDate.propsTypes = {
  ...commonPropsType,
  type: PropTypes.string,
  format: PropTypes.string,
  options: PropTypes.object,
  control: PropTypes.object
}
ErpDate.defaultProps = {
  ...commonProps,
  type: "date",
  format: "DD/MM/YYYY"
}

export const ErpDatetime = (props) => {
  return <ErpDate showTime={{ format: "HH:mm" }} {...props} />
}
ErpDatetime.propsTypes = {
  ...commonPropsType,
  type: PropTypes.string,
  format: PropTypes.string,
  options: PropTypes.object,
  control: PropTypes.object
}
ErpDatetime.defaultProps = {
  ...commonProps,
  type: "datetime",
  format: "DD/MM/YYYY HH:mm"
}

export const ErpTime = (props) => {
  return <ErpDate showTime={{ format: "HH:mm" }} {...props} />
}
ErpTime.propsTypes = {
  ...commonPropsType,
  type: PropTypes.string,
  format: PropTypes.string,
  options: PropTypes.object,
  control: PropTypes.object
}
ErpTime.defaultProps = {
  ...commonProps,
  type: "time",
  format: "HH:mm"
}

const CustomErpSelectsOption = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      <div
        className={classnames(
          "d-flex justify-content-left align-items-center erpSelect",
          {
            "has-extra": data?.icon || data?.text
          }
        )}>
        {data?.icon && (
          <Fragment>
            {_.isString(data.icon) ? <i className={data.icon}></i> : data.icon}
          </Fragment>
        )}
        <div className="text-label">
          <p>
            {_.isFunction(props.selectProps?.formatOptionLabel)
              ? props.selectProps?.formatOptionLabel({
                  label: data.label
                })
              : data.label}
          </p>
          {data?.text && (
            <small className="text-truncate mb-0">{data.text}</small>
          )}
        </div>
      </div>
    </components.Option>
  )
}
const CustomSingleErpSelect = ({ data, ...props }) => {
  return (
    <components.SingleValue {...props}>
      {!isEmpty(data) && (
        <div
          className={classnames(
            "d-flex flex-wrap align-items-center erpSelect",
            {
              "has-extra": data?.icon || data?.text
            }
          )}>
          {data?.icon && (
            <Fragment>
              {_.isString(data.icon) ? (
                <i className={data.icon}></i>
              ) : (
                data.icon
              )}
            </Fragment>
          )}
          <div className="text-label">
            <p>
              {_.isFunction(props.selectProps?.formatOptionLabel)
                ? props.selectProps?.formatOptionLabel({
                    label: data.label
                  })
                : data.label}
            </p>
            {data?.text && (
              <small className="text-truncate mb-0">{data.text}</small>
            )}
          </div>
        </div>
      )}
    </components.SingleValue>
  )
}
const CustomMultiErpSelect = ({ data, ...props }) => {
  return (
    <components.MultiValueLabel {...props}>
      <div
        className={classnames(
          "d-flex flex-wrap align-items-center erpSelectMulti",
          {
            "has-extra": data?.icon
          }
        )}>
        {data?.icon && (
          <Fragment>
            {_.isString(data.icon) ? <i className={data.icon}></i> : data.icon}
          </Fragment>
        )}
        <span>
          {_.isFunction(props.selectProps?.formatOptionLabel)
            ? props.selectProps?.formatOptionLabel({
                label: data.label
              })
            : data.label}
        </span>
      </div>
    </components.MultiValueLabel>
  )
}

export const ErpSelect = (props) => {
  const {
    name,
    id,
    type,
    defaultValue,
    required,
    readOnly,
    placeholder,
    formGroupClass,
    labelInline,
    inlineClassLabel,
    inlineClassInput,
    append,
    prepend,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    control,
    useForm,
    validateRules,
    useFormatMessageLabel,
    allowCreate,
    onCreateOption,
    onChange,
    render,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  const defaultProps = {
    name,
    type,
    defaultValue,
    required,
    readOnly,
    placeholder,
    id: inputId,
    isDisabled: readOnly
  }
  const controllerProps = {
    name,
    defaultValue,
    useForm,
    required,
    validateRules,
    shouldUnregister: true
  }
  if (isFunction(onChange)) {
    defaultProps.onChange = onChange
  }
  const isInvalid = handleError(name, invalid, useForm)
  if (!isUndefined(useForm)) {
    const { setValue } = useForm
    if (allowCreate) {
      defaultProps.onChange = (value) => {
        setValue(name, value)
        if (isFunction(onChange)) {
          onChange(value)
        }
      }
    }
  }
  if (useFormatMessageLabel) {
    defaultProps.formatOptionLabel = ({ value, label, icon }) => {
      return useFormatMessage(`${label}`)
    }
  }
  const SelectTag = allowCreate ? Creatable : Select
  const renderInput = () => {
    return (
      <Fragment>
        <HandleController
          {...controllerProps}
          render={(useFormProps) => {
            const { field } = useFormProps
            const otherProps = { ...field }
            if (!isUndefined(field?.ref)) delete otherProps.ref
            let renderProps = {
              className: classnames("react-select", {
                [className]: className,
                "is-invalid": isInvalid
              }),
              ...otherProps,
              ...defaultProps,
              ...rest
            }
            if (!isUndefined(field?.ref)) {
              renderProps = {
                ...renderProps,
                inputRef: field.ref,
                selectRef: field.ref
              }
            }
            if (!isUndefined(render) && isFunction(render)) {
              return render(renderProps, useFormProps)
            } else {
              return (
                <SelectTag
                  classNamePrefix="select"
                  isClearable={true}
                  onCreateOption={onCreateOption}
                  components={{
                    Option: CustomErpSelectsOption,
                    SingleValue: CustomSingleErpSelect,
                    MultiValueLabel: CustomMultiErpSelect
                  }}
                  {...renderProps}
                />
              )
            }
          }}
        />
        {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
      </Fragment>
    )
  }
  return (
    <div
      className={classnames("form-group", {
        [formGroupClass]: formGroupClass,
        row: labelInline,
        "field-locked": readOnly
      })}>
      {!nolabel && (
        <Fragment>
          <Label
            for={name}
            className={classnames({
              "col-form-label": labelInline,
              [inlineClassLabel]: labelInline
            })}
            title={label}>
            {label} {required && "*"}
          </Label>
          {labelNote && (
            <Whisper
              trigger="click"
              followCursor
              placement="auto"
              speaker={<Tooltip>{labelNote}</Tooltip>}>
              <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
            </Whisper>
          )}
        </Fragment>
      )}
      {loading && <Skeleton.Input active block size="large" />}
      {!labelInline && !loading && renderInput()}
      {labelInline && !loading && (
        <div className={classnames(inlineClassInput)}>{renderInput()}</div>
      )}
    </div>
  )
}
ErpSelect.propsTypes = {
  ...commonPropsType,
  options: PropTypes.array,
  isMulti: PropTypes.bool,
  useFormatMessageLabel: PropTypes.bool,
  rules: PropTypes.object,
  onCreateOption: PropTypes.func,
  allowCreate: PropTypes.bool
}
ErpSelect.defaultProps = {
  ...commonDefaultProps,
  useFormatMessageLabel: false,
  allowCreate: false,
  onCreateOption: () => {}
}

export const ErpAsyncSelect = (props) => {
  const {
    name,
    id,
    type,
    defaultValue,
    required,
    readOnly,
    placeholder,
    formGroupClass,
    labelInline,
    inlineClassLabel,
    inlineClassInput,
    append,
    prepend,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    control,
    useForm,
    validateRules,
    allowCreate,
    onCreateOption,
    onChange,
    render,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  const defaultProps = {
    name,
    type,
    defaultValue,
    required,
    readOnly,
    placeholder,
    id: inputId,
    isDisabled: readOnly
  }

  const controllerProps = {
    name,
    defaultValue,
    useForm,
    required,
    validateRules,
    shouldUnregister: true
  }

  if (isFunction(onChange)) {
    defaultProps.onChange = onChange
  }
  const isInvalid = handleError(name, invalid, useForm)
  if (!isUndefined(useForm)) {
    const { setValue } = useForm
    if (allowCreate) {
      defaultProps.onChange = (value) => {
        setValue(name, value)
        if (isFunction(onChange)) {
          onChange(value)
        }
      }
    }
  }
  const SelectTag = allowCreate ? withAsyncPaginate(Creatable) : AsyncPaginate
  const renderInput = () => (
    <Fragment>
      <HandleController
        {...controllerProps}
        render={(useFormProps) => {
          const { field } = useFormProps
          const otherProps = { ...field }
          if (!isUndefined(field?.ref)) delete otherProps.ref
          let renderProps = {
            className: classnames("react-select", {
              [className]: className,
              "is-invalid": isInvalid
            }),
            ...otherProps,
            ...defaultProps,
            ...rest
          }
          if (!isUndefined(field?.ref)) {
            renderProps = {
              ...renderProps,
              inputRef: field.ref,
              selectRef: field.ref
            }
          }
          if (!isUndefined(render) && isFunction(render)) {
            return render(renderProps, useFormProps)
          } else {
            return (
              <SelectTag
                classNamePrefix="select"
                isClearable={true}
                debounceTimeout={200}
                onCreateOption={onCreateOption}
                {...renderProps}
              />
            )
          }
        }}
      />
      {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
    </Fragment>
  )

  return (
    <div
      className={classnames("form-group", {
        [formGroupClass]: formGroupClass,
        row: labelInline,
        "field-locked": readOnly
      })}>
      {!nolabel && (
        <Fragment>
          <Label
            for={name}
            className={classnames({
              "col-form-label": labelInline,
              [inlineClassLabel]: labelInline
            })}
            title={label}>
            {label} {required && "*"}
          </Label>
          {labelNote && (
            <Whisper
              trigger="click"
              followCursor
              placement="auto"
              speaker={<Tooltip>{labelNote}</Tooltip>}>
              <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
            </Whisper>
          )}
        </Fragment>
      )}
      {loading && <Skeleton.Input active block size="large" />}
      {!labelInline && !loading && renderInput()}
      {labelInline && !loading && (
        <div className={classnames(inlineClassInput)}>{renderInput()}</div>
      )}
    </div>
  )
}
ErpAsyncSelect.propsTypes = {
  ...commonPropsType,
  options: PropTypes.array,
  control: PropTypes.object,
  isMulti: PropTypes.bool,
  cacheOptions: PropTypes.bool,
  defaultOptions: PropTypes.bool,
  allowCreate: PropTypes.bool,
  rules: PropTypes.object,
  additional: PropTypes.object,
  defaultAdditional: PropTypes.object,
  components: PropTypes.element,
  debounceTimeout: PropTypes.number,
  loadOptions: PropTypes.func.isRequired,
  onCreateOption: PropTypes.func
}
ErpAsyncSelect.defaultProps = {
  ...commonDefaultProps,
  isMulti: false,
  cacheOptions: true,
  defaultOptions: false,
  debounceTimeout: 200,
  allowCreate: false,
  onCreateOption: () => {}
}

export const ErpCheckbox = (props) => {
  const {
    name,
    id,
    invalid,
    inline,
    inlineClassLabel,
    inlineClassInput,
    className,
    useForm,
    validateRules,
    required,
    readOnly,
    loading,
    ...rest
  } = props

  const inputId = handleInputId(name, id)
  let defaultProps = {
    name,
    readOnly,
    required,
    id: inputId,
    disabled: readOnly
  }
  let isInvalid = invalid

  if (!isUndefined(useForm)) {
    const {
      register,
      formState: { errors }
    } = useForm
    const registerProps = register(name, {
      ...defaultValidate(required),
      ...validateRules
    })
    defaultProps = {
      ...defaultProps,
      ...registerProps,
      innerRef: registerProps.ref
    }
    delete defaultProps.ref
    if (!isUndefined(errors?.[name])) isInvalid = errors?.[name]
  }
  return (
    <div className="form-check">
      {loading && <Skeleton.Input active />}
      {!loading && (
        <Fragment>
          <CustomInput
            invalid={isInvalid && true}
            type="checkbox"
            className={classnames({
              [className]: className,
              "field-locked": readOnly,
              "is-invalid": isInvalid
            })}
            {...defaultProps}
            {...rest}
          />
          {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
        </Fragment>
      )}
    </div>
  )
}
ErpCheckbox.propsTypes = {
  ...commonPropsType
}
ErpCheckbox.defaultProps = {
  ...commonProps,
  readOnly: false,
  inline: true,
  multiple: false
}

export const ErpCheckboxList = (props) => {
  const {
    name,
    id,
    required,
    readOnly,
    formGroupClass,
    labelInline,
    inline,
    inlineClassLabel,
    inlineClassInput,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    useForm,
    validateRules,
    value,
    defaultValue,
    optionsList,
    loading,
    ...rest
  } = props

  const inputId = handleInputId(name, id)
  const defaultProps = {
    name,
    required,
    defaultValue,
    id: inputId,
    disabled: readOnly
  }
  const controllerProps = {
    name,
    defaultValue,
    useForm,
    required,
    validateRules,
    shouldUnregister: true
  }
  const isInvalid = handleError(name, invalid, useForm)
  return (
    <Fragment>
      <div
        className={classnames("form-group", {
          [formGroupClass]: formGroupClass,
          "field-locked": readOnly,
          "is-invalid": isInvalid
        })}>
        {!nolabel && (
          <Label
            for={inputId}
            className={classnames("form-label", {
              "col-form-label": labelInline,
              [inlineClassLabel]: labelInline
            })}
            title={label}>
            {label} {required && "*"}
          </Label>
        )}
        {loading && <Skeleton.Input active block />}
        {!loading && (
          <HandleController
            {...controllerProps}
            render={({ field }) => (
              <Checkbox.Group
                className={classnames({
                  [className]: className,
                  "field-locked": readOnly,
                  "d-grid": !isUndefined(inline) && inline === false
                })}
                {...field}
                {...defaultProps}
                {...rest}>
                {optionsList.length > 0 &&
                  map(optionsList, (item, index) => (
                    <Checkbox
                      key={index}
                      className="ant-checkbox-group-item"
                      value={item.value}>
                      {useFormatMessage(item.label)}
                    </Checkbox>
                  ))}
              </Checkbox.Group>
            )}
          />
        )}
      </div>
      {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
    </Fragment>
  )
}
ErpCheckboxList.propsTypes = {
  ...commonPropsType
}
ErpCheckboxList.defaultProps = {
  ...commonDefaultProps,
  readOnly: false
}

export const ErpRadio = (props) => {
  const {
    name,
    id,
    invalid,
    inline,
    inlineClassLabel,
    inlineClassInput,
    className,
    useForm,
    validateRules,
    required,
    readOnly,
    loading,
    ...rest
  } = props

  const inputId = handleInputId(name, id)
  let defaultProps = {
    name,
    readOnly,
    required,
    id: inputId,
    disabled: readOnly
  }
  let isInvalid = invalid

  if (!isUndefined(useForm)) {
    const {
      register,
      formState: { errors }
    } = useForm
    const registerProps = register(name, {
      ...defaultValidate(required),
      ...validateRules
    })
    defaultProps = {
      ...defaultProps,
      ...registerProps,
      innerRef: registerProps.ref
    }
    delete defaultProps.ref
    if (!isUndefined(errors?.[name])) isInvalid = errors?.[name]
  }
  return (
    <Fragment>
      {loading && <Skeleton.Button shape="round" active />}
      {!loading && (
        <Fragment>
          <CustomInput
            invalid={isInvalid && true}
            type="radio"
            className={classnames({
              [className]: className,
              "field-locked": readOnly,
              "is-invalid": isInvalid
            })}
            {...defaultProps}
            {...rest}
          />
          {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
        </Fragment>
      )}
    </Fragment>
  )
}
ErpRadio.propsTypes = {
  ...commonPropsType
}
ErpRadio.defaultProps = {
  ...commonProps,
  readOnly: false
}

export const ErpRadioList = (props) => {
  const {
    name,
    id,
    required,
    readOnly,
    formGroupClass,
    labelInline,
    inline,
    inlineClassLabel,
    inlineClassInput,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    useForm,
    validateRules,
    value,
    defaultValue,
    optionsList,
    loading,
    ...rest
  } = props

  const inputId = handleInputId(name, id)
  const defaultProps = {
    name,
    required,
    defaultValue,
    id: inputId,
    disabled: readOnly
  }
  const controllerProps = {
    name,
    defaultValue,
    useForm,
    required,
    validateRules,
    shouldUnregister: true
  }
  const isInvalid = handleError(name, invalid, useForm)
  return (
    <Fragment>
      <div
        className={classnames("form-group", {
          [formGroupClass]: formGroupClass,
          "field-locked": readOnly,
          "is-invalid": isInvalid
        })}>
        {!nolabel && (
          <Label
            for={inputId}
            className={classnames("form-label", {
              "col-form-label": labelInline,
              [inlineClassLabel]: labelInline
            })}
            title={label}>
            {label} {required && "*"}
          </Label>
        )}
        {loading && <Skeleton.Button shape="round" active block />}
        {!loading && (
          <HandleController
            {...controllerProps}
            render={({ field }) => (
              <Radio.Group
                className={classnames({
                  [className]: className,
                  "field-locked": readOnly,
                  "d-grid": !isUndefined(inline) && inline === false
                })}
                {...field}
                {...defaultProps}
                {...rest}>
                {optionsList.length > 0 &&
                  map(optionsList, (item, index) => (
                    <Radio key={index} value={item.value}>
                      {useFormatMessage(item.label)}
                    </Radio>
                  ))}
              </Radio.Group>
            )}
          />
        )}
      </div>
      {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
    </Fragment>
  )
}
ErpRadioList.propsTypes = {
  ...commonPropsType
}
ErpRadioList.defaultProps = {
  ...commonDefaultProps,
  readOnly: false
}

export const ErpSwitch = (props) => {
  const {
    name,
    id,
    required,
    readOnly,
    formGroupClass,
    labelInline,
    inline,
    inlineClassLabel,
    inlineClassInput,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    useForm,
    validateRules,
    defaultValue,
    defaultChecked,
    checked,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  let defaultCheckValue = undefined
  if (!isUndefined(defaultValue)) defaultCheckValue = defaultValue
  if (!isUndefined(defaultChecked)) defaultCheckValue = defaultChecked
  let checkedValue = undefined
  if (!isUndefined(checked)) checkedValue = checked
  const defaultProps = {
    name,
    required,
    id: inputId,
    disabled: readOnly,
    ...(isUndefined(checkedValue) ? {} : { checked: checkedValue }),
    ...(isUndefined(defaultCheckValue)
      ? {}
      : { defaultChecked: defaultCheckValue })
  }
  if (!isUndefined(useForm)) {
    delete defaultProps.checked
    delete defaultProps.defaultChecked
  }
  const controllerProps = {
    name,
    defaultValue: defaultValue,
    useForm,
    required,
    validateRules,
    shouldUnregister: true
  }
  const isInvalid = handleError(name, invalid, useForm)
  return (
    <Fragment>
      <div
        className={classnames("form-group form-switch", {
          [formGroupClass]: formGroupClass,
          "field-locked": readOnly,
          "ps-0": !labelInline
        })}>
        {!nolabel && (
          <Fragment>
            <Label
              for={inputId}
              className={classnames("form-label", {
                "d-block": !labelInline
              })}
              title={label}>
              {label} {required && "*"}
            </Label>
            {labelNote && (
              <Whisper
                trigger="click"
                followCursor
                placement="auto"
                speaker={<Tooltip>{labelNote}</Tooltip>}>
                <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
              </Whisper>
            )}
          </Fragment>
        )}
        {loading && <Skeleton.Button shape="round" active />}
        {!loading && (
          <Fragment>
            <HandleController
              {...controllerProps}
              render={({ field }) => {
                let checkedVal = {}
                if (!isUndefined(field?.value)) {
                  checkedVal = {
                    checked: field.value
                  }
                }
                return (
                  <Input
                    invalid={isInvalid && true}
                    className={classnames({
                      [className]: className,
                      "field-locked": readOnly,
                      "ms-0": !labelInline
                    })}
                    type="switch"
                    {...checkedVal}
                    {...field}
                    {...defaultProps}
                    {...rest}
                  />
                )
              }}
            />
            {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}
ErpSwitch.propsTypes = {
  ...commonPropsType
}
ErpSwitch.defaultProps = {
  ...commonProps,
  readOnly: false
}

const DisplayFileDownload = ({ file, onFileDelete, fileIndex }) => {
  if (file === undefined) return null
  return (
    <Fragment>
      <Badge color="light-secondary" className="mt-50">
        <DownloadFile fileName={file.fileName} src={file.url}>
          {file.fileName}
        </DownloadFile>
        <Button.Ripple
          onClick={() => {
            onFileDelete(file, fileIndex)
          }}
          className="btn-icon p-0"
          title="Delete this file"
          outline
          size="sm"
          color="flat-danger">
          <X size="13" className="ms-50" style={{ color: "$primary" }} />
        </Button.Ripple>
      </Badge>
    </Fragment>
  )
}
export const ErpFileUpload = (props) => {
  const {
    name,
    id,
    required,
    readOnly,
    formGroupClass,
    labelInline,
    inlineClassLabel,
    inlineClassInput,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    useForm,
    validateRules,
    onFileDelete,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  let requiredCheck = required
  if (!isEmpty(props.default)) {
    requiredCheck = false
  }
  let defaultProps = {
    name,
    required: requiredCheck,
    id: inputId,
    disabled: readOnly
  }
  if (!isUndefined(useForm)) {
    const { register } = useForm
    defaultProps = {
      ...defaultProps,
      ...register(name, {
        ...defaultValidate(requiredCheck),
        ...validateRules
      })
    }
  }

  const isInvalid = handleError(name, invalid, useForm)
  const renderInput = () => {
    return (
      <Fragment>
        <input
          className={classnames("form-control", {
            [className]: className,
            "is-invalid": isInvalid
          })}
          type="file"
          {...defaultProps}
          {...rest}
        />
        {isInvalid ? <FormFeedback>{isInvalid.message}</FormFeedback> : null}
        {!isEmpty(props.default) && (
          <Fragment>
            <Paperclip size="13" className="me-50" />
            {isArray(props.default) ? (
              props.default.map((item, index) => (
                <DisplayFileDownload
                  key={index}
                  file={item}
                  fileIndex={index}
                  onFileDelete={onFileDelete}
                />
              ))
            ) : (
              <DisplayFileDownload
                file={props.default}
                fileIndex={false}
                onFileDelete={onFileDelete}
              />
            )}
          </Fragment>
        )}
      </Fragment>
    )
  }
  return (
    <div
      className={classnames("form-group", {
        [formGroupClass]: formGroupClass,
        "field-locked": readOnly
      })}>
      {!nolabel && (
        <Fragment>
          <Label
            for={name}
            title={label}
            className={classnames({
              "col-form-label": labelInline,
              [inlineClassLabel]: labelInline
            })}>
            {label} {required && "*"}
          </Label>
          {labelNote && (
            <Whisper
              trigger="click"
              followCursor
              placement="auto"
              speaker={<Tooltip>{labelNote}</Tooltip>}>
              <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
            </Whisper>
          )}
        </Fragment>
      )}
      {loading && <Skeleton.Input active block size="large" />}
      {!labelInline && !loading && renderInput()}
      {labelInline && !loading && (
        <div className={classnames(inlineClassInput)}>{renderInput()}</div>
      )}
    </div>
  )
}
ErpFileUpload.propsTypes = commonPropsType
ErpFileUpload.defaultProps = commonDefaultProps

export const ErpImageUpload = (props) => {
  const {
    name,
    required,
    formGroupClass,
    readOnly,
    invalid,
    nolabel,
    label,
    labelNote,
    useForm,
    validateRules,
    onChange,
    disabled,
    allowFile,
    description,
    darkbg,
    onRemoveFile,
    loading
  } = props
  const [state, setState] = useMergedState({
    img:
      isEmpty(props.default) || _.isNumber(props.default)
        ? false
        : props.default,
    isRemote: true
  })

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  let isInvalid = invalid
  if (!isUndefined(useForm)) {
    const { register, errors } = useForm
    register(
      name,
      {
        name: name,
        value: isEmpty(state.img)
          ? ""
          : isObject(state.img)
          ? state.img.url
          : state.img
      },
      { ...defaultValidate(required), ...validateRules }
    )
    if (!isUndefined(errors?.[name])) isInvalid = errors?.[name]
  }

  useEffect(() => {
    if (isFileList(props.default) && props.default.length === 1) {
      setState({
        img: URL.createObjectURL(props.default[0]),
        isRemote: false
      })
      if (!isUndefined(useForm)) {
        useForm.setValue(name, props.default)
      }
    } else {
      setState({
        img:
          isEmpty(props.default) || _.isNumber(props.default)
            ? false
            : props.default,
        isRemote: true
      })
      if (!isUndefined(useForm)) {
        useForm.setValue(
          name,
          isEmpty(props.default) || _.isNumber(props.default)
            ? ""
            : isObject(props.default)
            ? props.default.url
            : props.default
        )
      }
    }
  }, [props.default])
  const handleFile = async (event) => {
    if (validateImage(event.target.files[0])) {
      const img = await readFileAsync(event.target.files[0])
      setState({
        img: img,
        isRemote: false
      })
      if (!isUndefined(useForm)) {
        useForm.setValue(name, event.target.files)
      }
      if (isFunction(onChange)) {
        onChange(event)
      }
    }
  }

  const removeFile = () => {
    setState({
      img: false
    })
    if (!isUndefined(useForm)) {
      useForm.setValue(name, "")
    }
    if (isFunction(onRemoveFile)) {
      onRemoveFile()
    }
  }
  return (
    <div
      className={classnames("form-group", {
        [formGroupClass]: formGroupClass,
        "field-locked": readOnly
      })}>
      {!nolabel && (
        <Fragment>
          <Label for={name} title={label}>
            {label} {required && "*"}
          </Label>
          {labelNote && (
            <Whisper
              trigger="click"
              followCursor
              placement="auto"
              speaker={<Tooltip>{labelNote}</Tooltip>}>
              <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
            </Whisper>
          )}
        </Fragment>
      )}
      {loading && (
        <Skeleton.Input
          active
          block
          size="large"
          style={{
            height: "100px"
          }}
        />
      )}
      {!loading && (
        <div className="erp-image-upload-wrapper">
          <div
            className={classnames(
              "erp-image-upload d-flex align-items-center justify-content-center",
              {
                "dark-bg": darkbg
              }
            )}>
            {state.img && !state.isRemote && (
              <Image src={state.img} alt={name} className="img-fluid" />
            )}
            {state.img && state.isRemote && (
              <Photo
                src={isObject(state.img) ? state.img.url : state.img}
                className="photo img-fluid"
                alt={name}
              />
            )}
            {state.img && (
              <div className="image-action">
                <Button.Ripple
                  tag="label"
                  className="cursor-pointer btn-icon"
                  hidden={disabled || readOnly}
                  color="flat-success">
                  <RefreshCw size={18} />
                  <Input type="file" hidden onChange={handleFile} />
                </Button.Ripple>
                <Button.Ripple
                  className="cursor-pointer btn-icon"
                  hidden={disabled || readOnly}
                  color="flat-danger"
                  onClick={removeFile}>
                  <X size={18} />
                </Button.Ripple>
              </div>
            )}
            {!state.img && (
              <Button.Ripple
                tag="label"
                className="cursor-pointer btn-icon erp-image-upload-icon"
                hidden={disabled || readOnly}
                color="flat-success">
                <Camera size={22} />
                <Input type="file" hidden onChange={handleFile} />
              </Button.Ripple>
            )}
          </div>
          <div className="w-100">
            <div
              className={classnames(
                "d-flex flex-sm-row flex-column justify-content-start px-0",
                {
                  "is-invalid": isInvalid
                }
              )}></div>
            <p className="text-muted m-0 mt-50">
              <small>
                {useFormatMessage("file.fileAllowed", { fileType: allowFile })}
              </small>
            </p>
            {isInvalid ? (
              <FormFeedback>{isInvalid.message}</FormFeedback>
            ) : null}
            {!isEmpty(description) && description}
          </div>
        </div>
      )}
    </div>
  )
}
ErpImageUpload.propsTypes = commonPropsType
ErpImageUpload.defaultProps = {
  ...commonDefaultProps,
  allowFile: "jpg, png"
}
const CustomUsersOption = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      <div className="d-flex justify-content-left align-items-center">
        <Avatar
          userId={data.value}
          className="my-0 me-50"
          size="sm"
          src={data.icon}
        />
        <div className="d-flex flex-column">
          <p className="user-name text-truncate mb-0">
            <span className="fw-bold">{data.full_name}</span>{" "}
            <small className="text-truncate text-username mb-0">
              @{data.label}
            </small>
          </p>
          <small className="text-truncate text-email mb-0">{data.email}</small>
        </div>
      </div>
    </components.Option>
  )
}
const CustomSingleUserSelect = ({ data, ...props }) => {
  return (
    <components.SingleValue {...props}>
      {!isEmpty(data) && (
        <div className="d-flex flex-wrap align-items-center">
          <Avatar
            userId={data.value}
            className="my-0 me-50"
            size="sm"
            src={data.icon}
          />
          <span className="fw-bold">{data.full_name}</span> &nbsp;
          <small className="text-truncate text-muted mb-0">@{data.label}</small>
        </div>
      )}
    </components.SingleValue>
  )
}
const CustomMultiUserSelect = ({ data, ...props }) => {
  return (
    <components.MultiValueLabel {...props}>
      <div className="d-flex flex-wrap align-items-center">
        <Avatar
          userId={data.value}
          className="my-0 me-50"
          size="sm"
          src={data.icon}
        />
        <span className="fw-bold">{data.full_name}</span> &nbsp;
        <small className="text-truncate text-username mb-0">
          @{data.label}
        </small>
      </div>
    </components.MultiValueLabel>
  )
}
export const ErpUserSelect = (props) => {
  const {
    name,
    id,
    type,
    defaultValue,
    required,
    readOnly,
    placeholder,
    formGroupClass,
    labelInline,
    inlineClassLabel,
    inlineClassInput,
    append,
    prepend,
    invalid,
    className,
    nolabel,
    label,
    labelNote,
    control,
    filters,
    exceptSelf,
    excepts,
    rankType,
    rankTarget,
    rankDirectOnly,
    useForm,
    validateRules,
    loadOptionsApi,
    url,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  const defaultProps = {
    name,
    type,
    defaultValue,
    required,
    placeholder,
    readOnly,
    id: inputId,
    isDisabled: readOnly
  }

  const controllerProps = {
    name,
    defaultValue,
    useForm,
    required,
    validateRules,
    shouldUnregister: true
  }

  const isInvalid = handleError(name, invalid, useForm)

  const loadUsers = async (
    search,
    loadedOptions,
    { page, isPaginate = true, apiProps = {} }
  ) => {
    let result = {
      options: [],
      hasMore: true
    }
    const sendProps = {
      isLoadOption: "username",
      optionImgKey: "avatar",
      search,
      page,
      isPaginate,
      filters,
      exceptSelf,
      excepts,
      rankType,
      rankTarget,
      rankDirectOnly,
      ...apiProps
    }
    await defaultModuleApi.getUsers(sendProps, url).then((res) => {
      result = {
        options: res.data.results,
        hasMore: res.data.hasMore,
        additional: {
          page: page + 1
        }
      }
    })
    return result
  }
  const renderInput = () => {
    return (
      <React.Fragment>
        <HandleController
          {...controllerProps}
          render={({ field }) => {
            const otherProps = { ...field }
            if (!isUndefined(field?.ref)) delete otherProps.ref
            return (
              <AsyncPaginate
                className={classnames("react-select", {
                  [className]: className,
                  "is-invalid": isInvalid
                })}
                classNamePrefix="users-selection select"
                {...(isUndefined(field?.ref)
                  ? {}
                  : {
                      selectRef: field.ref
                    })}
                debounceTimeout={200}
                components={{
                  Option: CustomUsersOption,
                  SingleValue: CustomSingleUserSelect,
                  MultiValueLabel: CustomMultiUserSelect
                }}
                loadOptions={loadUsers}
                additional={{
                  page: 1,
                  apiProps: loadOptionsApi
                }}
                {...otherProps}
                {...defaultProps}
                {...rest}
              />
            )
          }}
        />
        {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
      </React.Fragment>
    )
  }

  return (
    <div
      className={classnames("form-group", {
        [formGroupClass]: formGroupClass,
        row: labelInline,
        "field-locked": readOnly
      })}>
      {!nolabel && (
        <Fragment>
          <Label
            for={name}
            className={classnames({
              "col-form-label": labelInline,
              [inlineClassLabel]: labelInline
            })}
            title={label}>
            {label} {required && "*"}
          </Label>
          {labelNote && (
            <Whisper
              trigger="click"
              followCursor
              placement="auto"
              speaker={<Tooltip>{labelNote}</Tooltip>}>
              <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
            </Whisper>
          )}
        </Fragment>
      )}
      {loading && <Skeleton.Input active block size="large" />}
      {!labelInline && !loading && renderInput()}
      {labelInline && !loading && (
        <div className={classnames(inlineClassInput)}>{renderInput()}</div>
      )}
    </div>
  )
}
ErpUserSelect.propsTypes = {
  ...commonPropsType,
  options: PropTypes.array,
  isMulti: PropTypes.bool,
  rules: PropTypes.object
}
//type : all - subordinate | superior | other | subordinate-superior | subordinate-other | superior-other
ErpUserSelect.defaultProps = {
  ...commonDefaultProps,
  filters: [],
  exceptSelf: false,
  excepts: [],
  rankType: "all",
  rankTarget: [],
  rankLevel: 0
}

export const ErpPassword = (props) => {
  const {
    readOnly,
    hideIcon,
    showIcon,
    visible,
    placeholder,
    formGroupClass,
    labelInline,
    inlineClassLabel,
    inlineClassInput,
    prepend,
    invalid,
    className,
    nolabel,
    labelNote,
    name,
    id,
    label,
    required,
    iconSize,
    useForm,
    validateRules,
    defaultValue,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  const defaultProps = {
    name,
    required,
    readOnly,
    placeholder,
    id: inputId
  }
  const controllerProps = {
    name,
    useForm,
    defaultValue,
    required,
    validateRules,
    shouldUnregister: true
  }

  const isInvalid = handleError(name, invalid, useForm)

  // ** State
  const [inputVisibility, setInputVisibility] = useState(false)

  // ** Renders Icon Based On Visibility
  const renderIcon = () => {
    const size = iconSize ? iconSize : 14

    if (inputVisibility === false) {
      return hideIcon ? hideIcon : <i className="fa-solid fa-eye"></i>
    } else {
      return showIcon ? showIcon : <i className="fa-solid fa-eye-slash"></i>
    }
  }

  const renderInput = () => {
    return (
      <React.Fragment>
        <InputGroup
          className={classnames("input-group-merge", {
            [formGroupClass]: formGroupClass,
            "field-locked": readOnly,
            "is-invalid": isInvalid
          })}>
          {prepend && <InputGroupText>{prepend}</InputGroupText>}
          <HandleController
            {...controllerProps}
            render={({ field }) => (
              <Input
                className={classnames({
                  [className]: className,
                  "is-invalid": isInvalid
                })}
                {...field}
                {...defaultProps}
                {...rest}
                type={inputVisibility === false ? "password" : "text"}
                autoComplete="on"
              />
            )}
          />
          <InputGroupText
            onClick={() => setInputVisibility(!inputVisibility)}
            className="cursor-pointer">
            {renderIcon()}
          </InputGroupText>
        </InputGroup>
        {isInvalid && (
          <FormFeedback
            style={{
              marginTop: "10px",
              marginBottom: "0px",
              marginLeft: "5px"
            }}>
            {isInvalid.message}
          </FormFeedback>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <div
        className={classnames("form-group", {
          [formGroupClass]: formGroupClass,
          row: labelInline
        })}>
        {!nolabel && (
          <Fragment>
            <Label
              for={name}
              className={classnames({
                "col-form-label": labelInline,
                [inlineClassLabel]: labelInline
              })}
              title={label}>
              {label} {required && "*"}
            </Label>
            {labelNote && (
              <Whisper
                trigger="click"
                followCursor
                placement="auto"
                speaker={<Tooltip>{labelNote}</Tooltip>}>
                <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
              </Whisper>
            )}
          </Fragment>
        )}
        {loading && <Skeleton.Input active block size="large" />}
        {!labelInline && !loading && renderInput()}
        {labelInline && !loading && (
          <div className={classnames(inlineClassInput)}>{renderInput()}</div>
        )}
      </div>
    </React.Fragment>
  )
}

export const ErpEditor = (props) => {
  const {
    name,
    id,
    defaultValue,
    required,
    readOnly,
    placeholder,
    formGroupClass,
    invalid,
    className,
    nolabel,
    label,
    labelInline,
    inlineClassLabel,
    inlineClassInput,
    labelNote,
    useForm,
    validateRules,
    render,
    loading,
    ...rest
  } = props
  const inputId = handleInputId(name, id)
  let defaultProps = {
    name,
    required,
    readOnly,
    placeholder,
    id: inputId
  }
  if (isUndefined(useForm)) {
    defaultProps = {
      ...defaultProps,
      defaultValue: defaultValue
    }
  }
  const controllerProps = {
    name,
    defaultValue,
    useForm,
    required,
    validateRules,
    shouldUnregister: true
  }
  const isInvalid = handleError(name, invalid, useForm)
  const renderInput = () => {
    return (
      <React.Fragment>
        <HandleController
          {...controllerProps}
          render={(useFormProps) => {
            const { field } = useFormProps
            const renderProps = {
              className: classnames("form-control", {
                [className]: className,
                "is-invalid": isInvalid
              }),
              ...field,
              ...defaultProps,
              ...rest
            }
            if (!isUndefined(render) && isFunction(render)) {
              return render(renderProps, useFormProps)
            } else {
              const editorProps = {
                defaultValue: defaultValue
              }
              if (
                !isUndefined(field?.onChange) &&
                isFunction(field?.onChange)
              ) {
                editorProps.onDataChange = (value) => {
                  field.onChange(value)
                }
              }

              return <Editor {...editorProps} {...rest} />
            }
          }}
        />
        {isInvalid && <FormFeedback>{isInvalid.message}</FormFeedback>}
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <div
        className={classnames("form-group", {
          [formGroupClass]: formGroupClass,
          row: labelInline,
          "field-locked": readOnly
        })}>
        {!nolabel && (
          <Fragment>
            <Label
              for={name}
              className={classnames({
                "col-form-label": labelInline,
                [inlineClassLabel]: labelInline
              })}
              title={label}>
              {label} {required && "*"}
            </Label>{" "}
            {labelNote && (
              <Whisper
                trigger="click"
                followCursor
                placement="auto"
                speaker={<Tooltip>{labelNote}</Tooltip>}>
                <i className="fa-regular fa-circle-info ms-25 icon-input-information text-muted"></i>
              </Whisper>
            )}
          </Fragment>
        )}
        {loading && <Skeleton.Input active block size="large" />}
        {!labelInline && !loading && renderInput()}
        {labelInline && !loading && (
          <div className={classnames(inlineClassInput)}>{renderInput()}</div>
        )}
      </div>
    </React.Fragment>
  )
}
ErpEditor.propsTypes = commonPropsType
ErpEditor.defaultProps = commonDefaultProps
