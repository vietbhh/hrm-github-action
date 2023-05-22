import { ErpInput } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { manageEndorsementApi } from "@modules/FriNet/common/api"
import { getBadgeFromKey, listBadge } from "@modules/FriNet/common/common"
import { Dropdown } from "antd"
import classNames from "classnames"
import React, { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap"

const BadgeSetting = () => {
  const [state, setState] = useMergedState({
    modal: false,
    loadingSubmit: false,
    selectedBadge: "",
    loadingData: false,
    dataBadge: [],

    // edit
    idEdit: "",
    dataEdit: {},
    loadingEdit: false
  })

  const methods = useForm({ mode: "onSubmit" })
  const { handleSubmit, reset, setValue } = methods
  const onSubmit = (values) => {
    if (state.selectedBadge === "") {
      notification.showError({
        text: useFormatMessage(
          "modules.manage_endorsement.badge_setting.please_select_badge"
        )
      })

      return
    }

    values.selectedBadge = state.selectedBadge
    values.idEdit = state.idEdit

    setState({ loadingSubmit: true })
    manageEndorsementApi
      .postSubmitCreateBadge(values)
      .then((res) => {
        setState({ loadingSubmit: false, modal: false, selectedBadge: "" })
        reset()

        loadData()
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
        setState({ loadingSubmit: false })
      })
  }

  // ** function
  const toggleModal = () => setState({ modal: !state.modal, idEdit: "" })
  const setSelectedBadge = (value) => setState({ selectedBadge: value })

  const loadData = () => {
    setState({ loadingData: true })
    manageEndorsementApi
      .getListDataBadgeSetting()
      .then((res) => {
        setState({ loadingData: false, dataBadge: res.data })
      })
      .catch((err) => {
        setState({ loadingData: false })
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  const deleteBadge = (id) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete"),
      html: ""
    }).then((res) => {
      if (res.value) {
        setState({ loadingData: true })
        manageEndorsementApi
          .getDeleteBadgeSetting(id)
          .then((res) => {
            loadData()
          })
          .catch((err) => {
            setState({ loadingData: false })
          })
      }
    })
  }

  // ** useEffect
  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (state.modal && state.idEdit) {
      setState({ loadingEdit: true })
      manageEndorsementApi
        .getBadgeSettingById(state.idEdit)
        .then((res) => {
          setState({
            loadingEdit: false,
            dataEdit: res.data,
            selectedBadge: res.data.badge
          })
        })
        .catch((err) => {
          setState({ loadingEdit: false })
        })
    }
  }, [state.idEdit, state.modal])

  // ** render

  return (
    <Fragment>
      <div className="badge-setting">
        <div className="div-header">
          <span className="title">
            {useFormatMessage(
              "modules.manage_endorsement.badge_setting.organization_badge"
            )}
          </span>
          <Button.Ripple
            color="success"
            size="sm"
            className="ms-auto"
            onClick={() => {
              toggleModal()
              setState({ selectedBadge: "" })
              setValue("badge_name", "")
            }}>
            {useFormatMessage(
              "modules.manage_endorsement.badge_setting.create_badge"
            )}
          </Button.Ripple>
        </div>
        <div className="div-body">
          {state.loadingData && <DefaultSpinner />}

          {!state.loadingData && (
            <div className="div-list-item">
              {_.map(state.dataBadge, (item, index) => {
                const items = [
                  {
                    key: "1",
                    label: (
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          setState({ idEdit: item._id, modal: true })
                        }}>
                        <i className="fa-regular fa-edit"></i>
                        <span>
                          {useFormatMessage(
                            "modules.manage_endorsement.badge_setting.edit_badge"
                          )}
                        </span>
                      </div>
                    )
                  },
                  {
                    key: "2",
                    label: (
                      <div
                        className="dropdown-item div-delete"
                        onClick={() => deleteBadge(item._id)}>
                        <i className="fa-regular fa-delete-right"></i>
                        <span>
                          {useFormatMessage(
                            "modules.manage_endorsement.badge_setting.delete_badge"
                          )}
                        </span>
                      </div>
                    )
                  }
                ]

                return (
                  <div key={index} className="div-item-badge">
                    <div className="item-badge__header">
                      <Dropdown
                        menu={{ items: items }}
                        placement="bottom"
                        trigger={["click"]}
                        overlayClassName="feed dropdown-div-repeat dropdown-header-badge">
                        <div className="cursor-pointer">
                          <svg
                            width="19"
                            height="4"
                            viewBox="0 0 19 4"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ margin: "10px 4px" }}>
                            <path
                              d="M4.66797 2C4.66797 3.10457 3.77254 4 2.66797 4C1.5634 4 0.667969 3.10457 0.667969 2C0.667969 0.89543 1.5634 0 2.66797 0C3.77254 0 4.66797 0.89543 4.66797 2Z"
                              fill="#737682"></path>
                            <path
                              d="M11.668 2C11.668 3.10457 10.7725 4 9.66797 4C8.5634 4 7.66797 3.10457 7.66797 2C7.66797 0.89543 8.5634 0 9.66797 0C10.7725 0 11.668 0.89543 11.668 2Z"
                              fill="#737682"></path>
                            <path
                              d="M18.668 2C18.668 3.10457 17.7725 4 16.668 4C15.5634 4 14.668 3.10457 14.668 2C14.668 0.89543 15.5634 0 16.668 0C17.7725 0 18.668 0.89543 18.668 2Z"
                              fill="#737682"></path>
                          </svg>
                        </div>
                      </Dropdown>
                    </div>
                    <div className="item-badge__body">
                      <div className="div-img">
                        <img
                          src={getBadgeFromKey(item.badge)}
                          alt={getBadgeFromKey(item.badge)}
                        />
                      </div>
                      <div className="div-text">{item.name}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={state.modal}
        toggle={() => toggleModal()}
        className="feed modal-create-post modal-create-event modal-create-badge"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader>
          <span className="text-title">
            {useFormatMessage(
              "modules.manage_endorsement.badge_setting.create_new_badge"
            )}
          </span>
          <div className="div-btn-close" onClick={() => toggleModal()}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </ModalHeader>
        <ModalBody>
          <ErpInput
            label={useFormatMessage(
              "modules.manage_endorsement.badge_setting.badge_name"
            )}
            placeholder={useFormatMessage(
              "modules.manage_endorsement.badge_setting.badge_name"
            )}
            className="input"
            name="badge_name"
            defaultValue={state.dataEdit?.name || ""}
            loading={state.loadingEdit}
            useForm={methods}
            required
          />

          <label title="Attendees" className="form-label mt-2">
            {useFormatMessage(
              "modules.manage_endorsement.badge_setting.select_badge"
            )}{" "}
            *
          </label>
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            <div className="div-list-badge">
              {_.map(listBadge, (item, index) => {
                return (
                  <div
                    key={index}
                    className={classNames("div-badge-item", {
                      selected: index === state.selectedBadge
                    })}
                    onClick={() => setSelectedBadge(index)}>
                    <div className="div-badge-item__body">
                      <div className="div-img mb-1">
                        <img src={item} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </PerfectScrollbar>

          <div className="text-center mt-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Button.Ripple
                color="primary"
                type="submit"
                className="btn-post"
                disabled={state.loadingSubmit || state.loadingEdit}>
                {state.loadingSubmit && (
                  <Spinner size={"sm"} className="me-50" />
                )}
                {useFormatMessage(
                  "modules.manage_endorsement.badge_setting.create_badge"
                )}
              </Button.Ripple>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default BadgeSetting
