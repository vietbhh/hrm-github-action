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
  const modules = useSelector((state) => state.app.modules.pay_cycles)
  const module = modules.config
  const moduleName = module.name
  const metas = modules.metas
  const options = modules.options
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    dataList: [],
    isEdit: false,
    dataEdit: {},
    loading: false,
    effectiveType: "date",
    effectiveFormat: "DD MMM YYYY",
    repeatNumCheck: true,
    lastAttendanceDate: ""
  })
  const methods = useForm({
    mode: "onSubmit"
  })
  const {
    handleSubmit,
    errors,
    control,
    register,
    watch,
    reset,
    setValue,
    getValues
  } = methods
  const { id } = useParams()
  const indexOfArray = (arr, value) => {
    return arr.findIndex((item) => item.value === value)
  }
  const optionsRepeatNum = [{ value: 1, label: 1 }]

  const optionsRepeatNumWeek = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 }
  ]

  const optionsCutOffDateWeek = [
    {
      label: "Before End Date",
      options: [
        {
          value: 1,
          label: `1 ${useFormatMessage("modules.pay_cycles.text.day")}`
        },
        {
          value: 2,
          label: `2 ${useFormatMessage("modules.pay_cycles.text.days")}`
        },
        {
          value: 3,
          label: `3 ${useFormatMessage("modules.pay_cycles.text.days")}`
        },
        {
          value: 4,
          label: `4 ${useFormatMessage("modules.pay_cycles.text.days")}`
        }
      ]
    }
  ]
  const arrOptionCutOfDate = []
  for (let i = 1; i <= 15; i++) {
    const obj = {
      value: i,
      label: `${useFormatMessage("modules.pay_cycles.text.day")} ${i}`
    }
    arrOptionCutOfDate.push(obj)
  }

  const optionsCutOffDateMonth = [
    {
      label: "After the fact",
      options: arrOptionCutOfDate
    },
    {
      label: "In advance",
      options: [
        {
          value: 20,
          label: `${useFormatMessage("modules.pay_cycles.text.day")} 20`
        },
        {
          value: 21,
          label: ` ${useFormatMessage("modules.pay_cycles.text.day")} 21`
        },
        {
          value: 22,
          label: `${useFormatMessage("modules.pay_cycles.text.day")} 22`
        },
        {
          value: 23,
          label: `${useFormatMessage("modules.pay_cycles.text.day")} 23`
        },
        {
          value: 24,
          label: `${useFormatMessage("modules.pay_cycles.text.day")} 24`
        },
        {
          value: 25,
          label: `${useFormatMessage("modules.pay_cycles.text.day")} 25`
        },
        {
          value: 27,
          label: `${useFormatMessage("modules.pay_cycles.text.day")} 27`
        },
        {
          value: 28,
          label: `${useFormatMessage("modules.pay_cycles.text.day")} 28`
        }
      ]
    }
  ]

  const optionsRwBfCutOff = [
    {
      value: 2,
      label: `2 ${useFormatMessage("modules.pay_cycles.text.days")}`
    },
    {
      value: 5,
      label: `5 ${useFormatMessage("modules.pay_cycles.text.days")}`
    }
  ]
  useEffect(() => {
    if (!id) {
      setValue("repeat_every_num", optionsRepeatNumWeek[0])
      setValue("cut_off_date", optionsCutOffDateWeek[0].options[0])
      setValue("rw_before_cut_off_date", optionsRwBfCutOff[0])
    }
    loadData()
  }, [])

  useEffect(() => {
    if (id && !state.isEdit) {
      setState({
        loading: true
      })
      payrollsSettingApi.info(id).then((res) => {
        const info = res.data.data
        setState({
          isEdit: true,
          dataEdit: info,
          loading: false
        })
        setValue(
          "repeat_every_num",
          info.repeat_every_type?.name_option === "week"
            ? optionsRepeatNumWeek[
                indexOfArray(optionsRepeatNumWeek, info.repeat_every_num * 1)
              ]
            : optionsRepeatNum[
                indexOfArray(optionsRepeatNum, info.repeat_every_num * 1)
              ]
        )
        // setValue("effective", moment(info.effective, "YYYY-MM-DD"))

        setValue("repeat_every_type", info.repeat_every_type)
        let cut_off_val =
          info.cut_off_date * 1 >= 5
            ? optionsCutOffDateMonth[0].options
            : optionsCutOffDateWeek[0].options
        if (info.cut_off_date * 1 >= 20) {
          cut_off_val = optionsCutOffDateMonth[1].options
        }

        setValue(
          "cut_off_date",
          info.cut_off_date * 1 >= 5
            ? cut_off_val[indexOfArray(cut_off_val, info.cut_off_date * 1)]
            : cut_off_val[indexOfArray(cut_off_val, info.cut_off_date * 1)]
        )
        changeRepeatType(info.repeat_every_type)
      })
    }
  }, [id])

  const loadData = () => {
    payrollsSettingApi.lastAttendance().then((res) => {
      setState({ lastAttendanceDate: res.data.last_attendances_date })
    })
  }
  const history = useNavigate()

  const handleCancel = () => {
    history("/payrolls/settings/pay-cycles")
  }
  const changeRepeatType = (e) => {
    let effectiveType = "date"
    let effectiveFormat = "DD MMM YYYY"
    if (e.name_option === "month") {
      effectiveType = "month"
      effectiveFormat = "MMM YYYY"
    }

    setState({
      effectiveType: effectiveType,
      effectiveFormat: effectiveFormat
    })
  }
  const onSubmit = (values) => {
    values.cut_off_date = values.cut_off_date.value
    values.rw_before_cut_off_date = values.rw_before_cut_off_date.value
    values.repeat_every_num = values.repeat_every_num.value

    setState({ loading: true })
    if (state.isEdit) values.id = id
    payrollsSettingApi
      .save(values)
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
                  color="primary"
                  style={{
                    padding: "0.5rem"
                  }}>
                  <i className="fal fal fa-sync"></i>
                </Button.Ripple>{" "}
                <span
                  style={{
                    marginLeft: "15px",
                    fontSize: "1.2rem"
                  }}>
                  {useFormatMessage("modules.pay_cycles.button.add")}
                </span>
              </CardTitle>
            )}
            {state.isEdit && (
              <CardTitle tag="h4">
                <Button.Ripple
                  tag="span"
                  className="btn-icon rounded-circle "
                  color="primary"
                  style={{
                    padding: "0.5rem"
                  }}>
                  <i className="fal fal fa-sync"></i>
                </Button.Ripple>{" "}
                <span
                  style={{
                    marginLeft: "15px",
                    fontSize: "1.2rem"
                  }}>
                  {useFormatMessage("button.edit")} {state.dataEdit.name}
                </span>
              </CardTitle>
            )}
            <UILoader
              blocking={false}
              className="custom-loader"
              loader={<FormLoader />}>
              {" "}
              <FormProvider {...methods}>
                <Row>
                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage("modules.pay_cycles.fields.name")} *
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
                          updateData={state.dataEdit.name}
                          loading={state.loading}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.pay_cycles.fields.description"
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
                          options={options}
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
                          "modules.pay_cycles.fields.effective"
                        )}{" "}
                        *
                      </div>
                      <div className="w-50 mb-1">
                        <ErpDate
                          picker={state.effectiveType}
                          name="effective"
                          useForm={methods}
                          className="form-control mr-1"
                          allowClear={false}
                          disabledDate={(current) => {
                            const customDate = moment(
                              state.lastAttendanceDate
                            ).format("YYYY-MM-DD")
                            return (
                              (current &&
                                current < moment(customDate, "YYYY-MM-DD")) ||
                              moment(
                                state.lastAttendanceDate,
                                "YYYY-MM-DD"
                              ).add(
                                1,
                                state.effectiveType === "date"
                                  ? "days"
                                  : "months"
                              ) > current
                            )
                          }}
                          defaultValue={
                            state.isEdit &&
                            moment(state.dataEdit?.effective, "YYYY-MM-DD")
                          }
                          nolabel
                          loading={state.loading}
                          format={state.effectiveFormat}
                          placeholder={useFormatMessage(
                            "modules.pay_cycles.fields.effective"
                          )}
                        />
                        <div className="invalid-feedback d-block">
                          {errors?.effective && errors?.effective.message}
                        </div>
                      </div>
                      <div className="w-25">
                        <div className="ms-1 text-sm"></div>
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
                            options={
                              state.effectiveType === "month"
                                ? optionsRepeatNum
                                : optionsRepeatNumWeek
                            }
                            name="repeat_every_num"
                            useForm={methods}
                            nolabel
                            placeholder={useFormatMessage(
                              "modules.pay_cycles.fields.repeat_every_num"
                            )}
                            onChange={(e) => {
                              setValue("repeat_every_num", e)
                              if (
                                e.value > 1 &&
                                state.effectiveType !== "month"
                              ) {
                                setValue(
                                  "rw_before_cut_off_date",
                                  optionsRwBfCutOff[1]
                                )
                              } else if (state.effectiveType === "month") {
                                setValue(
                                  "rw_before_cut_off_date",
                                  optionsRwBfCutOff[1]
                                )
                              } else {
                                setValue(
                                  "rw_before_cut_off_date",
                                  optionsRwBfCutOff[0]
                                )
                              }
                              setState({
                                dataEdit: {
                                  ...state.dataEdit,
                                  repeat_every_num: e
                                }
                              })
                            }}
                            isClearable={false}
                            defaultValue={optionsRepeatNumWeek[0]}
                          />
                        </div>
                        <div className="w-100">
                          <FieldHandle
                            module={moduleName}
                            fieldData={{
                              ...metas.repeat_every_type
                            }}
                            nolabel
                            isClearable={false}
                            useForm={methods}
                            options={options}
                            onChange={(e) => {
                              changeRepeatType(e)
                              setValue("repeat_every_type", e)
                              if (e.name_option === "month") {
                                setValue(
                                  "rw_before_cut_off_date",
                                  optionsRwBfCutOff[1]
                                )
                                setValue(
                                  "repeat_every_num",
                                  optionsRepeatNum[0]
                                )
                                setValue(
                                  "cut_off_date",
                                  optionsCutOffDateMonth[0].options[0]
                                )
                              } else {
                                setValue(
                                  "rw_before_cut_off_date",
                                  optionsRwBfCutOff[0]
                                )
                                setValue(
                                  "repeat_every_num",
                                  optionsRepeatNum[0]
                                )

                                setValue(
                                  "cut_off_date",
                                  optionsCutOffDateWeek[0].options[0]
                                )
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.pay_cycles.fields.cut_off_date"
                        )}{" "}
                        *
                      </div>
                      <div className="w-50">
                        <ErpSelect
                          options={
                            state.effectiveType === "month"
                              ? optionsCutOffDateMonth
                              : optionsCutOffDateWeek
                          }
                          name="cut_off_date"
                          useForm={methods}
                          onChange={(e) => {
                            setValue("cut_off_date", e)
                            setState({
                              dataEdit: {
                                ...state.dataEdit,
                                cut_off_date: e
                              }
                            })
                          }}
                          nolabel
                          placeholder={useFormatMessage(
                            "modules.pay_cycles.fields.cut_off_date"
                          )}
                          className="select-css"
                          defaultValue={optionsCutOffDateWeek[0].options[0]}
                          isClearable={false}
                        />
                        <div
                          className="invalid-feedback d-block"
                          style={{
                            marginTop: "-0.75rem"
                          }}>
                          {errors?.cut_off_date && errors?.cut_off_date.message}
                        </div>
                      </div>
                      <div className="w-25">
                        <div className="ms-1 fs-8">
                          <i className="fal fa-exclamation-circle"></i>{" "}
                          {useFormatMessage(
                            "modules.pay_cycles.note.cut_off_date_note"
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={12} className="mt-1">
                    <h4>
                      {useFormatMessage("modules.pay_cycles.text.who_charge")}
                    </h4>
                  </Col>
                  <Col sm={12} className="mt-1">
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.pay_cycles.fields.person_in_charge"
                        )}{" "}
                        *
                      </div>
                      <div className="w-50">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.person_in_charge
                          }}
                          nolabel
                          useForm={methods}
                          updateData={state.dataEdit?.person_in_charge}
                          loading={state.loading}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.pay_cycles.fields.rw_before_cut_off_date"
                        )}{" "}
                        *
                      </div>
                      <div className="w-50">
                        <ErpSelect
                          options={optionsRwBfCutOff}
                          name="rw_before_cut_off_date"
                          useForm={methods}
                          nolabel
                          placeholder={useFormatMessage(
                            "modules.pay_cycles.fields.rw_before_cut_off_date"
                          )}
                          defaultValue={optionsRwBfCutOff[0]}
                          readOnly
                        />
                      </div>
                      <div className="w-25">
                        <div className="ms-1 fs-8">
                          <i className="fal fa-exclamation-circle"></i>{" "}
                          {useFormatMessage(
                            "modules.pay_cycles.note.before_cut_off_date_note"
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="d-flex align-items-top mt-1">
                      <div className="w-25">
                        {useFormatMessage(
                          "modules.pay_cycles.fields.use_time_attendance"
                        )}
                      </div>
                      <div className="w-50">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.use_time_attendance
                          }}
                          nolabel
                          useForm={methods}
                          options={options}
                          updateData={state.dataEdit?.use_time_attendance}
                          loading={state.loading}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="div-use-ot d-flex align-items-center mt-1 mt-2">
                      <div className="w-100">
                        {useFormatMessage(
                          "modules.pay_cycles.fields.calculate_ot"
                        )}
                      </div>
                      <div className="ms-1">
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.calculate_ot
                          }}
                          nolabel
                          useForm={methods}
                          options={options}
                          updateData={state.dataEdit?.calculate_ot}
                          loading={state.loading}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col sm={12} className="mt-2">
                    <i className="fal fa-exclamation-circle"></i>{" "}
                    {useFormatMessage("modules.pay_cycles.note.last_note")}
                  </Col>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-12 d-flex mt-3 ">
                      <Button className="btn" color="primary" type="sub">
                        {useFormatMessage("button.save")}
                      </Button>

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
