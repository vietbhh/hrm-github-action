// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useForm } from "react-hook-form"
// ** Styles
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
// ** Components
import FormEditGroupRule from "./FormEditGroupRule"

const EditGroupRuleModal = (props) => {
  const {
    // ** props
    id,
    modal,
    editGroupRuleData,
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
    if (Object.keys(editGroupRuleData).length > 0) {
      const updateValues = {
        group_rule_id: editGroupRuleData._id,
        type: "update",
        data: {
          ...values,
          _id: editGroupRuleData._id
        }
      }

      workspaceApi
        .update(id, updateValues, false)
        .then((res) => {
          reset({})
          const [groupRuleItem] = res.data.group_rules
          setGroupRule(res.data.group_rules)
          handleModal()
        })
        .catch((err) => {})
    } else {
      workspaceApi
        .update(
          id,
          {
            group_rules: [...groupRule, values],
            add_new_group: true
          },
          false
        )
        .then((res) => {
          reset({})
          //const [groupRuleItem] = res.data.group_rules
          setGroupRule(res.data.group_rules)
          handleModal()
        })
        .catch((err) => {})
    }
  }

  // ** effect
  useEffect(() => {
    if (modal === true) {
      reset(editGroupRuleData)
    }
  }, [modal])

  // ** render
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="group-rule-modal create-workgroup-modal"
      size="sm"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.workspace.display.group_rules")}
      </ModalHeader>
      <ModalBody>
        <div className="form-container">
          <FormEditGroupRule
            methods={methods}
            showInputLabel={true}
            isEdit={false}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)} className="w-100">
          <Button.Ripple
            type="submit"
            block
            color="primary"
            disabled={state.loading}>
            {Object.keys(editGroupRuleData).length === 0
              ? useFormatMessage("button.create")
              : useFormatMessage("button.save")}
          </Button.Ripple>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default EditGroupRuleModal
