import {
  ErpCheckbox,
  ErpInput,
  ErpSelect
} from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { downloadApi } from "@apps/modules/download/common/api"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { announcementApi } from "@modules/Feed/common/api"
import { renderIconAttachment } from "@modules/Feed/common/common"
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
import MemberSelect from "../../../MemberSelect/MemberSelect"
import Photo from "@apps/modules/download/pages/Photo"
const ModalAnnouncement = (props) => {
  const {
    modal,
    toggleModal,
    options_employee_department,
    setDataCreateNew,

    // ** edit
    idAnnouncement = null,
    setData,
    setDataLink,
    idPost = null
  } = props
  const [state, setState] = useMergedState({
    loadingSubmit: false,
    loadingEdit: false,
    dataEdit: {},

    //
    valueShowAnnouncement: "643",
    nameOptionShowAnnouncement: "one_week",
    coverImage: { src: "", image: null },

    // ** Attendees
    valueAttendees: [],
    dataAttendees: [],

    // ** attachment
    arrAttachment: [],
    loadingAttachment: false
  })

  const optionsShowAnnouncement = useSelector(
    (state) => state.app.modules.news.options.show_announcements
  )

  const methods = useForm({ mode: "onSubmit" })
  const { handleSubmit, reset, setValue } = methods
  const onSubmit = (values) => {
    values.valueShowAnnouncement = state.valueShowAnnouncement
    values.dataAttendees = state.dataAttendees
    values.idAnnouncement = idAnnouncement
    values.idPost = idPost
    values.file = state.arrAttachment
    values.coverImage = state.coverImage
    const params = {
      body: JSON.stringify(values),
      file: state.arrAttachment,
      coverImage: state.coverImage
    }
    setState({ loadingSubmit: true })
    announcementApi
      .postSubmitAnnouncement(params)
      .then(async (res) => {
        if (_.isFunction(setDataCreateNew)) {
          setDataCreateNew(res.data.dataFeed)
        }
        if (_.isFunction(setData)) {
          setData(res.data.dataFeed)
        }
        if (_.isFunction(setDataLink)) {
          const _data = { ...res.data.dataLink }
          await downloadApi.getPhoto(_data.cover_image).then((response) => {
            _data.cover_url = URL.createObjectURL(response.data)
            setDataLink(_data)
          })
        }

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
  }

  // ** function
  const resetAfterSubmit = () => {
    setState({
      valueAttendees: [],
      dataAttendees: [],
      arrAttachment: [],
      valueShowAnnouncement: "643",
      nameOptionShowAnnouncement: "one_week"
    })
    reset()
    setValue("pin_to_top", false)
  }

  const handleAddAttendees = () => {
    if (state.valueAttendees.some((itemSome) => itemSome.value === "all")) {
      setState({
        valueAttendees: [],
        dataAttendees: [
          {
            label: "all",
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

  const handleRemoveCover = () => {
    setState({
      coverImage: { src: "", image: null }
    })
  }

  // ** useEffect
  useEffect(() => {
    if (modal && idAnnouncement) {
      setState({ loadingEdit: true })
      announcementApi
        .getAnnouncementById(idAnnouncement)
        .then((res) => {
          const indexOptionShow = optionsShowAnnouncement.findIndex(
            (val) => val.value === res.data.show_announcements
          )
          if (indexOptionShow !== -1) {
            setState({
              nameOptionShowAnnouncement:
                optionsShowAnnouncement[indexOptionShow].name_option,
              valueShowAnnouncement:
                optionsShowAnnouncement[indexOptionShow].value
            })
          } else {
            setState({
              valueShowAnnouncement: "643",
              nameOptionShowAnnouncement: "one_week"
            })
          }

          setState({
            loadingEdit: false,
            dataEdit: res.data,
            valueAttendees: [],
            dataAttendees: res.data.send_to,
            coverImage: { src: res.data?.cover_image || "", image: null }
          })

          setValue("pin_to_top", res.data.pin && res.data.pin === 1)

          if (!_.isEmpty(res.data.attachment)) {
            setState({ loadingAttachment: true })
            const promises = []
            _.forEach(res.data.attachment, (item) => {
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
    }
  }, [modal, idAnnouncement])

  useEffect(() => {
    setState({
      coverImage: { src: "", image: null }
    })
  }, [toggleModal])

  // ** render
  const optionShowAnnouncement = [
    ..._.map(optionsShowAnnouncement, (item) => {
      return {
        key: item.value,
        label: (
          <div
            onClick={() => {
              setState({
                nameOptionShowAnnouncement: item.name_option,
                valueShowAnnouncement: item.value
              })
            }}>
            {useFormatMessage(item.label)}
          </div>
        )
      }
    })
  ]
  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="modal-dialog-centered feed modal-create-post modal-create-event modal-announcement"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <span className="text-title">
          {useFormatMessage("modules.feed.announcement.title")}
        </span>
        <div className="div-btn-close" onClick={() => toggleModal()}>
          <i className="fa-regular fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="div-event div-event-name">
          <ErpInput
            label={useFormatMessage(
              "modules.feed.announcement.text.announcement_title"
            )}
            placeholder={useFormatMessage(
              "modules.feed.announcement.text.announcement_title_placeholder"
            )}
            className="input"
            name="announcement_title"
            defaultValue={state.dataEdit?.title || ""}
            loading={state.loadingEdit}
            useForm={methods}
            required
          />

          <Label
            for="announcement-cover-image"
            className="mb-0 label-announcement-cover-image">
            <div
              className="div-announcement-cover-image"
              onClick={() =>
                setState({
                  coverImage: { src: "", image: null }
                })
              }>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none">
                <path
                  d="M10.5002 25.6667H17.5002C23.3335 25.6667 25.6668 23.3333 25.6668 17.5V10.5C25.6668 4.66668 23.3335 2.33334 17.5002 2.33334H10.5002C4.66683 2.33334 2.3335 4.66668 2.3335 10.5V17.5C2.3335 23.3333 4.66683 25.6667 10.5002 25.6667Z"
                  stroke="#737B81"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.4998 11.6667C11.7885 11.6667 12.8332 10.622 12.8332 9.33333C12.8332 8.04467 11.7885 7 10.4998 7C9.21117 7 8.1665 8.04467 8.1665 9.33333C8.1665 10.622 9.21117 11.6667 10.4998 11.6667Z"
                  stroke="#737B81"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.11523 22.1083L8.8669 18.2467C9.78857 17.6283 11.1186 17.6983 11.9469 18.41L12.3319 18.7483C13.2419 19.53 14.7119 19.53 15.6219 18.7483L20.4752 14.5833C21.3852 13.8017 22.8552 13.8017 23.7652 14.5833L25.6669 16.2167"
                  stroke="#737B81"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <input
              type="file"
              id="announcement-cover-image"
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setState({
                    coverImage: { src: "", image: e.target.files[0] }
                  })
                } else {
                  setState({
                    coverImage: { src: "", image: null }
                  })
                }
              }}
            />
          </Label>
        </div>
        {state.coverImage.image && (
          <div className="cover-announcment mb-1">
            <Photo
              src={[state.coverImage.image]}
              width="100%"
              style={{ borderRadius: "20px" }}
            />
            <Button.Ripple
              className="btn-remove-cover"
              onClick={() => handleRemoveCover()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M9.8 4.7561H14.2C14.2 3.57071 13.215 2.60976 12 2.60976C10.785 2.60976 9.8 3.57071 9.8 4.7561ZM8.15 4.7561C8.15 2.68166 9.8737 1 12 1C14.1263 1 15.85 2.68166 15.85 4.7561H22.175C22.6306 4.7561 23 5.11645 23 5.56098C23 6.0055 22.6306 6.36585 22.175 6.36585H20.724L19.4348 19.3633C19.2301 21.4261 17.4532 23 15.3289 23H8.67106C6.54679 23 4.76986 21.4261 4.56524 19.3633L3.27598 6.36585H1.825C1.36937 6.36585 1 6.0055 1 5.56098C1 5.11645 1.36937 4.7561 1.825 4.7561H8.15ZM10.35 9.85366C10.35 9.40914 9.98063 9.04878 9.525 9.04878C9.06937 9.04878 8.7 9.40914 8.7 9.85366V17.9024C8.7 18.347 9.06937 18.7073 9.525 18.7073C9.98063 18.7073 10.35 18.347 10.35 17.9024V9.85366ZM14.475 9.04878C14.9306 9.04878 15.3 9.40914 15.3 9.85366V17.9024C15.3 18.347 14.9306 18.7073 14.475 18.7073C14.0194 18.7073 13.65 18.347 13.65 17.9024V9.85366C13.65 9.40914 14.0194 9.04878 14.475 9.04878ZM6.20757 19.2082C6.33034 20.4459 7.3965 21.3902 8.67106 21.3902H15.3289C16.6035 21.3902 17.6697 20.4459 17.7924 19.2082L19.0663 6.36585H4.93369L6.20757 19.2082Z"
                  fill="#8C8A82"
                />
              </svg>
            </Button.Ripple>
          </div>
        )}

        <div className="div-event div-event-time">
          <div className="div-all-day">
            <div className="div-switch div-pin">
              <ErpCheckbox
                name="pin_to_top"
                useForm={methods}
                defaultValue={false}
              />
              <span className="text">
                {useFormatMessage("modules.feed.announcement.text.pin_to_top")}
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
                overlayClassName="feed dropdown-div-repeat dropdown-show-announcement"
                suffixIcon="sadf">
                <div className="div-repeat">
                  <span className="text-repeat">
                    {useFormatMessage(
                      `modules.news.app_options.show_announcements.${state.nameOptionShowAnnouncement}`
                    )}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none">
                    <path
                      d="M19.9181 9.44995L13.3981 15.97C12.6281 16.74 11.3681 16.74 10.5981 15.97L4.07812 9.44995"
                      stroke="#696760"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="div-event div-attendees">
          <div className="div-attendees-input div-input-btn">
            <label title="Attendees" className="form-label">
              {useFormatMessage("modules.feed.announcement.text.send_to")}
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
                renderHeader={true}
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

        <div className="div-event div-details">
          <ErpInput
            type="textarea"
            label={useFormatMessage("modules.feed.create_event.text.details")}
            placeholder={useFormatMessage(
              "modules.feed.create_event.text.details_placeholder"
            )}
            className="input"
            useForm={methods}
            name="details"
            defaultValue={state.dataEdit?.content || ""}
            loading={state.loadingEdit}
          />
        </div>

        <div className="div-event div-add-attachment">
          <Label for="attach-doc">
            <div className="div-add-attachment__choose">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none">
                <path
                  d="M6 12.5H18"
                  stroke="#2F9BFA"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18.5V6.5"
                  stroke="#2F9BFA"
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
                    <div className="div-icon">{renderIconAttachment(item)}</div>
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

        <div className="div-event text-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button.Ripple
              color="primary"
              type="submit"
              className="btn-post"
              disabled={state.loadingSubmit}>
              {state.loadingSubmit && <Spinner size={"sm"} className="me-50" />}
              {useFormatMessage(
                _.isEmpty(state.dataEdit)
                  ? "modules.feed.announcement.text.post_announcement"
                  : "modules.feed.announcement.text.update_announcement"
              )}
            </Button.Ripple>
          </form>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalAnnouncement
