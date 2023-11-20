import {
  ErpDate,
  ErpInput,
  ErpSelect,
  ErpSwitch,
  ErpTime
} from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { downloadApi } from "@apps/modules/download/common/api"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { renderIconAttachment } from "@modules/Feed/common/common"
import {
  DropdownItem,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownToggle
} from "reactstrap"
import classNames from "classnames"
import React, { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Alert,
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner
} from "reactstrap"
import { components } from "react-select"
// ** redux
import { useDispatch, useSelector } from "react-redux"
import { hideAddEventCalendarModal } from "../../../../../@apps/modules/calendar/common/reducer/calendar"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import MemberSelect from "../../../MemberSelect/MemberSelect"
import RepeatEventDropDown from "./CreateEventDetail/RepeatEventDropDown"
import ModalCustomRepeatEvent from "./CustomRepeatEvent/ModalCustomRepeatEvent"
import { AlertCircle } from "react-feather"

const ModalCreateEvent = (props) => {
  const {
    options_employee_department,
    optionsMeetingRoom,
    setDataCreateNew,

    // ** edit
    setData,
    setDataLink,
    idPost = null,

    // ** api
    createEventApi,
    getDetailApi,
    afterCreate,
    workspace
  } = props
  const defaultValueRepeat = {
    value: "no_repeat"
  }

  const [state, setState] = useMergedState({
    loadingSubmit: false,
    isEditable: true,
    //
    color: "#5398ff",
    valueRepeat: defaultValueRepeat,
    startDate: dayjs(),
    switch_all_day: false,
    switch_important: false,
    modalCustomRepeat: false,
    errorSubmit: {},

    // ** Attendees
    valueAttendees: [],
    dataAttendees: [],

    // ** attachment
    arrAttachment: [],
    loadingAttachment: false,

    // ** edit
    loadingEdit: false,
    dataEdit: {}
  })

  dayjs.extend(weekday)
  dayjs.extend(localeData)

  const calendarState = useSelector((state) => state.calendar)
  const { modal, idEvent } = calendarState

  const dispatch = useDispatch()

  const toggleModal = () => {
    dispatch(hideAddEventCalendarModal())
  }

  const toggleModalCustomRepeat = () => {
    setState({
      modalCustomRepeat: !state.modalCustomRepeat
    })
  }

  const methods = useForm({ mode: "onSubmit" })
  const { handleSubmit, reset, setValue, watch, setError } = methods

  const onSubmit = (values) => {
    values.color = state.color
    values.valueRepeat = state.valueRepeat
    values.dataAttendees = state.dataAttendees
    values.idEvent = idEvent
    values.idPost = idPost
    values.file = state.arrAttachment
    values.workspace = workspace
    const params = { body: JSON.stringify(values), file: state.arrAttachment }
    if (values.start_time_date.diff(values.end_time_date, "day") > 0) {
      setState({
        errorSubmit: {
          end_time_date: ["less_than_start_time_date"]
        }
      })

      return false
    } else if (
      values.start_time_time.diff(values.end_time_time, "minute") > 0
    ) {
      setState({
        errorSubmit: {
          end_time_time: ["less_than_start_time_time"]
        }
      })

      return false
    }

    setState({ loadingSubmit: true })
    createEventApi(params)
      .then((res) => {
        if (_.isFunction(setDataCreateNew)) {
          setDataCreateNew(res.data.dataFeed)
        }
        if (_.isFunction(setData)) {
          setData(res.data.dataFeed)
        }
        if (_.isFunction(setDataLink)) {
          setDataLink(res.data.dataLink)
        }

        resetAfterSubmit()
        toggleModal()
        setState({ loadingSubmit: false, errorSubmit: {} })
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })

        if (_.isFunction(afterCreate)) {
          afterCreate(res.data?.result)
        }
      })
      .catch((err) => {
        setState({ loadingSubmit: false })
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  // ** function
  const setColor = (value) => setState({ color: value })
  const setValueRepeat = (value, isNew = true) => {
    if (isNew) {
      setState({ valueRepeat: value })
    }

    setState({
      valueRepeat: {
        ...state.valueRepeat,
        ...value
      }
    })
  }

  const resetAfterSubmit = () => {
    setState({
      color: "#5398ff",
      valueRepeat: "no_repeat",
      valueAttendees: [],
      dataAttendees: [],
      arrAttachment: [],
      switch_all_day: false,
      switch_important: false
    })
    reset()
  }

  const handleAddAttendees = () => {
    if (state.valueAttendees.some((itemSome) => itemSome.value === "all")) {
      setState({
        valueAttendees: [],
        dataAttendees: [
          {
            label: useFormatMessage("modules.feed.create_post.text.select_all"),
            value: "all"
          }
        ]
      })
    } else {
      const dataAttendees = [...state.dataAttendees]
      _.forEach(state.valueAttendees, (item) => {
        const indexData = dataAttendees.findIndex(
          (val) => val.value === item.value
        )
        const indexOption = options_employee_department.findIndex(
          (val) => val.value === item.value
        )
        if (indexData === -1 && indexOption !== -1) {
          dataAttendees.push(options_employee_department[indexOption])
        }
      })
      setState({ valueAttendees: [], dataAttendees: dataAttendees })
    }
  }

  const handleRemoveAttendees = (index) => {
    const dataAttendees = [...state.dataAttendees]
    dataAttendees.splice(index, 1)
    setState({ dataAttendees: dataAttendees })
  }

  const handleChangeFile = (e) => {
    const files = e.target.files
    const arrAttachment = [...state.arrAttachment]
    _.forEach(files, (item) => {
      let _type = "file"
      const type = item.type
      const name = item.name
      if (type.includes("image/")) {
        _type = "image"
      }
      if (type.includes("video/")) {
        _type = "video"
      }
      if (name.includes(".xlsx") || name.includes(".xls")) {
        _type = "excel"
      }
      if (name.includes(".docx") || name.includes(".doc")) {
        _type = "word"
      }

      arrAttachment.push({ file: item, type: _type, new: true })
    })
    setState({ arrAttachment: arrAttachment })
  }

  const handleRemoveAttachment = (index) => {
    const arrAttachment = [...state.arrAttachment]
    arrAttachment.splice(index, 1)
    setState({ arrAttachment: arrAttachment })
  }

  const getRepeatData = (day) => {
    const weekDayByDate = day.day()
    const dateInMonthByDate = day.format("DD")
    const order = Math.ceil(parseInt(dateInMonthByDate) / 7)

    return {
      week_day: weekDayByDate,
      date_in_month: dateInMonthByDate,
      order_week_date_in_month: order
    }
  }

  // ** useEffect
  useEffect(() => {
    if (modal && idEvent) {
      setState({ loadingEdit: true })
      getDetailApi(idEvent)
        .then((res) => {
          const restData = res.data.data
          const repeat = restData.repeat
          setState({
            loadingEdit: false,
            dataEdit: restData,
            isEditable: restData.is_editable,
            color: restData.color,
            valueRepeat: repeat,
            switch_all_day: restData.all_day_event,
            switch_important: restData.important,
            dataAttendees: restData.attendees,
            valueAttendees: []
          })

          if (!_.isEmpty(restData.attachment)) {
            setState({ loadingAttachment: true })
            const promises = []
            _.forEach(restData.attachment, (item) => {
              const promise = new Promise(async (resolve, reject) => {
                if (item.type === "image") {
                  const _item = { ...item }
                  await downloadApi.getPhoto(item.src).then((response) => {
                    _item.url = URL.createObjectURL(response.data)
                    resolve(_item)
                  })
                } else {
                  resolve(item)
                }
              })
              promises.push(promise)
            })
            Promise.all(promises)
              .then((res) => {
                setState({ arrAttachment: res, loadingAttachment: false })
              })
              .catch((err) => {
                setState({ loadingAttachment: false })
              })
          }
        })
        .catch((err) => {
          setState({ loadingEdit: false, dataEdit: {} })
        })
    } else {
      const currentTime = dayjs()
      const repeatData = {
        ...defaultValueRepeat,
        ...getRepeatData(currentTime)
      }
      setState({
        loadingEdit: false,
        dataEdit: {
          start_time_date: currentTime,
          start_time_time: currentTime,
          end_time_date: currentTime,
          end_time_time: currentTime
        },
        valueRepeat: repeatData,
        arrAttachment: [],
        isEditable: true,
        errorSubmit: {}
      })
    }
  }, [modal, idEvent])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "start_time_date") {
        setState({
          valueRepeat: {
            ...defaultValueRepeat,
            ...getRepeatData(value.start_time_date)
          }
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])

  // ** render
  const iconDate = (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.9572 3.46675V2.16675C13.9572 1.82508 13.6739 1.54175 13.3322 1.54175C12.9906 1.54175 12.7072 1.82508 12.7072 2.16675V3.41675H7.29056V2.16675C7.29056 1.82508 7.00722 1.54175 6.66556 1.54175C6.32389 1.54175 6.04056 1.82508 6.04056 2.16675V3.46675C3.79056 3.67508 2.69889 5.01675 2.53222 7.00841C2.51556 7.25008 2.71556 7.45008 2.94889 7.45008H17.0489C17.2906 7.45008 17.4906 7.24175 17.4656 7.00841C17.2989 5.01675 16.2072 3.67508 13.9572 3.46675Z"
        fill="#00B3B3"
      />
      <path
        d="M16.6667 8.69995H3.33333C2.875 8.69995 2.5 9.07495 2.5 9.53328V14.6666C2.5 17.1666 3.75 18.8333 6.66667 18.8333H13.3333C16.25 18.8333 17.5 17.1666 17.5 14.6666V9.53328C17.5 9.07495 17.125 8.69995 16.6667 8.69995ZM7.675 15.675C7.59167 15.75 7.5 15.8083 7.4 15.85C7.3 15.8916 7.19167 15.9166 7.08333 15.9166C6.975 15.9166 6.86667 15.8916 6.76667 15.85C6.66667 15.8083 6.575 15.75 6.49167 15.675C6.34167 15.5166 6.25 15.3 6.25 15.0833C6.25 14.8666 6.34167 14.65 6.49167 14.4916C6.575 14.4166 6.66667 14.3583 6.76667 14.3166C6.96667 14.2333 7.2 14.2333 7.4 14.3166C7.5 14.3583 7.59167 14.4166 7.675 14.4916C7.825 14.65 7.91667 14.8666 7.91667 15.0833C7.91667 15.3 7.825 15.5166 7.675 15.675ZM7.85 12.4833C7.80833 12.5833 7.75 12.675 7.675 12.7583C7.59167 12.8333 7.5 12.8916 7.4 12.9333C7.3 12.975 7.19167 13 7.08333 13C6.975 13 6.86667 12.975 6.76667 12.9333C6.66667 12.8916 6.575 12.8333 6.49167 12.7583C6.41667 12.675 6.35833 12.5833 6.31667 12.4833C6.275 12.3833 6.25 12.275 6.25 12.1666C6.25 12.0583 6.275 11.95 6.31667 11.85C6.35833 11.75 6.41667 11.6583 6.49167 11.575C6.575 11.5 6.66667 11.4416 6.76667 11.4C6.96667 11.3166 7.2 11.3166 7.4 11.4C7.5 11.4416 7.59167 11.5 7.675 11.575C7.75 11.6583 7.80833 11.75 7.85 11.85C7.89167 11.95 7.91667 12.0583 7.91667 12.1666C7.91667 12.275 7.89167 12.3833 7.85 12.4833ZM10.5917 12.7583C10.5083 12.8333 10.4167 12.8916 10.3167 12.9333C10.2167 12.975 10.1083 13 10 13C9.89167 13 9.78333 12.975 9.68333 12.9333C9.58333 12.8916 9.49167 12.8333 9.40833 12.7583C9.25833 12.6 9.16667 12.3833 9.16667 12.1666C9.16667 11.95 9.25833 11.7333 9.40833 11.575C9.49167 11.5 9.58333 11.4416 9.68333 11.4C9.88333 11.3083 10.1167 11.3083 10.3167 11.4C10.4167 11.4416 10.5083 11.5 10.5917 11.575C10.7417 11.7333 10.8333 11.95 10.8333 12.1666C10.8333 12.3833 10.7417 12.6 10.5917 12.7583Z"
        fill="#00B3B3"
      />
    </svg>
  )

  const iconTime = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none">
      <path
        d="M9.99984 1.66666C5.40817 1.66666 1.6665 5.40832 1.6665 9.99999C1.6665 14.5917 5.40817 18.3333 9.99984 18.3333C14.5915 18.3333 18.3332 14.5917 18.3332 9.99999C18.3332 5.40832 14.5915 1.66666 9.99984 1.66666ZM13.6248 12.975C13.5082 13.175 13.2998 13.2833 13.0832 13.2833C12.9748 13.2833 12.8665 13.2583 12.7665 13.1917L10.1832 11.65C9.5415 11.2667 9.0665 10.425 9.0665 9.68332V6.26666C9.0665 5.92499 9.34984 5.64166 9.6915 5.64166C10.0332 5.64166 10.3165 5.92499 10.3165 6.26666V9.68332C10.3165 9.98332 10.5665 10.425 10.8248 10.575L13.4082 12.1167C13.7082 12.2917 13.8082 12.675 13.6248 12.975Z"
        fill="#F5BB63"
      />
    </svg>
  )

  const optionsReminder = [
    {
      value: "just_in_time",
      label: useFormatMessage("modules.feed.create_event.text.just_in_time")
    },
    {
      value: "5_minutes_before",
      label: useFormatMessage("modules.feed.create_event.text.5_minutes_before")
    },
    {
      value: "10_minutes_before",
      label: useFormatMessage(
        "modules.feed.create_event.text.10_minutes_before"
      )
    },
    {
      value: "15_minutes_before",
      label: useFormatMessage(
        "modules.feed.create_event.text.15_minutes_before"
      )
    },
    {
      value: "30_minutes_before",
      label: useFormatMessage(
        "modules.feed.create_event.text.30_minutes_before"
      )
    },
    {
      value: "1_hour_before",
      label: useFormatMessage("modules.feed.create_event.text.1_hour_before"),
      default: true
    },
    {
      value: "1_day_before",
      label: useFormatMessage("modules.feed.create_event.text.1_day_before")
    },
    {
      value: "no_remind",
      label: useFormatMessage("modules.feed.create_event.text.no_remind")
    }
  ]

  const renderErrorSubmit = () => {
    if (Object.keys(state.errorSubmit).length === 0) {
      return ""
    }

    return (
      <Fragment>
        {_.map(state.errorSubmit, (item) => {
          return (
            <Fragment>
              {item.map((itemError) => {
                return (
                  <Alert color="danger">
                    <div className="d-flex align-items-center alert-body">
                      <AlertCircle size={15} /> &nbsp;
                      <span>
                        {useFormatMessage(
                          `modules.feed.create_post.text.${itemError}`
                        )}
                      </span>
                    </div>
                  </Alert>
                )
              })}
            </Fragment>
          )
        })}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="modal-dialog-centered feed modal-create-post modal-create-event"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader>
          <span className="text-title">
            {useFormatMessage("modules.feed.create_event.title")}
          </span>
          <div className="div-btn-close" onClick={() => toggleModal()}>
            <i className="fa-regular fa-xmark"></i>
          </div>
        </ModalHeader>
        <ModalBody>
          {state.loadingEdit && <DefaultSpinner />}

          <div className="div-event-name">
            <ErpInput
              label={useFormatMessage(
                "modules.feed.create_event.text.event_name"
              )}
              placeholder={useFormatMessage(
                "modules.feed.create_event.text.event_name_placeholder"
              )}
              className="input"
              name="event_name"
              defaultValue={state.dataEdit?.name || ""}
              loading={state.loadingEdit}
              useForm={methods}
              required
            />

            <UncontrolledDropdown>
              <DropdownToggle
                tag="a"
                data-toggle="dropdown"
                className=""
                href="/"
                onClick={(e) => e.preventDefault()}
                id="setting">
                <div
                  className="div-btn-color"
                  style={{
                    backgroundColor:
                      state.color.search("#") === -1
                        ? "#" + state.color
                        : state.color
                  }}></div>
              </DropdownToggle>
              <DropdownMenu end className="dropdown-div-change-color mt-0">
                <DropdownItem>
                  <div className="div-change-color">
                    <div
                      className="div-btn-color"
                      style={{ backgroundColor: "#5398ff" }}
                      onClick={() => setColor("#5398ff")}></div>
                    <div
                      className="div-btn-color"
                      style={{ backgroundColor: "#ff6f2c" }}
                      onClick={() => setColor("#ff6f2c")}></div>
                    <div
                      className="div-btn-color"
                      style={{ backgroundColor: "#44d38a" }}
                      onClick={() => setColor("#44d38a")}></div>
                    <div
                      className="div-btn-color"
                      style={{ backgroundColor: "#ffc66f" }}
                      onClick={() => setColor("#ffc66f")}></div>
                    <div
                      className="div-btn-color"
                      style={{ backgroundColor: "#ffe658" }}
                      onClick={() => setColor("#ffe658")}></div>
                    <div
                      className="div-btn-color"
                      style={{ backgroundColor: "#f066b9" }}
                      onClick={() => setColor("#f066b9")}></div>
                    <div
                      className="div-btn-color"
                      style={{ backgroundColor: "#66e0f0" }}
                      onClick={() => setColor("#66e0f0")}></div>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
          <div className="div-event-important">
            <div className="div-switch">
              <ErpSwitch
                nolabel
                useForm={methods}
                name="switch_important"
                defaultValue={state.switch_important}
                loading={state.loadingEdit}
              />
              <span className="text">
                {useFormatMessage("modules.feed.create_post.text.important")}
              </span>
            </div>
            <p className="mb-0 important-text">
              {useFormatMessage("modules.feed.create_post.text.important_text")}
            </p>
          </div>
          <div className="div-event-time">
            <div
              className={classNames("div-select-time", {
                "all-day-event": state.switch_all_day
              })}>
              <div className="div-select-time__div-box">
                <div className="div-box__date">
                  <ErpDate
                    label={useFormatMessage(
                      "modules.feed.create_event.text.start_time"
                    )}
                    suffixIcon={iconDate}
                    defaultValue={
                      state.dataEdit.start_time_date
                        ? dayjs(state.dataEdit.start_time_date)
                        : null
                    }
                    loading={state.loadingEdit}
                    useForm={methods}
                    name="start_time_date"
                    allowClear={false}
                    required
                  />
                </div>
                <div className="div-box__time">
                  <ErpTime
                    label={<>&nbsp;</>}
                    placeholder={"Time"}
                    suffixIcon={iconTime}
                    defaultValue={
                      state.dataEdit.start_time_time
                        ? dayjs(state.dataEdit.start_time_time)
                        : null
                    }
                    loading={state.loadingEdit}
                    useForm={methods}
                    allowClear={false}
                    name="start_time_time"
                  />
                </div>
              </div>
              <div className="div-select-time__div-box">
                <div className="div-box__date">
                  <ErpDate
                    label={useFormatMessage(
                      "modules.feed.create_event.text.end_time"
                    )}
                    suffixIcon={iconDate}
                    defaultValue={
                      state.dataEdit.end_time_date
                        ? dayjs(state.dataEdit.end_time_date)
                        : null
                    }
                    loading={state.loadingEdit}
                    useForm={methods}
                    name="end_time_date"
                    allowClear={false}
                    required
                  />
                </div>
                <div className="div-box__time">
                  <ErpTime
                    label={<>&nbsp;</>}
                    placeholder={"Time"}
                    suffixIcon={iconTime}
                    defaultValue={
                      state.dataEdit.end_time_time
                        ? dayjs(state.dataEdit.end_time_time)
                        : null
                    }
                    loading={state.loadingEdit}
                    useForm={methods}
                    allowClear={false}
                    name="end_time_time"
                  />
                </div>
              </div>
            </div>
            <div className="div-all-day">
              <div className="div-switch">
                <ErpSwitch
                  nolabel
                  useForm={methods}
                  name="switch_all_day"
                  defaultValue={state.switch_all_day}
                  loading={state.loadingEdit}
                  onChange={(e) => {
                    setValue("switch_all_day", e.target.checked)
                    setState({ switch_all_day: e.target.checked })
                  }}
                />
                <span className="text">
                  {useFormatMessage(
                    "modules.feed.create_event.text.all_day_event"
                  )}
                </span>
              </div>

              <RepeatEventDropDown
                valueRepeat={state.valueRepeat}
                setValueRepeat={setValueRepeat}
                toggleModalCustomRepeat={toggleModalCustomRepeat}
              />
            </div>
          </div>

          <div className="div-attendees">
            <div className="div-attendees-input div-input-btn">
              <label title="Attendees" className="form-label">
                {useFormatMessage("modules.feed.create_event.text.attendees")}
              </label>
              <div className="div-input-btn-select">
                <MemberSelect
                  noLabel={true}
                  placeholder={useFormatMessage(
                    "modules.feed.create_event.text.attendees_placeholder"
                  )}
                  classNameProps="select-attendees"
                  isMulti={true}
                  options={options_employee_department}
                  value={state.valueAttendees}
                  selectDepartment={true}
                  selectAll={true}
                  handleOnchange={(e) => {
                    setState({ valueAttendees: e })
                  }}
                />
                <button
                  type="button"
                  className="btn-input"
                  onClick={() => handleAddAttendees()}>
                  {useFormatMessage("button.add")}
                </button>
              </div>
            </div>
            <div className="div-attendees-show">
              {_.map(state.dataAttendees, (item, index) => {
                return (
                  <div key={index} className="div-attendees-show__item">
                    <Avatar src={item.avatar} />
                    <span className="item__text">{item.label}</span>
                    <div
                      className="item__div-remove"
                      onClick={() => handleRemoveAttendees(index)}>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="div-meeting">
            <div className="div-meeting__div-input">
              <div className="div-input__meeting-room">
                <div className="div-input-btn">
                  <label title="Attendees" className="form-label">
                    {useFormatMessage(
                      "modules.feed.create_event.text.meeting_room"
                    )}
                  </label>
                  <ErpSelect
                    nolabel
                    placeholder={useFormatMessage(
                      "modules.feed.create_event.text.meeting_room_placeholder"
                    )}
                    className="select"
                    options={optionsMeetingRoom}
                    defaultValue={state.dataEdit?.meeting_room || null}
                    loading={state.loadingEdit}
                    useForm={methods}
                    name="meeting_room"
                  />
                </div>
              </div>
              <div className="div-input__set-reminder">
                <ErpSelect
                  label={useFormatMessage(
                    "modules.feed.create_event.text.set_reminder"
                  )}
                  isClearable={false}
                  className="select"
                  defaultValue={
                    optionsReminder[
                      optionsReminder.findIndex((val) => {
                        if (
                          state.dataEdit.reminder &&
                          state.dataEdit.reminder === val.value
                        ) {
                          return true
                        } else {
                          return val.default === true
                        }
                      })
                    ]
                  }
                  loading={state.loadingEdit}
                  options={optionsReminder}
                  useForm={methods}
                  name="reminder"
                />
              </div>
            </div>
            <div className="div-meeting__div-switch">
              <div className="div-switch">
                <ErpSwitch
                  nolabel
                  useForm={methods}
                  name="switch_online_meeting"
                  defaultValue={state.dataEdit?.online_meeting || false}
                  loading={state.loadingEdit}
                />
                <span className="text">
                  {useFormatMessage(
                    "modules.feed.create_event.text.online_meeting"
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="div-details">
            <ErpInput
              type="textarea"
              label={useFormatMessage("modules.feed.create_event.text.details")}
              placeholder={useFormatMessage(
                "modules.feed.create_event.text.details_placeholder"
              )}
              className="input"
              useForm={methods}
              name="details"
              defaultValue={state.dataEdit?.details || ""}
              loading={state.loadingEdit}
            />
          </div>

          <div className="mb-1 div-add-attachment">
            <Label for="attach-doc">
              <div className="div-add-attachment__choose">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 12.5H18"
                    stroke="#2F9BFA"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 18.5V6.5"
                    stroke="#2F9BFA"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <span className="text">
                  {useFormatMessage(
                    "modules.feed.create_event.text.add_attachment_files"
                  )}
                </span>
              </div>

              <input
                type="file"
                id="attach-doc"
                multiple
                hidden
                onChange={handleChangeFile}
              />
            </Label>

            <div className="div-attachment__div-show">
              {state.loadingAttachment && (
                <div className="w-100">
                  <DefaultSpinner />
                </div>
              )}

              {_.map(state.arrAttachment, (item, index) => {
                let size = 0
                let name = ""
                if (item.new) {
                  const file = item.file
                  size = file.size
                  name = file.name
                } else {
                  size = item.size
                  name = item.name
                }

                size = size / 1024
                let size_type = "KB"
                if (size > 1024) {
                  size = size / 1024
                  size_type = "MB"
                }
                size = Math.round(size)

                return (
                  <div key={index} className="div-attachment__div-items">
                    <div className="div-attachment__item">
                      <div className="div-icon">
                        {renderIconAttachment(item)}
                      </div>
                      <div className="div-body">
                        <span className="title">{name}</span>
                        <span className="size">
                          <i className="fa-regular fa-circle-info"></i> {size}{" "}
                          {size_type}
                        </span>
                      </div>
                      <div
                        className="div-close"
                        onClick={() => handleRemoveAttachment(index)}>
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="error-section">
            <Fragment>{renderErrorSubmit()}</Fragment>
          </div>
          <div className="text-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Button.Ripple
                color="primary"
                type="submit"
                className="btn-post"
                disabled={
                  state.loadingSubmit || state.loadingEdit || !state.isEditable
                }>
                {state.loadingSubmit && (
                  <Spinner size={"sm"} className="me-50" />
                )}
                {idEvent
                  ? useFormatMessage(
                      "modules.calendar.modals.title.update_event"
                    )
                  : useFormatMessage("modules.calendar.create_event.title")}
              </Button.Ripple>
            </form>
          </div>
        </ModalBody>
      </Modal>
      <ModalCustomRepeatEvent
        modal={state.modalCustomRepeat}
        dataEdit={state.dataEdit}
        valueRepeat={state.valueRepeat}
        defaultValueRepeat={defaultValueRepeat}
        handleModal={toggleModalCustomRepeat}
        setValueRepeat={setValueRepeat}
      />
    </Fragment>
  )
}

export default ModalCreateEvent
