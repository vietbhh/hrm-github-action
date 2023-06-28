import { ErpCheckbox, ErpSwitch } from "@apps/components/common/ErpField"
import {
  fieldLabel,
  getBool,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { filter, map } from "lodash"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
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
import { updateStateModule } from "@store/app/app"

const SettingTableModal = (props) => {
  const {
    modal,
    handleModal,
    loadData,
    metas,
    module,
    canDragColumn,
    canResizeColumnWidth
  } = props
  const moduleName = module.name
  const [state, setState] = useMergedState({
    loading: false
  })
  const dispatch = useDispatch()
  const defaultFields = useSelector((state) => state.app.filters.defaultFields)
  const onSubmit = (values) => {
    setState({ loading: true })
    defaultModuleApi
      .updateModuleSetting(moduleName, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        dispatch(updateStateModule(res.data.modules))
        handleModal()
        loadData()
        setState({ loading: false })
      })
      .catch((err) => {
        setState({ loading: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods
  return (
    <React.Fragment>
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal">
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("module.default.modal.settingModalTitle")}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <Row>
              <Col sm={6} md={6} className="mb-25">
                <ErpSwitch
                  name={`dragColumn`}
                  id={`dragColumn`}
                  label={useFormatMessage("module.default.settings.dragColumn")}
                  defaultValue={canDragColumn}
                  useForm={methods}
                />
              </Col>
              <Col sm={6} md={6} className="mb-25">
                <ErpSwitch
                  name={`resizeColumnWidth`}
                  id={`resizeColumnWidth`}
                  label={useFormatMessage(
                    "module.default.settings.resizeColumnWidth"
                  )}
                  defaultValue={canResizeColumnWidth}
                  useForm={methods}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <div className="divider">
                  <div className="divider-text">
                    {useFormatMessage(
                      "module.default.settings.moduleFieldsDisplay"
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              {map(
                filter(metas, (field) => field.field_enable),
                (field, index) => {
                  return (
                    <Col sm={12} md={6} key={index} className="mb-25">
                      <ErpCheckbox
                        name={`modules[${field.id}]`}
                        id={`${field.field}`}
                        label={fieldLabel(field.moduleName, field.field)}
                        defaultValue={field.field_table_show}
                        useForm={methods}
                      />
                    </Col>
                  )
                }
              )}
            </Row>
            <Row>
              <Col sm={12}>
                <div className="divider">
                  <div className="divider-text">
                    {useFormatMessage(
                      "module.default.settings.systemFieldsDisplay"
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              {map(
                filter(
                  defaultFields,
                  (field) =>
                    ![
                      "view_permissions",
                      "deleted_at",
                      "update_permissions"
                    ].includes(field.field)
                ),
                (field, index) => {
                  const defaultChecked =
                    getBool(
                      module.user_options?.table?.metas?.[field.field]
                        ?.field_table_show
                    ) || false
                  return (
                    <Col sm={12} md={6} key={index} className="mb-25">
                      <ErpCheckbox
                        name={`default[${field.field}]`}
                        id={`${field.field}`}
                        label={useFormatMessage(`common.${field.field}`)}
                        defaultChecked={defaultChecked}
                        useForm={methods}
                      />
                    </Col>
                  )
                }
              )}
            </Row>
          </ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalFooter className="pt-2">
              <Button type="submit" color="primary" disabled={state.loading}>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </React.Fragment>
  )
}

export default SettingTableModal
