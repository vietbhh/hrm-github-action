import Editor from "@apps/components/common/Editor"
import {
  ErpInput,
  ErpSelect,
  ErpSwitch
} from "@apps/components/common/ErpField"
import {
  stringInject,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { commonApi } from "@apps/utility/commonApi"
import { isUndefined } from "@apps/utility/handleData"
import "@styles/react/libs/editor/editor.scss"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
const RejectedActionModal = (props) => {
  const {
    modal,
    toggleModal,
    onClosed,
    modalProps,
    onSubmit,
    mailContentReplace,
    candidate,
    rejection_reason_options
  } = props
  const replaceData = {
    ...mailContentReplace
  }

  const [state, setState] = useMergedState({
    submitting: false,
    mailContentTemplate: "",
    mailContent: ""
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue, watch } = methods
  const submitFrm = (values) => {
    const data = {
      ...values,
      mailContent: state.mailContent,
      mailTo: candidate.candidate_email,
      candidate: candidate.id,
      rejection_reason_name: values.rejection_reason?.label
    }
    onSubmit(data)
  }

  const getTemplates = () => {
    commonApi
      .getMailTemplates(
        {
          source: "rejected"
        },
        true
      )
      .then((res) => {
        setState({
          mailTemplates: res.data
        })
      })
  }

  useEffect(() => {
    getTemplates()
  }, [])

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        onClosed={onClosed}
        toggle={toggleModal}
        backdrop={"static"}
        className="modal-lg"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        {...modalProps}>
        <ModalHeader toggle={() => toggleModal()}>
          {useFormatMessage("modules.candidates.actions.rejected.title")}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <div className="row">
              <div className="col-md-12">
                <ErpSelect
                  name="rejection_reason"
                  id="rejection_reason"
                  options={rejection_reason_options}
                  label={useFormatMessage(
                    "modules.candidates.fields.rejection_reason"
                  )}
                  useFormatMessageLabel={true}
                  useForm={methods}
                  required
                />
              </div>
              <div className="col-md-12">
                <ErpSwitch
                  name="send_mail"
                  id="send_mail"
                  inline
                  label={useFormatMessage(
                    "modules.candidates.actions.rejected.fields.send_mail"
                  )}
                  useForm={methods}
                  defaultChecked={true}
                />
              </div>
              {(isUndefined(watch("send_mail")) || watch("send_mail")) && (
                <Fragment>
                  <div className="col-md-12">
                    <ErpSelect
                      name="template"
                      id="template"
                      options={state.mailTemplates}
                      label={useFormatMessage(
                        "modules.candidates.actions.rejected.fields.template"
                      )}
                      useForm={methods}
                      onChange={(val) => {
                        setValue("template", val)
                        setValue(
                          "subject",
                          stringInject(val.subject, replaceData)
                        )
                        const content = stringInject(val.content, replaceData)
                        setState({
                          mailContentTemplate: content,
                          mailContent: content
                        })
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <ErpInput
                      name="to"
                      id="to"
                      label={useFormatMessage(
                        "modules.candidates.actions.rejected.fields.to"
                      )}
                      defaultValue={candidate.candidate_email}
                      readOnly
                    />
                  </div>
                  <div className="col-12">
                    <ErpInput
                      name="subject"
                      id="subject"
                      label={useFormatMessage(
                        "modules.candidates.actions.rejected.fields.subject"
                      )}
                      useForm={methods}
                      required={
                        isUndefined(watch("send_mail")) || watch("send_mail")
                      }
                    />
                  </div>
                  <div className="col-md-12">
                    <Editor
                      defaultValue={state.mailContentTemplate}
                      onDataChange={(data) => {
                        setState({
                          mailContent: data
                        })
                      }}
                      toolbar={{
                        options: [
                          "inline",
                          "list",
                          "textAlign",
                          "colorPicker",
                          "link"
                        ],
                        inline: {
                          inDropdown: false,
                          options: ["bold", "italic", "underline"]
                        }
                      }}
                    />
                  </div>
                </Fragment>
              )}
            </div>
          </ModalBody>
          <form onSubmit={handleSubmit(submitFrm)}>
            <ModalFooter>
              <Button type="submit" color="primary" disabled={state.submitting}>
                {state.submitting && <Spinner size="sm" className="mr-50" />}
                {useFormatMessage("button.confirm")}
              </Button>
              <Button color="flat-danger" onClick={() => toggleModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </Fragment>
  )
}

RejectedActionModal.defaultProps = {
  modal: false,
  toggleModal: () => {},
  onClosed: () => {},
  modalProps: {}
}

export default RejectedActionModal
