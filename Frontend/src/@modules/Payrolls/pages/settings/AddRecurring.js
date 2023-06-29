import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { ErpDate, ErpSelect } from "@apps/components/common/ErpField"
import { FormLoader } from "@apps/components/spinner/FormLoader"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import UILoader from "@core/components/ui-loader"
import { DatePicker } from "antd"
import moment from "moment"
import { useContext, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Button, CardTitle, Col, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { payrollsSettingApi } from "../../common/api"
import PayCyclesLayout from "./PayCyclesLayout"
const AddPaycles = (props) => {
  const modules = useSelector((state) => state.app.modules.recurring)
  const module = modules.config
  const moduleName = module.name
  const metas = modules.metas
  const options = modules.options
  const ability = useContext(AbilityContext)
  const fixedValue = options.payment_type.filter((option) => {
    return option.name_option === "fixed"
  })
  const [state, setState] = useMergedState({
    isEdit: false,
    dataEdit: {
      valid_from: new Date(),
      valid_to: new Date()
    },
    loading: false,
    endDate: false,
    repeat_every_type: "day",
    pickerType: "date",
    repeatYear: false,
    paymentTypeCus: false,
    format: "DD MMM YYYY",
    fm: "D",
    option_paymentType: fixedValue
  })
  useEffect(() => {
    if (
      state.repeat_every_type === "month" ||
      state.repeat_every_type === "year"
    ) {
      setState({
        fm: "M",
        format: "MMM YYYY",
        pickerType: "month"
      })
    } else if (state.repeat_every_type === "day") {
      setState({
        fm: "D",
        format: "DD MMM YYYY",
        pickerType: "date"
      })
    }
  }, [state.repeat_every_type])

  const repeatNumOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" }
  ]
  const approvalOptions = [
    { value: "1", label: useFormatMessage("common.month.1") },
    { value: "2", label: useFormatMessage("common.month.2") },
    { value: "3", label: useFormatMessage("common.month.3") },
    { value: "4", label: useFormatMessage("common.month.4") },
    { value: "5", label: useFormatMessage("common.month.5") },
    { value: "6", label: useFormatMessage("common.month.6") },
    { value: "7", label: useFormatMessage("common.month.7") },
    { value: "8", label: useFormatMessage("common.month.8") },
    { value: "9", label: useFormatMessage("common.month.9") },
    { value: "10", label: useFormatMessage("common.month.10") },
    { value: "11", label: useFormatMessage("common.month.11") },
    { value: "12", label: useFormatMessage("common.month.12") }
  ]
  const EligibilityOptions = [
    {
      value: "1",
      label: `1 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "2",
      label: `2 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "3",
      label: `3 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "4",
      label: `4 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "5",
      label: `5 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "6",
      label: `6 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "7",
      label: `7 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "8",
      label: `8 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "9",
      label: `9 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "10",
      label: `10 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "11",
      label: `11 ${useFormatMessage("modules.recurring.fields.month")}`
    },
    {
      value: "12",
      label: `12 ${useFormatMessage("modules.recurring.fields.month")}`
    }
  ]
  const methods = useForm({
    mode: "onSubmit"
  })
  const {
    handleSubmit,
    errors,
    control,
    register,
    reset,
    setValue,
    getValues,
    watch
  } = methods
  const { id } = useParams()
  const indexOfArray = (arr, value) => {
    return arr.findIndex((item) => item.value === value)
  }

  useEffect(() => {
    setValue(
      "valid_from",
      moment(new Date(state.dataEdit.valid_from), state.format)
    )
    setValue(
      "valid_to",
      moment(new Date(state.dataEdit.valid_to), state.format)
    )
    if (id && !state.isEdit) {
      setState({
        loading: true
      })
      payrollsSettingApi.infoRecurring(id).then((res) => {
        const info = res.data.data
        let formatType = "month"
        let format = "MMM YYYY"
        let fm = "M"
        let repeatYear = false
        if (info?.repeat_type?.name_option === "day") {
          formatType = "date"
          format = "DD MMM YYYY"
          fm = "D"
        }
        if (info?.repeat_type?.name_option === "week") {
          formatType = "week"
          format = "[Week] w, YYYY"
          fm = "w"
        }
        if (info?.repeat_type?.name_option === "year") {
          repeatYear = true
          setValue(
            "repeat_on",
            approvalOptions[indexOfArray(approvalOptions, info.repeat_on)]
          )
        }
        setState({
          isEdit: true,
          dataEdit: info,
          loading: false,
          repeat_every_type: formatType,
          pickerType: formatType,
          format: format,
          repeatYear: repeatYear,
          fm: fm,
          endDate: info.end_date
        })

        setValue(
          "repeat_number",
          repeatNumOptions[
            indexOfArray(repeatNumOptions, info.repeat_number * 1)
          ]
        )
        setValue("prorate_payment", info.prorate_payment)
        setValue("enough_working_hours", info.enough_working_hours)
        setValue("valid_from", moment(new Date(info.valid_from), fm))
        setValue("valid_to", moment(new Date(info.valid_to), fm))
      })
    }
  }, [id])

  const handleChangeRepeatType = (e) => {
    let pickerType = "week"
    let repeatYear = false
    let format = "[Week] w, YYYY"
    let fm = "w"
    let optionsPaymentType = { ...options.payment_type }
    const fixedValue = options.payment_type.filter((option) => {
      return option.name_option === "fixed"
    })
    optionsPaymentType = fixedValue

    if (e.name_option === "day") {
      pickerType = "date"
      format = "DD MMM YYYY"
      fm = "D"
    }

    if (e.name_option === "month") {
      pickerType = "month"
      format = "MMM YYYY"
      fm = "M"
    }

    if (e.name_option === "year") {
      repeatYear = true
      pickerType = "month"
      format = "MMM YYYY"
      fm = "M"
      optionsPaymentType = [...options.payment_type]
    }

    setState({
      repeat_every_type: e.name_option,
      pickerType: pickerType,
      repeatYear: repeatYear,
      option_paymentType: optionsPaymentType,
      format: format,
      fm: fm
    })
    setValue("repeat_type", e)
  }

  const handleChangePaymentType = (e) => {
    let sttPaymentTypeCus = false
    if (e.name_option === "custom") sttPaymentTypeCus = true
    setState({ paymentTypeCus: sttPaymentTypeCus })
    setValue("payment_type", e)
  }

  const history = useNavigate()

  const handleCancel = () => {
    history("/payrolls/settings/compensation")
  }

  const onSubmit = (values) => {
    setState({ loading: true })
    if (id) values.id = id
    if (_.isArray(values.repeat_type)) {
      values.repeat_type = values.repeat_type[0]
    }
    if (_.isArray(values.payment_type)) {
      values.payment_type = values.payment_type[0]
    }
    payrollsSettingApi
      .saveRecurring(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({
          loading: false
        })
        handleCancel()
      })
      .catch((err) => {
        //props.submitError();
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const addBtn = ability.can("accessPayrollsSetting", "payrolls") ? (
    <Button className="btn" color="primary" type="submit">
      {useFormatMessage("button.save")}
    </Button>
  ) : (
    ""
  )

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "end_date") {
        setState({ endDate: value.end_date })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <>
      <PayCyclesLayout
        breadcrumbs={
          <Breadcrumbs
            list={[
              {
                title: useFormatMessage("menu.pay_cycles")
              },
              {
                title: useFormatMessage("modules.pay_cycles.button.add")
              }
            ]}
          />
        }>
        <Row>
          <Col sm={12}>
            {!state.isEdit && (
              <CardTitle tag="h4">
                <Button.Ripple
                  tag="span"
                  className="btn-icon rounded-circle "
                  color="primary">
                  <i className="fal fa-coins"></i>
                </Button.Ripple>{" "}
                <span className="title-card">
                  {useFormatMessage("modules.recurring.button.add")}
                </span>
              </CardTitle>
            )}
            {state.isEdit && (
              <CardTitle tag="h4">
                <Button.Ripple
                  tag="span"
                  className="btn-icon rounded-circle "
                  color="primary">
                  <i className="fal fal fa-sync"></i>
                </Button.Ripple>{" "}
                <span className="title-card">
                  {useFormatMessage("button.edit")} {state.dataEdit?.name}
                </span>
              </CardTitle>
            )}
            <UILoader
              blocking={false}
              className="custom-loader"
              loader={<FormLoader />}>
              {" "}
              <FormProvider {...methods}>
                <Row className="mt-3">
                  <Col sm={12}>
                    <div className="d-flex align-items-top">
                      <div className="w-25">
                        {useFormatMessage("modules.recurring.fields.name")} *
                      </div>
                      <div className="w-50">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.name
                          }}
                          nolabel
                          useForm={methods}
                          options={options}
                          updateData={state.dataEdit?.name}
                          loading={state.loading}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.recurring.fields.description"
                        )}
                      </div>
                      <div className="w-50">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.description
                          }}
                          nolabel
                          useForm={methods}
                          updateData={state.dataEdit?.description}
                          loading={state.loading}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.pay_cycles.fields.repeat_every"
                        )}{" "}
                        *
                      </div>
                      <div className="w-50 d-flex">
                        <div className="w-100 me-1">
                          <ErpSelect
                            className="react-select mb-1"
                            nolabel
                            options={
                              state.repeat_every_type === "year" ||
                              state.repeat_every_type === "day"
                                ? [
                                    {
                                      value: "1",
                                      label: "1"
                                    }
                                  ]
                                : repeatNumOptions
                            }
                            defaultValue={repeatNumOptions[0]}
                            name="repeat_number"
                            useForm={methods}
                            isClearable={false}
                            loading={state.loading}
                          />
                        </div>
                        <div className="w-100">
                          <FieldHandle
                            module={moduleName}
                            fieldData={{
                              ...metas.repeat_type
                            }}
                            nolabel
                            options={options}
                            onChange={(e) => handleChangeRepeatType(e)}
                            isClearable={false}
                            useForm={methods}
                            updateData={state.dataEdit?.repeat_type}
                            loading={state.loading}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>

                  {state.repeatYear && (
                    <Col sm={12}>
                      <div className="d-flex align-items-top mt-1">
                        <div className="w-25">
                          {useFormatMessage(
                            "modules.recurring.fields.repeat_on"
                          )}{" "}
                          *
                        </div>
                        <div className="w-50">
                          <ErpSelect
                            className="react-select mb-1"
                            classNamePrefix="select"
                            name="repeat_on"
                            nolabel
                            useForm={methods}
                            options={approvalOptions}
                          />
                        </div>
                      </div>
                    </Col>
                  )}

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.recurring.fields.payment_type"
                        )}{" "}
                        *
                      </div>
                      <div className="w-50">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.payment_type
                          }}
                          nolabel
                          options={{ payment_type: state.option_paymentType }}
                          isClearable={false}
                          onChange={handleChangePaymentType}
                          useForm={methods}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage("modules.recurring.fields.amount")} *
                      </div>
                      <div className="w-50">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.amount
                          }}
                          nolabel
                          useForm={methods}
                          options={options}
                          updateData={state.dataEdit?.amount}
                          loading={state.loading}
                        />
                      </div>
                    </div>
                  </Col>
                  {state.repeatYear && (
                    <Col sm={12}>
                      <div className="d-flex align-items-top mt-1">
                        <div className="w-25">
                          {useFormatMessage(
                            "modules.recurring.fields.eligibility"
                          )}{" "}
                          *
                        </div>
                        <div className="w-50">
                          <ErpSelect
                            nolabel
                            className="react-select mb-1"
                            classNamePrefix="select"
                            options={EligibilityOptions}
                            name="eligibility"
                            useForm={methods}
                          />
                          {errors?.eligibility && (
                            <div
                              className="invalid-feedback"
                              style={{
                                display: "block"
                              }}>
                              {errors?.eligibility.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  )}

                  {state.paymentTypeCus && (
                    <Col sm={12}>
                      <div className="d-flex align-items-top mt-1">
                        <div className="w-25">
                          {useFormatMessage(
                            "modules.recurring.fields.calculate_base_on_last"
                          )}{" "}
                          *
                        </div>
                        <div className="w-50">
                          <ErpSelect
                            className="react-select mb-1"
                            options={EligibilityOptions}
                            name="calculate_base_on_last"
                            useForm={methods}
                            nolabel
                            isClearable={false}
                          />
                        </div>
                      </div>
                    </Col>
                  )}
                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.recurring.fields.valid_from"
                        )}{" "}
                        *
                      </div>
                      <div className="w-50">
                        <ErpDate
                          picker={state.pickerType}
                          className="form-control"
                          name="valid_from"
                          useForm={methods}
                          nolabel
                          format={state.format}
                          defaultValue={moment(
                            new Date(state.dataEdit.valid_from),
                            state.format
                          )}
                          allowClear={false}
                          loading={state.loading}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage("modules.recurring.fields.end_date")}{" "}
                        *
                      </div>
                      <div className="w-50">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.end_date
                          }}
                          nolabel
                          useForm={methods}
                          options={options}
                          defaultChecked={state.dataEdit.end_date}
                          loading={state.loading}
                        />

                        <DatePicker
                          picker={state.pickerType}
                          format={state.format}
                          className="form-control datepicker"
                          name="valid_to"
                          useForm={methods}
                          onChange={(e, string) => {
                            const dateFM = e.format("YYYY-MM-DD")
                            setValue("valid_to", e)
                            setState({
                              dataEdit: {
                                ...state.dataEdit,
                                valid_to: dateFM
                              }
                            })
                          }}
                          disabled={state.endDate}
                          disabledDate={(current) => {
                            const typeRepeat =
                              getValues("repeat_type")?.name_option
                            const valid_from = moment(
                              getValues("valid_from")
                            ).format("YYYY-MM")
                            let repeat_number =
                              getValues("repeat_number")?.value
                            const checkDate = (dateCheck) => {
                              if (
                                typeRepeat === "month" ||
                                typeRepeat === "year"
                              ) {
                                const currentTime = dateCheck.format("YYYY-MM")

                                let plusNumber = 1
                                if (typeRepeat === "year") {
                                  repeat_number = 12
                                  plusNumber = 0
                                }

                                if (
                                  (dateCheck?.format(state.fm) -
                                    repeat_number -
                                    moment(valid_from).format(state.fm) +
                                    plusNumber) %
                                    repeat_number !==
                                  0
                                ) {
                                  return true
                                }

                                if (currentTime < valid_from) {
                                  return true
                                }
                              } else if (typeRepeat === "week") {
                                const valid_from = getValues("valid_from")
                                if (
                                  dateCheck?.format("YYYY-MM-DD") <
                                    moment(valid_from).format("YYYY-MM-DD") ||
                                  (dateCheck?.format(state.fm) -
                                    repeat_number -
                                    moment(valid_from).format(state.fm) +
                                    1) %
                                    repeat_number !==
                                    0
                                ) {
                                  return true
                                }
                              } else {
                                const valid_from = getValues("valid_from")
                                if (
                                  moment(dateCheck).format("YYYY-MM-DD") <
                                  moment(valid_from).format("YYYY-MM-DD")
                                ) {
                                  return true
                                }
                              }

                              return false
                            }
                            return checkDate(current)
                          }}
                          value={moment(
                            new Date(state.dataEdit.valid_to),
                            state.format
                          )}
                          allowClear={false}
                          loading={state.loading}
                        />
                        {errors?.valid_to && (
                          <div
                            className="invalid-feedback"
                            style={{
                              display: "block"
                            }}>
                            {errors?.valid_to.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.recurring.fields.prorate_payment"
                        )}
                      </div>
                      <div className="w-50">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.prorate_payment
                          }}
                          defaultChecked={state.dataEdit.prorate_payment}
                          nolabel
                          useForm={methods}
                          options={options}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.recurring.fields.enough_working_hours"
                        )}
                      </div>
                      <div className="w-50">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.enough_working_hours
                          }}
                          defaultChecked={state.dataEdit.prorate_payment}
                          nolabel
                          useForm={methods}
                          options={options}
                        />
                      </div>
                    </div>
                  </Col>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-12 d-flex mt-3 ">
                      {addBtn}
                      <Button
                        className="btn ms-2"
                        color="secondary"
                        onClick={() => handleCancel()}>
                        {useFormatMessage("button.cancel")}
                      </Button>
                    </div>
                  </form>
                </Row>
              </FormProvider>
            </UILoader>
          </Col>
        </Row>
      </PayCyclesLayout>
    </>
  )
}

export default AddPaycles
