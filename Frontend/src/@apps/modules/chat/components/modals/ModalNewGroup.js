import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import { FormProvider, useForm } from "react-hook-form"
import { ErpInput, ErpUserSelect } from "@apps/components/common/ErpField"

const ModalNewGroup = (props) => {
  const {
    modal,
    toggleModal,
    handleAddNewGroup,
    setActive,
    userId,
    setSelectedUser
  } = props
  const [state, setState] = useMergedState({
    loading: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const onSubmit = async (values) => {
    setState({ loading: true })
    const member = [userId]
    _.forEach(values.group_member, (val) => {
      member.push(val.id)
    })
    const docData = {
      last_message: useFormatMessage("modules.chat.text.create_new_group"),
      last_user: userId,
      name: values.group_name,
      timestamp: Date.now(),
      type: "group",
      user: member,
      new: 0,
      pin: 0,
      avatar: "",
      background: ""
    }
    await handleAddNewGroup(docData).then((res) => {
      setTimeout(() => {
        const newGroupId = res.id
        setActive(newGroupId)
        toggleModal()
        setState({ loading: false })
      }, 500)
    })
  }

  return (
    <Modal
      isOpen={modal}
      toggle={toggleModal}
      className="modal-dialog-centered">
      <ModalHeader toggle={() => toggleModal()}>
        {useFormatMessage("modules.chat.text.create_new_group")}
      </ModalHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col sm="12">
                <ErpInput
                  name="group_name"
                  label={useFormatMessage("modules.chat.text.group_name")}
                  required
                  useForm={methods}
                />
              </Col>
              <Col sm="12">
                <ErpUserSelect
                  name="group_member"
                  label={useFormatMessage("modules.chat.text.group_member")}
                  required
                  useForm={methods}
                  isMulti={true}
                />
              </Col>
            </Row>
          </ModalBody>

          <ModalFooter>
            <Button.Ripple
              color="primary"
              type="submit"
              disabled={state.loading}>
              {state.loading && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("button.create")}
            </Button.Ripple>
            <Button.Ripple
              color="flat-danger"
              onClick={() => {
                toggleModal()
              }}>
              {useFormatMessage("button.cancel")}
            </Button.Ripple>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default ModalNewGroup
