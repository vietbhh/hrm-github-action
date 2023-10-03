import {
  ErpDate,
  ErpInput,
  ErpSwitch,
  ErpTime
} from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useSelector } from "react-redux"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { downloadApi } from "@apps/modules/download/common/api"
import { renderIconAttachment } from "../../common/common"
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
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner
} from "reactstrap"
// ** redux
import { useDispatch } from "react-redux"
import { hideAddEventCalendarModal } from "../../common/reducer/calendar"
import dayjs from "dayjs"

const ModalCreateEvent = (props) => {
  const {
    setDataCreateNew,

    // ** edit
    setData,
    setDataLink,
    idPost = null,

    // ** api
    createEventApi,
    getDetailApi,
    afterCreate
  } = props
  const [state, setState] = useMergedState({
    loadingSubmit: false,

    //
    color: "#5398ff",
    valueRepeat: "no_repeat",
    switch_all_day: false,
    openDropDownColor: false,

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

  const calendarState = useSelector((state) => state.calendar)
  const { modal, viewOnly, idEvent } = calendarState

  const dispatch = useDispatch()

  const toggleModal = () => {
    dispatch(hideAddEventCalendarModal())
  }

  const methods = useForm({ mode: "onSubmit" })
  const { handleSubmit, reset, setValue } = methods
  const onSubmit = (values) => {
    values.color = state.color
    values.valueRepeat = state.valueRepeat
    values.dataAttendees = state.dataAttendees
    values.idEvent = idEvent
    values.idPost = idPost
    values.file = state.arrAttachment
    const params = { body: JSON.stringify(values), file: state.arrAttachment }

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
        setState({ loadingSubmit: false })
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

  const resetAfterSubmit = () => {
    setState({
      color: "#5398ff",
      arrAttachment: [],
      switch_all_day: false
    })
    reset()
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

  // ** useEffect
  useEffect(() => {
    if (modal && idEvent) {
      setState({ loadingEdit: true })
      getDetailApi(idEvent)
        .then((res) => {
          const resData = res.data.data
          setState({
            loadingEdit: false,
            dataEdit: resData,
            color: resData.color,
            valueRepeat: resData.repeat,
            switch_all_day: resData.all_day_event,
            dataAttendees: resData.attendees,
            valueAttendees: []
          })

          if (!_.isEmpty(resData.attachment)) {
            setState({ loadingAttachment: true })
            const promises = []
            _.forEach(resData.attachment, (item) => {
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
      setState({ loadingEdit: false, dataEdit: {},  arrAttachment: [] })
    }
  }, [modal, idEvent])

  // ** render
  const iconDate = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none">
      <path
        d="M13.9582 2.96666V1.66666C13.9582 1.32499 13.6749 1.04166 13.3332 1.04166C12.9915 1.04166 12.7082 1.32499 12.7082 1.66666V2.91666H7.29153V1.66666C7.29153 1.32499 7.0082 1.04166 6.66653 1.04166C6.32487 1.04166 6.04153 1.32499 6.04153 1.66666V2.96666C3.79153 3.17499 2.69987 4.51666 2.5332 6.50832C2.51653 6.74999 2.71653 6.94999 2.94987 6.94999H17.0499C17.2915 6.94999 17.4915 6.74166 17.4665 6.50832C17.2999 4.51666 16.2082 3.17499 13.9582 2.96666Z"
        fill="#63A4F5"
      />
      <path
        d="M16.6667 8.20001H3.33333C2.875 8.20001 2.5 8.57501 2.5 9.03335V14.1667C2.5 16.6667 3.75 18.3333 6.66667 18.3333H13.3333C16.25 18.3333 17.5 16.6667 17.5 14.1667V9.03335C17.5 8.57501 17.125 8.20001 16.6667 8.20001ZM7.675 15.175C7.59167 15.25 7.5 15.3083 7.4 15.35C7.3 15.3917 7.19167 15.4167 7.08333 15.4167C6.975 15.4167 6.86667 15.3917 6.76667 15.35C6.66667 15.3083 6.575 15.25 6.49167 15.175C6.34167 15.0167 6.25 14.8 6.25 14.5833C6.25 14.3667 6.34167 14.15 6.49167 13.9917C6.575 13.9167 6.66667 13.8583 6.76667 13.8167C6.96667 13.7333 7.2 13.7333 7.4 13.8167C7.5 13.8583 7.59167 13.9167 7.675 13.9917C7.825 14.15 7.91667 14.3667 7.91667 14.5833C7.91667 14.8 7.825 15.0167 7.675 15.175ZM7.85 11.9833C7.80833 12.0833 7.75 12.175 7.675 12.2583C7.59167 12.3333 7.5 12.3917 7.4 12.4333C7.3 12.475 7.19167 12.5 7.08333 12.5C6.975 12.5 6.86667 12.475 6.76667 12.4333C6.66667 12.3917 6.575 12.3333 6.49167 12.2583C6.41667 12.175 6.35833 12.0833 6.31667 11.9833C6.275 11.8833 6.25 11.775 6.25 11.6667C6.25 11.5583 6.275 11.45 6.31667 11.35C6.35833 11.25 6.41667 11.1583 6.49167 11.075C6.575 11 6.66667 10.9417 6.76667 10.9C6.96667 10.8167 7.2 10.8167 7.4 10.9C7.5 10.9417 7.59167 11 7.675 11.075C7.75 11.1583 7.80833 11.25 7.85 11.35C7.89167 11.45 7.91667 11.5583 7.91667 11.6667C7.91667 11.775 7.89167 11.8833 7.85 11.9833ZM10.5917 12.2583C10.5083 12.3333 10.4167 12.3917 10.3167 12.4333C10.2167 12.475 10.1083 12.5 10 12.5C9.89167 12.5 9.78333 12.475 9.68333 12.4333C9.58333 12.3917 9.49167 12.3333 9.40833 12.2583C9.25833 12.1 9.16667 11.8833 9.16667 11.6667C9.16667 11.45 9.25833 11.2333 9.40833 11.075C9.49167 11 9.58333 10.9417 9.68333 10.9C9.88333 10.8083 10.1167 10.8083 10.3167 10.9C10.4167 10.9417 10.5083 11 10.5917 11.075C10.7417 11.2333 10.8333 11.45 10.8333 11.6667C10.8333 11.8833 10.7417 12.1 10.5917 12.2583Z"
        fill="#63A4F5"
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
            {useFormatMessage("modules.calendar.create_event.title")}
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
                "modules.calendar.create_event.text.event_name"
              )}
              placeholder={useFormatMessage(
                "modules.calendar.create_event.text.event_name_placeholder"
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
                  style={{ backgroundColor: state.color }}></div>
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

          <div className="div-event-time">
            <div
              className={classNames("div-select-time", {
                "all-day-event": state.switch_all_day
              })}>
              <div className="div-select-time__div-box">
                <div className="div-box__date">
                  <ErpDate
                    label={useFormatMessage(
                      "modules.calendar.create_event.text.start_time"
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
                    name="start_time_time"
                  />
                </div>
              </div>
              <div className="div-select-time__div-box">
                <div className="div-box__date">
                  <ErpDate
                    label={useFormatMessage(
                      "modules.calendar.create_event.text.end_time"
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
                    "modules.calendar.create_event.text.all_day_event"
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="div-details">
            <ErpInput
              type="textarea"
              label={useFormatMessage(
                "modules.calendar.create_event.text.details"
              )}
              placeholder={useFormatMessage(
                "modules.calendar.create_event.text.details_placeholder"
              )}
              className="input"
              useForm={methods}
              name="details"
              defaultValue={state.dataEdit?.details || ""}
              loading={state.loadingEdit}
            />
          </div>

          <div className="div-add-attachment">
            <Label for="attach-doc">
              <div className="div-add-attachment__choose">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none">
                  <path
                    d="M9.99984 18.3333C14.5832 18.3333 18.3332 14.5833 18.3332 9.99999C18.3332 5.41666 14.5832 1.66666 9.99984 1.66666C5.4165 1.66666 1.6665 5.41666 1.6665 9.99999C1.6665 14.5833 5.4165 18.3333 9.99984 18.3333Z"
                    stroke="#139FF8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.6665 10H13.3332"
                    stroke="#139FF8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 13.3333V6.66666"
                    stroke="#139FF8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text">
                  {useFormatMessage(
                    "modules.calendar.create_event.text.add_attachment_files"
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

          <div className="text-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Button.Ripple
                color="primary"
                type="submit"
                className="btn-post"
                disabled={
                  state.loadingSubmit ||
                  state.loadingEdit ||
                  state.dataEdit?.is_owner === false
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
    </Fragment>
  )
}

export default ModalCreateEvent
