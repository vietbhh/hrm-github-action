import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
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
import { recruitmentsApi } from "../../common/api"
const AssignJobModal = (props) => {
  const {
    idCandidate,
    modal,
    handleModal,
    loadData,
    options,
    typeCoppy,
    dataDetail,
    handleDetail
  } = props
  const [state, setState] = useMergedState({
    loading: false,
    filesend: { cv: null, candidate_avatar: "" }
  })

  const arrFields = useSelector(
    (state) => state.app.modules["candidates"].metas
  )
  const optionsArr = useSelector(
    (state) => state.app.modules["candidates"].options
  )
  const onSubmit = (values) => {
    //  setState({ loading: true });
    const data = { ...values }
    data.id = idCandidate
    if (typeCoppy) {
      data.isCoppy = true
    }
    const currentJob = dataDetail.recruitment_proposal?.value
    const newJob = data.recruitment_proposal?.value
    if (currentJob === newJob) {
      notification.showError({
        text: useFormatMessage("modules.candidates.text.job_exist_email")
      })
      return
    }

    recruitmentsApi
      .checkExistJob({
        id: idCandidate,
        job: values.recruitment_proposal?.value
      })
      .then((res) => {
        recruitmentsApi
          .saveCandidate(data)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
            handleModal()
            if (!typeCoppy) {
              dataDetail.recruitment_proposal = data.recruitment_proposal
            }

            setState({
              loading: false
            })
            loadData()
            handleDetail({ id: idCandidate }, true)
          })
          .catch((err) => {
            setState({ loading: false })
            notification.showError({
              text: useFormatMessage("notification.save.error")
            })
          })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("modules.candidates.text.job_exist_email")
        })
      })
  }
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const fieldJob = {
    module: "candidates",
    fieldData: {
      ...arrFields.recruitment_proposal
    },
    useForm: methods,
    options
  }

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      size="sm"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.candidates.text.assign_job")}
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-1">
            <Col sm={12}>
              <FieldHandle nolabel {...fieldJob} />
            </Col>
          </Row>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              disabled={state.loading}
              className="mr-2">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              {useFormatMessage("modules.candidates.button.assign")}
            </Button>
            <Button
              className="btn-cancel"
              color="flat-danger"
              onClick={() => handleModal(false)}>
              {useFormatMessage("button.cancel")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default AssignJobModal
