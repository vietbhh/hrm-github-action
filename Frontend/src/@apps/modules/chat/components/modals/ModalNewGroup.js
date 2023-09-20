import {
  ErpInput,
  ErpUserSelect
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
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

const ModalNewGroup = (props) => {
  const {
    modal,
    toggleModal,
    handleAddNewGroup,
    setActive,
    setActiveFullName,
    userId,
    setDataUnseenDetail
  } = props
  const [state, setState] = useMergedState({
    loading: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  const onSubmit = async (values) => {
    if (values.group_member.length <= 1) {
      notification.showWarning({
        text: useFormatMessage("modules.chat.text.warning_add_group_member")
      })
      return
    }
    setState({ loading: true })
    const member = [userId]
    const unseen = []
    _.forEach(values.group_member, (val) => {
      member.push(val.id)
      unseen.push(val.id)
    })
    const timestamp = Date.now()
    const docData = {
      last_message: useFormatMessage("modules.chat.text.create_new_group"),
      last_user: userId,
      name: values.group_name,
      timestamp: timestamp,
      type: "group",
      user: member,
      admin: [userId],
      creator: userId,
      new: 0,
      unseen: unseen,
      unseen_detail: setDataUnseenDetail("add", userId, timestamp, [], member),
      des: "Never settle!",
      is_system: false
    }
    await handleAddNewGroup(docData).then((res) => {
      setTimeout(() => {
        const newGroupId = res.id
        setActive(newGroupId)
        setActiveFullName("")
        window.history.replaceState(null, "", `/chat/${newGroupId}`)
        toggleModal()
        setState({ loading: false })
      }, 500)
    })
  }

  return (
    <Modal
      isOpen={modal}
      toggle={toggleModal}
      className="modal-dialog-centered chat-application">
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
                  excepts={[userId]}
                  loadOptionsApi={{ filters: { account_status: "activated" } }}
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
            {/* <Button.Ripple
              color="flat-danger"
              onClick={() => {
                toggleModal()
              }}>
              {useFormatMessage("button.cancel")}
            </Button.Ripple> */}
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default ModalNewGroup
