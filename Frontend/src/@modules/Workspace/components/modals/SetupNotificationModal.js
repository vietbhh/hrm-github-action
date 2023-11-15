import { ErpRadio } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { workspaceApi } from "@modules/Workspace/common/api"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import "react-perfect-scrollbar/dist/css/styles.css"
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
const findNotifi = (arr, iduser) => {
  const index = arr.findIndex((p) => parseInt(p.id_user) === parseInt(iduser))
  if (arr[index]) return arr[index].status
  return true
}
const SetupNotificationModal = (props) => {
  const { modal, handleModal, dataWorkspace } = props
  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0
  const [state, setState] = useMergedState({
    loading: false
  })
  const onSubmit = (values) => {
    setState({ loading: true })
    const dataSave = { _id: dataWorkspace._id }
    const arrNotifi = [...dataWorkspace.notification]
    const arrId = arrNotifi.map((i) => parseInt(i.id_user))

    if (arrId.includes(userId)) {
      const index = arrNotifi.findIndex((i) => parseInt(i.id_user) === userId)
      arrNotifi[index] = { id_user: userId, status: values.notification }
      dataWorkspace.notification[index].status = values.notification
    } else {
      arrNotifi.push({ id_user: userId, status: values.notification })
    }
    dataSave.notification = JSON.stringify(arrNotifi)

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
      size="md"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        Notification settings
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row>
            <Col sm={12}>
              <div className="content-notification-setup d-flex align-items-center">
                <div className="title flex-fill">
                  All post
                  <div className="sub-title">Every post in the group</div>
                </div>
                <ErpRadio
                  className="flex-fill text-end"
                  useForm={methods}
                  value={"all"}
                  defaultChecked={findNotifi(
                    dataWorkspace?.notification,
                    userId
                  )}
                  name="notification"
                />
              </div>
            </Col>

            <Col sm={12}>
              <div className="content-notification-setup d-flex align-items-center">
                <div className="title flex-fill">
                  Admin’s post
                  <div className="sub-title">Only admin’s posts</div>
                </div>
                <ErpRadio
                  className="flex-fill text-end"
                  useForm={methods}
                  value={"admin"}
                  defaultChecked={findNotifi(
                    dataWorkspace?.notification,
                    userId
                  )}
                  name="notification"
                />
              </div>
            </Col>

            <Col sm={12}>
              <div className="content-notification-setup d-flex align-items-center">
                <div className="title flex-fill">
                  Off
                  <div className="sub-title">
                    Only mentions and important updates to group settings or
                    privacy
                  </div>
                </div>
                <ErpRadio
                  className="flex-fill text-end"
                  useForm={methods}
                  value={"off"}
                  defaultChecked={
                    !findNotifi(dataWorkspace?.notification, userId)
                  }
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
              disabled={state.loading}
              className="btn-save btn btn-primary">
              {state.loading && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("modules.workspace.buttons.save_setting")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default SetupNotificationModal
