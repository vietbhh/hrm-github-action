// ** React Imports
import {
  useFormatMessage,
  useMergedState,
  addComma
} from "@apps/utility/common"
import "@modules/Careers/assets/careers.scss"
import React, { useEffect, Fragment } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import { careersApi } from "../common/api"
const JobDetail = (props) => {
  // ** Props

  const history = useNavigate()
  const slug = useParams().slug
  const [state, setState] = useMergedState({
    params: {
      search: "",
      page: 1
    },
    infoJob: {}
  })
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setState({ loading: true })
    careersApi
      .getInfoBySlug(slug)
      .then((res) => {
        setState({
          loading: false,
          infoJob: res.data
        })
      })
      .catch((err) => {
        history("/careers")
      })
  }

  const handleApply = () => {
    history("/careers/apply/" + slug)
  }
  return (
    <React.Fragment>
      <Card>
        <div className="p-md-0 div-header">
          <div className="name mt-5">Life Media</div>
          <div className="name">
            {useFormatMessage("modules.careers.text.join_us")}
          </div>
        </div>
        <Card className="card-jobs mt-1">
          <CardHeader className="hearder-jobs pb-0">
            {state.infoJob?.recruitment_code
              ? state.infoJob?.recruitment_code
              : "..."}
            <Button.Ripple color="primary" onClick={() => handleApply()}>
              <span className="align-self-center">
                {useFormatMessage("modules.careers.text.apply_now")}
              </span>
            </Button.Ripple>
          </CardHeader>
          <Row className="contentWrapper">
            <Col>
              <hr />
            </Col>
          </Row>
          <CardBody className="pt-0">
            <Row>
              <Col sm="12">
                <i className="fal fa-briefcase me-1"></i>
                {state.infoJob?.office?.label}
              </Col>
              <Col sm="12 mt-1">
                <i className="far fa-building me-1"></i>{" "}
                {state.infoJob?.department?.label}
              </Col>

              <Col sm="12 mt-2">
                <h4>
                  {useFormatMessage("modules.careers.text.employment_info")}
                </h4>
                <div className="row mb-50">
                  <span className="col-6 ">
                    {useFormatMessage("modules.careers.text.employment_type")} :{" "}
                    {useFormatMessage(state.infoJob?.employment_type?.label)}
                  </span>
                  <span className="col-6">
                    {useFormatMessage("modules.careers.text.salary")} :{" "}
                    {state.infoJob?.salary_from &&
                      addComma(state.infoJob?.salary_from)}{" "}
                    -{" "}
                    {state.infoJob?.salary_to &&
                      addComma(state.infoJob?.salary_to)}
                  </span>
                </div>
                <div className="row mb-50">
                  <span className="col-6">
                    {useFormatMessage("modules.careers.text.quantity")} :{" "}
                    {state.infoJob?.quantity}{" "}
                  </span>
                  <span className="col-6">
                    {useFormatMessage("modules.careers.text.experience")} :{" "}
                    {state.infoJob?.experience}
                  </span>
                </div>
                <div className="row mb-50">
                  <span className="col-6">
                    {useFormatMessage("modules.careers.text.job_title")} :{" "}
                    {state.infoJob?.job_title?.label}
                  </span>
                  <span className="col-6">
                    {useFormatMessage("modules.careers.text.degree")} : THPT
                  </span>
                </div>
                <div>
                  {useFormatMessage("modules.careers.text.work_location")} :{" "}
                  {state.infoJob?.offices_address}
                </div>
              </Col>
              <Col sm="12 mt-2">
                <h4>
                  {useFormatMessage("modules.careers.text.job_description")}
                </h4>
                <Fragment>{state.infoJob?.descriptions}</Fragment>
              </Col>
              <Col sm="12 mt-2">
                <h4>{useFormatMessage("modules.careers.text.requirement")}</h4>
                {state.infoJob?.requirements}
              </Col>
              <Col sm="12 mt-2">
                <h4>{useFormatMessage("modules.careers.text.benefits")}</h4>
                {state.infoJob?.benefits}
              </Col>
            </Row>
          </CardBody>
        </Card>
        <div className="bread-crumbs mt-1">
          <span className="title" onClick={() => history("/careers")}>
            {useFormatMessage("modules.careers.text.jobs")}
          </span>{" "}
          <i className="ms-1 me-1 fa-regular fa-angle-right"></i>{" "}
          {state.infoJob?.recruitment_code}
        </div>
        <div className="footer" hidden>
          {state.infoJob?.recruitment_code}
        </div>
      </Card>
    </React.Fragment>
  )
}

export default JobDetail
