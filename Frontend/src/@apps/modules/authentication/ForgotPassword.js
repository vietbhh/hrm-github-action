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
import { Alert, Button, Col, Form, Row, Spinner } from "reactstrap"
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
      <div className="auth-wrapper auth-basic d-flex align-item-start justify-content-between">
        <div className="auth-content">
          <Row className="w-100 h-100">
            <Col sm="6" className="col-image">
              <ImageSlider logo={password3D} />
            </Col>
            <Col sm="6" className="col-info">
              <div className="control-auth-section">
                <div className="control-auth-container">
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
                            prepend={
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none">
                                <rect
                                  opacity="0.01"
                                  width="24"
                                  height="24"
                                  fill="#8C8A82"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M11.9054 21.2325C6.56344 21.2325 3.27311 17.473 3.27311 12.6986C3.25031 10.1662 4.25647 7.73312 6.06113 5.95648C7.86579 4.17985 10.3144 3.2119 12.846 3.27433C17.7188 3.27433 21.3552 6.26736 21.3552 10.9923C21.3552 15.296 19.0798 17.0031 16.8037 17.0031C15.8272 17.0542 14.9001 16.5709 14.3828 15.7412C13.5555 16.511 12.4702 16.9434 11.3402 16.9536C8.61892 16.9536 7.23699 15.0243 7.23699 12.6955C7.19068 11.2536 7.73956 9.85606 8.75477 8.83103C9.76998 7.806 11.1621 7.24371 12.6045 7.27613C13.3995 7.25121 14.1811 7.48573 14.831 7.94426L14.9301 7.52388H17.2798L16.1185 12.9657C15.8956 14.0542 16.1433 14.9197 17.2071 14.9197C18.5178 14.9197 19.285 13.8312 19.285 10.9373C19.285 7.07871 16.2424 5.27252 12.829 5.27252C10.8444 5.20144 8.92027 5.96211 7.52077 7.37101C6.12127 8.77991 5.37351 10.7091 5.45789 12.6932C5.45789 16.6013 7.95621 19.1492 11.9139 19.1492C13.4248 19.1607 14.9169 18.8131 16.2672 18.135L17.0832 20.1386C15.4459 20.8399 13.6864 21.2116 11.9054 21.2325ZM11.7319 14.6277C12.4032 14.6536 13.0557 14.4032 13.5373 13.9348L14.3285 10.2736C13.8783 9.82116 13.2635 9.57107 12.6253 9.5807C11.8579 9.57359 11.1214 9.88214 10.5882 10.4341C10.055 10.986 9.77209 11.7328 9.80569 12.4994C9.80337 13.7869 10.422 14.6277 11.7327 14.6277H11.7319Z"
                                  fill="#8C8A82"
                                />
                              </svg>
                            }
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
                          {state.submitting && (
                            <Spinner size="sm" className="me-50" />
                          )}{" "}
                          {useFormatMessage("auth.sendResetLink")}
                        </Button.Ripple>
                      </Form>
                      <div className="div-forgot">
                        <p className="text-left mt-2">
                          <span className="text-forgot">
                            {useFormatMessage("auth.remember_your_password")}{" "}
                            <Link to="/login">
                              {useFormatMessage("auth.loginBtn")}
                            </Link>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="footer-section text-center">
                  <p>2023 Life Stud.io</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  )
}

export default ForgotPassword
