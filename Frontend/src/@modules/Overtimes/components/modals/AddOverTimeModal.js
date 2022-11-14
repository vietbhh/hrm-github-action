// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { overtimeApi } from "../../common/api"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import moment from "moment"
// ** Styles
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
import { Space } from "antd"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"

const AddOverTimeModal = (props) => {
  const {
    // ** props
    modal,
    isEditModal,
    modalData,
    moduleName,
    metas,
    options,
    optionsModules,
    // ** methods
    handleModal,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    modalTitle: useFormatMessage("modules.overtimes.buttons.new_overtime"),
    data: {}
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, getValues, setValue, reset, watch } = methods

  const onSubmit = (values) => {
    setState({
      loading: true
    })
    if (isEditModal === true) {
      overtimeApi
        .updateOvertime(modalData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          handleModal()
          setState({
            loading: false
          })
          loadData()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.update.error")
          })
          setState({
            loading: false
          })
        })
    } else {
      overtimeApi
        .createOvertime(values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.create.success")
          })
          handleModal()
          setState({
            loading: false
          })
          loadData()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.create.error")
          })
          setState({
            loading: false
          })
        })
    }
  }

  const loadDetailOvertime = () => {
    defaultModuleApi
      .getDetail("overtimes", modalData.id)
      .then((res) => {
        const resData = res.data.data
        resData.from_date = moment(resData.from_date)
        resData.to_date = moment(resData.to_date)
        reset(res.data.data)
      })
      .catch((err) => {})
  }

  // ** effect
  useEffect(() => {
    if (modal === true && isEditModal === true) {
      loadDetailOvertime()
    }
  }, [modal, isEditModal])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && (name === "from_time" || name === "to_time")) {
        const fromTime = value.from_time
        const toTime = value.to_time
        if (fromTime !== undefined && toTime !== undefined) {
          const duration = moment.duration(toTime.diff(fromTime))
          const totalTime = (duration.asSeconds() + 1) / (60 * 60)
          setValue("total_time", totalTime)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // ** render
  const renderModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>
          {state.modalTitle}
        </ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            <Row className="mt-2">
              <Col sm={6} className="">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.date
                  }}
                  useForm={methods}
                  required
                />
              </Col>
              <Col sm={3} className="">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.from_time
                  }}
                  useForm={methods}
                  required
                />
              </Col>
              <Col sm={3} className="">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.to_time
                  }}
                  useForm={methods}
                  required
                />
              </Col>
            </Row>
            <Row className="">
              <Col sm={12} className="">
                <FieldHandle
                  module={moduleName}
                  defaultValue={state.totalTime}
                  fieldData={{
                    ...metas.total_time
                  }}
                  readOnly={true}
                  useForm={methods}
                />
              </Col>
            </Row>
            <Row className="">
              <Col sm={12} className="">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.employee
                  }}
                  isMulti={true}
                  useForm={methods}
                  optionsModules={optionsModules}
                  required
                />
              </Col>
            </Row>
            <Row className="">
              <Col sm={12} className="">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.send_to
                  }}
                  isMulti={true}
                  useForm={methods}
                  optionsModules={optionsModules}
                  required
                />
              </Col>
            </Row>
            <Row className="">
              <Col sm={12} className="">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.note
                  }}
                  useForm={methods}
                />
              </Col>
            </Row>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space>
              <Button
                type="submit"
                color="primary"
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {(state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating) && (
                  <Spinner size="sm" className="me-50" />
                )}
                {isEditModal
                  ? useFormatMessage("app.update")
                  : useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </Space>
          </form>
        </ModalFooter>
      </Modal>
    )
  }

  return <Fragment>{renderModal()}</Fragment>
}

export default AddOverTimeModal
