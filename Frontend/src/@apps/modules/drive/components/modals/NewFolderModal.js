// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useForm, FormProvider } from "react-hook-form"
import { driveApi } from "../../common/api"
import { useParams } from "react-router-dom"
// ** redux
import { useDispatch, useSelector } from "react-redux"
import {
  toggleModalNewFolder,
  setListFolder,
  setReloadPage
} from "../../common/reducer/drive"
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
import { ErpInput } from "@apps/components/common/ErpField"
import notification from "@apps/utility/notification"

const NewFolderModal = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  const driveState = useSelector((state) => state.drive)
  const { modalNewFolder, listFolder } = driveState

  const dispatch = useDispatch()

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit, formState, reset } = methods

  const { id } = useParams()

  const handleModal = () => {
    dispatch(toggleModalNewFolder())
  }

  const onSubmit = (values) => {
    setState({
      loading: true
    })

    values.parent = id === undefined ? 0 : id
    driveApi
      .createDriveFolder(values)
      .then((res) => {
        notification.showSuccess()
        handleModal()

        if (res.data.data !== undefined) {
          const newListFolder = [...listFolder, res.data.data]
          dispatch(setListFolder(newListFolder))
          dispatch(setReloadPage(true))
        }
      })
      .catch((err) => {
        notification.showError()
      })
  }

  // ** render
  return (
    <Modal
      isOpen={modalNewFolder}
      toggle={() => handleModal()}
      className="drive-modal drive-new-folder-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      centered>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.drive.buttons.new_folder")}
      </ModalHeader>
      <ModalBody>
        <FormProvider {...methods}>
          <Row>
            <Col sm={12}>
              <ErpInput
                label={useFormatMessage("modules.drive_folders.fields.name")}
                name="name"
                type="text"
                required={true}
                placeholder={useFormatMessage(
                  "modules.drive_folders.fields.name"
                )}
                useForm={methods}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <ErpInput
                label={useFormatMessage(
                  "modules.drive_folders.fields.description"
                )}
                name="description"
                type="textarea"
                placeholder={useFormatMessage(
                  "modules.drive_folders.fields.description"
                )}
                useForm={methods}
              />
            </Col>
          </Row>
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)} className="w-100">
          <Button.Ripple
            className="w-100 btn-custom-primary"
            type="submit"
            disabled={
              state.loading || formState.isSubmitting || formState.isValidating
            }>
            {useFormatMessage("modules.drive.buttons.save")}
          </Button.Ripple>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default NewFolderModal
