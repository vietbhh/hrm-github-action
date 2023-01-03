// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useForm, FormProvider } from "react-hook-form"
import { driveApi } from "@apps/modules/drive/common/api"
import { getItemType } from "@apps/modules/drive/common/common"
// ** redux
import { useDispatch, useSelector } from "react-redux"
import drive, {
  toggleModalShare
} from "@apps/modules/drive/common/reducer/drive"
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
import ShareModalBody from "./ShareModalBody"
import notification from "@apps/utility/notification"

const ShareFileAndFolderDriveModal = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    loadingSubmit: false,
    shareType: 0,
    chosenUser: {}
  })

  const driveState = useSelector((state) => state.drive)
  const { modalShare, modalDataShare } = driveState

  const dispatch = useDispatch()

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit, formState, reset } = methods

  const handleModal = () => {
    dispatch(toggleModalShare())
  }

  const setChosenUser = (data) => {
    const index = data.key_id

    if (state.chosenUser[index] !== undefined) {
      state.chosenUser[index] = data
      return false
    }

    const newChosenUser = {
      ...state.chosenUser,
      [index]: data
    }

    setState({
      chosenUser: newChosenUser
    })
  }

  const setShareType = (value) => {
    setState({
      shareType: value
    })
  }

  const onSubmit = (values) => {
    setState({
      loadingSubmit: true
    })

    driveApi
      .shareFileAndFolder({
        item: { ...modalDataShare },
        share_type: state.shareType,
        data: { ...values }
      })
      .then((res) => {
        notification.showSuccess()
        setState({
          loadingSubmit: false
        })
        handleModal()
      })
      .catch((err) => {
        notification.showError()
        setState({
          loadingSubmit: false
        })
      })
  }

  const loadFileAndFolderPermission = () => {
    setState({
      loading: true
    })

    driveApi
      .getFileAndFolderPermission({
        id: modalDataShare?.id,
        type: modalDataShare?.type
      })
      .then((res) => {
        setState({
          shareType: parseInt(res.data.share_type),
          chosenUser: res.data.chosen_user,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          shareType: 0,
          chosenUser: {},
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    if (modalShare === true) {
      loadFileAndFolderPermission()
    }
  }, [modalShare])

  // ** render
  const renderShareModalBody = () => {
    return (
      <ShareModalBody
        shareType={state.shareType}
        chosenUser={state.chosenUser}
        methods={methods}
        setChosenUser={setChosenUser}
        setShareType={setShareType}
      />
    )
  }

  return (
    <Modal
      isOpen={modalShare}
      toggle={() => handleModal()}
      className="drive-modal drive-share-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      centered>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.drive.text.share_file_and_folder", {
          name: modalDataShare.name
        })}
      </ModalHeader>
      <ModalBody>
        <FormProvider {...methods}>
          <Fragment>{renderShareModalBody()}</Fragment>
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)} className="w-100">
          <div className="w-100 d-flex align-items-center justify-content-end">
            <Button.Ripple
              type="button"
              className="me-50 btn-custom-primary-outline">
              {useFormatMessage("modules.drive.buttons.get_link")}
            </Button.Ripple>
            <Button.Ripple
              type="submit"
              className="btn-custom-primary"
              disabled={state.loadingSubmit}>
              {useFormatMessage("modules.drive.buttons.save")}
            </Button.Ripple>
          </div>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default ShareFileAndFolderDriveModal
