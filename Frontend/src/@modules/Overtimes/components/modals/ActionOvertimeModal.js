// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { overtimeApi } from "../../common/api"
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

const ActionOvertimeModal = (props) => {
  const {
    // ** props
    modal,
    modalData,
    actionType,
    moduleName,
    metas,
    // ** methods
    handleModal,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  let modalTitle = ""
  if (actionType === "approved") {
    modalTitle = useFormatMessage("modules.overtimes.title.approve_overtime")
  } else if (actionType === "rejected") {
    modalTitle = useFormatMessage("modules.overtimes.title.reject_overtime")
  } else if (actionType === "cancelled") {
    modalTitle = useFormatMessage("modules.overtimes.title.cancel_overtime")
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, getValues } = methods

  const onSubmit = (values) => {
    setState({
      loading: true
    })
    values.action_type = actionType
    overtimeApi
      .actionOvertime(modalData.id, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.create.success")
        })
        handleModal()
        setState({
          loading: false
        })
        loadData()
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.create.error")
        })
        setState({
          loading: false
        })
      })
  }

  // ** render
  const renderModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>{modalTitle}</ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            <Row className="mt-2">
              <Col sm={12} className="">
                <Col sm={12} className="">
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.action_note
                    }}
                    useForm={methods}
                  />
                </Col>
              </Col>
            </Row>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space>
              <Button
                type="submit"
                color="primary"
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {(state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating) && (
                  <Spinner size="sm" className="me-50" />
                )}
                {useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </Space>
          </form>
        </ModalFooter>
      </Modal>
    )
  }

  return <Fragment>{renderModal()}</Fragment>
}

export default ActionOvertimeModal
