// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { useEffect, useContext, Fragment } from "react"
import { useSelector } from "react-redux"
import Filters from "../components/Filters"
import Viewtype from "../components/Viewtype"
import Recruitment from "../components/Recruitment"
import RecruitmentLayout from "./RecruitmentLayout"
import { AbilityContext } from "utility/context/Can"
import { Button } from "reactstrap"
import { recruitmentsApi } from "../common/api"
import { Navigate } from "react-router-dom"
const Jobs = (props) => {
  // ** Props
  const recruitments = useSelector((state) => state.app.modules.recruitments)
  const module = recruitments.config
  const metas = recruitments.metas
  const options = recruitments.options
  const moduleName = recruitments.config.name
  const userSetting = useSelector((state) => state.auth.settings)
  const ability = useContext(AbilityContext)
  if (!ability.can("jobs", "recruitments")) {
    return (
      <Fragment>
        <AppSpinner />
        <Navigate to="/not-found" replace />
      </Fragment>
    )
  }
  const [state, setState] = useMergedState({
    params: {
      search: "",
      filters: {},
      page: 1,
      limit: userSetting.perPage || 10
    },
    pagination: {
      perPage: userSetting.perPage || 10,
      toltalRow: 0,
      currentPage: 1
    },
    dataList: "",
    modalDetail: false,
    modalAddnew: false,
    settingModal: false,
    loading: false,
    viewGrid: true,
    requestDetail: "",
    tab: "jobs"
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
    recruitmentsApi.getJobsData(paramsEx).then((res) => {
      setState({
        loading: false,
        dataList: res.data.data,
        params: { ...paramsEx },
        pagination: {
          ...state.pagination,
          toltalRow: res.data.recordsTotal,
          currentPage: paramsEx.page
        }
      })
    })
  }

  const handleNewRe = () => {
    setState({
      modalAddnew: !state.modalAddnew,
      requestDetail: { approved: "0" }
    })
  }

  const addBtn = ability.can("add", moduleName) ? (
    <Button.Ripple color="primary" onClick={() => handleNewRe()}>
      <i className="icpega Actions-Plus"></i> &nbsp;
      <span className="align-self-center">
        {useFormatMessage("modules.recruitments.button.new_request")}
      </span>
    </Button.Ripple>
  ) : (
    ""
  )
  return (
    <>
      <RecruitmentLayout
        state={state}
        setState={setState}
        module={module}
        metas={metas}
        options={options}
        loadData={loadData}
        filter={
          <Filters params={state.params} loadData={loadData} tab="jobs" />
        }
        viewType={<Viewtype viewGrid={state.viewGrid} setState={setState} />}
        breadcrumbs={
          <Breadcrumbs
            list={[
              { title: useFormatMessage("menu.recruitments") },
              { title: useFormatMessage("menu.jobs") }
            ]}
            custom={addBtn}
          />
        }>
        {state.loading && state.viewGrid ? (
          <div className="mt-3">
            <AppSpinner />
          </div>
        ) : (
          <Recruitment
            state={state}
            setState={setState}
            data={state.dataList}
            options={options}
            type="jobs"
            loadData={loadData}
          />
        )}
      </RecruitmentLayout>
    </>
  )
}

export default Jobs
