// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { recruitmentsApi } from "../common/api"
import Filters from "../components/Filters"
import Recruitment from "../components/Recruitment"
import Viewtype from "../components/Viewtype"
import RecruitmentLayout from "./RecruitmentLayout"
import { Navigate, useParams } from "react-router-dom"
const Approval = (props) => {
  // ** Props
  const recruitments = useSelector((state) => state.app.modules.recruitments)
  const module = recruitments.config
  const metas = recruitments.metas
  const options = recruitments.options
  const moduleName = recruitments.config.name
  const userSetting = useSelector((state) => state.auth.settings)
  const ability = useContext(AbilityContext)
  if (!ability.can("approve", "recruitments")) {
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
      limit: userSetting.perPage || 10,
      type: "approve"
    },
    pagination: {
      perPage: userSetting.perPage || 10,
      toltalRow: 0,
      currentPage: 1
    },
    dataList: [],
    modalDetail: false,
    modalAddnew: false,
    settingModal: false,
    loading: false,
    viewGrid: true,
    tab: "approve",
    requestDetail: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  // ** Function
  const loadData = (props) => {
    const paramsEx = {
      ...state.params,
      ...props
    }
    setState({ loading: true })
    recruitmentsApi.getApproveData(paramsEx).then((res) => {
      setState({
        loading: false,
        dataList: res.data.results,
        params: { ...paramsEx },
        pagination: {
          ...state.pagination,
          toltalRow: res.data.recordsTotal,
          currentPage: paramsEx.page,
          perPage: paramsEx.length
        }
      })
    })
  }
  const handleNewRe = (a = true) => {
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
        filter={<Filters params={state.params} loadData={loadData} />}
        viewType={<Viewtype viewGrid={state.viewGrid} setState={setState} />}
        breadcrumbs={
          <Breadcrumbs
            list={[
              { title: useFormatMessage("menu.recruitments") },
              { title: useFormatMessage("menu.approval") }
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
            loadData={loadData}
            type="approve"
          />
        )}
      </RecruitmentLayout>
    </>
  )
}

export default Approval
