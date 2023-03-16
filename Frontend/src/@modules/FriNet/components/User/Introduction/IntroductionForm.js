import { useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import classNames from "classnames"
import React, { Fragment } from "react"
import { useSelector } from "react-redux"
import { Col, Row } from "reactstrap"

const IntroductionForm = (props) => {
  const { employeeData, arrField, options, methods, setValue } = props
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

  return (
    <Row>
      {_.map(arrField, (field, key) => {
        const fieldProps = {
          module: "employees",
          fieldData: { ...field },
          useForm: methods,
          options: { ...options },
          updateData: employeeData?.[field.field],
          updateDataId: employeeData?.id,
          labelInline: true,
          inlineClassLabel: "col-md-3",
          inlineClassInput: "col-md-9"
        }

        if (field.field === "temp_province" || field.field === "per_province") {
          fieldProps.fieldData.field_type = "select_option"
          fieldProps.options[field.field] = provinces
          fieldProps.formatOptionLabel = null
          const addressState =
            field.field === "temp_province" ? tempAddress : perAddress
          const setAddressState =
            field.field === "temp_province" ? setTempAddress : setPerAddress
          const districtField =
            field.field === "temp_province" ? "temp_district" : "per_district"
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
        if (field.field === "temp_district" || field.field === "per_district") {
          fieldProps.fieldData.field_type = "select_option"

          fieldProps.formatOptionLabel = null
          const addressState =
            field.field === "temp_district" ? tempAddress : perAddress
          fieldProps.options[field.field] = addressState.districts
          const setAddressState =
            field.field === "temp_district" ? setTempAddress : setPerAddress
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
          fieldProps.label = fieldProps.fieldData.field_options.name_show
          fieldProps.placeholder = fieldProps.fieldData.field_options.name_show
          fieldProps.required =
            fieldProps.fieldData.field_options.required_field
          if (fieldProps.fieldData.field_type === "select_option") {
            const optionValue = fieldProps.fieldData.field_options.option_values
            const customOption = options[fieldProps.fieldData.field].map(
              (item, index) => {
                return {
                  value: item.value,
                  label: optionValue[index]["name"]
                }
              }
            )

            if (fieldProps?.updateData?.label !== undefined) {
              const [currentOption] = optionValue.filter((item) => {
                return item.key === fieldProps?.updateData?.name_option
              })
              fieldProps.updateData.label = currentOption.name
            }
            fieldProps.options[fieldProps.fieldData.field] = customOption

            fieldProps.formatOptionLabel = (item) => {
              return (
                <div className="d-flex align-items-center">
                  <span>{item.label}</span>
                </div>
              )
            }
          }
        }
        return (
          <Fragment key={key}>
            <Col
              md={12}
              className={classNames(``, {
                "height-55": field.field_type !== "textarea"
              })}>
              <FieldHandle {...fieldProps} />
            </Col>
          </Fragment>
        )
      })}
    </Row>
  )
}

export default IntroductionForm