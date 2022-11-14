// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import {
  ErpCheckbox,
  ErpSelect,
  ErpSwitch,
  ErpUserSelect
} from "@apps/components/common/ErpField"
import { FormLoader } from "@apps/components/spinner/FormLoader"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { getNumOrder } from "@modules/Attendances/common/common"
import { payrollsSettingApi } from "@modules/Payrolls/common/api"
import { DatePicker, Tabs } from "antd"
import moment from "moment"
import { useContext, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Button, CardTitle, Col, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { attendanceSettingApi } from "../../common/api"
import AttendanceLayout from "./AttendanceLayout"

const { TabPane } = Tabs
const { RangePicker } = DatePicker

const General = (props) => {
  // ** Props
  const [state, setState] = useMergedState({
    loading: false,
    viewGrid: true,
    blockUI: true,
    info: {},
    generalUpdate: {},
    originalSetting: {},
    perSonList: [],
    isMonthly: false,
    repeatOnOption: [],
    disableRepeatOnSelect: false,
    lastAttendanceDate: ""
  })
  useEffect(() => {
    loadData()
    loadAttendanceDate()
  }, [])

  const approvalOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
  ]

  const numberApprovalOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" }
  ]

  const numberApprovalOptionsMonthly = [{ value: "1", label: "1" }]

  const disabledDate = (current) => {
    return current && current <= moment(state.lastAttendanceDate)
  }

  const loadData = () => {
    setState({ loading: true })
    attendanceSettingApi.infoGeneral().then((res) => {
      let isMonthly = false
      if (res.data.attendance_approval_cycle === "monthly") isMonthly = true
      const attendance_repeat_on = JSON.parse(res.data.attendance_repeat_on)
      setState({
        info: res.data,
        loading: false,
        perSonList: res.data.person_charge,
        generalUpdate: {
          attendance_start_date: res.data.attendance_start_date,
          attendance_approval_cycle_num: res.data.attendance_approval_cycle_num,
          attendance_approval_cycle: res.data.attendance_approval_cycle,
          attendance_repeat_on_value: attendance_repeat_on.value,
          attendance_repeat_on_type: attendance_repeat_on.type,
          attendance_allow_overtime:
            res.data.attendance_allow_overtime
        },
        originalSetting: {
          attendance_approval_cycle_num: res.data.attendance_approval_cycle_num,
          attendance_approval_cycle: res.data.attendance_approval_cycle,
          attendance_repeat_on_value: attendance_repeat_on.value,
          attendance_repeat_on_type: attendance_repeat_on.type,
          attendance_allow_overtime:
            res.data.attendance_allow_overtime
        },
        blockUI: false,
        isMonthly: isMonthly
      })

      if (isMonthly) {
        setValue("attendance_approval_cycle", {
          value: "monthly",
          label: "Monthly"
        })
        setValue("attendance_approval_cycle_num", { value: "1", label: "1" })
      } else {
        setValue("attendance_approval_cycle", {
          value: "weekly",
          label: "Weekly"
        })
        setValue("attendance_approval_cycle_num", {
          value: res.data.attendance_approval_cycle_num,
          label: res.data.attendance_approval_cycle_num
        })
      }
    })
  }

  const loadAttendanceDate = () => {
    payrollsSettingApi.lastAttendance().then((res) => {
      setState({ lastAttendanceDate: res.data.last_attendances_date })
    })
  }

  const renderPersonCharge = () => {
    return state.perSonList.map((item) => {
      return (
        <div key={item.value}>
          <div className="d-flex flex-wrap align-items-center perSon_charge">
            <div className="avatar my-0 me-50 rounded-circle avatar-sm">
              <Avatar src={item.avatar} height="32" width="32" />
              <span className="avatar-status-online avatar-status-sm"></span>
            </div>
            <span className="fw-bold">{item?.full_name}</span>{" "}
            <small className="text-truncate text-muted mb-0">
              @{item?.username}
            </small>
            <button
              type="button"
              className="waves-effect ms-auto btn btn-flat-danger btn-sm"
              onClick={() => handleDeletePerson(item)}>
              <i className="fal fa-trash ms-auto"></i>
            </button>
          </div>
        </div>
      )
    })
  }

  const handleDeletePerson = (itemDel) => {
    const arrData = []
    state.perSonList.map((item) => {
      if (item.value !== itemDel.value) {
        arrData.push(item)
      }
    })
    attendanceSettingApi
      .saveGeneral({ attendance_person_in_charge: arrData })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ perSonList: arrData })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const handleSelectPerson = (e) => {
    const arrData = []
    state.perSonList.map((item) => {
      if (item.value !== e.value) {
        arrData.push(item)
      }
    })
    arrData.push(e)
    attendanceSettingApi
      .saveGeneral({ attendance_person_in_charge: arrData })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ perSonList: arrData })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const handleChangeAttendanceApprovalCycle = (e) => {
    let isMonthly = false
    if (e.value === "monthly") {
      isMonthly = true
    }
    setValue("attendance_approval_cycle_num", numberApprovalOptionsMonthly[0])
    setValue("attendance_approval_cycle", e)
    setState({
      generalUpdate: {
        ...state.generalUpdate,
        attendance_approval_cycle: e,
        attendance_approval_cycle_num: numberApprovalOptionsMonthly[0]["value"]
      },
      isMonthly: isMonthly
    })
  }

  const handleChangeAttendanceStartDate = (e) => {
    setState({
      generalUpdate: {
        ...state.generalUpdate,
        attendance_start_date: e.format("YYYY-MM-DD")
      }
    })
  }

  const onSubmit = (values) => {
    const today = moment()
    const startDate = state.lastAttendanceDate
    const dateDiff = moment.duration(today.diff(startDate))
    let allowSubmit = true
    // &&  dateDiff.days() > 0

    if (
      (state.originalSetting.attendance_approval_cycle !==
        state.generalUpdate.attendance_approval_cycle ||
        state.originalSetting.attendance_approval_cycle_num !==
          state.generalUpdate.attendance_approval_cycle_num ||
        state.originalSetting.attendance_repeat_on_value !==
          state.generalUpdate.attendance_repeat_on_value ||
        state.originalSetting.attendance_repeat_on_type !==
          state.generalUpdate.attendance_repeat_on_type) &&
      dateDiff.days() > 0
    ) {
      allowSubmit = false
    }

    if (allowSubmit) {
      const data = { ...state.generalUpdate }
      data.attendance_person_in_charge = state.perSonList
      attendanceSettingApi
        .saveGeneral(data)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
        })
        .catch((err) => {
          setState({ loading: false })
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
        })
    } else {
      notification.showError({
        text: useFormatMessage(
          "modules.attendance_setting.text.warning.attendance_start_date"
        )
      })
    }
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit, setValue } = methods
  const ability = useContext(AbilityContext)
  const addBtn = ability.can("accessAttendanceSetting", "attendances") ? (
    <Button className="btn" color="primary" type="submit">
      {useFormatMessage("button.save")}
    </Button>
  ) : (
    ""
  )

  useEffect(() => {
    if (
      state.isMonthly === true &&
      state.generalUpdate.attendance_start_date !== undefined
    ) {
      const startDate = moment(state.generalUpdate.attendance_start_date)
      const date = startDate.date()
      const dayInWeek = startDate.day()
      const numOrder = getNumOrder(date)
      const dayOption = {
        value: { type: "date", value: date },
        label: useFormatMessage(
          "modules.attendance_setting.app_options.repeat_on.date",
          { date: date }
        )
      }
      const weekDayOption = {
        value: { type: "day_in_week", value: dayInWeek, num_order: numOrder },
        label: useFormatMessage(
          "modules.attendance_setting.app_options.repeat_on.day_in_week",
          {
            num_order: useFormatMessage(
              `modules.attendance_setting.text.num_order.${numOrder}`
            ),
            day_in_week: useFormatMessage(`day_in_week.${dayInWeek}`)
          }
        )
      }

      const repeatOnOption =
        state.generalUpdate?.attendance_repeat_on_type === "day_in_week"
          ? weekDayOption
          : dayOption

      setState({
        generalUpdate: {
          ...state.generalUpdate,
          repeat_on: repeatOnOption
        },
        repeatOnOption: [dayOption, weekDayOption],
        disableRepeatOnSelect: false
      })
      setValue("repeat_on", repeatOnOption)
    } else {
      setState({
        generalUpdate: {
          ...state.generalUpdate,
          repeat_on: {}
        },
        repeatOnOption: [],
        disableRepeatOnSelect: true
      })
      setValue("repeat_on", null)
    }
  }, [state.generalUpdate.attendance_start_date, state.isMonthly])

  return (
    <>
      <AttendanceLayout
        breadcrumbs={
          <Breadcrumbs
            list={[
              {
                title: useFormatMessage("menu.attendance_setting")
              },
              {
                title: useFormatMessage(
                  "modules.attendance_setting.text.general"
                )
              }
            ]}
          />
        }>
        <Row>
          <Col sm={12}>
            <CardTitle tag="h4">
              <Button.Ripple
                tag="span"
                className="btn-icon rounded-circle me-1"
                color="primary"
                style={{
                  padding: "0.5rem"
                }}>
                <i className="fal fa-exclamation-circle"></i>
              </Button.Ripple>{" "}
              <span
                style={{
                  fontSize: "1.2rem",
                  color: "black"
                }}>
                {useFormatMessage("modules.attendance_setting.text.general")}
              </span>
            </CardTitle>

            {state.blockUI && <FormLoader />}
            {!state.blockUI && (
              <FormProvider {...methods}>
                <div className="general-tab">
                  <Tabs>
                    <TabPane
                      tab={useFormatMessage(
                        "modules.attendance_setting.text.tabs.general"
                      )}
                      key="general_content">
                      <Row>
                        <Col sm={12}>
                          <div className="d-flex align-items-center mb-1">
                            <div className="w-50 title-attendance-setting ">
                              {useFormatMessage(
                                "modules.attendance_setting.fields.start_date"
                              )}
                            </div>
                            <div className="w-50 d-flex attendance-start-date">
                              <DatePicker
                                name="attendance_start_date"
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                                onChange={(e) =>
                                  handleChangeAttendanceStartDate(e)
                                }
                                defaultValue={moment(
                                  state.generalUpdate.attendance_start_date,
                                  "YYYY-MM-DD"
                                )}
                                allowClear={false}
                              />
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="w-50 title-attendance-setting ">
                              {useFormatMessage(
                                "modules.attendance_setting.fields.attendance_approval_cycle"
                              )}
                            </div>
                            <div className="w-50 d-flex input-select">
                              <ErpSelect
                                name="attendance_approval_cycle_num"
                                className="react-select"
                                classNamePrefix="select"
                                useForm={methods}
                                onChange={(e) => {
                                  setValue("attendance_approval_cycle_num", e)
                                  setState({
                                    generalUpdate: {
                                      ...state.generalUpdate,
                                      attendance_approval_cycle_num: e.value
                                    }
                                  })
                                }}
                                options={
                                  !state.isMonthly
                                    ? numberApprovalOptions
                                    : numberApprovalOptionsMonthly
                                }
                                isClearable={false}
                              />
                              <ErpSelect
                                className="react-select  ms-1 me-20"
                                classNamePrefix="select"
                                name="attendance_approval_cycle"
                                useForm={methods}
                                onChange={(e) =>
                                  handleChangeAttendanceApprovalCycle(e)
                                }
                                options={approvalOptions}
                                isClearable={false}
                              />
                            </div>
                          </div>
                          <div className="d-flex align-items-center repeat-on-select">
                            <div className="w-50 title-attendance-setting ">
                              {useFormatMessage(
                                "modules.attendance_setting.fields.repeat_on"
                              )}
                            </div>
                            <div className="w-50 d-flex input-select">
                              <ErpSelect
                                className="w-100"
                                isClearable={false}
                                name="repeat_on"
                                options={state.repeatOnOption}
                                useForm={methods}
                                isDisabled={state.disableRepeatOnSelect}
                                onChange={(e) => {
                                  setValue("repeat_on", e)
                                  setState({
                                    generalUpdate: {
                                      ...state.generalUpdate,
                                      repeat_on: e.value,
                                      attendance_approval_cycle_num:
                                        e.value.value,
                                      attendance_approval_cycle_type:
                                        e.value.type
                                    }
                                  })
                                }}
                                placeholder="select"
                              />
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="w-50 title-attendance-setting ">
                              {useFormatMessage(
                                "modules.attendance_setting.fields.locations"
                              )}
                            </div>
                            <div className="w-50 d-flex input-select">
                              <ErpSelect
                                className="react-select w-100"
                                classNamePrefix="select"
                                defaultValue={{
                                  value: "all",
                                  label: "All Offices"
                                }}
                                isClearable={false}
                                isDisabled={true}
                              />
                            </div>
                          </div>

                          <div className="d-flex mt-2 align-items-center">
                            <ErpCheckbox
                              name="primary"
                              id="check_outside"
                              inline
                              defaultChecked={true}
                              disabled
                            />
                            <span style={{ fontSize: "12px" }}>
                              {useFormatMessage(
                                "modules.attendance_setting.text.manager_notification",
                                {
                                  attendance_managers_notifications_day:
                                    state.info
                                      .attendance_managers_notifications_day
                                }
                              )}
                            </span>
                          </div>
                        </Col>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="col-12 d-flex  mt-3 ">{addBtn}</div>
                        </form>
                      </Row>
                    </TabPane>
                    <TabPane
                      tab={useFormatMessage(
                        "modules.attendance_setting.text.tabs.person_in_charge"
                      )}
                      key="person_content">
                      <Row>
                        <Col sm={12}>
                          <div className="d-flex align-items-center">
                            <div className="w-50 title-attendance-setting ">
                              {useFormatMessage(
                                "modules.attendance_setting.fields.person_in_charge"
                              )}
                            </div>
                            <div className="w-50 ">
                              <ErpUserSelect
                                onChange={(e) => handleSelectPerson(e)}
                                placeholder="Select User"
                              />
                            </div>
                          </div>

                          <div className="d-flex align-items-center mt-1">
                            <div className="w-50 title-attendance-setting "></div>
                            <div className="w-50 ">{renderPersonCharge()}</div>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane
                      tab={useFormatMessage(
                        "modules.attendance_setting.text.tabs.other"
                      )}
                      key="other_content">
                      <Row>
                        <Col sm={12}>
                          <div className="d-flex align-items-center">
                            <div className="w-25 title-attendance-setting ">
                              {useFormatMessage(
                                "modules.attendance_setting.fields.allow_overtime"
                              )}
                            </div>
                            <div className="w-50 ">
                              <ErpSwitch
                                name="attendance_allow_overtime"
                                id="attendance_allow_overtime"
                                defaultChecked={
                                  state.generalUpdate
                                    .attendance_allow_overtime === "true"
                                }
                                onChange={(e) => {
                                  setState({
                                    generalUpdate: {
                                      ...state.generalUpdate,
                                      attendance_allow_overtime:
                                        e.target.checked
                                    }
                                  })
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </div>
              </FormProvider>
            )}
          </Col>
        </Row>
      </AttendanceLayout>
    </>
  )
}

export default General
