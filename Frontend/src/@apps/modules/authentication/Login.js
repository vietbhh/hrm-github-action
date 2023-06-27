import {
  ErpCheckbox,
  ErpInput,
  ErpPassword
} from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import "@scss/friday/authentication.scss"
import login3D from "@src/assets/images/pages/login/login3D.png"
import useJwt from "@src/auth/jwt/useJwt"
import { AbilityContext } from "@src/utility/context/Can"
import { Fragment, useContext, useState } from "react"
import { AlertCircle, Check } from "react-feather"
import Helmet from "react-helmet"
import { FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Spinner
} from "reactstrap"
import { initAppData } from "@store/app/app"
import { updateListUsers } from "@store/app/users"
import { handleLogin } from "@store/authentication"
import { initialLayout } from "@store/layout"
import Header from "./Header"

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
      <Header />
      <div className="auth-wrapper auth-basic px-2">
        <img src={login3D} className="img3D" />
        <div className="auth-inner py-2">
          <Card className="">
            <CardBody className="">
              <CardTitle tag="h4" className="mb-1 text-title">
                {useFormatMessage("auth.loginBtn")}
              </CardTitle>
              <CardText className="mb-2">
                {useFormatMessage("auth.welcome_to")}{" "}
                <span style={{ color: "#F95050" }}>{appName}</span>,{" "}
                {useFormatMessage("auth.have_a_nice_day")} 🤗
              </CardText>
              {error !== "" && (
                <Alert color="danger">
                  <div className="alert-body">
                    <AlertCircle size={15} /> &nbsp;
                    <span>{useFormatMessage("auth.loginFailed")}</span>
                  </div>
                </Alert>
              )}
              <div className="auth-login-form mt-2">
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="div-email div-input-prepend">
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
                    <div className="mt-2 div-input-prepend-append">
                      <ErpPassword
                        type="password"
                        placeholder={useFormatMessage(
                          "auth.passwordPlaceholder"
                        )}
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
                    <div className="form-group d-flex justify-content-between align-items-center mt-2">
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
                <div className="mt-3">
                  <span className="text-forgot">
                    {useFormatMessage("auth.forgotPassword")}
                    <Link to="/forgot-password">
                      &nbsp;
                      {useFormatMessage("auth.reset_it")}
                    </Link>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Fragment>
  )
}

export default Login
