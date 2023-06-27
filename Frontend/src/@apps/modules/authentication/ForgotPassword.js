import { ErpInput } from "@apps/components/common/ErpField"
import {
  getErrors,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { serialize } from "@apps/utility/handleData"
import "@scss/friday/authentication.scss"
import password3D from "@src/assets/images/pages/login/password3D.png"
import axios from "axios"
import { cloneDeep } from "lodash-es"
import { Fragment } from "react"
import { AlertCircle, ChevronLeft, Info } from "react-feather"
import Helmet from "react-helmet"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Form,
  Spinner
} from "reactstrap"
import Header from "./Header"
import { useTranslation } from "react-i18next"

const ForgotPassword = () => {
  const { i18n } = useTranslation()
  const methods = useForm({
    mode: "onChange"
  })
  const { handleSubmit, reset } = methods

  const [state, setState] = useMergedState({
    error: false,
    success: false,
    msg: "",
    submitting: false
  })

  const onSubmit = (values) => {
    setState({
      error: false,
      success: false,
      msg: "",
      submitting: true
    })
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/auth/forgot`,
        serialize(cloneDeep(values)),
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
          success: true,
          error: false,
          msg: useFormatMessage("auth.sendResetPasswordSuccess")
        })
      })
      .catch((res) => {
        reset()
        const error = getErrors(res)?.data
        setState({
          submitting: false,
          success: false,
          error: true,
          msg: useFormatMessage(`auth.${error?.messages?.error}`)
        })
      })
  }

  return (
    <Fragment>
      <Helmet>
        <title>{useFormatMessage("auth.authentication")}</title>
      </Helmet>
      <Header />
      <div className="auth-wrapper auth-basic auth-v1 px-2">
        <img src={password3D} className="img3D" />
        <div className="auth-inner py-2">
          <Card className="mb-0">
            <CardBody>
              <CardTitle
                tag="h4"
                className="mb-1 text-title text-forgot-password">
                {useFormatMessage("auth.forgotPassword")}
              </CardTitle>
              <CardText className="mb-2">
                {useFormatMessage("auth.forgotPasswordIntructions")}
              </CardText>
              {state.error && (
                <Alert color="danger">
                  <div className="alert-body">
                    <AlertCircle size={15} /> {state.msg}
                  </div>
                </Alert>
              )}
              {state.success && (
                <Alert color="success">
                  <div className="alert-body">
                    <Info size={15} /> {state.msg}
                  </div>
                </Alert>
              )}
              <Form
                className="auth-forgot-password-form mt-2"
                onSubmit={handleSubmit(onSubmit)}>
                <ErpInput
                  type="text"
                  placeholder={useFormatMessage(
                    "auth.emailPlaceholder",
                    "Enter your account email"
                  )}
                  name="email"
                  label={useFormatMessage("auth.email")}
                  nolabel
                  className="mb-0"
                  prepend={<i className="fa-solid fa-at"></i>}
                  required
                  useForm={methods}
                  autoFocus
                />

                <Button.Ripple
                  type="submit"
                  color="primary"
                  className="mt-3 btn-login"
                  block
                  disabled={state.submitting}>
                  {state.submitting && <Spinner size="sm" className="me-50" />}{" "}
                  {useFormatMessage("auth.sendResetLink")}
                </Button.Ripple>
              </Form>
              <p className="text-center mt-2">
                <Link to="/login">
                  <ChevronLeft className="me-25" size={14} />
                  <span className="align-middle">
                    {useFormatMessage("auth.backToLogin")}
                  </span>
                </Link>
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </Fragment>
  )
}

export default ForgotPassword
