// ** React Imports
import { useMergedState, useFormatMessage } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { defaultModuleApi } from "@apps/utility/moduleApi"
// ** Styles
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import notification from "@apps/utility/notification"

const CreateMeetingRoomModal = (props) => {
  const {
    // ** props
    modal,
    idEdit,
    filter,
    // ** methods
    setFilter,
    handleModal,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    submitting: false,
    dataEdit: {}
  })

  const methods = useForm()
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    setState({
      submitting: true
    })

    const saveData = {
      ...values
    }
    if (idEdit !== 0) {
      saveData["id"] = idEdit
    } else {
      saveData["status"] = true
    }

    defaultModuleApi
      .postSave("meeting_room", saveData)
      .then((res) => {
        handleModal()
        if (filter.page === 1) {
          loadData()
        } else {
          setFilter({
            page: 1
          })
        }
      })
      .catch((err) => {
        notification.showError()
      })
  }

  // ** effect
  useEffect(() => {
    if (modal === true) {
      if (idEdit !== 0) {
        defaultModuleApi
          .getDetail("meeting_room", idEdit)
          .then((res) => {
            setState({
              dataEdit: res.data.data,
              loading: false
            })
          })
          .catch((err) => {
            setState({
              dataEdit: {},
              loading: false
            })
          })
      } else {
        setState({
          dataEdit: {},
          loading: false
        })
      }
    }
  }, [modal, idEdit])

  // ** render
  const renderBody = () => {
    if (state.loading === true) {
      return (
        <div className="loading-div">
          <AppSpinner />
        </div>
      )
    }

    return (
      <div className="fields-section mb-2 mt-1">
        <ErpInput
          name="name"
          label={useFormatMessage("modules.meeting_room.fields.name")}
          required
          defaultValue={state.dataEdit?.name}
          useForm={methods}
        />
      </div>
    )
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="modal-dialog-centered feed modal-create-post modal-create-event modal-custom-repeat modal-create-meeting-room"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <span className="text-title">
          {useFormatMessage("modules.meeting_room.buttons.create")}
        </span>
        <div className="div-btn-close" onClick={() => handleModal()}>
          <i className="fa-regular fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalBody>
        <Fragment>{renderBody()}</Fragment>
        <div className="pt-50 footer-section">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button.Ripple
              type="submit"
              className="w-100 save-btn"
              disabled={state.loading || state.submitting}>
              {idEdit === true
                ? useFormatMessage("button.update")
                : useFormatMessage("button.save")}
            </Button.Ripple>
          </form>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default CreateMeetingRoomModal
