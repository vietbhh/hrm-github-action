import LockedCard from "@apps/components/common/LockedCard"
import { FormHorizontalLoader } from "@apps/components/spinner/FormLoader"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import classNames from "classnames"
import { filter, isEmpty, map, orderBy } from "lodash"
import { isUndefined } from "lodash-es"
import { Fragment } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Button, Card, CardBody, CardHeader, Col, Spinner } from "reactstrap"

const DetailForm = (props) => {
  const { options, updateData, updateId, onSubmit, loading } = props
  const fields = { ...props.fields }
  const filterField = props.filterField || true
  const methods = useForm({
    mode: "onSubmit"
  })

  const readOnly = props.readOnly
  const { register, errors, handleSubmit, control, setValue, reset } = methods

  const dataUnit = useSelector((state) => state.app.unit)

  const [tempAddress, setTempAddress] = useMergedState({
    currentProvince: 0,
    currentDistrict: 0,
    districts: [],
    wards: []
  })

  const [perAddress, setPerAddress] = useMergedState({
    currentProvince: 0,
    currentDistrict: 0,
    districts: [],
    wards: []
  })

  const provinces = dataUnit.provinces.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  const handleProvincesChange = (value, setStateAddress) => {
    if (!isEmpty(value)) {
      const districts = dataUnit.districts
        .filter((item) => parseInt(item.province_id) === parseInt(value))
        .map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      setStateAddress({
        currentProvince: value,
        districts
      })
    }
  }
  const handleDistrictsChange = (value, setStateAddress) => {
    if (!isEmpty(value)) {
      const wards = dataUnit.wards
        .filter((item) => parseInt(item.district_id) === parseInt(value))
        .map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      setStateAddress({
        currentDistrict: value,
        wards
      })
    }
  }

  const onSubmitFrm = (values) => {
    onSubmit(values)
  }

  const cancelUpdate = () => {
    props.reload()
    props.cancelUpdate()
    if (!isEmpty(fields)) {
      map(
        filter(
          fields,
          (field) =>
            field.field_enable && field.field_form_show && filterField(field)
        ),
        (field, key) => {
          if (!isUndefined(global[`ref_${field.field}`])) {
            global[`ref_${field.field}`].flatpickr.setDate(
              updateData[field.field]
            )
          }
        }
      )
    }
  }
  if (loading) {
    return <FormHorizontalLoader rows={4} />
  }

  return (
    <Fragment>
      <div className="row employee-basic-info">
        {!isEmpty(fields) &&
          orderBy(
            map(
              filter(
                fields,
                (field) =>
                  field.field_enable &&
                  field.field_form_show &&
                  filterField(field)
              ),
              (field, key) => {
                const positionField = key % 2 ? "field-r" : "field-l"
                const fieldProps = {
                  module: field.moduleName,
                  fieldData: { ...field },
                  useForm: methods,
                  options: { ...options },
                  updateData: updateData?.[field.field],
                  updateDataId: updateId,
                  labelInline: true,
                  inlineClassLabel: "col-md-3",
                  inlineClassInput: "col-md-9"
                }

                if (
                  field.field === "temp_province" ||
                  field.field === "per_province"
                ) {
                  fieldProps.fieldData.field_type = "select_option"
                  fieldProps.options[field.field] = provinces
                  fieldProps.formatOptionLabel = null
                  const addressState =
                    field.field === "temp_province" ? tempAddress : perAddress
                  const setAddressState =
                    field.field === "temp_province"
                      ? setTempAddress
                      : setPerAddress
                  const districtField =
                    field.field === "temp_province"
                      ? "temp_district"
                      : "per_district"
                  const wardField =
                    field.field === "temp_province" ? "temp_ward" : "per_ward"
                  fieldProps.onChange = (e) => {
                    setValue(field.field, e)
                    if (e.value !== addressState.currentProvince) {
                      setValue(districtField, null)
                      setValue(wardField, null)
                    }
                    handleProvincesChange(e.value, setAddressState)
                  }
                }
                if (
                  field.field === "temp_district" ||
                  field.field === "per_district"
                ) {
                  fieldProps.fieldData.field_type = "select_option"

                  fieldProps.formatOptionLabel = null
                  const addressState =
                    field.field === "temp_district" ? tempAddress : perAddress
                  fieldProps.options[field.field] = addressState.districts
                  const setAddressState =
                    field.field === "temp_district"
                      ? setTempAddress
                      : setPerAddress
                  const wardField =
                    field.field === "temp_district" ? "temp_ward" : "per_ward"
                  fieldProps.onChange = (e) => {
                    setValue(field.field, e)
                    if (e.value !== addressState.currentDistrict) {
                      setValue(wardField, null)
                    }
                    handleDistrictsChange(e.value, setAddressState)
                  }
                }
                if (field.field === "temp_ward" || field.field === "per_ward") {
                  fieldProps.fieldData.field_type = "select_option"
                  const addressState =
                    field.field === "temp_ward" ? tempAddress : perAddress
                  fieldProps.options[field.field] = addressState.wards
                  fieldProps.formatOptionLabel = null
                }
                if (field.field_options?.is_custom_field) {
                  fieldProps.label =
                    fieldProps.fieldData.field_options.name_show
                  fieldProps.placeholder =
                    fieldProps.fieldData.field_options.name_show
                  fieldProps.required =
                    fieldProps.fieldData.field_options.required_field
                  if (fieldProps.fieldData.field_type === "select_option") {
                    const optionValue =
                      fieldProps.fieldData.field_options.option_values
                    const customOption = options[
                      fieldProps.fieldData.field
                    ].map((item, index) => {
                      return {
                        value: item.value,
                        label: optionValue[index]["name"]
                      }
                    })

                    if (fieldProps?.updateData?.label !== undefined) {
                      const [currentOption] = optionValue.filter((item) => {
                        return item.key === fieldProps?.updateData?.name_option
                      })
                      fieldProps.updateData.label = currentOption.name
                    }
                    fieldProps.options[fieldProps.fieldData.field] =
                      customOption

                    fieldProps.formatOptionLabel = (item) => {
                      return (
                        <div className="d-flex align-items-center">
                          <span>{item.label}</span>
                        </div>
                      )
                    }
                  }
                }
                fieldProps.fieldData.field_readonly = readOnly
                return (
                  <Fragment key={key}>
                    {field.field_options?.form?.break_row_before && (
                      <div className="w-100" />
                    )}
                    <Col
                      md={field.field_form_col_size}
                      className={classNames(`${positionField}`, {
                        "height-55": field.field_type !== "textarea"
                      })}>
                      <FieldHandle {...fieldProps} />
                    </Col>
                    {field.field_options?.form?.break_row_after && (
                      <div className="w-100" />
                    )}
                  </Fragment>
                )
              }
            ),
            (field) => parseInt(field.field_form_order),
            "asc"
          )}
      </div>
      {!readOnly && (
        <div className="row pt-2">
          <form
            className="col-12 text-center"
            onSubmit={handleSubmit(onSubmitFrm)}>
            <Button.Ripple
              type="submit"
              color="primary"
              className="btn-next me-1"
              disabled={props.saving}>
              <span className="align-middle d-sm-inline-block d-none">
                {props.saving && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("button.save")}
              </span>
            </Button.Ripple>
            <Button.Ripple
              type="button"
              color="primary"
              className="btn-next"
              onClick={cancelUpdate}
              disabled={props.saving}>
              <span className="align-middle d-sm-inline-block d-none">
                {useFormatMessage("button.cancel")}
              </span>
            </Button.Ripple>
          </form>
        </div>
      )}
    </Fragment>
  )
}

const EmployeeBasicInformationForm = (props) => {
  const {
    titleIcon,
    title,
    fields,
    options,
    filterField,
    loading,
    api,
    permits
  } = props
  const canView = permits.view || false
  const canUpdate = permits.update || false
  const employeeData = permits.view ? props.employeeData : {}
  const [state, setState] = useMergedState({
    readOnly: true,
    saving: false
  })

  const updateBtn = () => {
    setState({
      readOnly: false
    })
  }
  const cancelUpdate = () => {
    setState({
      readOnly: true,
      saving: false
    })
  }
  return (
    <LockedCard blocking={!canView}>
      <Card className="card-inside with-border-radius life-card">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">{titleIcon}</span>
              <span>{title}</span>
            </h1>
            <div className="d-flex ms-auto">
              {canUpdate && (
                <Button
                  color="flat-primary"
                  tag="div"
                  className="text-primary btn-table-more btn-icon"
                  onClick={updateBtn}>
                  <i className="iconly-Edit icli"></i>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <DetailForm
            fields={fields}
            options={options}
            filterField={filterField}
            readOnly={state.readOnly}
            updateBtn={updateBtn}
            cancelUpdate={cancelUpdate}
            updateData={employeeData}
            updateId={employeeData?.id}
            onSubmit={(values) => {
              setState({
                saving: true
              })
              api
                .save(values)
                .then((result) => {
                  notification.showSuccess({
                    text: useFormatMessage("notification.save.success")
                  })
                  cancelUpdate()
                  props.reload()
                })
                .catch((err) => {
                  notification.showError({
                    text: useFormatMessage("notification.save.error")
                  })
                })
            }}
            loading={loading}
            saving={state.saving}
            reload={props.reload}
          />
        </CardBody>
      </Card>
    </LockedCard>
  )
}

export default EmployeeBasicInformationForm
