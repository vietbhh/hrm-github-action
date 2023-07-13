import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
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
import { workspaceApi } from "../../common/api"
import AvatarBox from "../../../../@apps/components/common/AvatarBox"
const EditInformationModal = (props) => {
  const { modal, handleModal, infoWorkspace } = props
  const [state, setState] = useMergedState({
    loading: false,
    avatar: ""
  })

  const onSubmit = (values) => {
    setState({ loading: true })
    workspaceApi.update(infoWorkspace._id, values).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      infoWorkspace.name = values.name
      infoWorkspace.introduction = values.introduction

      handleModal()
      setState({ loading: false })
    })
  }

  const saveAvatar = (value) => {
    setState({ loading: true })
    const dataSave = { _id: infoWorkspace._id, avatar: value }
    workspaceApi.saveAvatar(dataSave).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      setState({ loading: false })
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
      size="md"
      className="edit-information-workspace"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}></ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row>
            <Col
              sm={4}
              className="d-flex align-items-center justify-content-center">
              <AvatarBox
                currentAvatar={infoWorkspace?.avatar}
                handleSave={(img) => {
                  saveAvatar(img)
                }}
              />
            </Col>

            <Col sm={8}>
              <ErpInput
                defaultValue={infoWorkspace?.name}
                name="name"
                useForm={methods}
              />

              <ErpInput
                type="textarea"
                nolabel
                defaultValue={infoWorkspace?.introduction}
                rows={8}
                name="introduction"
                useForm={methods}
              />
            </Col>
            <Col sm={12}></Col>
            <Col sm={12}></Col>
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
export default EditInformationModal
