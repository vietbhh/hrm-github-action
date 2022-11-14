import { ChecklistApi } from "@modules/Checklist/common/api"
import {
  useFormatMessage,
  useMergedState,
  formatDate
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap"
import { Fragment, useEffect, useState } from "react"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { defaultModuleApi } from "@apps/utility/moduleApi"

const RevertTaskModal = (props) => {
  const {
    isMyTask,
    currentChecklistIndex,
    data,
    modal,
    moduleName,
    handleModal,
    loadData,
    setData,
    setChecklistDetailData
  } = props
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods
  const [state, setState] = useMergedState({
    loading: false,
    modalData: {}
  })
  const onSubmit = (values) => {
    values.checklist_detail_id = data.id
    values.task_type = state.modalData.task_type
    values.checklist_id = state.modalData.checklist_id
    ChecklistApi.postRevertChecklistDetail(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.update.success")
        })
        handleCancelModal()
        if (isMyTask) {
          loadData()
        } else {
          setData(currentChecklistIndex, res.data.info_checklist)
          setChecklistDetailData(data.id, res.data.info_checklist_detail)
        }
        setState({ loading: false })
      })
      .catch((err) => {
        handleCancelModal()
        notification.showError({
          text: useFormatMessage("notification.update.error")
        })
        setState({ loading: false })
      })
  }

  const loadChecklistInfo = () => {
    setState({ loading: true })
    defaultModuleApi.getDetail(moduleName, data.id).then((res) => {
      setState({
        loading: false,
        modalData: res.data.data
      })
    })
  }

  const handleCancelModal = () => {
    document.body.style.overflow = "scroll"
    handleModal()
  }

  // ** effect
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden"
    }
  }, [modal])

  useEffect(() => {
    if (modal === true) {
      loadChecklistInfo()
    }
  }, [modal])

  // ** render
  const renderModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="complete-task-modal"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        d={{ timeout: 100 }}>
        <ModalBody>
          <h3>Revert to in progress?</h3>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            <Button.Ripple type="submit" color="primary">
              OK
            </Button.Ripple>
            <Button.Ripple
              color="flat-danger"
              onClick={() => handleCancelModal()}>
              {useFormatMessage("button.cancel")}
            </Button.Ripple>
          </ModalFooter>
        </form>
      </Modal>
    )
  }

  return !state.loading && renderModal()
}

export default RevertTaskModal
RevertTaskModal.defaultProps = {
  loading: false,
  modalData: {}
}
