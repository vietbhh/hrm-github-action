import {
  sortFieldsDisplay,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { isArray } from "@apps/utility/handleData"
import notification from "@apps/utility/notification"
import AvatarBox from "@modules/Employees/components/detail/AvatarBox"
import { isEmpty, toArray } from "lodash-es"
import React, { Fragment } from "react"
import { useDropzone } from "react-dropzone"
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
const AddCandidateModal = (props) => {
  const {
    modal,
    handleNewRe,
    handleModal,
    loadData,
    metas,
    options,
    module,
    idJob,
    updateData
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

  /* drop cv */

  const RenderCV = () => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
      accept: ".pdf,.docx",
      maxFiles: 1,
      onDrop: (files) => setFile(files)
    })
    if (!isEmpty(state.filesend.cv)) {
      loadCV()
      return (
        <div className="dropzone drag-cv  drop-cv-candidate mb-2">
          <div className="file-cv align-self-center">
            <div className="d-flex justify-content-center">
              <i className="fad fa-file-pdf mt-2"></i>
              <i className="fa fa-times-circle" onClick={() => deleteCV()}></i>
            </div>
            <p className="name-cv">{state.filesend.cv[0].name}</p>
          </div>
        </div>
      )
    } else {
      return (
        <section>
          <div
            className="drag-cv drop-cv-candidate dropzone d-flex mb-2"
            {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="align-self-center">
              <i className="fal fa-cloud-upload-alt"></i>
              <p>{useFormatMessage("modules.candidates.text.drop_file")}</p>
            </div>
          </div>
        </section>
      )
    }
  }
  const deleteCV = () => {
    setState({
      filesend: { ...state.filesend, cv: null }
    })
  }
  const setFile = (file) => {
    setState({
      filesend: { ...state.filesend, cv: file }
    })
  }
  const loadCV = () => {
    recruitmentsApi.loadCV(state.filesend.cv[0]).then((res) => {
      const value = res.data
    })
  }
  const onSubmit = (values) => {
    //  setState({ loading: true });
    const data = { ...values, ...state.filesend }
    if (idJob) data.stage = 1

    recruitmentsApi
      .checkExistJob({
        email: data.candidate_email,
        job: data.recruitment_proposal?.value
      })
      .then((res) => {
        recruitmentsApi
          .saveCandidate(data)
          .then((res) => {
            notification.showSuccess(
              useFormatMessage("notification.save.success")
            )
            handleNewRe()
            loadData()
            setState({
              loading: false,
              filesend: { cv: null, candidate_avatar: null }
            })
          })
          .catch((err) => {
            setState({ loading: false })
            notification.showError(useFormatMessage("notification.save.error"))
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
  const dataFields = isArray(arrFields) ? arrFields : toArray(arrFields)
  const { handleSubmit, errors, control, register, reset, setValue } = methods
  const fieldNoteProps = {
    module: "candidates",
    fieldData: arrFields.candidate_note,
    useForm: methods,
    options
  }

  const fieldSkillProps = {
    module: "candidates",
    fieldData: arrFields.skills,
    useForm: methods,
    options
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleNewRe()}
      className="new-modal"
      backdrop={"static"}
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleNewRe()}>
        <span className="title-icon align-self-center">
          <i className="fad fa-user-plus"></i>
        </span>{" "}
        <span className="ms-1">
          {useFormatMessage("modules.candidates.title.addnew")}
        </span>
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-2">
            <Col sm={3} className="d-flex justify-content-center">
              <AvatarBox
                currentAvatar={""}
                readOnly={""}
                handleSave={(img) => {
                  setState({
                    filesend: {
                      ...state.filesend,
                      candidate_avatar: img
                    }
                  })
                }}
              />
            </Col>
            <Col sm={9}>
              <RenderCV />
              <span className="file-format">
                {useFormatMessage("modules.candidates.text.file_format")}
              </span>
            </Col>
          </Row>
          <Row className="mt-2 form-add">
            <Col sm={12} className="mb-1">
              <span className="title-info">
                {useFormatMessage("modules.candidates.fields.personal")}
              </span>
            </Col>

            {dataFields
              .filter((field) => field.field_form_show && field.field_enable)
              .sort((a, b) => {
                return sortFieldsDisplay(a, b)
              })
              .map((field, key) => {
                const options = optionsArr
                const fieldProps = {
                  module: "candidates",
                  fieldData: field,
                  useForm: methods,
                  options
                }
                const nameField = field.field
                return (
                  <Col
                    sm={field.field_form_col_size}
                    className="mb-1"
                    key={key}>
                    <Fragment>
                      <FieldHandle
                        label={useFormatMessage(
                          "modules.candidates.fields." + field.field
                        )}
                        {...fieldProps}
                        updateData={updateData?.[nameField]}
                        readOnly={idJob && nameField === "recruitment_proposal"}
                      />
                    </Fragment>
                  </Col>
                )
              })}
            <Col sm={12}>
              <span className="title-info">
                {useFormatMessage("modules.candidates.fields.skills")}
              </span>
              <FieldHandle nolabel {...fieldSkillProps} />
            </Col>

            <Col sm={12}>
              <span className="title-info">
                {useFormatMessage("modules.candidates.fields.candidate_note")}
              </span>
              <Fragment>
                <FieldHandle
                  nolabel
                  rows="4"
                  label={useFormatMessage(
                    "modules.candidates.fields.candidate_note"
                  )}
                  {...fieldNoteProps}
                />
              </Fragment>
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
              {useFormatMessage("button.createnew")}
            </Button>
            <Button
              className="btn-cancel"
              color="flat-danger"
              onClick={() => handleNewRe()}>
              {useFormatMessage("button.cancel")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default AddCandidateModal
