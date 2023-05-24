import { ErpInput } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { manageEndorsementApi } from "@modules/FriNet/common/api"
import { listBadge } from "@modules/FriNet/common/common"
import classNames from "classnames"
import Nouislider from "nouislider-react"
import React, { Fragment, useEffect, useRef } from "react"
import AvatarEditor from "react-avatar-editor"
import { useForm } from "react-hook-form"
import PerfectScrollbar from "react-perfect-scrollbar"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"

const ModalCreateBadge = (props) => {
  const { modal, toggleModal, idEdit, loadData } = props
  const [state, setState] = useMergedState({
    modal: false,
    loadingSubmit: false,
    selectedBadge: "",
    loadingData: false,
    dataBadge: [],

    // edit
    dataEdit: {},
    loadingEdit: false,

    // ** custom
    customPreviewLink: null,
    scale: 1
  })

  const customEditor = useRef(null)

  const methods = useForm({ mode: "onSubmit" })
  const { handleSubmit, reset, setValue } = methods
  const onSubmit = (values) => {
    values.selectedBadge = state.selectedBadge
    values.idEdit = idEdit
    values.customImg = customEditor.current
      ? customEditor.current.getImageScaledToCanvas().toDataURL()
      : null

    if (state.selectedBadge === "" && values.customImg === null) {
      notification.showError({
        text: useFormatMessage(
          "modules.manage_endorsement.badge_setting.please_select_badge"
        )
      })

      return
    }

    setState({ loadingSubmit: true })
    manageEndorsementApi
      .postSubmitCreateBadge(values)
      .then((res) => {
        setState({
          loadingSubmit: false,
          selectedBadge: "",
          customPreviewLink: null
        })
        reset()
        toggleModal()
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
  const setSelectedBadge = (value) =>
    setState({ selectedBadge: value, customPreviewLink: null })
  const handleScale = (value) => {
    const scale = parseFloat(value)
    setState({ scale })
  }

  const changeCustom = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        notification.showError({
          text: useFormatMessage("modules.chat.notification.image_error", {
            allowType: "image/png, image/jpeg"
          })
        })
      } else {
        const linkPreview = URL.createObjectURL(file)
        setState({ customPreviewLink: linkPreview, selectedBadge: "" })
      }
    }
  }

  // ** useEffect
  useEffect(() => {
    if (modal && idEdit) {
      setState({ loadingEdit: true })
      manageEndorsementApi
        .getBadgeSettingById(idEdit)
        .then((res) => {
          setState({
            dataEdit: res.data,
            selectedBadge: "",
            customPreviewLink: null
          })

          if (res.data.badge_type === "local") {
            setState({
              customPreviewLink: null,
              selectedBadge: res.data.badge,
              loadingEdit: false
            })
          }

          if (res.data.badge_type === "upload") {
            const promise = new Promise(async (resolve, reject) => {
              await downloadApi.getPhoto(res.data.badge).then((response) => {
                resolve(URL.createObjectURL(response.data))
              })
            })
            promise.then((res) => {
              setState({
                customPreviewLink: res,
                loadingEdit: false
              })
            })
          }
        })
        .catch((err) => {
          setState({ loadingEdit: false })
        })
    } else {
      setState({
        loadingEdit: false,
        dataEdit: {},
        selectedBadge: "",
        customPreviewLink: null
      })
      setValue("badge_name", "")
    }
  }, [idEdit, modal])

  return (
    <Fragment>
      <Modal
        isOpen={modal}
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

          <div className="d-flex align-items-center mt-2 mb-1">
            <label title="Attendees" className="form-label">
              {useFormatMessage(
                "modules.manage_endorsement.badge_setting.select_badge"
              )}{" "}
              *
            </label>

            <label id="label-custom" htmlFor="input-custom" className="ms-auto">
              <div className="div-btn-custom">
                <i className="fa-regular fa-gear me-50"></i>
                {useFormatMessage(
                  "modules.manage_endorsement.badge_setting.custom"
                )}
              </div>

              <input
                type="file"
                id="input-custom"
                name="input-custom"
                accept="image/png, image/jpeg"
                hidden
                onChange={changeCustom}
                onClick={() => {
                  document.getElementById("input-custom").value = null
                }}
              />
            </label>
          </div>

          {state.loadingEdit ? (
            <DefaultSpinner />
          ) : (
            <>
              {state.customPreviewLink === null ? (
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
              ) : (
                <Fragment>
                  <Row>
                    <Col sm="12" className={`avtCustomize text-center`}>
                      <div
                        className="div-close"
                        onClick={() => {
                          setState({
                            customPreviewLink: null,
                            selectedBadge: ""
                          })
                        }}>
                        <i className="fa-solid fa-xmark"></i>
                      </div>

                      <AvatarEditor
                        ref={customEditor}
                        image={state.customPreviewLink}
                        border={50}
                        borderRadius={200}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={parseFloat(state.scale)}
                        rotate={0}
                        width={180}
                        height={180}
                      />
                    </Col>
                    <Col sm={{ size: 6, offset: 3 }}>
                      <Nouislider
                        value={state.scale}
                        onChange={handleScale}
                        step={0.01}
                        start={1}
                        range={{
                          min: 1,
                          max: 2
                        }}
                      />
                    </Col>
                  </Row>
                </Fragment>
              )}
            </>
          )}

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

export default ModalCreateBadge
