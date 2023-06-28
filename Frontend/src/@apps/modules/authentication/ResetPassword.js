import { ErpPassword } from "@apps/components/common/ErpField"
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
import axios from "axios"
import classNames from "classnames"
import { cloneDeep } from "lodash-es"
import { Fragment, useEffect } from "react"
import { AlertCircle, ChevronLeft } from "react-feather"
import Helmet from "react-helmet"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
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
import * as yup from "yup"
import Header from "./Header"
import { useTranslation } from "react-i18next"

const ResetPassword = () => {
  const { i18n } = useTranslation()

  const [state, setState] = useMergedState({
    error: false,
    success: false,
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
    dataUser: {}
  })
  const history = useNavigate()
  const params = useParams()
  const token = params.token

  useEffect(() => {
    setState({
      validating: true
    })
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/auth/reset/validate`,
        serialize(
          cloneDeep({
            token: token
          })
        ),
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      .then((res) => {
        setState({
          validate: true,
          validating: false,
          dataUser: res.data
        })
      })
      .catch(() => {
        setState({
          validate: false,
          validating: false
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
  const { handleSubmit, reset, watch, formState, getValues } = methods
  const onSubmit = (values) => {
    setState({
      error: false,
      success: false,
      msg: "",
      submitting: true
    })
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/auth/reset`,
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
        reset()
        setState({
          submitting: false,
          success: true,
          error: false,
          msg: useFormatMessage("auth.resetPasswordSuccess"),
          checkCharacters: false,
          checkPassword: false,
          checkRePassword: false,
          checkRePasswordMatch: false
        })
        //history("/login")
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
      <Header />
      <div className="auth-wrapper auth-basic page-reset px-2">
        <img src={password3D} className="img3D" />
        <div
          className={classNames("auth-inner py-2", {
            "auth-inner-custom":
              state.checkPassword === true ||
              state.checkCharacters === true ||
              state.checkRePassword === true ||
              state.checkRePasswordMatch,
            "auth-inner-congratulations": state.success
          })}>
          <Card className="mb-0">
            <CardBody>
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
                  <p>{useFormatMessage("auth.active_token_expired_text")}</p>
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
              {!state.validating && state.validate && (
                <Fragment>
                  {state.success ? (
                    <div className="div-congratulations">
                      <span>🎉🎉🎉</span>
                      <CardTitle tag="h4" className="mb-1 text-title">
                        {useFormatMessage("auth.congratulations")}
                      </CardTitle>
                      <CardText className="mb-2">
                        {useFormatMessage("auth.congratulationsText")}
                      </CardText>
                      <Button.Ripple
                        type="button"
                        color="primary"
                        className="mt-3 mb-1 btn-login"
                        block
                        disabled={state.submitting}
                        onClick={() => history("/login")}>
                        {state.submitting && (
                          <Spinner size="sm" className="me-50" />
                        )}{" "}
                        {useFormatMessage("auth.loginBtn2")}
                      </Button.Ripple>
                    </div>
                  ) : (
                    <>
                      <CardTitle tag="h4" className="mb-1 text-title">
                        Hi, {state.dataUser?.full_name}
                      </CardTitle>
                      <CardText className="mb-2">
                        {useFormatMessage("auth.resetPasswordText")}
                      </CardText>

                      {state.error && (
                        <Alert color="danger">
                          <div className="alert-body">
                            <AlertCircle size={15} /> {state.msg}
                          </div>
                        </Alert>
                      )}
                      {!state.success && (
                        <Form
                          className="auth-reset-password-form mt-2"
                          onSubmit={handleSubmit(onSubmit)}>
                          <div className="d-flex div-email">
                            <ErpPassword
                              name="password"
                              useForm={methods}
                              autoFocus
                              required
                              label={useFormatMessage("auth.newPasswordLabel")}
                              nolabel
                              prepend={<i className="fa-solid fa-lock"></i>}
                              placeholder={useFormatMessage(
                                "auth.newPasswordLabel"
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

                          <div className="mt-2 d-flex">
                            <ErpPassword
                              name="repassword"
                              useForm={methods}
                              required
                              label={useFormatMessage(
                                "auth.confirmPasswordLabel"
                              )}
                              nolabel
                              prepend={<i className="fa-solid fa-lock"></i>}
                              placeholder={useFormatMessage(
                                "auth.confirmPasswordLabel"
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

                          <div className="mt-3">
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
                            className="mt-3 mb-1 btn-login"
                            block
                            disabled={state.submitting}>
                            {state.submitting && (
                              <Spinner size="sm" className="me-50" />
                            )}{" "}
                            {useFormatMessage("auth.setNewPasswordBtn")}
                          </Button.Ripple>
                        </Form>
                      )}
                    </>
                  )}
                </Fragment>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </Fragment>
  )
}

export default ResetPassword
