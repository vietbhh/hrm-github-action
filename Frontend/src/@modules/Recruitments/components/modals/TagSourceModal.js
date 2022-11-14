import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
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
const TagSourceModal = (props) => {
  const { modal, handleModal, loadData, dataEdit, tab } = props
  const [state, setState] = useMergedState({
    loading: false
  })
  const onSubmit = (values) => {
    setState({ loading: true })

    if (dataEdit) values.id = dataEdit.id
    defaultModuleApi
      .postSave(tab, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        loadData()
        handleModal()
        setState({ loading: false })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
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
      size="sm"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {!dataEdit &&
          tab === "tags" &&
          useFormatMessage("modules.recruitments.text.new_tag")}
        {dataEdit &&
          tab === "tags" &&
          useFormatMessage("modules.recruitments.text.edit_tag")}
        {!dataEdit &&
          tab === "sources" &&
          useFormatMessage("modules.recruitments.text.new_source")}
        {dataEdit &&
          tab === "sources" &&
          useFormatMessage("modules.recruitments.text.edit_source")}
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-1">
            <Col sm={12}>
              <ErpInput
                nolabel
                placeholder={
                  tab === "tags"
                    ? useFormatMessage("modules.recruitments.text.tag_name")
                    : useFormatMessage("modules.recruitments.text.source_name")
                }
                name="name"
                required
                useForm={methods}
                defaultValue={dataEdit?.title}
              />
            </Col>
          </Row>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              disabled={state.loading}
              className="me-1">
              {state.loading && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("button.add")}
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
export default TagSourceModal
