import { ErpUserSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import "@core/scss/react/libs/flatpickr/flatpickr.scss"
import { timeoffApi } from "@modules/TimeOff/common/api"
import "@styles/react/libs/editor/editor.scss"
import "flatpickr/dist/themes/light.css"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap"

const AddApproverModal = ({
  modal_add_approver,
  toggleModalAddApprover,
  id_add_approver,
  loadMyRequests
}) => {
  const [state, setState] = useMergedState({
    loading: false
  })

  const methods = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  })
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    values.id_add_approver = id_add_approver
    setState({ loading: true })
    timeoffApi
      .getAddApprover(values)
      .then((res) => {
        loadMyRequests()
        toggleModalAddApprover()
        setState({ loading: false })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  return (
    <Modal
      isOpen={modal_add_approver}
      toggle={() => toggleModalAddApprover()}
      className="modal-sm"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader
        toggle={() => {
          toggleModalAddApprover()
        }}>
        {useFormatMessage("modules.time_off_requests.add_members_to_approve")}
      </ModalHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="modal-body">
            <div className="mt-1 mb-2">
              <ErpUserSelect
                name="approver_request"
                nolabel
                isMulti={true}
                useForm={methods}
                placeholder={useFormatMessage(
                  "modules.time_off_requests.add_members_to_approve"
                )}
                required={true}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              type="submit"
              color="primary"
              className="btn-change-file"
              onClick={() => {}}
              disabled={state.loading}>
              {state.loading && (
                <Spinner size="sm" style={{ marginRight: "4px" }} />
              )}
              {useFormatMessage("button.save")}
            </Button.Ripple>
            <Button.Ripple
              color="flat-danger"
              onClick={() => {
                toggleModalAddApprover()
              }}>
              {useFormatMessage("button.cancel")}
            </Button.Ripple>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default AddApproverModal
