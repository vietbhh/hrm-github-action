import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { isEmpty } from "lodash"
import React, { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Modal,
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
import { permissionApi, permissionApiEdit } from "../common/permissionApi"
import PermitFormTabMembers from "./PermitFormTabMembers"
import PermitFormTabSelection from "./PermitFormTabSelection"

const PermitFormModal = (props) => {
  const { modal, handleModal, loadData, updateData, updateId } = props
  const [state, setState] = useMergedState({
    active: "1",
    selectUsers: [],
    loading: false,
    checkboxChild: []
  })

  const toggle = (tab) => {
    if (state.active !== tab) {
      setState({
        active: tab
      })
    }
  }
  const onSubmit = (values) => {
    values.checkboxChild = state.checkboxChild
    setState({ loading: true })
    values.users = state.selectUsers
    if (updateId !== false) values.id = updateId
    permissionApiEdit
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
    await permissionApi.postValidate(validateData).then((res) => {
      if (res.data === true) result = true
    })
    return result
  }

  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (!modal) {
      reset()
    }
  }, [modal])

  return (
    <React.Fragment>
      {modal && (
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
                label={useFormatMessage(
                  "modules.permissions.fields.description"
                )}
              />

              <Nav tabs>
                <NavItem>
                  <NavLink
                    active={state.active === "1"}
                    onClick={() => {
                      toggle("1")
                    }}>
                    {useFormatMessage("modules.permissions.text.permissions")}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={state.active === "2"}
                    onClick={() => {
                      toggle("2")
                    }}>
                    {useFormatMessage("modules.permissions.text.members")}
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent className="py-50" activeTab={state.active}>
                <TabPane tabId="1">
                  <PermitFormTabSelection
                    methods={methods}
                    setCheckboxChild={(values) => {
                      setState({
                        checkboxChild: values
                      })
                    }}
                    per_radio={
                      !_.isUndefined(updateData.per_radio)
                        ? updateData.per_radio
                        : ""
                    }
                    per_select_employee={
                      !_.isUndefined(updateData.per_select_employee)
                        ? updateData.per_select_employee
                        : {}
                    }
                    per_select_profile={
                      !_.isUndefined(updateData.per_select_profile)
                        ? updateData.per_select_profile
                        : {}
                    }
                    per_checkbox={
                      !_.isUndefined(updateData.per_checkbox)
                        ? updateData.per_checkbox
                        : {}
                    }
                    per_stateCheckBoxList={
                      !_.isUndefined(updateData.per_stateCheckBoxList)
                        ? updateData.per_stateCheckBoxList
                        : {}
                    }
                    per_stateCheckBoxIndeterminate={
                      !_.isUndefined(updateData.per_stateCheckBoxIndeterminate)
                        ? updateData.per_stateCheckBoxIndeterminate
                        : {}
                    }
                    modal={modal}
                  />
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
      )}
    </React.Fragment>
  )
}
export default PermitFormModal
