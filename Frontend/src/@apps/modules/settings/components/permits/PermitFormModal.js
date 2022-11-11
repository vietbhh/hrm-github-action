import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { isEmpty } from "lodash"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button, Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  TabContent,
  TabPane
} from "reactstrap"
import { permitApi } from "../../common/api"
import PermitFormTabMembers from "./PermitFormTabMembers"
import PermitFormTabSelection from "./PermitFormTabSelection"

const PermitFormModal = (props) => {
  const { modal, handleModal, loadData, permissions, updateData, updateId } =
    props
  const [state, setState] = useMergedState({
    active: "1",
    selectPermissions: [],
    selectUsers: [],
    loading: false
  })

  const toggle = (tab) => {
    if (state.active !== tab) {
      setState({
        active: tab
      })
    }
  }
  const onSubmit = (values) => {
    setState({ loading: true })
    values.permissions = state.selectPermissions
    values.users = state.selectUsers
    if (updateId !== false) values.id = updateId
    permitApi
      .postSave(values)
      .then(() => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleModal()
        loadData()
        setState({ loading: false })
      })
      .catch((err) => {
        //props.submitError();
        setState({ loading: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const validateUnique = async (validateValue) => {
    const validateData = {
      name: validateValue
    }
    if (!isEmpty(state.updateId)) {
      validateData.id = state.updateId
    }
    let result = true
    await permitApi.postValidate(validateData).then((res) => {
      if (res.data === true) result = true
    })
    return result
  }

  const { handleSubmit } = methods

  return (
    <React.Fragment>
      <Modal isOpen={modal} toggle={() => handleModal()} className="modal-lg">
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("modules.permissions.display.addModalTitle")}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <ErpInput
              type="text"
              required
              validateRules={{
                validate: {
                  checkUnique: async (v) =>
                    (await validateUnique(v)) ||
                    useFormatMessage("validate.exists", { name: v })
                }
              }}
              name="name"
              id="name"
              defaultValue={updateData.name || ""}
              label={useFormatMessage("modules.permissions.fields.name")}
              useForm={methods}
            />

            <ErpInput
              type="textarea"
              useForm={methods}
              name="description"
              id="description"
              defaultValue={updateData.description || ""}
              label={useFormatMessage("modules.permissions.fields.description")}
            />

            <Nav tabs>
              <NavItem>
                <NavLink
                  active={state.active === "1"}
                  onClick={() => {
                    toggle("1")
                  }}>
                  Permissions
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={state.active === "2"}
                  onClick={() => {
                    toggle("2")
                  }}>
                  Members
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="py-50" activeTab={state.active}>
              <TabPane tabId="1">
                <PermitFormTabSelection
                  listPermits={permissions}
                  selectPermissions={(values) => {
                    setState({
                      selectPermissions: values
                    })
                  }}
                  updatePermissions={
                    updateData.permissions
                  }></PermitFormTabSelection>
              </TabPane>
              <TabPane tabId="2">
                <PermitFormTabMembers
                  selectUsers={(values) => {
                    setState({
                      selectUsers: values
                    })
                  }}
                  updateUsers={updateData.users}></PermitFormTabMembers>
              </TabPane>
            </TabContent>
          </ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalFooter>
              <Button type="submit" color="primary" disabled={state.loading}>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </React.Fragment>
  )
}
export default PermitFormModal
