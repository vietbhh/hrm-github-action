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
import { Alert, Button, Spinner } from "reactstrap"
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
        console.log(err)
        setLoading(false)
        setError(err)
      })
  }
  return (
    <Fragment>
      <Helmet>
        <title>{useFormatMessage("auth.authentication")}</title>
      </Helmet>
      <div className="auth-wrapper auth-basic d-flex align-item-center justify-content-between">
        <ImageSlider logo={login3D}/>
        <div className="control-auth-section">
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
            {error !== "" && (
              <Alert color="danger">
                <div className="alert-body">
                  <AlertCircle size={15} /> &nbsp;
                  <span>{useFormatMessage("auth.loginFailed")}</span>
                </div>
              </Alert>
            )}
            <div className="form-section">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="div-login-info div-email div-input-prepend">
                    <label>{useFormatMessage("auth.loginPlaceholder")}</label>
                    <ErpInput
                      type="text"
                      placeholder={useFormatMessage("auth.loginPlaceholder")}
                      name="login"
                      label={useFormatMessage("auth.loginLabel")}
                      nolabel
                      prepend={<i className="fa-solid fa-at"></i>}
                      required
                      useForm={methods}
                      autoFocus
                    />
                  </div>
                  <div className="div-login-info mt-2 div-input-prepend-append">
                    <label>
                      {useFormatMessage("auth.passwordPlaceholder")}
                    </label>
                    <ErpPassword
                      type="password"
                      placeholder={useFormatMessage("auth.passwordPlaceholder")}
                      name="password"
                      label={useFormatMessage("auth.passwordLabel")}
                      nolabel
                      className="input-password"
                      prepend={<i className="fa-solid fa-lock"></i>}
                      useForm={methods}
                      required
                      defaultValue=""
                    />
                  </div>
                  <div className="div-login-info form-group d-flex justify-content-between align-items-center mt-2">
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
                    className="mt-3 btn-login"
                    block
                    disabled={loading}>
                    {loading && <Spinner size="sm" className="me-50" />}
                    {useFormatMessage("auth.loginBtn")}
                  </Button.Ripple>
                </form>
              </FormProvider>
              <div className="mt-2">
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
          <div className="footer-section text-center">
            <p>2023 Life Stud.io</p>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Login
