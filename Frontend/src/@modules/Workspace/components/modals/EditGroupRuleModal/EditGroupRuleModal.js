// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useForm } from "react-hook-form"
// ** Styles
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
// ** Components
import PerfectScrollbar from "react-perfect-scrollbar"
import FormEditGroupRule from "./FormEditGroupRule"
import ListGroupRule from "../../detail/TabIntroduction/ListGroupRule"

const EditGroupRuleModal = (props) => {
  const {
    // ** props
    id,
    modal,
    groupRule,
    // ** methods
    handleModal,
    setGroupRule
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, reset } = methods

  const onSubmit = (values) => {
    setState({
      loading: false
    })
    workspaceApi
      .update(id, {
        group_rules: [...groupRule, values]
      })
      .then((res) => {
        reset({})
        const [groupRuleItem] = res.data.group_rules
        setGroupRule(groupRuleItem)
      })
      .catch((err) => {})
  }

  // ** render
  const renderListGroupRule = () => {
    if (groupRule.length === 0) {
      return ""
    }

    return (
      <div className="mb-1 list-container">
        <PerfectScrollbar
          style={{
            maxHeight: "400px",
            minHeight: "50px"
          }}
          options={{ wheelPropagation: false }}>
          <ListGroupRule
            id={id}
            groupRule={groupRule}
            isEditable={true}
            setGroupRule={setGroupRule}
          />
        </PerfectScrollbar>
      </div>
    )
  }

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="group-rule-modal"
      size="md"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.workspace.display.group_rules")}
      </ModalHeader>
      <ModalBody>
        <Fragment>{renderListGroupRule()}</Fragment>
        <div className="form-container">
          <FormEditGroupRule
            methods={methods}
            showInputLabel={true}
            isEdit={false}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button.Ripple type="submit" color="primary" disabled={state.loading}>
            {useFormatMessage("modules.workspace.buttons.add_new_rule")}
          </Button.Ripple>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default EditGroupRuleModal
