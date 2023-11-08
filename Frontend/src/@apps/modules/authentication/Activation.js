import { ErpInput, ErpPassword } from "@apps/components/common/ErpField"
import { FormLoader } from "@apps/components/spinner/FormLoader"
import {
  getErrors,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { serialize } from "@apps/utility/handleData"
import { yupResolver } from "@hookform/resolvers/yup"
import "@scss/friday/authentication.scss"
import password3D from "@src/assets/images/pages/login/password3D.png"
import useJwt from "@src/auth/jwt/useJwt"
import { AbilityContext } from "@src/utility/context/Can"
import axios from "axios"
import classNames from "classnames"
import { cloneDeep } from "lodash-es"
import { Fragment, useContext, useEffect } from "react"
import { AlertCircle, ChevronLeft, Info } from "react-feather"
import Helmet from "react-helmet"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Form,
  Row,
  Spinner
} from "reactstrap"
import { initAppData } from "@store/app/app"
import { handleLogin } from "@store/authentication"
import { initialLayout } from "@store/layout"
import * as yup from "yup"
import Header from "./Header"
import { useTranslation } from "react-i18next"
import { updateListUsers } from "@store/app/users"
import ImageSlider from "./ImageSlider"

const Activation = () => {
  const { i18n } = useTranslation()
  const history = useNavigate()
  const dispatch = useDispatch()
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    error: false,
    success: false,
    msg: "",
    submitting: false,
    validate: true,
    validating: true,
    accountEmail: null,
    accountUsername: null,
    checkStringUpper: false,
    checkNumber: false,
    checkCharacters: false,
    checkPassword: false,
    checkRePassword: false,
    checkRePasswordMatch: false
  })
  const params = useParams()
  const token = params.token

  useEffect(() => {
    setState({
      validating: true
    })
    axios
      .get(
        `${
          import.meta.env.VITE_APP_API_URL
        }/auth/active/validate?token=${token}`
      )
      .then((res) => {
        setState({
          validate: true,
          validating: false,
          accountEmail: res.data.email,
          accountUsername: res.data.username
        })
      })
      .catch(() => {
        setState({
          validate: false,
          validating: false,
          accountEmail: null,
          accountUsername: null
        })
      })
  }, [token])

  const stringUpperRegExp = /^(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{1,}$/
  const numberRegExp = /^(?=.*\d)[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{1,}$/

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
      .min(8, useFormatMessage("validate.min", { num: 8 })),
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
  const { errors, handleSubmit, reset, watch, formState, getValues } = methods
  const onSubmit = (values) => {
    setState({
      error: false,
      success: false,
      msg: "",
      submitting: true
    })
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/auth/active`,
        serialize(
          cloneDeep({
            token: token,
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
        const loginData = new FormData()
        loginData.append("login", state.accountUsername)
        loginData.append("password", values.password)
        loginData.append("remember", true)
        useJwt
          .login(loginData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then((res) => {
            const {
              userData,
              permits,
              init: {
                settings,
                unit,
                modules,
                routes,
                filters,
                optionsModules
              },
              accessToken,
              refreshToken,
              list_user
            } = res.data
            dispatch(initialLayout(settings))
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
            history("/start")
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((res) => {
        console.log(res)
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
    setState({ checkPassword: true })
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "password") {
        handleValidatePassword(value.password)
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

  return (
    <Fragment>
      <Helmet>
        <title>{useFormatMessage("auth.authentication")}</title>
      </Helmet>
      <div className="auth-wrapper auth-basic d-flex align-item-center justify-content-between">
        <div className="auth-content">
          <Row className="w-100 h-100">
            <Col sm="6" className="col-image">
              <ImageSlider logo={password3D} />
            </Col>
            <Col sm="6" className="col-info">
              <div className="control-auth-section">
                <div className="control-auth-container">
                  <Header />
                  <div className="login-section activation-section">
                    {state.validating && <FormLoader />}
                    {!state.validating && !state.validate && (
                      <Fragment>
                        <Alert color="danger">
                          <div className="alert-body">
                            <AlertCircle size={15} />{" "}
                            <span className="ms-1">
                              <strong>
                                {useFormatMessage("auth.active_token_expired")}
                              </strong>
                            </span>
                          </div>
                        </Alert>
                        <p>
                          {useFormatMessage("auth.active_token_expired_text")}
                        </p>
                        <p className="text-center mt-2">
                          <Link to="/">
                            <ChevronLeft className="me-25" size={14} />
                            <span className="align-middle">
                              {useFormatMessage("button.back")}
                            </span>
                          </Link>
                        </p>
                      </Fragment>
                    )}
                    <div className="header-form">
                      <h1 className="title mb-75">
                        {useFormatMessage("auth.activeAccount")} 👋🏻
                      </h1>
                      <p className="sub-title">
                        {useFormatMessage("auth.activeAccountText")}
                      </p>
                    </div>
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
                    <div className="form-section form-reset-password">
                      <Form
                        className="auth-reset-password-form"
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="div-login-info">
                          <label>
                            {useFormatMessage("auth.usernameLabel")}
                          </label>
                          <ErpInput
                            type="text"
                            placeholder={useFormatMessage("auth.usernameLabel")}
                            name="login"
                            label={useFormatMessage("auth.usernameLabel")}
                            prepend={<i className="fa-solid fa-user"></i>}
                            nolabel
                            readOnly
                            defaultValue={state.accountUsername}
                          />
                        </div>
                        <div className="div-login-info">
                          <label>{useFormatMessage("auth.emailLabel")}</label>
                          <ErpInput
                            type="text"
                            placeholder={useFormatMessage("auth.emailLabel")}
                            name="email"
                            label={useFormatMessage("auth.emailLabel")}
                            prepend={<i className="fa-solid fa-at"></i>}
                            readOnly
                            nolabel
                            defaultValue={state.accountEmail}
                          />
                        </div>
                        <div className="div-login-info">
                          <label>
                            {useFormatMessage("auth.passwordLabel")}
                          </label>
                          <div className="d-flex">
                            <ErpPassword
                              name="password"
                              useForm={methods}
                              autoFocus
                              required
                              label={useFormatMessage("auth.passwordLabel")}
                              nolabel
                              prepend={<i className="fa-solid fa-lock"></i>}
                              placeholder={useFormatMessage(
                                "auth.passwordLabel"
                              )}
                              defaultValue=""
                            />
                            {state.checkCharacters &&
                              state.checkNumber &&
                              state.checkStringUpper && (
                                <div className="ms-auto">
                                  <div className="check check-primary">
                                    <i className="fa-solid fa-check"></i>
                                  </div>
                                </div>
                              )}
                            {state.checkPassword && (
                              <div className="ms-auto">
                                <div className="check check-danger">
                                  <i className="fa-solid fa-exclamation"></i>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="div-login-info">
                          <label>
                            {useFormatMessage("auth.passwordLabelConfirm")}
                          </label>
                          <div className="d-flex w-100">
                            <ErpPassword
                              name="repassword"
                              useForm={methods}
                              required
                              label={useFormatMessage(
                                "auth.passwordLabelConfirm"
                              )}
                              nolabel
                              prepend={<i className="fa-solid fa-lock"></i>}
                              placeholder={useFormatMessage(
                                "auth.passwordLabelConfirm"
                              )}
                              className="input-password"
                              defaultValue=""
                            />
                            {state.checkRePassword && (
                              <div className="ms-auto">
                                <div className="check check-danger">
                                  <i className="fa-solid fa-exclamation"></i>
                                </div>
                              </div>
                            )}
                            {state.checkRePasswordMatch && (
                              <div className="ms-auto">
                                <div className="check check-primary">
                                  <i className="fa-solid fa-check"></i>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
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
                        <Button.Ripple
                          type="submit"
                          color="primary"
                          block
                          className="mt-3 mb-1 btn-login"
                          disabled={state.submitting}>
                          {state.submitting && (
                            <Spinner size="sm" className="me-50" />
                          )}{" "}
                          {useFormatMessage("auth.activeBtn")}
                        </Button.Ripple>
                      </Form>
                    </div>
                  </div>
                  <div className="footer-section text-center">
                    <p>2023 Life Stud.io</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  )
}

export default Activation
