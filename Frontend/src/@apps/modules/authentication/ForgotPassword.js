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
  Form,
  Spinner
} from "reactstrap"
import Header from "./Header"
import ImageSlider from "./ImageSlider"

const ForgotPassword = () => {
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
      <div className="auth-wrapper auth-basic d-flex align-item-center justify-content-between">
        <ImageSlider logo={password3D}/>
        <div className="control-auth-section">
          <Header />
          <div className="login-section">
            <div className="header-form">
              <h1 className="title mb-75">
                {useFormatMessage("auth.resetPassword")}
              </h1>
              <p className="sub-title">
                {useFormatMessage("auth.forgotPasswordIntructions")}
              </p>
            </div>
            <div className="error-section">
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
            </div>
            <div className="form-section form-reset-password">
              <Form
                className="auth-forgot-password-form mt-2"
                onSubmit={handleSubmit(onSubmit)}>
                <div className="div-login-info">
                  <label>{useFormatMessage("auth.email")}</label>
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
                </div>

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
              <p className="text-left mt-2">
                <span className="text-forgot">
                  {useFormatMessage("auth.remember_your_password")}{" "}
                  <Link to="/login">{useFormatMessage("auth.loginBtn")}</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ForgotPassword
