// ** React Imports
import { Fragment, useCallback } from "react"
import { components } from "react-select"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useForm, FormProvider } from "react-hook-form"
import { employeesApi } from "../../../../Employees/common/api"
// ** Styles
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap"
// ** Components
import { ErpSelect } from "@apps/components/common/ErpField"
import notification from "@apps/utility/notification"

const CreateSkillModal = (props) => {
  const {
    // ** props
    modal,
    skill,
    employeeData,
    // ** methods
    setSkill,
    handleModal
  } = props

  const [state, setState] = useMergedState({
    submitting: false,
    tempSkill: [...skill],
    menuIsOpen: false,
    newSkill: []
  })

  const methods = useForm()
  const { handleSubmit, reset } = methods

  const handleClickRemove = (e, props) => {
    e.stopPropagation()
    const removeData = props.data

    const newTempSkill = [...state.tempSkill].filter((item) => {
      return parseInt(item.value) !== parseInt(removeData.value)
    })

    setState({
      tempSkill: newTempSkill
    })

    if (
      [...state.newSkill].some(
        (itemSome) => parseInt(itemSome.value) === parseInt(removeData.value)
      )
    ) {
      const newNewSkill = [...state.newSkill].filter((item) => {
        return parseInt(item.value) !== parseInt(removeData.value)
      })

      setState({
        newSkill: newNewSkill
      })
    }
  }

  const onCreateOption = (data) => {
    const arrValue = [...state.tempSkill].map((item) => {
      return item.value
    })

    const max = arrValue.length > 0 ? Math.max(...arrValue) : 0
    const newData = {
      label: data,
      value: max + 1
    }
    reset({
      "create-skill-select": newData
    })
    setState({
      tempSkill: [...state.tempSkill, newData],
      newSkill: [...state.newSkill, newData]
    })
  }

  const onMenuOpen = useCallback(() => {
    setState({
      menuIsOpen: true
    })
  }, [])

  const onMenuClose = useCallback(() => {
    setState({
      menuIsOpen: false
    })
  }, [])

  const onSubmit = (values) => {
    setState({
      submitting: true
    })

    employeesApi
      .postUpdate(employeeData.id, {
        skill: JSON.stringify(state.tempSkill)
      })
      .then((res) => {
        notification.showSuccess()
        setSkill([...state.tempSkill])
        handleModal()
        setState({
          submitting: false
        })
      })
      .catch((err) => {
        notification.showError()
        setState({
          submitting: false
        })
      })
  }

  // ** render
  const Option = (props) => {
    return (
      <>
        <components.Option {...props}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
            <div>{props.children}</div>
            <div>
              <Button.Ripple
                color="danger"
                className="btn-icon btn-action"
                size="sm"
                onClick={(e) => handleClickRemove(e, props)}>
                <i className="fas fa-times" />
              </Button.Ripple>
            </div>
          </div>
        </components.Option>
      </>
    )
  }

  const renderNewSkill = () => {
    if (state.newSkill.length === 0) {
      return ""
    }

    return (
      <div>
        <h6>{useFormatMessage("modules.employees.fields.skill")}</h6>
        <div className="">
          {state.newSkill.map((item) => {
            return (
              <div
                className="mb-75 me-50 ps-50 pe-50 d-flex align-items-center justify-content-between skill-item"
                key={`skill-item-new-${item.value}`}>
                <div>{item.label}</div>
                <div className="mb-25">
                  <Button.Ripple
                    color="danger"
                    className="btn-icon btn-action"
                    size="sm"
                    onClick={(e) => handleClickRemove(e, {
                      data: {...item}
                    })}>
                    <i className="fas fa-times" />
                  </Button.Ripple>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      size="md"
      className="create-skill-folder create-workgroup-modal"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.employees.text.create_skill")}
      </ModalHeader>
      <ModalBody>
        <div className="p-1">
          <FormProvider {...methods}>
            <ErpSelect
              name="create-skill-select"
              nolabel={true}
              options={state.tempSkill}
              components={{ Option }}
              isClearable={false}
              allowCreate={true}
              onCreateOption={onCreateOption}
              menuIsOpen={state.menuIsOpen}
              useForm={methods}
              onMenuOpen={onMenuOpen}
              onMenuClose={onMenuClose}
            />
          </FormProvider>

          <div>
            <Fragment>{renderNewSkill()}</Fragment>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="p-1 pb-50 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="w-100 m-0">
          <Button.Ripple
            type="submit"
            color="primary"
            block
            disabled={state.submitting}>
            {state.submitting && <Spinner size="sm" className="me-50" />}
            {useFormatMessage("app.save")}
          </Button.Ripple>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default CreateSkillModal
