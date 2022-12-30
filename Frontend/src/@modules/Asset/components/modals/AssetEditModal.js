import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import {
  formatDate,
  sortFieldsDisplay,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { isArray } from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import AvatarBox from "@modules/Employees/components/detail/AvatarBox"
import classnames from "classnames"
import { isEmpty, toArray } from "lodash-es"
import { Fragment, useContext, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"
import {
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import SwAlert from "@apps/utility/SwAlert"
import Photo from "@apps/modules/download/pages/Photo"
const AssetEditModal = (props) => {
  const { modal, options, dataDetail, handleDetail, loadData } = props
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    readOnly: true,
    saving: false,
    loading: false,
    averageStar: 0,
    loadingStar: modal,
    dataReviews: [],
    modalAssign: false,
    currentJob: "",
    typeCoppy: false
  })
  const module = "asset_lists"
  const arrFields = useSelector(
    (state) => state.app.modules["asset_lists"].metas
  )
  const optionsArr = useSelector(
    (state) => state.app.modules["asset_lists"].options
  )

  const onSubmitFrm = (values) => {
    values.id = dataDetail.id
    defaultModuleApi.postSave("asset_lists", values).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
    })
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const dataFields = isArray(arrFields) ? arrFields : toArray(arrFields)
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const cancelUpdate = () => {
    setState({
      readOnly: true,
      saving: false
    })
  }

  const handleDeDelete = () => {
    const idCandidate = dataDetail.id
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        defaultModuleApi
          .delete("candidates", idCandidate)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })

            loadData()
            handleDetail("")
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={() => handleDetail("")}
        backdrop={"static"}
        size="lg"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleDetail("")}>
          <span className="title-icon align-self-center">
            <i className="fa-regular fa-circle-info"></i>
          </span>{" "}
          <span className="ms-50">
            {useFormatMessage("modules.asset_lists.title.edit")}
          </span>
        </ModalHeader>
        <ModalBody>
          <Row className="mt-2">
            <Col sm={12} className="mb-1">
              <div className="div-tab-content">
                <FormProvider {...methods}>
                  <Row>
                    {dataFields
                      .filter(
                        (field) => field.field_form_show && field.field_enable
                      )
                      .sort((a, b) => {
                        return sortFieldsDisplay(a, b)
                      })
                      .map((field, key) => {
                        const options = optionsArr
                        const fieldAuth = { ...field }
                        const nameField = field.field
                        if (
                          nameField === "asset_code" ||
                          nameField === "asset_status" ||
                          nameField === "asset_name"
                        ) {
                          fieldAuth.field_readonly = true
                        }

                        const fieldProps = {
                          module: "asset_lists",
                          fieldData: fieldAuth,
                          useForm: methods,
                          options
                        }

                        if (nameField !== "recruitment_proposal") {
                          return (
                            <Col
                              lg={field.field_form_col_size}
                              className="mb-1"
                              key={key}>
                              <Fragment>
                                <FieldHandle
                                  updateDataId={dataDetail?.id}
                                  label={useFormatMessage(
                                    "modules.asset_lists.fields." + field.field
                                  )}
                                  updateData={dataDetail?.[field.field]}
                                  {...fieldProps}
                                />
                              </Fragment>
                            </Col>
                          )
                        }
                      })}

                    <Col sm={12}>
                      <div className="row pt-2">
                        <form
                          className="col-12 text-center"
                          onSubmit={handleSubmit(onSubmitFrm)}>
                          <Button
                            type="submit"
                            color="primary"
                            className="btn-next me-2"
                            disabled={state.saving}>
                            <span className="align-middle d-sm-inline-block d-none">
                              {state.saving && (
                                <Spinner size="sm" className="mr-50" />
                              )}
                              {useFormatMessage("button.save")}
                            </span>
                          </Button>

                          <Button.Ripple
                            type="button"
                            className="btn-cancel"
                            onClick={() => handleDetail("")}
                            disabled={state.saving}>
                            <span className="align-middle d-sm-inline-block d-none">
                              {useFormatMessage("button.cancel")}
                            </span>
                          </Button.Ripple>
                        </form>
                      </div>
                    </Col>
                  </Row>
                </FormProvider>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </>
  )
}
export default AssetEditModal
