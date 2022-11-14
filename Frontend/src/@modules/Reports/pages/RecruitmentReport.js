// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
import { RecruitmentApi } from "../common/RecruitmentApi"
import moment from "moment"
// ** Styles
import "../assets/scss/recruitment.scss"
import { Card, CardBody, CardHeader } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import FilterRecruitment from "../components/recruitment/FilterRecruitment"
import ListRecruitment from "../components/recruitment/ListRecruitment"

const RecruitmentReport = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    filter: {
      from_date: moment().startOf("month").format("YYYY-MM-DD"),
      to_date: moment().endOf("month").format("YYYY-MM-DD"),
      publish_status: "",
      department: "",
      office: ""
    },
    recruitmentData: [],
    hiringWorkflowData: []
  })

  const moduleData = useSelector((state) => state.app.modules.recruitments)
  const moduleName = moduleData.config.name
  const metas = moduleData.metas
  const options = moduleData.options

  const optionsModules = useSelector((state) => state.app.optionsModules)

  const loadRecruitment = () => {
    setState({
      loading: true
    })
    RecruitmentApi.loadRecruitment(state.filter)
      .then((res) => {
        setState({
          recruitmentData: res.data.list_recruitment,
          hiringWorkflowData: res.data.list_hiring_workflow,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          recruitmentData: [],
          hiringWorkflowData: [],
          loading: false
        })
      })
  }

  const setFilter = (filter) => {
    setState({
      filter: {
        ...state.filter,
        ...filter
      }
    })
  }

  // ** effect
  useEffect(() => {
    loadRecruitment()
  }, [state.filter])

  // ** render
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[
          { title: useFormatMessage("modules.reports.title") },
          { title: useFormatMessage("modules.reports.recruitment.title") }
        ]}
      />
    )
  }

  const renderHeader = () => {
    return (
      <Fragment>
        <div className="d-flex flex-wrap w-100 mb-1">
          <div className="d-flex align-items-center">
            <i className="far fa-computer-classic icon-circle bg-icon-green"></i>
            <span className="instruction-bold">
              {useFormatMessage("modules.reports.recruitment.title")}
            </span>
            <span className="text-small ms-50">
              {useFormatMessage("modules.reports.recruitment.text.description")}
            </span>
          </div>
        </div>
      </Fragment>
    )
  }

  const renderFilterRecruitment = () => {
    return (
      <FilterRecruitment
        filter={state.filter}
        moduleName={moduleName}
        metas={metas}
        options={options}
        optionsModules={optionsModules}
        setFilter={setFilter}
      />
    )
  }

  const renderListRecruitment = () => {
    return (
      <ListRecruitment
        recruitmentData={state.recruitmentData}
        hiringWorkflowData={state.hiringWorkflowData}
      />
    )
  }

  return (
    <Fragment>
      <div className="recruitment-report">
        {renderBreadcrumb()}
        <Card>
          <CardHeader>{renderHeader()}</CardHeader>
          <CardBody>
            <Fragment>{renderFilterRecruitment()}</Fragment>
            <Fragment>
              {state.loading ? <AppSpinner /> : renderListRecruitment()}
            </Fragment>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}

export default RecruitmentReport
