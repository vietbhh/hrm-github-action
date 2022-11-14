// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import {
  getOptionValue,
  getDaysInMonth,
  getListMonth
} from "@modules/TimeOff/common/common"
// ** Styles
import {
  Button,
  Col,
  Row,
  Spinner,
  Card,
  CardBody,
  FormGroup
} from "reactstrap"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import { ErpRadio, ErpSelect } from "@apps/components/common/ErpField"
import DurationAllowedElement from "./DurationAllowedElement"
import WaitingPeriodElement from "./WaitingPeriodElement"

const PolicyFormElement = (props) => {
  const {
    // ** props
    moduleName,
    metas,
    options,
    optionsModules,
    dataForm,
    isEditPolicy,
    timeOffTypePaidStatus,
    methods
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    showDurationAllowedWarning: false,
    typeData: {},
    chosenMonth: {},
    listDayInMonth: [],
    editDurationAllowed: false,
    currentAccrualFrequency: 0,
    showAdvanceLeave: false
  })
  const { setValue, watch, register } = methods
  const CarryOverExpiration = getListMonth()
  const durationAllowedDurationHalfDayOption = getOptionValue(
    options,
    "duration_allowed",
    "halfday"
  )

  const _setMonthOption = (obj) => {
    setValue("carry_over_expiration_month", {
      value: obj.value,
      label: obj.label
    })
    setState({
      chosenMonth: obj
    })
  }

  const handleChangeMonth = (el) => {
    _setMonthOption(el)
  }

  const setDateOptionValue = () => {
    setValue("carry_over_expiration_date", {
      value: "1",
      label: "1"
    })
    const monthValue = parseInt(state.chosenMonth.value) - 1
    const arrDaysInMonth = getDaysInMonth(monthValue, new Date().getFullYear())
    const listDayInMonth = []
    arrDaysInMonth.map((value, index) => {
      listDayInMonth.push({ value: value, label: value })
    })

    setState({
      listDayInMonth: listDayInMonth
    })
  }

  const handleChangeAccrualFrequency = (el) => {
    setValue("accrual_frequency", el)
    setState({
      currentAccrualFrequency: el.value
    })
  }

  // ** effect
  useEffect(() => {
    if (Object.keys(state.chosenMonth).length > 0) {
      setDateOptionValue()
    }
  }, [state.chosenMonth])

  useEffect(() => {
    if (isEditPolicy === true && Object.keys(dataForm).length > 0) {
      const [monthOption] = CarryOverExpiration.filter((item) => {
        return item.value === parseInt(dataForm.carry_over_expiration_month)
      })
      if (monthOption) {
        _setMonthOption(monthOption)
      }
      setValue("carry_over_expiration_date", {
        value: dataForm.carry_over_expiration_date,
        label: dataForm.carry_over_expiration_date
      })
      if (
        parseInt(dataForm?.duration_allowed.value) ===
        durationAllowedDurationHalfDayOption
      ) {
        setState({
          editDurationAllowed: true
        })
      }
      setState({
        currentAccrualFrequency: dataForm?.accrual_frequency?.value
      })
    }
  }, [isEditPolicy])

  useEffect(() => {
    if (
      parseInt(state.currentAccrualFrequency) ===
        getOptionValue(options, "accrual_frequency", "monthly") &&
      (timeOffTypePaidStatus === true || parseInt(timeOffTypePaidStatus) === 1)
    ) {
      setState({
        showAdvanceLeave: true
      })
    } else {
      setState({
        showAdvanceLeave: false
      })
    }
  }, [timeOffTypePaidStatus, state.currentAccrualFrequency])

  // ** render
  const renderType = () => {
    return (
      <Row className="mt-2">
        <Col sm={12} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.type
            }}
            nolabel={false}
            useForm={methods}
            readOnly={true}
            optionsModules={optionsModules}
            updateData={dataForm?.type}
          />
        </Col>
      </Row>
    )
  }

  const renderAdvancedLeave = () => {
    return (
      <Col sm={6} className="mb-0">
        <FieldHandle
          module={moduleName}
          fieldData={{
            ...metas.advanced_leave
          }}
          nolabel={false}
          useForm={methods}
          updateData={dataForm?.advanced_leave}
        />
      </Col>
    )
  }

  const renderDurationAllowedElement = () => {
    return (
      <DurationAllowedElement
        options={options}
        dataForm={dataForm}
        editDurationAllowed={state.editDurationAllowed}
        isEditPolicy={isEditPolicy}
        methods={methods}
      />
    )
  }

  const renderWaitingPeriodElement = () => {
    return (
      <WaitingPeriodElement
        moduleName={moduleName}
        metas={metas}
        options={options}
        dataForm={dataForm}
        isEditPolicy={isEditPolicy}
        methods={methods}
      />
    )
  }

  return (
    <Fragment>
      <div>
        <h4>{useFormatMessage("modules.time_off.title.create_policy")}</h4>
      </div>
      {isEditPolicy && renderType()}
      <Row className="mt-0">
        <Col sm={12} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.name
            }}
            nolabel={false}
            useForm={methods}
            updateData={dataForm?.name}
          />
        </Col>
      </Row>
      <Row className="mt-0">
        <Col sm={12} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.description
            }}
            nolabel={false}
            useForm={methods}
            updateData={dataForm?.description}
          />
        </Col>
      </Row>

      <div className="mt-2">
        <h5>{useFormatMessage("modules.time_off_policies.title.accrual")}</h5>
      </div>
      <Row className="mt-1">
        <Col sm={6} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.assign_date,
              labelIcon: "fal fa-info-circle",
              labelIconContent: useFormatMessage(
                "modules.time_off_policies.text.field_description.assign_date"
              )
            }}
            nolabel={false}
            options={options}
            useForm={methods}
            updateData={dataForm?.assign_date}
          />
        </Col>
      </Row>
      <Row className="mt-0">
        <Col sm={6} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.accrual_frequency,
              labelIcon: "fal fa-info-circle",
              labelIconContent: useFormatMessage(
                "modules.time_off_policies.text.field_description.accrual_frequency"
              )
            }}
            isClearable={false}
            nolabel={false}
            options={options}
            useForm={methods}
            updateData={dataForm?.accrual_frequency}
            onChange={(el) => handleChangeAccrualFrequency(el)}
          />
        </Col>
        <Col sm={6} className="mt-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.entitlement
            }}
            nolabel={false}
            useForm={methods}
            updateData={dataForm?.entitlement}
          />
          <small className="">(Days per year)</small>
        </Col>
      </Row>
      <Row className="mt-0">
        <Col sm={6} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.prorate_accrual,
              labelIcon: "fal fa-info-circle",
              labelIconContent: useFormatMessage(
                "modules.time_off_policies.text.field_description.prorate_accrual"
              )
            }}
            nolabel={false}
            useForm={methods}
            updateData={dataForm?.prorate_accrual}
          />
        </Col>
        {state.showAdvanceLeave && renderAdvancedLeave()}
      </Row>
      <Row className="mt-1">
        <Col sm={6} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.rounding_rule
            }}
            nolabel={false}
            useForm={methods}
            options={options}
            updateData={dataForm?.rounding_rule}
          />
        </Col>
        <Col sm={6} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.rounding_unit
            }}
            nolabel={false}
            useForm={methods}
            options={options}
            updateData={dataForm?.rounding_unit}
          />
        </Col>
      </Row>

      <div className="mt-2">
        <h5>
          {useFormatMessage("modules.time_off_policies.title.carry_over")}
        </h5>
      </div>
      <Row className="mt-1">
        <Col sm={6} className="mb-0">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.maximum_carry_over,
              labelIcon: "fal fa-info-circle",
              labelIconContent: useFormatMessage(
                "modules.time_off_policies.text.field_description.maximum_carry_over"
              )
            }}
            nolabel={false}
            useForm={methods}
            updateData={dataForm?.maximum_carry_over}
          />
        </Col>
        <Col sm={3} className="mb-0">
          <ErpSelect
            options={CarryOverExpiration}
            useFormatMessageLabel={true}
            name="carry_over_expiration_month"
            label={useFormatMessage(
              "modules.time_off_policies.fields.carry_over_expiration"
            )}
            placeholder={useFormatMessage(
              "modules.time_off_policies.text.choose_month"
            )}
            onChange={(el) => handleChangeMonth(el)}
            useForm={methods}
            defaultValue={dataForm?.carry_over_expiration_month}
            isClearable={false}
          />
        </Col>
        <Col sm={3} className="mb-0">
          <ErpSelect
            options={state.listDayInMonth}
            name="carry_over_expiration_date"
            label={useFormatMessage(
              "modules.time_off_policies.fields.carry_over_expiration_date"
            )}
            placeholder={useFormatMessage(
              "modules.time_off_policies.text.choose_date"
            )}
            useForm={methods}
            isClearable={false}
          />
        </Col>
      </Row>
      <Fragment>{renderWaitingPeriodElement()}</Fragment>
      <div className="mb-1 mt-2">
        <h5>
          {useFormatMessage("modules.time_off_policies.title.duration_allowed")}
        </h5>
      </div>
      <Fragment>{renderDurationAllowedElement()}</Fragment>
    </Fragment>
  )
}

export default PolicyFormElement
