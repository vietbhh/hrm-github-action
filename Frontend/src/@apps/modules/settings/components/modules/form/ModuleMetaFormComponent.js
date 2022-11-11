import {
  ErpInput,
  ErpRadio,
  ErpSelect,
  ErpSwitch
} from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { isEmpty } from "lodash"
import React, { Fragment, useEffect, useRef, useState } from "react"
import { MoreVertical, Plus } from "react-feather"
import { useForm } from "react-hook-form"
import ReactJson from "react-json-view"
import PerfectScrollbar from "react-perfect-scrollbar"
import { ReactSortable } from "react-sortablejs"
import {
  Badge,
  Button,
  Col,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from "reactstrap"
import * as Yup from "yup"
const colorFieldType = {
  text: "primary",
  textarea: "primary",
  number_int: "secondary",
  number_dec: "secondary",
  select_option: "danger",
  select_module: "danger",
  checkbox: "warning",
  checkbox_module: "warning",
  radio: "warning",
  radio_module: "warning",
  switch: "warning",
  date: "info",
  time: "info",
  datetime: "info",
  upload_one: "dark",
  upload_multiple: "dark",
  upload_dropzone: "dark",
  upload_image: "dark"
}

const ModuleMetaFormComponent = (props) => {
  const defaultFieldOptions = {
    field: "",
    field_enable: true,
    field_type: props.moduleConfig.fields.modules_metas.field_type[0],
    field_select_field_show: "",
    field_select_module: "",
    field_icon_type: props.moduleConfig.fields.modules_metas.field_icon_type[0],
    field_icon: "",
    field_table_width: "",
    field_table_sortable: true,
    field_form_col_size: "6",
    field_form_require: false,
    field_default_value: "",
    field_readonly: false,
    field_table_show: true,
    field_form_show: true,
    field_quick_view_show: true,
    field_detail_show: true,
    field_filter_show: true,
    field_form_order: 0,
    field_table_order: 0,
    field_quick_view_order: 0,
    field_detail_order: 0,
    field_filter_order: 0,
    field_options: "",
    field_options_values: {
      default: "",
      values: []
    }
  }
  const data = props.metas
  const setData = props.setMetas
  const [optionModal, setOptionModal] = React.useState(false)
  const [optionData, setOptionData] = React.useState({
    position: null,
    data: defaultFieldOptions
  })
  const addData = (values) => {
    setData((data) => [...data, values])
  }
  const removeData = (position) => {
    const newData = [...data]
    newData.splice(position, 1)
    setData(newData)
  }

  const toogleOptionModal = () => {
    setOptionModal(!optionModal)
  }

  const openOptionModal = (position) => {
    const item = data.filter((value, index) => index === position)[0]
    setOptionData({
      position: position,
      data: item
    })
    toogleOptionModal()
  }

  const updateOptionData = (position, value) => {
    const tempData = [...data]
    tempData[position] = value
    setData(tempData)
  }
  if (props.modalLoading) return <DefaultSpinner />
  else
    return (
      <React.Fragment>
        <Row>
          <Col md="12">
            <QuickDetailMetaForm
              defaultFieldOptions={defaultFieldOptions}
              fieldSelectOpions={props.fieldSelectOpions}
              moduleSelectOptions={props.moduleSelectOptions}
              data={data}
              moduleConfig={props.moduleConfig}
              addData={addData}
              setAreInputting={props.setAreInputting}
            />
          </Col>
          <Table className="canDrag mt-50" striped hover responsive>
            <thead>
              <tr>
                <th />
                <th>{useFormatMessage("manage.module.field.field_type")}</th>
                <th>{useFormatMessage("manage.module.field.field")}</th>
                <th />
              </tr>
            </thead>
            {!isEmpty(data) && (
              <ReactSortable
                tag="tbody"
                handle=".drag-icon"
                list={data}
                setList={setData}>
                {data.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <MoreVertical className="drag-icon" />
                      </td>
                      <td>
                        <Badge
                          pill
                          color={`${colorFieldType[item.field_type.value]}`}
                          className="me-1">
                          {item.field_type.value}
                        </Badge>
                      </td>
                      <td>
                        {item.field} {item.field_form_require && "*"}
                      </td>
                      <td>
                        {!item.default && (
                          <Button.Ripple
                            outline
                            color="flat-success"
                            className="btn btn-sm btn-icon float-end"
                            onClick={() => removeData(index)}>
                            <i className="fal fa-trash" />
                          </Button.Ripple>
                        )}
                        <Button.Ripple
                          outline
                          color="flat-success"
                          className="btn btn-sm btn-icon float-end"
                          onClick={() => openOptionModal(index)}>
                          <i className="fal fa-cog" />
                        </Button.Ripple>
                      </td>
                    </tr>
                  )
                })}
              </ReactSortable>
            )}
          </Table>
        </Row>
        <FullDetailMetaForm
          moduleConfig={props.moduleConfig}
          fieldSelectOpions={props.fieldSelectOpions}
          moduleSelectOptions={props.moduleSelectOptions}
          data={data}
          optionData={optionData}
          updateOptionData={updateOptionData}
          optionModal={optionModal}
          toogleOptionModal={toogleOptionModal}
          setAreInputting={props.setAreInputting}
        />
      </React.Fragment>
    )
}

const QuickDetailMetaForm = (props) => {
  const quickDetailMetaFormRef = useRef()
  const onSubmit = (values) => {
    values = {
      ...props.defaultFieldOptions,
      ...values
    }
    props.addData(values)
  }
  return (
    <React.Fragment>
      <DetailMetaForm
        innerRef={quickDetailMetaFormRef}
        {...props}
        quickForm
        onSubmit={onSubmit}
      />
    </React.Fragment>
  )
}

const FullDetailMetaForm = (props) => {
  const detailMetaFormRef = useRef()
  const onSubmit = (values) => {
    const updateData = {
      ...props.optionData.data,
      ...values
    }
    props.updateOptionData(props.optionData.position, updateData)
    props.toogleOptionModal()
  }
  const handleSubmit = () => {
    if (detailMetaFormRef.current) {
      detailMetaFormRef.current.props.onSubmit()
    }
  }
  return (
    <Modal
      isOpen={props.optionModal}
      toggle={props.toogleOptionModal}
      backdrop={"static"}>
      <ModalHeader toggle={props.toogleOptionModal}>
        {useFormatMessage("manage.module.field.field_option_modal_title")}
      </ModalHeader>
      <ModalBody>
        <PerfectScrollbar
          style={{
            maxHeight: "600px",
            minHeight: "50px"
          }}>
          <DetailMetaForm
            innerRef={detailMetaFormRef}
            {...props}
            onSubmit={onSubmit}
          />
        </PerfectScrollbar>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          {useFormatMessage("button.accept")}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

const OptionListComponent = (props) => {
  const [fieldOptionData, setFieldOptionData] = useState(
    props.fieldOptionData.values
  )
  const [defaultFieldOptionValue, setDefaultFieldOptionValue] = useState(
    props.fieldOptionData.default
  )
  const [optValue, setOptValue] = useState("")
  const [optValueError, setOptValueError] = useState("")
  const [updateIndex, setUpdateIndex] = useState(false)

  const inputRef = useRef()
  const saveOpt = () => {
    if (isEmpty(optValue)) {
      setOptValueError({
        message: useFormatMessage("validate.required")
      })
      return
    }

    if (
      fieldOptionData.filter(
        (item, index) => item.name === optValue && index !== updateIndex
      ).length > 0
    ) {
      setOptValueError({
        message: useFormatMessage("validate.exists", { name: optValue })
      })
      return
    }
    if (updateIndex === false) {
      setFieldOptionData([...fieldOptionData, { name: optValue }])
    } else {
      const data = [...fieldOptionData]
      data[updateIndex].name = optValue
      setFieldOptionData(data)
    }
    setOptValue("")
    setOptValueError("")
    setUpdateIndex(false)
  }
  const removeOpt = (index) => {
    const tempData = [...fieldOptionData]
    tempData.splice(index, 1)
    setFieldOptionData(tempData)
  }

  const updateOpt = (index) => {
    setUpdateIndex(index)
    setOptValue(fieldOptionData[index].name)
  }

  const clearDefault = () => {
    setDefaultFieldOptionValue("")
  }
  useEffect(() => {
    props.setFieldOptionData({
      default: defaultFieldOptionValue,
      values: fieldOptionData
    })
    if (fieldOptionData.length > 0) {
      props.setAreInputting(true)
    } else {
      props.setAreInputting(false)
    }
  }, [fieldOptionData, defaultFieldOptionValue])
  return (
    <Fragment>
      <Row>
        <Col md="12">
          <div className="divider" style={{ margin: "0" }}>
            <div className="divider-text">
              {useFormatMessage("manage.module.field.field_options_values")}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <ErpInput
            type="text"
            placeholder={useFormatMessage("common.value")}
            nolabel
            invalid={optValueError}
            id={`${props.inputPrefix}field_options_values`}
            name={`field_options_values`}
            className="mt-0"
            innerRef={inputRef}
            value={optValue}
            onChange={(e) => {
              setOptValue(
                e.target.value.toLowerCase().replace(/[^A-Z0-9]+/gi, "_")
              )
            }}
          />
          <Button.Ripple
            size="sm"
            block
            outline
            color="primary"
            className="mb-1"
            onClick={() => {
              saveOpt()
            }}>
            {updateIndex === false &&
              useFormatMessage(
                "manage.module.field.field_options_values_add_button"
              )}
            {updateIndex !== false &&
              useFormatMessage(
                "manage.module.field.field_options_values_update_button"
              )}
          </Button.Ripple>
        </Col>
        <Col md="8" style={{ overflowX: "auto" }}>
          <Table
            size="sm"
            className="canDrag table-hover-animation"
            bordered
            hover
            striped>
            <thead>
              <tr>
                <th colSpan="2" className="text-end">
                  {useFormatMessage("manage.module.field.field_options_values")}
                </th>
                <th colSpan="2" className="text-end">
                  <Button.Ripple
                    outline
                    color="flat-success"
                    className="btn btn-sm btn-icon float-end"
                    onClick={() => clearDefault()}
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "8px"
                    }}>
                    {" "}
                    {useFormatMessage(
                      "manage.module.field.field_options_values_clear_default"
                    )}
                  </Button.Ripple>
                </th>
              </tr>
            </thead>
            {fieldOptionData.length ? (
              <ReactSortable
                tag="tbody"
                handle=".drag-icon"
                list={fieldOptionData}
                setList={setFieldOptionData}>
                {fieldOptionData.map((item, index) => {
                  return (
                    <tr key={item.name}>
                      <td scope="row">
                        <MoreVertical className="drag-icon" />
                      </td>
                      <td>
                        <p className="mb-0" style={{ whiteSpace: "nowrap" }}>
                          {item.name}
                          <small className="text-secondary"> ({item.id})</small>
                        </p>
                        <ErpRadio
                          placeholder={useFormatMessage(
                            "manage.module.field.field_default_value"
                          )}
                          label={useFormatMessage("common.default")}
                          id={`${props.inputPrefix}field_options_values_default_${index}`}
                          name={`field_options_values`}
                          onChange={() => {
                            setDefaultFieldOptionValue(item.name)
                          }}
                          value={item.name}
                          defaultChecked={item.name === defaultFieldOptionValue}
                        />
                      </td>
                      <td>
                        <Button.Ripple
                          outline
                          color="flat-success"
                          className="btn btn-sm btn-icon float-end"
                          onClick={() => removeOpt(index)}>
                          <i className="fal fa-trash" />
                        </Button.Ripple>
                        <Button.Ripple
                          outline
                          color="flat-success"
                          className="btn btn-sm btn-icon float-end"
                          onClick={() => updateOpt(index)}>
                          <i className="fal fa-cog" />
                        </Button.Ripple>
                      </td>
                    </tr>
                  )
                })}
              </ReactSortable>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center">
                    {useFormatMessage("common.nodata")}
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </Col>
      </Row>
    </Fragment>
  )
}

const DetailMetaForm = (props) => {
  const validateSchema = Yup.object().shape({
    field: Yup.string()
      .trim()
      .min(2, useFormatMessage("validate.min", { num: 2 }))
      .required(useFormatMessage("validate.required"))
      .lowercase()
      .test(
        "checkFieldCode",
        useFormatMessage("validate.exists", { name: "Fields" }),
        async (value) => {
          if (
            typeof value !== undefined &&
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value.length >= 2
          ) {
            let count = 0
            for (const item of props.data) {
              if (
                props.optionData &&
                count !== props.optionData.position &&
                item.field === value
              ) {
                return false
              }
              if (!props.optionData && item.field === value) {
                return false
              }
              count++
            }
            return true
          } else {
            return true
          }
        }
      )
  })
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
    //resolver: yupResolver(validateSchema)
  })
  const { handleSubmit, reset, setValue } = methods
  const [showModuleSelect, setShowModuleSelect] = useState(false)
  const [fieldOptionData, setFieldOptionData] = useState({
    values: [],
    default: ""
  })
  const [fieldSelectDisplayData, setFieldSelectDisplayData] = useState(
    props.optionData &&
      props.optionData.data.field_select_module &&
      props.optionData.data.field_select_module.value
      ? props.fieldSelectOpions[props.optionData.data.field_select_module.value]
      : []
  )
  const [showAppOptionSelect, setShowAppOptionSelect] = useState(false)
  const [state, setState] = useMergedState({
    options: {}
  })
  const metaFieldsAllowModuleSelection =
    props.moduleConfig.metaFieldsAllowModuleSelection
  const metaFieldsAllowOptionSelection =
    props.moduleConfig.metaFieldsAllowOptionSelection
  useEffect(() => {
    if (props.optionData) {
      handleFieldType(props.optionData.data.field_type.value)
      if (
        metaFieldsAllowOptionSelection.includes(
          props.optionData.data.field_type.value
        )
      ) {
        setFieldOptionData(props.optionData.data.field_options_values)
      }
      reset(props.optionData.data)
      setState({
        options: isEmpty(props.optionData.data?.field_options)
          ? {}
          : props.optionData.data?.field_options
      })
    }
  }, [props.optionData])

  const handleFieldType = (type) => {
    if (!metaFieldsAllowModuleSelection.includes(type) && showModuleSelect) {
      setShowModuleSelect(false)
      setFieldSelectDisplayData([])
    }
    if (!metaFieldsAllowOptionSelection.includes(type) && showAppOptionSelect) {
      setShowAppOptionSelect(false)
      setFieldOptionData({
        values: [],
        default: ""
      })
    }
    if (metaFieldsAllowModuleSelection.includes(type) && !showModuleSelect) {
      setShowModuleSelect(true)
    }
    if (metaFieldsAllowOptionSelection.includes(type) && !showAppOptionSelect) {
      setShowAppOptionSelect(true)
    }
  }

  const onSubmit = (values) => {
    values.field_options_values = fieldOptionData
    values.field_options = isEmpty(state.options) ? {} : state.options
    props.onSubmit(values)
    handleFieldType("text")
    reset(props.defaultFieldOptions)
    props.setAreInputting(false)
    setFieldOptionData({
      values: [],
      default: ""
    })
  }
  const colSize = props.quickForm ? 3 : 6
  const fieldCodeColSize = props.quickForm ? 4 : 6
  const inputPrefix = props.quickForm ? "quick_" : "full_"
  return (
    <Form ref={props.innerRef} onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md={colSize}>
          <ErpSelect
            options={props.moduleConfig.fields.modules_metas.field_type}
            defaultValue={props.moduleConfig.fields.modules_metas.field_type[0]}
            placeholder={useFormatMessage("manage.module.field.field_type")}
            label={useFormatMessage("manage.module.field.field_type")}
            id={`${inputPrefix}field_type`}
            name="field_type"
            useForm={methods}
            onChange={(e) => {
              setValue("field_type", e)
              if (isEmpty(e)) {
                handleFieldType("text")
              } else {
                handleFieldType(e.value)
              }
            }}
          />
        </Col>
        <Col md={fieldCodeColSize}>
          <ErpInput
            type="text"
            placeholder={useFormatMessage("manage.module.field.field")}
            label={useFormatMessage("manage.module.field.field")}
            id={`${inputPrefix}field`}
            name={`field`}
            useForm={methods}
            required
            onChange={(e) => {
              setValue("field", e.target.value.toLowerCase())
              methods.trigger("field")
            }}
            validateRules={{
              minLength: {
                value: 2,
                message: useFormatMessage("validate.min", { num: 2 })
              },
              validate: {
                checkFieldCode: async (value) => {
                  if (
                    typeof value !== undefined &&
                    value !== undefined &&
                    value !== null &&
                    value !== "" &&
                    value.length >= 2
                  ) {
                    let count = 0
                    for (const item of props.data) {
                      if (
                        props.optionData &&
                        count !== props.optionData.position &&
                        item.field === value
                      ) {
                        return useFormatMessage("validate.exists", {
                          name: "Fields"
                        })
                      }
                      if (!props.optionData && item.field === value) {
                        return useFormatMessage("validate.exists", {
                          name: "Fields"
                        })
                      }
                      count++
                    }
                    return true
                  } else {
                    return true
                  }
                }
              }
            }}
          />
        </Col>
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpInput
              type="text"
              placeholder={useFormatMessage(
                "manage.module.field.field_default_value"
              )}
              label={useFormatMessage(
                "manage.module.field.field_default_value"
              )}
              id={`${inputPrefix}field_default_value`}
              name={`field_default_value`}
              useForm={methods}
            />
          </Col>
        )}
        {props.quickForm && (
          <Col md={3}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_form_require"
              )}
              label={useFormatMessage("manage.module.field.field_form_require")}
              id={`${inputPrefix}opt_field_form_require`}
              name={`field_form_require`}
              useForm={methods}
            />
          </Col>
        )}
        {props.quickForm && (
          <Col md={2} className="text-end">
            <Button.Ripple
              color="primary"
              className="btn-sm mt-2"
              outline
              type="submit">
              <Plus size="14" className="me-50" />
              {useFormatMessage("button.add")}
            </Button.Ripple>
          </Col>
        )}
        {showModuleSelect && (
          <Col md={colSize}>
            <ErpSelect
              options={props.moduleSelectOptions}
              defaultValue={null}
              placeholder="Select"
              label={useFormatMessage(
                "manage.module.field.field_select_module"
              )}
              id={`${inputPrefix}field_select_module`}
              name="field_select_module"
              useForm={methods}
              required
              onChange={(e) => {
                setValue("field_select_module", e)
                setValue("field_select_field_show", null)
                setFieldSelectDisplayData(props.fieldSelectOpions?.[e?.value])
              }}
            />
          </Col>
        )}
        {showModuleSelect && (
          <Col md={colSize}>
            <ErpSelect
              options={fieldSelectDisplayData}
              defaultValue={null}
              placeholder="Select"
              label={useFormatMessage(
                "manage.module.field.field_select_field_show"
              )}
              id={`${inputPrefix}field_select_field_show`}
              name="field_select_field_show"
              useForm={methods}
              required
            />
          </Col>
        )}

        {!props.quickForm && (
          <Col md={colSize}>
            <ErpInput
              type="text"
              placeholder={useFormatMessage(
                "manage.module.field.field_table_width"
              )}
              label={useFormatMessage("manage.module.field.field_table_width")}
              id={`${inputPrefix}field_table_width`}
              name={`field_table_width`}
              useForm={methods}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpInput
              type="number"
              placeholder={useFormatMessage(
                "manage.module.field.field_form_col_size"
              )}
              label={useFormatMessage(
                "manage.module.field.field_form_col_size"
              )}
              id={`${inputPrefix}field_form_col_size`}
              name={`field_form_col_size`}
              useForm={methods}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSelect
              options={props.moduleConfig.fields.modules_metas.field_icon_type}
              defaultValue={
                props.moduleConfig.fields.modules_metas.field_icon_type[0]
              }
              placeholder={useFormatMessage(
                "manage.module.field.field_icon_type"
              )}
              label={useFormatMessage("manage.module.field.field_icon_type")}
              id={`${inputPrefix}field_icon_type`}
              name="field_icon_type"
              useForm={methods}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpInput
              type="text"
              placeholder={useFormatMessage("manage.module.field.field_icon")}
              label={useFormatMessage("manage.module.field.field_icon")}
              id={`${inputPrefix}field_icon`}
              name={`field_icon`}
              useForm={methods}
            />
          </Col>
        )}
      </Row>
      {showAppOptionSelect && (
        <OptionListComponent
          fieldOptionData={fieldOptionData}
          inputPrefix={inputPrefix}
          setFieldOptionData={setFieldOptionData}
          setAreInputting={props.setAreInputting}
        />
      )}
      {!props.quickForm && (
        <Row>
          <Col md="12">
            <div className="divider mt-0">
              <div className="divider-text">
                {useFormatMessage("common.other")}
              </div>
            </div>
          </Col>
        </Row>
      )}
      <Row>
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage("manage.module.field.field_enable")}
              label={useFormatMessage("manage.module.field.field_enable")}
              id={`${inputPrefix}field_enable`}
              name={`field_enable`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_enable}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_form_require"
              )}
              label={useFormatMessage("manage.module.field.field_form_require")}
              id={`${inputPrefix}opt_field_form_require`}
              name={`field_form_require`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_form_require}
            />
          </Col>
        )}

        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_table_sortable"
              )}
              label={useFormatMessage(
                "manage.module.field.field_table_sortable"
              )}
              id={`${inputPrefix}field_table_sortable`}
              name={`field_table_sortable`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_table_sortable}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_form_unique"
              )}
              label={useFormatMessage("manage.module.field.field_form_unique")}
              id={`${inputPrefix}field_form_unique`}
              name={`field_form_unique`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_form_unique}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_readonly"
              )}
              label={useFormatMessage("manage.module.field.field_readonly")}
              id={`${inputPrefix}field_readonly`}
              name={`field_readonly`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_readonly}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_table_show"
              )}
              label={useFormatMessage("manage.module.field.field_table_show")}
              id={`${inputPrefix}field_table_show`}
              name={`field_table_show`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_table_show}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_form_show"
              )}
              label={useFormatMessage("manage.module.field.field_form_show")}
              id={`${inputPrefix}field_form_show`}
              name={`field_form_show`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_form_show}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_quick_form_show"
              )}
              label={useFormatMessage(
                "manage.module.field.field_quick_form_show"
              )}
              id={`${inputPrefix}field_quick_form_show`}
              name={`field_quick_form_show`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_quick_form_show}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_quick_view_show"
              )}
              label={useFormatMessage(
                "manage.module.field.field_quick_view_show"
              )}
              id={`${inputPrefix}field_quick_view_show`}
              name={`field_quick_view_show`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_quick_view_show}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_detail_show"
              )}
              label={useFormatMessage("manage.module.field.field_detail_show")}
              id={`${inputPrefix}field_detail_show`}
              name={`field_detail_show`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_detail_show}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={colSize}>
            <ErpSwitch
              placeholder={useFormatMessage(
                "manage.module.field.field_filter_show"
              )}
              label={useFormatMessage("manage.module.field.field_filter_show")}
              id={`${inputPrefix}field_filter_show`}
              name={`field_filter_show`}
              useForm={methods}
              defaultValue={props.optionData?.data?.field_filter_show}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={12}>
            <ErpInput
              type="text"
              placeholder={useFormatMessage(
                "manage.module.field.field_validate_rules"
              )}
              label={useFormatMessage(
                "manage.module.field.field_validate_rules"
              )}
              id={`${inputPrefix}field_validate_rules`}
              name={`field_validate_rules`}
              useForm={methods}
            />
          </Col>
        )}
        {!props.quickForm && (
          <Col md={12}>
            <Label for="options">
              {useFormatMessage("manage.module.field.field_options")}
            </Label>
            <ReactJson
              src={state.options}
              id={`${inputPrefix}field_options`}
              name={`field_options`}
              theme="monokai"
              iconStyle="square"
              onAdd={(e) =>
                setState({
                  options: e.updated_src
                })
              }
              onEdit={(e) =>
                setState({
                  options: e.updated_src
                })
              }
              onDelete={(e) =>
                setState({
                  options: e.updated_src
                })
              }
              collapsed={true}
            />
          </Col>
        )}
      </Row>
    </Form>
  )
}

export default ModuleMetaFormComponent
