// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { contractTypeApi } from "@modules/ContractType/common/api"
import { useSelector } from "react-redux"
// ** Styles
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
import { Space } from "antd"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"

const AddContractTypeModal = (props) => {
  const {
    // ** props
    modal,
    modalData,
    // ** methods
    handleModal,
    loadTabContent
  } = props

  const isEditModal = Object.keys(modalData).length > 0

  const [state, setState] = useMergedState({
    loading: false
  })

  const moduleData = useSelector((state) => state.app.modules.contract_type)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  const onSubmit = (values) => {
    setState({
      loading: true
    })
    if (!isEditModal) {
      contractTypeApi
        .createContractType(values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.create.success")
          })
          setState({
            loading: false
          })
          handleModal(false)
          loadTabContent()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.create.error")
          })
          setState({
            loading: false
          })
        })
    } else {
      contractTypeApi
        .updateContractType(modalData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          setState({
            loading: false
          })
          handleModal(false)
          loadTabContent()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.update.error")
          })
          setState({
            loading: false
          })
        })
    }
  }

  const handleCloseModal = () => {
    handleModal(false)
  }

  // ** effect
  useEffect(() => {
    if (Object.keys(modalData).length > 0) {
      setValue("name", modalData.name)
      setValue("description", modalData.description)
    }
  }, [modal])

  // ** render
  return (
    <Modal
      isOpen={modal}
      toggle={() => handleCloseModal()}
      size="md"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      className="employee-setting-modal">
      <ModalHeader toggle={() => handleCloseModal()}>
        {isEditModal
          ? useFormatMessage(
              "modules.employee_setting.modal.title.edit_contract"
            )
          : useFormatMessage(
              "modules.employee_setting.modal.title.add_contract"
            )}
      </ModalHeader>
      <ModalBody>
        <FormProvider {...methods}>
          <Row>
            <Col sm={12}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.name
                }}
                useForm={methods}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.no_end_date
                }}
                useForm={methods}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.description
                }}
                useForm={methods}
              />
            </Col>
          </Row>
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space>
            <Button.Ripple
              type="submit"
              color="primary"
              disabled={state.loading}>
              {state.loading && <Spinner size="sm" className="me-25" />}
              {isEditModal
                ? useFormatMessage("modules.employee_setting.buttons.save")
                : useFormatMessage("modules.employee_setting.buttons.add")}
            </Button.Ripple>
            <Button.Ripple
              color="flat-danger"
              onClick={() => handleCloseModal()}>
              {useFormatMessage("modules.employee_setting.buttons.cancel")}
            </Button.Ripple>
          </Space>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default AddContractTypeModal
