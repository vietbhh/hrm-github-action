import { EmptyContent } from "@apps/components/common/EmptyContent"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { manageEndorsementApi } from "@modules/FriNet/common/api"
import { getBadgeFromKey } from "@modules/FriNet/common/common"
import { Dropdown } from "antd"
import React, { Fragment, useEffect } from "react"
import { Button } from "reactstrap"
import ModalCreateBadge from "./modals/ModalCreateBadge"
import { downloadApi } from "@apps/modules/download/common/api"

const BadgeSetting = () => {
  const [state, setState] = useMergedState({
    modal: false,
    loadingData: false,
    dataBadge: [],

    // edit
    idEdit: ""
  })

  // ** function
  const toggleModal = () => setState({ modal: !state.modal, idEdit: "" })

  const loadData = () => {
    setState({ loadingData: true })
    manageEndorsementApi
      .getListDataBadgeSetting()
      .then((res) => {
        const promises = []
        _.forEach(res.data, (item) => {
          const promise = new Promise(async (resolve, reject) => {
            const _item = { ...item }
            if (_item.badge_type === "upload") {
              await downloadApi.getPhoto(item.badge).then((response) => {
                _item.url = URL.createObjectURL(response.data)
                resolve(_item)
              })
            } else {
              resolve(_item)
            }
          })
          promises.push(promise)
        })
        Promise.all(promises)
          .then((res) => {
            setState({ loadingData: false, dataBadge: res })
          })
          .catch((err) => {
            setState({ loadingData: false })
          })
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
            }}>
            {useFormatMessage(
              "modules.manage_endorsement.badge_setting.create_badge"
            )}
          </Button.Ripple>
        </div>
        <div className="div-body">
          {state.loadingData && <DefaultSpinner />}

          {!state.loadingData && _.isEmpty(state.dataBadge) && <EmptyContent />}

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
                          src={
                            item.badge_type === "local"
                              ? getBadgeFromKey(item.badge)
                              : item.url
                          }
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

      <ModalCreateBadge
        modal={state.modal}
        toggleModal={toggleModal}
        idEdit={state.idEdit}
        loadData={loadData}
      />
    </Fragment>
  )
}

export default BadgeSetting
