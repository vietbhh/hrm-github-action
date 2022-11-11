import { ErpPassword } from "@apps/components/common/ErpField"
import { axiosApi } from "@apps/utility/api"
import {
  getErrors,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { serialize } from "@apps/utility/handleData"
import notification from "@apps/utility/notification"
import { cloneDeep } from "lodash-es"
import React from "react"
import { AlertCircle } from "react-feather"
import { useForm } from "react-hook-form"
import {
  Alert,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap"
import { usersApi } from "../../common/api"
const ResetUserPassword = (props) => {
  const { modal, handleModal, user } = props
  const [state, setState] = useMergedState({
    error: false,
    msg: "",
    submitting: false,
    validate: true,
    validating: true
  })

  const methods = useForm({
    mode: "onChange"
  })
  const { handleSubmit, reset, watch, formState } = methods

  const onSubmit = (values) => {
    setState({
      error: false,
      msg: "",
      submitting: true
    })
    usersApi
      .postChangePwd(user.id, values.password)
      .then(() => {
        reset()
        setState({
          submitting: false,
          error: false,
          msg: useFormatMessage("auth.changePasswordSuccess")
        })
        notification.showSuccess({
          text: useFormatMessage("auth.changePasswordSuccess")
        })
        handleModal()
      })
      .catch((res) => {
        reset()
        const error = getErrors(res)?.data
        setState({
          submitting: false,
          error: true,
          msg: useFormatMessage(`auth.${error?.messages?.error}`)
        })
      })
  }

  return (
    <React.Fragment>
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("modules.users.display.changePwdModalTitle", {
            name: user?.username
          })}
        </ModalHeader>
        <Form
          className="auth-reset-password-form mt-1"
          onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            {state.error && (
              <Alert color="danger">
                <div className="alert-body">
                  <AlertCircle size={15} /> {state.msg}
                </div>
              </Alert>
            )}
            <ErpPassword
              name="password"
              validateRules={{
                minLength: {
                  value: 6,
                  message: useFormatMessage("validate.min", { num: 6 })
                }
              }}
              autoFocus
              required
              label={useFormatMessage("auth.newPasswordLabel")}
              useForm={methods}
            />
            <ErpPassword
              name="repassword"
              validateRules={{
                validate: (value) =>
                  value === watch("password") ||
                  useFormatMessage("validate.passwordNotMatch")
              }}
              required
              label={useFormatMessage("auth.confirmPasswordLabel")}
              useForm={methods}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              disabled={state.submitting || formState.isValidating}>
              {state.submitting && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("auth.changePasswordModal")}
            </Button>
            <Button color="flat-danger" onClick={() => handleModal()}>
              {useFormatMessage("button.cancel")}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
export default ResetUserPassword
