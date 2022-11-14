// ** React Imports
import { FormProvider, useForm } from "react-hook-form"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
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
  Row,
  Spinner
} from "reactstrap"
import { useEffect } from "react"
// ** Components

const AddFolderModal = (props) => {
  const {
    modal,
    parentFolder,
    handleModal,
    loadData,
    metas,
    options,
    optionsModules,
    module,
    fillData,
    isEditModal,
    moduleName
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    modalData: {}
  })

  const modalTitle = isEditModal ? useFormatMessage("modules.documents.modal.title.edit_folder") : useFormatMessage("modules.documents.modal.title.new_folder")

  // ** Form handle
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState } = methods

  const onSubmit = (values) => {
    setState({ loading: true })
    if (isEditModal !== true) {
      values.parent = parentFolder === undefined ? 0 : parentFolder
      DocumentApi.postSaveDocument(values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          loadData()
          setState({ loading: false })
          handleModal()
        })
        .catch((err) => {
          setState({ loading: false })
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
          handleModal()
        })
    } else {
      DocumentApi.postEditDocument(fillData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.edit.success")
          })
          loadData()
          setState({ loading: false })
          handleModal()
        })
        .catch((err) => {
          notification.showSuccess({
            text: useFormatMessage("notification.edit.error")
          })
          loadData()
          setState({ loading: false })
          handleModal()
        })
    }
  }

  useEffect(() => {
    if (isEditModal === true && modal === true) {
      setState({
        loading: true
      })
      defaultModuleApi.getDetail(moduleName, fillData.id).then((res) => {
        setState({
          loading: false,
          modalData: res.data.data
        })
      })
    } else {
      setState({
        modalData: {}
      })
    }
  }, [modal])

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
        <ModalHeader toggle={() => handleModal()}>{modalTitle}</ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <Row className="mt-2">
              <Col sm={12} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.name
                  }}
                  useForm={methods}
                  updateData={state.modalData?.name}
                />
              </Col>
              <Col sm={12} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.description
                  }}
                  useForm={methods}
                  updateData={state.modalData?.description}
                />
              </Col>
            </Row>
          </ModalBody>
        </FormProvider>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
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
          </ModalFooter>
        </form>
      </Modal>
    )
  }

  return !state.loading && renderModal()
}

export default AddFolderModal
AddFolderModal.defaultProps = {
  loading: false,
  modalData: {}
}
