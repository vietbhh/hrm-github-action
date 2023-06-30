// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useForm, FormProvider } from "react-hook-form"
import { workspaceApi } from "../../../common/api"
import { useNavigate } from "react-router-dom"
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
// ** Components
import WorkspaceForm from "../../detail/CreateWorkspace/WorkspaceForm"
import WorkspaceCover from "../../detail/CreateWorkspace/WorkspaceCover"
import notification from "@apps/utility/notification"

const CreateWorkgroupModal = (props) => {
  const {
    // ** props
    modal,
    // ** methods
    handleModal
  } = props

  const [state, setState] = useMergedState({
    submitting: false,
    image: ""
  })

  const navigate = useNavigate()

  const methods = useForm()
  const { handleSubmit } = methods

  const setImage = (data) => {
    setState({
      image: data
    })
  }

  const onSubmit = (values) => {
    setState({
      submitting: true
    })

    workspaceApi
      .save({
        ...values,
        image: state.image
      })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        methods.reset({})
        handleModal()

        setTimeout(() => {
          navigate(`/workspace/${res.data._id}`)
        }, 500)
      })
      .catch((err) => {
        setState({
          submitting: false
        })
        notification.showError({
          text: useFormatMessage("notification.save.success")
        })
      })
  }

  // ** render
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="create-workgroup-modal"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.workspace.display.create_workgroup")}
      </ModalHeader>
      <ModalBody>
        <FormProvider {...methods}>
          <div className="mb-25 mt-75">
            <WorkspaceCover
              src=""
              dataSave={{}}
              isEditable={false}
              saveCoverImageApi=""
              setImage={setImage}
            />
          </div>
          <div className="p-1">
            <WorkspaceForm methods={methods} />
          </div>
        </FormProvider>
      </ModalBody>
      <ModalFooter className="p-1 pb-50 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="w-100 m-0">
          <Button.Ripple
            type="submit"
            color="primary"
            block
            disabled={state.submitting}>
            {state.submitting && <Spinner size="sm" className="me-50" />}
            {useFormatMessage("app.create")}
          </Button.Ripple>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default CreateWorkgroupModal
