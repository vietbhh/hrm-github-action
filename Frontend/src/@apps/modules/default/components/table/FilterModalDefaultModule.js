import { ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { isArray } from "@apps/utility/handleData"
import { isEmpty, toArray } from "lodash"
import moment from "moment"
import React, { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  UncontrolledButtonDropdown
} from "reactstrap"
import { FieldHandle } from "../../../../utility/FieldHandler"

const DateInputFilter = (props) => {
  const { operator, setValue, format } = props
  const fieldProps = { ...props }
  delete fieldProps.setValue
  delete fieldProps.format
  if (operator === "between") {
    return (
      <Fragment>
        <FieldHandle
          {...fieldProps}
          label="Value from"
          id={`filter_value_from`}
          name={`filter_value[from]`}
          onValueUpdate={(values) => {
            setValue("filter_value[from]", moment(values[0]).format(format))
          }}
        />
        <FieldHandle
          {...fieldProps}
          label="Value to"
          id={`filter_value_to`}
          name={`filter_value[to]`}
          onValueUpdate={(values) => {
            setValue("filter_value[to]", moment(values[0]).format(format))
          }}
        />
      </Fragment>
    )
  } else {
    return (
      <FieldHandle
        {...fieldProps}
        onValueUpdate={(values) => {
          setValue("filter_value", moment(values[0]).format(format))
        }}
      />
    )
  }
}

const HandleInputFilterValue = (props) => {
  const { fieldData, useForm, operator } = props
  const { setValue } = useForm
  const { field_type, field_select_module, field_select_field_show } = fieldData
  const optionsModules = useSelector((state) => state.app.optionsModules)
  const replaceField = { ...fieldData }
  replaceField.field_type = "select_option"
  replaceField.field_form_unique = false
  const fieldHandleProps = {
    ...props,
    updateData: false,
    required: true,
    useForm: useForm,
    autoComplete: "off",
    defaultValue: "",
    label: "Value",
    name: "filter_value",
    readOnly: false,
    placeholder: "Type value..."
  }
  switch (field_type) {
    case "date":
      return (
        <DateInputFilter
          {...fieldHandleProps}
          setValue={setValue}
          format="DD-MM-YYYY"
        />
      )
    case "datetime":
      return (
        <DateInputFilter
          {...fieldHandleProps}
          setValue={setValue}
          format="DD-MM-YYYY HH:mm:ss"
        />
      )
    case "time":
      return (
        <DateInputFilter
          {...fieldHandleProps}
          setValue={setValue}
          format="HH:mm:ss"
        />
      )
    case "number_int":
    case "number_dec":
      if (operator === "between") {
        return (
          <Fragment>
            <FieldHandle
              {...fieldHandleProps}
              label="Value from"
              id={`filter_value_from`}
              name={`filter_value[from]`}
            />
            <FieldHandle
              {...fieldHandleProps}
              label="Value to"
              id={`filter_value_to`}
              name={`filter_value[to]`}
            />
          </Fragment>
        )
      } else {
        return <FieldHandle {...fieldHandleProps} />
      }
    case "select_option":
    case "checkbox":
    case "radio":
      return (
        <FieldHandle
          {...fieldHandleProps}
          fieldData={replaceField}
          isMulti={true}
        />
      )
    case "checkbox_module":
    case "radio_module":
      return (
        <ErpSelect
          options={optionsModules[field_select_module][field_select_field_show]}
          label="Value"
          isMulti={true}
          name="filter_value"
          id="filter_value"
          required={true}
          useForm={useForm}
        />
      )
    case "select_module":
      return <FieldHandle {...fieldHandleProps} isMulti={true} />
    case "switch":
      return <FieldHandle {...fieldHandleProps} />
    case "upload_one":
    case "upload_multiple":
    case "upload_image":
    case "text":
    case "textarea":
    default:
      replaceField.field_type = "text"
      return <FieldHandle {...fieldHandleProps} fieldData={replaceField} />
  }
}

function FilterModalDefaultModule(props) {
  const { module, options } = props
  const onCloseModal = () => {}
  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit, setValue } = methods

  const filterDef = props.filters.type || []
  const [state, setState] = useMergedState({
    filterOptions: [],
    operatorOptions: [],
    currentField: "",
    operator: [],
    compareType: "AND"
  })

  const onSubmit = (data) => {
    const filterData = {
      field: state.currentField.field,
      field_type: state.currentField.field_type,
      operator: state.operator.value,
      compareType: state.compareType,
      value: data.filter_value
    }
    props.handleAddFilter(filterData)
    props.handleModal()
    setState({
      operatorOptions: [],
      currentField: "",
      operator: [],
      compareType: "AND"
    })
  }
  const metasList = isArray(props.metas) ? props.metas : toArray(props.metas)
  useEffect(() => {
    const metasFilter = isEmpty(metasList)
      ? []
      : metasList
          .filter(
            (item) =>
              !isEmpty(filterDef[item.field_type]) && item.field_filter_show
          )
          .map((item) => {
            return {
              ...item,
              label: useFormatMessage(
                `modules.${props.module.name}.fields.${item.field}`
              ),
              value: item.field
            }
          })
    const defaultFilter = isEmpty(props.filters.defaultFields)
      ? []
      : props.filters.defaultFields
          .filter(
            (item) =>
              !isEmpty(filterDef[item.field_type]) && item.field_filter_show
          )
          .map((item) => {
            return {
              ...item,
              label: useFormatMessage(`module.default.fields.${item.field}`),
              value: item.field
            }
          })
    setState({
      filterOptions: [...metasFilter, ...defaultFilter]
    })
  }, [props.metas, props.filters])

  const handleFilterType = (option) => {
    const listOperators = isEmpty(filterDef[option.field_type])
      ? []
      : filterDef[option.field_type]["operator"].map((item) => {
          return {
            label: item,
            value: item
          }
        })
    setState({
      operatorOptions: listOperators,
      currentField: option,
      operator: isEmpty(listOperators) ? [] : listOperators[0]
    })
    if (!isEmpty(listOperators)) setValue("filter_operator", listOperators[0])
  }
  return (
    <React.Fragment>
      <Modal
        isOpen={props.modal}
        onClosed={onCloseModal}
        toggle={props.handleModal}
        backdrop={"static"}
        className="modal-sm">
        <ModalHeader toggle={props.handleModal}>
          {useFormatMessage("module.default.modal.addFilterTitle")}
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col sm="12">
                <ErpSelect
                  label={useFormatMessage("module.default.filters.filter")}
                  id="filter_field"
                  name="filter_field"
                  options={state.filterOptions}
                  onChange={(e) => {
                    setValue("filter_field", e)
                    handleFilterType(e)
                  }}
                  required
                />
              </Col>
              <Col sm="12">
                <ErpSelect
                  label={useFormatMessage("module.default.filters.operator")}
                  id="filter_operator"
                  name="filter_operator"
                  options={state.operatorOptions}
                  value={state.operator}
                  onChange={(e) => {
                    setValue("filter_operator", e)
                    setState({
                      operator: e
                    })
                  }}
                  required
                />
              </Col>
              <Col sm="12">
                <HandleInputFilterValue
                  fieldData={state.currentField}
                  module={module.name}
                  options={options}
                  useForm={methods}
                  operator={state.operator.value || "="}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="d-flex me-auto hidden">
              <UncontrolledButtonDropdown>
                <DropdownToggle
                  color="flat-secondary"
                  className="ms-auto"
                  caret>
                  {state.compareType}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      setState({
                        compareType: "AND"
                      })
                    }}
                    tag="li">
                    AND
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      setState({
                        compareType: "OR"
                      })
                    }}
                    tag="li">
                    OR
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
            <Button.Ripple color="primary" type="submit" onClick={handleSubmit}>
              {useFormatMessage("app.add")}
            </Button.Ripple>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default FilterModalDefaultModule
