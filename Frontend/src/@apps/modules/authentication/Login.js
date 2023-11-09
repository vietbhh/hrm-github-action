import {
  ErpCheckbox,
  ErpInput,
  ErpPassword
} from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import "@scss/friday/authentication.scss"
import login3D from "@src/assets/images/pages/login/login3D.png"
import useJwt from "@src/auth/jwt/useJwt"
import { AbilityContext } from "@src/utility/context/Can"
import { initAppData } from "@store/app/app"
import { updateListUsers } from "@store/app/users"
import { handleLogin } from "@store/authentication"
import { initialLayout } from "@store/layout"
import { handleNotification } from "@store/notification"
import { Fragment, useContext, useState } from "react"
import { AlertCircle, Check } from "react-feather"
import Helmet from "react-helmet"
import { FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Alert, Button, Col, Row, Spinner } from "reactstrap"
import Header from "./Header"
import ImageSlider from "./ImageSlider"

const Login = (props) => {
  const appName = useSelector((state) => state.layout.app_name)
  const methods = useForm({
    mode: "onChange"
  })

  const { i18n } = useTranslation()
  const { handleSubmit } = methods
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const location = useLocation()
  const { from } = location.state || { from: { pathname: "/" } }
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const onSubmit = (values) => {
    const data = new FormData()
    setLoading(true)
    data.append("login", values.login)
    data.append("password", values.password)
    data.append("remember", values.remember)
    useJwt
      .login(data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => {
        setLoading(false)
        const {
          userData,
          permits,
          init: { settings, unit, modules, routes, filters, optionsModules },
          accessToken,
          refreshToken,
          list_user
        } = res.data

        const listNotification = res.data.list_notification ?? []
        const numberNotification = res.data.number_notification ?? 0

        dispatch(initialLayout(settings))
        i18n.changeLanguage(settings.language)
        dispatch(
          handleLogin({
            userData,
            permits,
            settings,
            accessToken,
            refreshToken
          })
        )
        dispatch(
          initAppData({ unit, modules, routes, filters, optionsModules })
        )
        dispatch(updateListUsers(list_user))
        // ** save notification to redux
        dispatch(
          handleNotification({
            listNotification,
            numberNotification
          })
        )
        ability.update(permits)
        navigate(from)
      })
      .catch((err) => {
        setLoading(false)
        setError(err)
      })
  }
  return (
    <Fragment>
      <Helmet>
        <title>{useFormatMessage("auth.authentication")}</title>
      </Helmet>
      <div className="auth-wrapper auth-basic">
        <div className="auth-content">
          <Row className="">
            <Col lg="6" className="d-none d-lg-block">
              <ImageSlider logo={login3D} />
            </Col>
            <Col lg="6" className="col-info">
              <div className="control-auth-section">
                <div className="control-auth-container">
                  <Header />
                  <div className="login-section">
                    <div className="header-form">
                      <h1 className="title mb-75">
                        {useFormatMessage("auth.loginBtn")}
                      </h1>
                      <p className="sub-title">
                        {useFormatMessage("auth.welcome_to")}{" "}
                        <span style={{ color: "#F95050" }}>{appName}</span>,{" "}
                        {useFormatMessage("auth.have_a_nice_day")} 🤗
                      </p>
                    </div>

                    <div className="form-section">
                      <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="div-login-info div-email div-input-prepend">
                            <label>
                              {useFormatMessage("auth.loginPlaceholder")}
                            </label>
                            <ErpInput
                              type="text"
                              placeholder={useFormatMessage(
                                "auth.enter_your_email_or_username"
                              )}
                              name="login"
                              label={useFormatMessage("auth.loginLabel")}
                              nolabel
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
                          <div className="div-login-info div-input-prepend-append">
                            <label>
                              {useFormatMessage("auth.passwordPlaceholder")}
                            </label>
                            <ErpPassword
                              type="password"
                              placeholder={useFormatMessage(
                                "auth.enter_password"
                              )}
                              name="password"
                              label={useFormatMessage("auth.passwordLabel")}
                              nolabel
                              className="input-password"
                              prepend={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none">
                                  <path
                                    d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                                    stroke="#8C8A82"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z"
                                    stroke="#8C8A82"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                                    stroke="#8C8A82"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              }
                              useForm={methods}
                              required
                              defaultValue=""
                              hideIcon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none">
                                  <path
                                    d="M15.58 11.9999C15.58 13.9799 13.98 15.5799 12 15.5799C10.02 15.5799 8.41998 13.9799 8.41998 11.9999C8.41998 10.0199 10.02 8.41992 12 8.41992C13.98 8.41992 15.58 10.0199 15.58 11.9999Z"
                                    stroke="#696760"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M12 20.2707C15.53 20.2707 18.82 18.1907 21.11 14.5907C22.01 13.1807 22.01 10.8107 21.11 9.4007C18.82 5.8007 15.53 3.7207 12 3.7207C8.47003 3.7207 5.18003 5.8007 2.89003 9.4007C1.99003 10.8107 1.99003 13.1807 2.89003 14.5907C5.18003 18.1907 8.47003 20.2707 12 20.2707Z"
                                    stroke="#696760"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              }
                              showIcon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none">
                                  <path
                                    d="M14.5299 9.47004L9.46992 14.53C8.81992 13.88 8.41992 12.99 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C12.9899 8.42004 13.8799 8.82004 14.5299 9.47004Z"
                                    stroke="#292D32"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M17.8198 5.76998C16.0698 4.44998 14.0698 3.72998 11.9998 3.72998C8.46984 3.72998 5.17984 5.80998 2.88984 9.40998C1.98984 10.82 1.98984 13.19 2.88984 14.6C3.67984 15.84 4.59984 16.91 5.59984 17.77"
                                    stroke="#292D32"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M8.41992 19.5301C9.55992 20.0101 10.7699 20.2701 11.9999 20.2701C15.5299 20.2701 18.8199 18.1901 21.1099 14.5901C22.0099 13.1801 22.0099 10.8101 21.1099 9.40005C20.7799 8.88005 20.4199 8.39005 20.0499 7.93005"
                                    stroke="#292D32"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52"
                                    stroke="#292D32"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M9.47 14.53L2 22"
                                    stroke="#292D32"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M21.9998 2L14.5298 9.47"
                                    stroke="#292D32"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              }
                            />
                          </div>
                          <div className="div-login-info form-group d-flex justify-content-between align-items-center">
                            <ErpCheckbox
                              color="primary"
                              icon={<Check className="vx-icon" size={16} />}
                              label={useFormatMessage("auth.remember")}
                              name="remember"
                              useForm={methods}
                              className="checkbox login-checkbox"
                            />
                          </div>

                          <Button.Ripple
                            color="primary"
                            type="submit"
                            className="btn-login"
                            block
                            disabled={loading}>
                            {loading && <Spinner size="sm" className="me-50" />}
                            {useFormatMessage("auth.loginBtn")}
                          </Button.Ripple>
                        </form>
                        {error !== "" && (
                          <Alert color="danger mt-1">
                            <div className="alert-body">
                              <AlertCircle size={15} /> &nbsp;
                              <span>
                                {useFormatMessage("auth.loginFailed")}
                              </span>
                            </div>
                          </Alert>
                        )}
                      </FormProvider>
                      <div className="div-forgot">
                        <span className="text-forgot">
                          {useFormatMessage("auth.forgotPassword")}
                          <Link to="/forgot-password">
                            &nbsp;
                            {useFormatMessage("auth.reset_it")}
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="footer-section text-center">
                  <p>2023 {appName}</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  )
}

export default Login
