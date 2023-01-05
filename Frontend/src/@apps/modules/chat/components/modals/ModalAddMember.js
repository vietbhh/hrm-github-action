import { ErpUserSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
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

const ModalAddMember = (props) => {
  const {
    modal,
    toggleModal,
    handleUpdateGroup,
    userId,
    setDataUnseenDetail,
    selectedGroup
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
    const member = selectedGroup.user
    const unseen = selectedGroup.chat.unseen
    const member_add = []
    _.forEach(values.group_member, (val) => {
      member.push(val.id)
      unseen.push(val.id)
      member_add.push(val.id)
    })
    const timestamp = Date.now()
    const docData = {
      last_message: useFormatMessage("modules.chat.text.add_new_member"),
      last_user: userId,
      timestamp: timestamp,
      user: member,
      unseen: unseen,
      unseen_detail: setDataUnseenDetail(
        "add_member",
        userId,
        timestamp,
        selectedGroup.chat.unseen_detail,
        member,
        member_add
      )
    }
    await handleUpdateGroup(selectedGroup.id, docData).then((res) => {
      setTimeout(() => {
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
        {useFormatMessage("modules.chat.text.add_member")}
      </ModalHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col sm="12">
                <ErpUserSelect
                  name="group_member"
                  label={useFormatMessage("modules.chat.text.group_member")}
                  required
                  useForm={methods}
                  isMulti={true}
                  excepts={
                    selectedGroup.user
                      ? [userId, ...selectedGroup.user]
                      : [userId]
                  }
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

export default ModalAddMember
