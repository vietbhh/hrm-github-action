import {
  getOptionValue,
  sortFieldsDisplay,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { isArray } from "@apps/utility/handleData"
import notification from "@apps/utility/notification"
import { canDeleteData, canUpdateData } from "@apps/utility/permissions"
import { Dropdown, Menu } from "antd"
import { isEmpty, toArray } from "lodash-es"
import { Fragment, useContext, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { recruitmentsApi } from "../../common/api"
const AddRequestModal = (props) => {
  const moduleName = "recruitments"
  const {
    modal,
    handleNewRe,
    handleDetail,
    handleDelete,
    loadData,
    selectedRequest
  } = props
  const ability = useContext(AbilityContext)
  const setting = useSelector((state) => state.auth.settings)
  const userId = useSelector((state) => state.auth.userData.id) || 0
  const canUpdate = canUpdateData(ability, moduleName, userId, selectedRequest)
  const canDelete = canDeleteData(ability, moduleName, userId, selectedRequest)
  const modules = useSelector((state) => state.app.modules.recruitments)
  const options = modules.options
  const [state, setState] = useMergedState({
    loading: false
  })
  const arrFields = useSelector(
    (state) => state.app.modules["recruitments"].metas
  )
  const optionsArr = useSelector(
    (state) => state.app.modules["recruitments"].options
  )
  const publish_status = useRef(0)

  const onSubmit = (values) => {
    setState({ loading: true })
    if (!isEmpty(selectedRequest)) {
      values.id = selectedRequest["id"]
    }
    values.hiringwork = setting.recruitmentHiringWorkflowCustom
    values.publish_status = publish_status.current
    recruitmentsApi
      .saveRequest(values)
      .then((res) => {
        notification.showSuccess(useFormatMessage("notification.save.success"))
        handleNewRe()
        if (!isEmpty(selectedRequest["id"])) {
          handleDetail(selectedRequest["id"], false, true)
        } else {
          loadData()
        }
        setState({ loading: false })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }
  const methods = useForm({
    mode: "onSubmit"
  })
  const dataFields = isArray(arrFields) ? arrFields : toArray(arrFields)
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const funSave = (publish_stt) => {
    publish_status.current = publish_stt
    handleSubmit(onSubmit)()
  }

  const publishStatus = () => {
    const items = [
      {
        label: (
          <div
            className="d-flex ms-1"
            rel="noopener noreferrer"
            onClick={() =>
              funSave(getOptionValue(options, "publish_status", "published"))
            }>
            <i className="fal fa-globe"></i>
            <div className="d-flex flex-column ms-1">
              <span className="title-publish">
                {useFormatMessage(
                  "modules.recruitments.app_options.publish_status.published"
                )}
              </span>
              <span className="sub-publish">
                {useFormatMessage("modules.recruitments.text.note_publish")}
              </span>
            </div>
          </div>
        ),
        key: "save-published"
      },
      {
        label: (
          <div
            className="d-flex ms-1"
            rel="noopener noreferrer"
            onClick={() =>
              funSave(getOptionValue(options, "publish_status", "private"))
            }>
            <i className="fal fa-user-friends"></i>
            <div className="d-flex flex-column ms-1">
              <span className="title-publish">
                {useFormatMessage(
                  "modules.recruitments.app_options.publish_status.private"
                )}
              </span>
              <span className="sub-publish">
                {useFormatMessage("modules.recruitments.text.note_private")}
              </span>
            </div>
          </div>
        ),
        key: "save-private"
      },
      {
        label: (
          <div
            className="d-flex ms-1"
            rel="noopener noreferrer"
            onClick={() =>
              funSave(getOptionValue(options, "publish_status", "off"))
            }>
            <i className="fal fa-file-edit"></i>
            <div className="d-flex flex-column ms-1">
              <span className="title-publish">
                {useFormatMessage(
                  "modules.recruitments.app_options.publish_status.off"
                )}
              </span>
              <span className="sub-publish">
                {useFormatMessage("modules.recruitments.text.note_off")}
              </span>
            </div>
          </div>
        ),
        key: "save-off"
      }
    ]

    return <Menu items={items} />
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleNewRe()}
      className="new-modal"
      backdrop={"static"}
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleNewRe()}>
        <span className="title-icon align-self-center">
          <i className="fal fa-calendar-plus"></i>
        </span>
        <span className="ms-1">
          {!isEmpty(selectedRequest.id)
            ? useFormatMessage("modules.recruitments.title.updaterequest")
            : useFormatMessage("modules.recruitments.title.newrequest")}
        </span>
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-2">
            {dataFields
              .filter((field) => field.field_form_show && field.field_enable)
              .sort((a, b) => {
                return sortFieldsDisplay(a, b)
              })
              .map((fieldItem, key) => {
                const field = { ...fieldItem }
                const options = optionsArr
                const fieldText = field.field

                if (fieldText === "send_to") {
                  field.field_options = { multiple: true, field_readonly: true }
                  if (selectedRequest.approved > 0) field.field_readonly = true
                }
                const fieldProps = {
                  module: "recruitments",
                  fieldData: field,
                  useForm: methods,
                  options
                }

                return (
                  <Col
                    sm={field.field_form_col_size}
                    className="mb-25"
                    key={key}>
                    <Fragment>
                      <FieldHandle
                        label={useFormatMessage(
                          "modules.recruitments.fields." + field.field
                        )}
                        {...fieldProps}
                        updateData={
                          !isEmpty(selectedRequest) &&
                          selectedRequest[fieldText]
                        }
                      />
                    </Fragment>
                  </Col>
                )
              })}
          </Row>
        </ModalBody>
        <form>
          <ModalFooter>
            {ability.can("update", moduleName) &&
              modal &&
              selectedRequest.approved === "0" &&
              canUpdate && (
                <>
                  <Dropdown
                    overlay={publishStatus}
                    trigger="click"
                    placement="topLeft"
                    disabled={state.loading}
                    className="me-2">
                    <Button color="primary">
                      {state.loading && <Spinner size="sm" className="mr-50" />}{" "}
                      {useFormatMessage("app.save")}{" "}
                      <i className="far fa-angle-down ms-1"></i>
                    </Button>
                  </Dropdown>
                </>
              )}
            {ability.can("update", moduleName) &&
              modal &&
              selectedRequest.approved > 0 &&
              canUpdate && (
                <>
                  <Dropdown
                    overlay={publishStatus}
                    trigger="click"
                    placement="topLeft"
                    disabled={state.loading}
                    className="me-2">
                    <Button color="primary">
                      {state.loading && <Spinner size="sm" className="mr-50" />}{" "}
                      {useFormatMessage("app.save")}{" "}
                      <i className="far fa-angle-down ms-1"></i>
                    </Button>
                  </Dropdown>
                </>
              )}

            {ability.can("add", moduleName) &&
              modal &&
              !canUpdate &&
              isEmpty(selectedRequest.id) && (
                <Button
                  type="submit"
                  color="primary"
                  className="me-2"
                  disabled={state.loading}>
                  {state.loading && <Spinner size="sm" className="mr-50" />}
                  {useFormatMessage("app.save")} b
                </Button>
              )}
            <Button
              className="btn-cancel me-2"
              onClick={() => handleNewRe(false)}>
              {useFormatMessage("button.cancel")}
            </Button>
            {!isEmpty(selectedRequest.id) &&
              ability.can("delete", moduleName) &&
              canDelete && (
                <Button
                  color="outline-danger"
                  onClick={() => handleDelete(selectedRequest["id"])}>
                  {useFormatMessage("button.delete")}
                </Button>
              )}
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default AddRequestModal
