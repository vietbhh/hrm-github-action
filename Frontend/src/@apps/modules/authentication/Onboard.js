// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { AbilityContext } from "@src/utility/context/Can"
import { updateListUsers } from "@store/app/users"
import { handleLogin } from "@store/authentication"
import { Fragment, useContext, useRef, useState } from "react"
import Helmet from "react-helmet"
import { FormProvider, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { userApi } from "../users/common/api"
// ** Styles
import "@scss/friday/authentication.scss"
import { Button, Col, Row, Spinner } from "reactstrap"
import noAvatar from "@src/assets/images/erp/noavt.png"
import login3D from "@src/assets/images/pages/login/login3D.png"
// ** Components
import { ErpDate, ErpInput } from "@apps/components/common/ErpField"
import Header from "./Header"
import dayjs from "dayjs"
import notification from "../../utility/notification"
import AvatarBox from "@apps/components/common/AvatarBox"
import ImageSlider from "./ImageSlider"

const Onboard = (props) => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState(noAvatar)

  const appName = useSelector((state) => state.layout.app_name)
  const userAuth = useSelector((state) => state.auth.userData)
  const customFields =
    userAuth?.custom_fields === undefined || userAuth.custom_fields === null
      ? {}
      : JSON.parse(userAuth.custom_fields)

  const methods = useForm({
    mode: "onChange"
  })
  const { handleSubmit } = methods
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const location = useLocation()

  const avatarUploader = useRef()

  const navigate = useNavigate()

  const handleUpdateUser = (values) => {
    userApi
      .postUpdate(values)
      .then((res) => {
        notification.showSuccess()
        navigate("/dashboard")
      })
      .catch(() => {})
  }

  const onSubmit = (values) => {
    const submitValue = {
      ...values,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      custom_fields: JSON.stringify({
        ...customFields,
        onboard: false
      })
    }

    handleUpdateUser(submitValue)
  }

  const handleClickSkip = (e) => {
    e.preventDefault()
    handleUpdateUser({
      custom_fields: JSON.stringify({
        ...customFields,
        onboard: false
      })
    })
  }

  const handleClickChangeAvatar = () => {
    if (avatarUploader.current) {
      avatarUploader.current.click()
    }
  }

  const handleAvtChange = (file) => {
    if (!_.isEmpty(file)) {
      if (["image/jpeg", "image/png"].includes(file[0].type)) {
        userApi
          .changeAvatar(file[0])
          .then((res) => {
            const linkPreview = URL.createObjectURL(file[0])
            setAvatar(linkPreview)
          })
          .catch((err) => {})
      }
    }
  }

  // ** render
  return (
    <Fragment>
      <Helmet>
        <title>{useFormatMessage("auth.authentication")}</title>
      </Helmet>
      <div className="auth-wrapper auth-basic d-flex align-item-center justify-content-between">
        <Row className="w-100 h-100">
          <Col sm="6">
            <ImageSlider logo={login3D} />
          </Col>
          <Col sm="6">
            <div className="control-auth-section">
              <div className="control-auth-container">
                <Header />
                <div className="login-section profile-setting-section">
                  <div className="header-form">
                    <h1 className="title mb-75">
                      {useFormatMessage("auth.profile_setting")}
                    </h1>
                    <p className="sub-title">
                      {useFormatMessage("auth.welcome_to")}{" "}
                      <span style={{ color: "#F95050" }}>{appName}</span>,{" "}
                      {useFormatMessage("auth.setting_your_profile")} 🤗
                    </p>
                  </div>
                  <div className="form-section">
                    <div className="d-flex align-items-center avatar-section">
                      <AvatarBox
                        currentAvatar={avatar}
                        readOnly={false}
                        buttonComponent={
                          <Button.Ripple className="ms-50 d-flex align-items-center btn-change-avatar">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="me-50">
                              <path
                                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                                stroke="#2F9BFA"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                                stroke="#2F9BFA"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2.66992 18.9505L7.59992 15.6405C8.38992 15.1105 9.52992 15.1705 10.2399 15.7805L10.5699 16.0705C11.3499 16.7405 12.6099 16.7405 13.3899 16.0705L17.5499 12.5005C18.3299 11.8305 19.5899 11.8305 20.3699 12.5005L21.9999 13.9005"
                                stroke="#2F9BFA"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Change
                          </Button.Ripple>
                        }
                        handleSave={(img) => {
                          userApi
                            .changeAvatar({
                              avatar: img
                            })
                            .then((res) => {})
                            .catch((err) => {})
                        }}
                      />
                    </div>
                    <div></div>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="div-login-info">
                          <label>
                            {useFormatMessage("auth.usernameLabel")}
                          </label>
                          <ErpInput
                            type="text"
                            defaultValue={userAuth?.username}
                            placeholder={useFormatMessage("auth.usernameLabel")}
                            name="username"
                            nolabel
                            useForm={methods}
                            disabled
                          />
                        </div>
                        <div className="div-login-info">
                          <label>
                            {useFormatMessage("modules.users.fields.full_name")}
                          </label>
                          <ErpInput
                            type="text"
                            placeholder={useFormatMessage(
                              "modules.users.fields.full_name"
                            )}
                            name="full_name"
                            nolabel
                            useForm={methods}
                          />
                        </div>
                        <div className="div-login-info">
                          <label>
                            {useFormatMessage("modules.users.fields.dob")}
                          </label>
                          <ErpDate
                            placeholder={useFormatMessage(
                              "modules.users.fields.dob"
                            )}
                            name="dob"
                            nolabel
                            useForm={methods}
                          />
                        </div>
                        <Button.Ripple
                          color="primary"
                          type="submit"
                          className="mt-3 btn-login"
                          block
                          disabled={loading}>
                          {loading && <Spinner size="sm" className="me-50" />}
                          {useFormatMessage("auth.save_profile")}
                        </Button.Ripple>
                      </form>
                    </FormProvider>
                    <div className="mt-1 d-flex justify-content-end">
                      <p className="text-forgot">
                        <Link to="" onClick={(e) => handleClickSkip(e)}>
                          {useFormatMessage("auth.skip_now")}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-section text-center">
                <p>2023 Friday Co., Ltd</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Fragment>
  )
}

export default Onboard
