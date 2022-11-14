// ** React Imports
import { ErpFileUpload, ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import "@modules/Careers/assets/careers.scss"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner
} from "reactstrap"
import { careersApi } from "../common/api"
const Apply = (props) => {
  // ** Props

  const history = useNavigate()
  const slug = useParams().slug
  const [state, setState] = useMergedState({
    params: {
      search: "",
      page: 1
    },
    infoJob: {},
    applied: false,
    loaddingApply: false
  })

  const methods = useForm({
    mode: "onChange"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const onSubmit = (values) => {
    setState({ loaddingApply: true })
    values.recruitment_proposal = state.infoJob?.id
    careersApi
      .saveApply(values)
      .then((res) => {
        setState({
          loaddingApply: false,
          applied: true
        })
      })
      .catch((err) => {
        //props.submitError();
        console.log("err", err.response)
        setState({ loaddingApply: false })
        //  You have already applied to this job
        notification.showError({
          text: useFormatMessage("modules.careers.notification.exist")
        })
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setState({ loaddingApply: true })
    careersApi
      .getInfoBySlug(slug)
      .then((res) => {
        setState({
          loaddingApply: false,
          infoJob: res.data
        })
      })
      .catch((err) => {
        history("/careers")
      })
  }

  return (
    <React.Fragment>
      <Card>
        <div className="p-md-0 div-header">
          <div className="name mt-5">Life Media</div>
          <div className="name">
            {useFormatMessage("modules.careers.text.open_positions")}
          </div>
        </div>
        <Card className="card-jobs mt-1">
          {state.applied && (
            <CardBody className="card-applied text-center">
              <span>
                {useFormatMessage("modules.careers.notification.applid_ss", {
                  job_name: state.infoJob?.recruitment_code
                })}
              </span>
              <div
                className="mt-2 text-primary"
                onClick={() => history("/careers")}>
                {useFormatMessage("modules.careers.text.back_job")}
              </div>
            </CardBody>
          )}

          {!state.applied && (
            <>
              <CardHeader className="hearder-jobs pb-0">
                {useFormatMessage("modules.careers.text.application_form")}
              </CardHeader>
              <Row className="contentWrapper">
                <Col>
                  <hr />
                </Col>
              </Row>
              <CardBody className="pt-0 mt-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col sm="12">
                      <ErpInput
                        type="text"
                        name="candidate_name"
                        useForm={methods}
                        required
                        label={"Full Name"}
                        placeholder={"Jonny Dark"}
                      />
                    </Col>

                    <Col sm="6">
                      <ErpInput
                        type="text"
                        name="candidate_email"
                        useForm={methods}
                        required
                        validateRules={{
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: useFormatMessage("validate.email")
                          }
                        }}
                        label={"Email Address"}
                        placeholder={"name@gmail.com"}
                      />
                    </Col>
                    <Col sm="6">
                      <ErpInput
                        type="text"
                        name="candidate_phone"
                        useForm={methods}
                        required
                        validateRules={{
                          pattern: {
                            value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                            message: useFormatMessage("validate.phoneNumber")
                          }
                        }}
                        label={"Phone number"}
                        placeholder={"+84 336219199"}
                      />
                    </Col>
                    <Col sm="6" className="mt-1">
                      <ErpFileUpload
                        name="cv"
                        id="cv"
                        useForm={methods}
                        required
                        label={"CV/Resume"}
                      />
                    </Col>
                    <Col sm="12" className="mt-1">
                      <ErpInput
                        type="textarea"
                        name="candidate_note"
                        useForm={methods}
                        label={"Cover Letter"}
                        placeholder={"Cover Letter"}
                      />
                    </Col>
                    <Col sm="12" className="mt-1">
                      <div hidden>
                        <ErpInput
                          type="text"
                          name="checkrb"
                          useForm={methods}
                        />
                      </div>
                      <Button.Ripple
                        color="primary"
                        type="submit"
                        disabled={state.loaddingApply}>
                        <span className="align-self-center">Submit</span>
                      </Button.Ripple>
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </>
          )}
        </Card>
        <div className="bread-crumbs mt-1">
          <span className="title" onClick={() => history("/careers")}>
            {useFormatMessage("modules.careers.text.jobs")}
          </span>{" "}
          <i className="ms-1 me-1 fa-regular fa-angle-right"></i>{" "}
          <span className="title" onClick={() => history("/careers/" + slug)}>
            {state.infoJob?.recruitment_code}
          </span>{" "}
          <i className="ms-1 me-1 fa-regular fa-angle-right"></i>
          {useFormatMessage("modules.careers.text.application_form")}
        </div>
      </Card>
    </React.Fragment>
  )
}

export default Apply
