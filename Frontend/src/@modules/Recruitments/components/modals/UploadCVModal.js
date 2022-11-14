// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { recruitmentsApi } from "@modules/Recruitments/common/api"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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
import CVDragger from "../form/CVDragger"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"

const UploadCVModal = (props) => {
  const {
    // ** props
    modal,
    metas,
    moduleName,
    // ** methods
    handleModal,
    setState,
    jobUpdate
  } = props
  const methods = useForm({
    mode: "onSubmit"
  })
  const { getValues, setError, clearErrors, formState, handleSubmit } = methods

  const [loading, setLoading] = useState(null)
  const [listFile, setListFile] = useState([])

  const handlePreview = (values) => {
    if (listFile.length > 0) {
      loadEmployeeEmail()
      setLoading(true)
      const recruitmentProposal = getValues("recruitment_proposal")
      if (recruitmentProposal === null || recruitmentProposal === "") {
        setError("recruitment_proposal", {
          type: "custom",
          message: useFormatMessage("modules.candidates.text.required_job")
        })
        return
      } else {
        clearErrors("recruitment_proposal")
      }

      const values = {
        list_file: listFile,
        recruitment_proposal: recruitmentProposal
      }
      recruitmentsApi
        .loadContentCV(values)
        .then((res) => {
          handleModal()
          setState({
            listCVUpload: { ...res.data.list_cv_content },
            listFileCV: listFile,
            recruitmentProposal: recruitmentProposal,
            showPreviewCV: true
          })
          setListFile([])
          setLoading(false)
        })
        .catch((err) => {
          handleModal()
          notification.showError()
          setState({
            listCVUpload: {},
            listFileCV: [],
            recruitmentProposal: {},
            showPreviewCV: false
          })
          setListFile([])
          setLoading(false)
        })
    }
  }

  const handleCancel = () => {
    handleModal()
    setListFile([])
  }

  const loadEmployeeEmail = () => {
    const idJob = getValues("recruitment_proposal")
    if (idJob) {
      recruitmentsApi.loadEmployeeEmail([idJob?.value]).then((res) => {
        setState({
          listEmployeeEmail: res.data
        })
      })
    }
  }

  // ** effect
  useEffect(() => {
    loadEmployeeEmail()
  }, [])

  // ** render
  const renderCVDragger = () => {
    return (
      <CVDragger
        showNumberFileSelected={true}
        autoUpload={false}
        listCVUpload={listFile}
        setListFile={setListFile}
        setState={setState}
      />
    )
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="new-profile-modal upload-cv-modal"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.candidates.title.upload_cv")}
      </ModalHeader>
      <ModalBody>
        <Row className="mt-2">
          <Col sm={12} className="mb-25">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.recruitment_proposal
              }}
              useForm={methods}
              updateData={jobUpdate}
              isClearable={false}
              readOnly={jobUpdate && true}
              required
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col sm={12} className="mb-25">
            {renderCVDragger()}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(handlePreview)}>
          <Space>
            <Button
              type="submit"
              color="primary"
              disabled={
                loading || formState.isSubmitting || formState.isValidating
              }>
              {(loading ||
                formState.isSubmitting ||
                formState.isValidating) && (
                <Spinner size="sm" className="me-50" />
              )}
              {useFormatMessage("modules.candidates.button.preview_cv")}
            </Button>
            <Button
              type="button"
              color="flat-danger"
              onClick={() => handleCancel()}>
              {useFormatMessage("button.cancel")}
            </Button>
          </Space>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default UploadCVModal
