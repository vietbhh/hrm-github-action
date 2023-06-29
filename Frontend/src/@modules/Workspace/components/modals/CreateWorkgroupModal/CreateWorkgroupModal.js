// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useForm, FormProvider } from "react-hook-form"
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
import WorkspaceForm from "../../detail/CreateWorkspace/WorkspaceForm"
import WorkspaceCover from "../../detail/CreateWorkspace/WorkspaceCover"
import CoverImage from "../../detail/CoverImage"

const CreateWorkgroupModal = (props) => {
  const {
    // ** props
    modal,
    // ** methods
    handleModal
  } = props

  const methods = useForm()
  const { handleSubmit } = methods

  const onSubmit = (values) => {}

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
          <div className="mb-1 mt-75">
            <WorkspaceCover
              src=""
              dataSave={{}}
              isEditable={false}
              saveCoverImageApi=""
            />
          </div>
          <div className="p-1">
            <WorkspaceForm methods={methods} />
          </div>
        </FormProvider>
      </ModalBody>
      <ModalFooter className="pb-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-100">
          <Button.Ripple type="submit" color="primary" block>
            {useFormatMessage("app.create")}
          </Button.Ripple>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default CreateWorkgroupModal
