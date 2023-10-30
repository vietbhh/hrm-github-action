import { ErpPassword } from "@apps/components/common/ErpField"
import { axiosApi } from "@apps/utility/api"
import {
  getErrors,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { serialize } from "@apps/utility/handleData"
import notification from "@apps/utility/notification"
import { yupResolver } from "@hookform/resolvers/yup"
import "@scss/friday/authentication.scss"
import classNames from "classnames"
import { cloneDeep } from "lodash-es"
import React, { useEffect } from "react"
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
import * as yup from "yup"

const ChangePasswordModal = (props) => {
  const { modal, handleModal } = props
  const [state, setState] = useMergedState({
    error: false,
    msg: "",
    submitting: false,
    validate: true,
    validating: true,
    checkStringUpper: false,
    checkNumber: false,
    checkCharacters: false,
    checkPassword: false,
    checkRePassword: false,
    checkRePasswordMatch: false,
    checkSameCurrentPassword: false,
    dataUser: {}
  })
  const stringUpperRegExp =
    /^(?=.*[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ])[a-z0-9A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ!@#\$%\^\&*\)\(+=._-]{1,}$/

  const numberRegExp =
    /^(?=.*\d)[a-z0-9A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ!@#\$%\^\&*\)\(+=._-]{1,}$/

  const validateSchema = yup.object().shape({
    password: yup
      .string()
      .required(useFormatMessage("auth.password_required"))
      .matches(
        stringUpperRegExp,
        useFormatMessage("auth.at_least_1_upper_validate")
      )
      .matches(
        numberRegExp,
        useFormatMessage("auth.at_least_1_number_validate")
      )
      .min(8, useFormatMessage("validate.min", { num: 8 }))
      .notOneOf(
        [yup.ref("currentPassword"), null],
        useFormatMessage("auth.password_same_currentPassword")
      ),
    repassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        useFormatMessage("validate.passwordNotMatch")
      )
  })
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(validateSchema)
  })
  const { handleSubmit, reset, watch, formState, getValues, resetField } =
    methods

  const onSubmit = (values) => {
    setState({
      error: false,
      msg: "",
      submitting: true
    })
    axiosApi
      .post(
        "/user/change-pwd",
        serialize(
          cloneDeep({
            currentPassword: values.currentPassword,
            password: values.password
          })
        ),
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      .then(() => {
        reset()
        setState({
          submitting: false,
          error: false,
          msg: useFormatMessage("auth.changePasswordSuccess"),
          checkCharacters: false,
          checkPassword: false,
          checkRePassword: false,
          checkRePasswordMatch: false,
          checkStringUpper: false,
          checkNumber: false
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
  const validateCurrentPwd = async (value) => {
    let result = false
    await axiosApi
      .post(
        "/user/change-pwd/validate",
        serialize(
          _.cloneDeep({
            currentPassword: value
          })
        ),
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      .then((res) => {
        result = res.data
      })
    return result
  }

  const handleValidatePassword = (values) => {
    if (stringUpperRegExp.test(values)) {
      setState({ checkStringUpper: true })
    } else {
      setState({ checkStringUpper: false })
    }
    if (numberRegExp.test(values)) {
      setState({ checkNumber: true })
    } else {
      setState({ checkNumber: false })
    }
    if (values.length >= 8) {
      setState({ checkCharacters: true })
    } else {
      setState({ checkCharacters: false })
    }
    if (getValues("currentPassword") === values) {
      setState({ checkSameCurrentPassword: true })
    } else {
      setState({ checkSameCurrentPassword: false })
    }

    setState({ checkPassword: true })
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "password") {
        handleValidatePassword(value.password)
      }
      if (name === "currentPassword") {
        handleValidatePassword(getValues("password"))
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    if (!_.isEmpty(formState.dirtyFields)) {
      const errors = formState.errors
      if (!_.isUndefined(formState.dirtyFields.password)) {
        if (!_.isUndefined(errors.password)) {
          handleValidatePassword(getValues("password"))
        } else {
          setState({
            checkCharacters: true,
            checkStringUpper: true,
            checkNumber: true,
            checkPassword: false
          })
        }
      }

      if (!_.isUndefined(formState.dirtyFields.repassword)) {
        if (!_.isUndefined(errors.repassword)) {
          setState({ checkRePassword: true, checkRePasswordMatch: false })
        } else {
          setState({ checkRePassword: false, checkRePasswordMatch: true })
        }
      }
    }
  }, [formState])

  useEffect(() => {
    setState({
      checkStringUpper: false,
      checkCharacters: false,
      checkNumber: false
    })
    //resetField("currentPassword")
  }, [modal])
  return (
    <React.Fragment>
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("auth.changePasswordModal")}
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
              name="currentPassword"
              autoFocus
              required
              label={useFormatMessage("auth.currentPassword")}
              useForm={methods}
              validateRules={{
                validate: {
                  checkCurrentPwd: async (v) =>
                    ((await validateCurrentPwd(v)) && modal) ||
                    useFormatMessage("validate.currentPwdIncorrect")
                }
              }}
              defaultValue=""
            />

            <ErpPassword
              name="password"
              autoFocus
              required
              label={useFormatMessage("auth.newPasswordLabel")}
              useForm={methods}
              defaultValue=""
            />

            <ErpPassword
              name="repassword"
              required
              label={useFormatMessage("auth.confirmPasswordLabel")}
              useForm={methods}
              defaultValue=""
            />

            <div className="mt-2 div-change-password">
              <p className="text-title-ul">
                {useFormatMessage("auth.password_must_contain")}
              </p>
              <ul>
                <li
                  className={classNames("text-li", {
                    "active-li": state.checkStringUpper
                  })}>
                  {useFormatMessage("auth.at_least_1_upper")}
                </li>
                <li
                  className={classNames("text-li", {
                    "active-li": state.checkNumber
                  })}>
                  {useFormatMessage("auth.at_least_1_number")}
                </li>
                <li
                  className={classNames("text-li", {
                    "active-li": state.checkCharacters
                  })}>
                  {useFormatMessage("auth.at_least_characters", {
                    number_character_password: 8
                  })}
                </li>
              </ul>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              disabled={
                state.submitting ||
                formState.isValidating ||
                state.checkSameCurrentPassword
              }>
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
export default ChangePasswordModal
