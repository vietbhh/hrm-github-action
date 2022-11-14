// ** React Imports
import { FormProvider, useForm } from "react-hook-form"
import {
  useFormatMessage,
  useMergedState,
  getOptionValue
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { DocumentApi } from "@modules/Documents/common/api"
import { defaultModuleApi } from "@apps/utility/moduleApi"
// ** Styles
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap"
import { Fragment, useEffect } from "react"
import { Space } from "antd"
// ** Components
import notification from "@apps/utility/notification"
import { ErpRadio, ErpSwitch } from "@apps/components/common/ErpField"

const ShareModal = (props) => {
  const {
    // ** props
    modal,
    metas,
    options,
    optionsModules,
    module,
    moduleName,
    fillData,
    // ** methods
    handleModal,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    modalData: {},
    shareOption: 0,
    department: [],
    office: [],
    employeeGroups: [],
    chosenShareOption: {}
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, watch, reset } = methods
  const onSubmit = (values) => {
    setState({ loading: true })
    values.share_type = state.shareOption
    DocumentApi.postShareDocument(fillData.id, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.update.success")
        })
        loadData()
        setState({ loading: false })
        handleModal()
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.update.error")
        })
        handleModal()
      })
  }

  const loadModalData = () => {
    setState({ loading: true })
    DocumentApi.getInfoDocument(fillData.id).then((res) => {
      setState({
        loading: false,
        modalData: res.data.data
      })
    })
  }

  // ** effect
  useEffect(() => {
    if (modal === true) {
      loadModalData()
    }
  }, [modal])

  useEffect(() => {
    const defaultShareOption =
      state.modalData?.share_type?.value !== undefined
        ? state.modalData?.share_type?.value
        : getOptionValue(options, "share_type", "everyone", false)

    setState({
      shareOption: defaultShareOption
    })
  }, [state.modalData])

  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (type === "change") {
        setState({
          shareOption: value.share_type
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [methods.watch])

  useEffect(() => {
    if (modal === true) {
      reset({
        share_type: state.shareOption,
        office: state.modalData?.office,
        department: state.modalData?.department,
        employee: state.modalData?.employee
      })
    }
  }, [modal, state.modalData, state.shareOption])

  // ** render
  const renderShareOptions = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center justify-content-between">
          {options.share_type.map((item, index) => {
            return (
              <div
                className="d-flex align-items-center"
                key={`share_type${index}`}>
                <ErpRadio
                  name="share_type"
                  value={item.value}
                  className="me-50"
                  useForm={methods}
                />
                <span>{useFormatMessage(item.label)}</span>
              </div>
            )
          })}
        </div>
      </Fragment>
    )
  }

  const renderShareContent = () => {
    switch (state.shareOption) {
      case getOptionValue(options, "share_type", "everyone", false): // ** everyone
        return <></>
      case getOptionValue(options, "share_type", "department", false): // ** department
        return (
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.department,
              field_options: {
                multiple: true
              }
            }}
            nolabel
            useForm={methods}
            optionsModules={optionsModules}
            multiple={true}
          />
        )
      case getOptionValue(options, "share_type", "offices", false): // ** offices
        return (
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.office,
              field_options: {
                multiple: true
              }
            }}
            nolabel
            useForm={methods}
            optionsModules={optionsModules}
            multiple={true}
          />
        )
      case getOptionValue(options, "share_type", "employee", false): // ** employee
        return (
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.employee,
              field_options: {
                multiple: true
              }
            }}
            nolabel
            useForm={methods}
            optionsModules={optionsModules}
            multiple={true}
          />
        )
    }
  }

  const renderModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal"
        backdrop={"static"}
        size="lg">
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("modules.documents.modal.title.share")}
        </ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            <Row className="mt-2">
              <Col sm={12} className="mb-25">
                {renderShareOptions()}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col sm={12} className="mb-25">
                {renderShareContent()}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col sm={12} className="d-flex align-items-center">
                <p className=" me-1">
                  {useFormatMessage(
                    "modules.documents.fields.sharing_permission_recursively"
                  )}
                </p>
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.sharing_permission_recursively
                  }}
                  nolabel
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
                {useFormatMessage("modules.documents.buttons.share")}
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

  return !state.loading && renderModal()
}

export default ShareModal
ShareModal.defaultProps = {
  loading: false,
  modalData: {}
}
