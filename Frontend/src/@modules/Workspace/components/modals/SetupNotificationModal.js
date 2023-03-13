import { ErpRadio } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { workspaceApi } from "@modules/Workspace/common/api"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import "react-perfect-scrollbar/dist/css/styles.css"
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
const SetupNotificationModal = (props) => {
  const { modal, handleModal, dataWorkspace } = props
  const [state, setState] = useMergedState({
    loading: false
  })
  const onSubmit = (values) => {
    setState({ loading: true })
    const dataSave = { _id: dataWorkspace._id }
    dataSave.notification = values.notification

    workspaceApi.update(dataWorkspace._id, dataSave).then((res) => {
      if (res.statusText) {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleModal()
        setState({ loading: false })
      }
    })
  }
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="setup-notification-workspace-modal no-border-bottom"
      size="sm"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>Setup notification</ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row>
            <Col sm={12}>
              <div className="content-notification-setup d-flex">
                <div className="title">
                  Receive all notifications
                  <div className="sub-title">All posts in group</div>
                </div>
                <ErpRadio
                  className="ms-auto"
                  useForm={methods}
                  value={true}
                  defaultChecked={dataWorkspace?.notification === true}
                  name="notification"
                />
              </div>
            </Col>
            <Col sm={12}>
              <div className="content-notification-setup d-flex">
                <div className="title">
                  Turn off all notifications from this group
                  <div className="sub-title">
                    You will not receive notifications of any posts from the
                    group
                  </div>
                </div>
                <ErpRadio
                  className="ms-auto"
                  useForm={methods}
                  value={false}
                  defaultChecked={dataWorkspace?.notification === false}
                  name="notification"
                />
              </div>
            </Col>
          </Row>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              disabled={state.loading}
              className="ms-auto mr-2">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              {useFormatMessage("button.save")}
            </Button>
            <Button
              className="btn-cancel"
              color="flat-danger"
              onClick={() => handleModal(false)}>
              {useFormatMessage("button.cancel")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default SetupNotificationModal
