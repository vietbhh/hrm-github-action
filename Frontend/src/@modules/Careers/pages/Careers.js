// ** React Imports
import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpInput } from "@apps/components/common/ErpField"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import "@modules/Careers/assets/careers.scss"
import React, { useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { careersApi } from "../common/api"
const Careers = (props) => {
  // ** Props

  const history = useNavigate()
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    params: {
      search: "",
      page: 1
    },
    dataList: []
  })
  useEffect(() => {
    loadData()
  }, [])

  const loadData = (props) => {
    const paramsEx = {
      ...state.params,
      ...props
    }
    setState({ loading: true })
    careersApi.getData(paramsEx).then((res) => {
      setState({
        loading: false,
        dataList: res.data.data
      })
    })
  }

  const typingTimeoutRef = useRef(null)
  const handleFilterText = (e) => {
    const stateEx = { ...state.params, page: 1, search: e }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      loadData({ ...stateEx })
    }, 500)
  }

  const handleView = (slug) => {
    history("/careers/" + slug)
  }

  const renderJobs = (arr) => {
    if (arr.length <= 0) {
      return <EmptyContent />
    }
    return arr.map((item) => {
      return (
        <Col sm="12">
          <div className="job-info d-flex">
            <div className="info">
              <div className="job-name" onClick={() => handleView(item.slug)}>
                {item.recruitment_code}
              </div>
              <div className="job-description">
                <i className="fal fa-briefcase"></i> {item?.office?.label}
                <i className="far fa-building ms-1"></i>
                {"  "}
                {item?.department?.label}
              </div>
            </div>
            <div className="btn-view ms-auto">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleView(item.slug)}>
                {useFormatMessage("modules.careers.text.view_job")}
              </button>
            </div>
          </div>
        </Col>
      )
    })
  }

  return (
    <React.Fragment>
      <Card>
        <div className="p-md-0 div-header">
          <div className="name mt-5">Life Media</div>
          <div className="name">
            {useFormatMessage("modules.careers.text.jobs_board")}
          </div>
        </div>
        <Card className="card-jobs">
          <CardHeader className="hearder-jobs pb-0">
            {useFormatMessage("modules.careers.text.jobs")}
          </CardHeader>
          <Row className="contentWrapper">
            <Col>
              <hr />
            </Col>
          </Row>
          <CardBody className="pt-0 ">
            <Row>
              <Col sm="12">
                <ErpInput
                  prepend={<i className="iconly-Search icli"></i>}
                  onChange={(e) => handleFilterText(e.target.value)}
                  type="text"
                  name="app_name"
                  id="app_name"
                  nolabel
                  placeholder={"Search by Job Title, Office, Department"}
                />
              </Col>
              <div className="mt-1"></div>
              <div className="content-job">
                {state.loading && <AppSpinner />}
                {!state.loading && renderJobs(state.dataList)}
              </div>
            </Row>
          </CardBody>
        </Card>
      </Card>
    </React.Fragment>
  )
}

export default Careers
