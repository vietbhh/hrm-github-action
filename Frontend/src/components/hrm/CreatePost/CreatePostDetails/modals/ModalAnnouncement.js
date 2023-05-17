import {
  ErpCheckbox,
  ErpInput,
  ErpSelect
} from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { announcementApi } from "@modules/Feed/common/api"
import { Dropdown } from "antd"
import React, { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner
} from "reactstrap"

const ModalAnnouncement = (props) => {
  const {
    modal,
    toggleModal,
    options_employee_department,
    idEdit = null
  } = props
  const [state, setState] = useMergedState({
    loadingSubmit: false,

    //
    valueShowAnnouncement: "643",
    nameOptionShowAnnouncement: "one_week",

    // ** Attendees
    valueAttendees: [],
    dataAttendees: [],

    // ** attachment
    arrAttachment: []
  })

  const optionsShowAnnouncement = useSelector(
    (state) => state.app.modules.news.options.show_announcements
  )

  const methods = useForm({ mode: "onSubmit" })
  const { handleSubmit, reset, setValue } = methods
  const onSubmit = (values) => {
    values.valueShowAnnouncement = state.valueShowAnnouncement
    values.dataAttendees = state.dataAttendees

    setState({ loadingSubmit: true })
    announcementApi
      .postSubmitAnnouncement(values)
      .then((res) => {
        announcementApi
          .postSubmitAnnouncementAttachment({
            idAnnouncement: res.data,
            file: state.arrAttachment
          })
          .then((res) => {
            resetAfterSubmit()
            toggleModal()
            setState({ loadingSubmit: false })
            notification.showSuccess({
              text: useFormatMessage("notification.success")
            })
          })
          .catch((err) => {
            setState({ loadingSubmit: false })
            notification.showError({
              text: useFormatMessage("notification.something_went_wrong")
            })
          })
      })
      .catch((err) => {
        setState({ loadingSubmit: false })
      })
  }

  // ** function
  const setValueShowAnnouncement = (value) =>
    setState({ valueShowAnnouncement: value })

  const resetAfterSubmit = () => {
    setState({
      dataAttendees: [],
      arrAttachment: [],
      valueShowAnnouncement: "643",
      nameOptionShowAnnouncement: "one_week"
    })
    reset()
    setValue("pin_to_top", false)
  }

  const handleAddAttendees = () => {
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

      arrAttachment.push({ file: item, type: _type })
    })
    setState({ arrAttachment: arrAttachment })
  }

  const renderIconAttachment = (item) => {
    const file = item.file
    const type = item.type
    if (type === "image") {
      const img = URL.createObjectURL(file)
      return <img src={img} />
    }
    if (type === "video") {
      return <i className="fa-solid fa-file-video"></i>
    }
    if (type === "excel") {
      return <i className="fa-solid fa-file-excel"></i>
    }
    if (type === "word") {
      return <i className="fa-solid fa-file-word"></i>
    }
    return <i className="fa-solid fa-file"></i>
  }

  const handleRemoveAttachment = (index) => {
    const arrAttachment = [...state.arrAttachment]
    arrAttachment.splice(index, 1)
    setState({ arrAttachment: arrAttachment })
  }

  // ** useEffect
  useEffect(() => {
    if (modal && idEdit) {
      announcementApi
        .getAnnouncementById(idEdit)
        .then((res) => {})
        .catch((err) => {})
    }
  }, [modal, idEdit])

  // ** render
  const optionShowAnnouncement = [
    ..._.map(optionsShowAnnouncement, (item) => {
      return {
        key: item.value,
        label: (
          <div
            onClick={() => {
              setValueShowAnnouncement(item.value)
              setState({ nameOptionShowAnnouncement: item.name_option })
            }}>
            {useFormatMessage(item.label)}
          </div>
        )
      }
    })
  ]

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="feed modal-create-post modal-create-event modal-announcement"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader>
          <span className="text-title">
            {useFormatMessage("modules.feed.announcement.title")}
          </span>
          <div className="div-btn-close" onClick={() => toggleModal()}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="div-event-name">
            <ErpInput
              label={useFormatMessage(
                "modules.feed.announcement.text.announcement_title"
              )}
              placeholder={useFormatMessage(
                "modules.feed.announcement.text.announcement_title_placeholder"
              )}
              className="input"
              name="announcement_title"
              defaultValue=""
              useForm={methods}
              required
            />
          </div>
          <div className="div-event-time">
            <div className="div-all-day">
              <div className="div-switch div-pin">
                <ErpCheckbox
                  name="pin_to_top"
                  useForm={methods}
                  defaultValue={false}
                />
                <span className="text">
                  {useFormatMessage(
                    "modules.feed.announcement.text.pin_to_top"
                  )}
                </span>
              </div>

              <div className="div-show-announcement">
                <span className="text-show">
                  {useFormatMessage(
                    "modules.feed.announcement.text.show_announcement"
                  )}
                  :
                </span>
                <Dropdown
                  menu={{ items: optionShowAnnouncement }}
                  placement="bottom"
                  trigger={["click"]}
                  overlayClassName="feed dropdown-div-repeat">
                  <div className="div-repeat">
                    <span className="text-repeat">
                      {useFormatMessage(
                        `modules.news.app_options.show_announcements.${state.nameOptionShowAnnouncement}`
                      )}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none">
                      <path
                        d="M8.61251 0H4.45918H0.719181C0.0791811 0 -0.240819 0.773333 0.212515 1.22667L3.66585 4.68C4.21918 5.23333 5.11918 5.23333 5.67251 4.68L6.98585 3.36667L9.12585 1.22667C9.57251 0.773333 9.25251 0 8.61251 0Z"
                        fill="#9399A2"
                      />
                    </svg>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>

          <div className="div-attendees">
            <div className="div-attendees-input div-input-btn">
              <label title="Attendees" className="form-label">
                {useFormatMessage("modules.feed.announcement.text.send_to")}
              </label>
              <div className="div-input-btn-select">
                <ErpSelect
                  nolabel
                  placeholder={useFormatMessage(
                    "modules.feed.announcement.text.send_to_placeholder"
                  )}
                  className="select"
                  isMulti={true}
                  options={options_employee_department}
                  value={state.valueAttendees}
                  onChange={(e) => setState({ valueAttendees: e })}
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
              defaultValue=""
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
              {_.map(state.arrAttachment, (item, index) => {
                const file = item.file
                let size = file.size / 1024
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
                        <span className="title">{file.name}</span>
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
                disabled={state.loadingSubmit}>
                {state.loadingSubmit && (
                  <Spinner size={"sm"} className="me-50" />
                )}
                {useFormatMessage(
                  "modules.feed.announcement.text.create_announcement"
                )}
              </Button.Ripple>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default ModalAnnouncement
