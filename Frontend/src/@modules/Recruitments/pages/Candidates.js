// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import AddCandidateModal from "@modules/Recruitments/components/modals/AddCandidateModal"
import React, { Fragment, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button, Col, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { candidatesApi, recruitmentsApi } from "../common/api"
import CardCandidate from "../components/CardCandidate"
import FiltersCandidates from "../components/FiltersCandidates"
import CandidateDetail from "../components/modals/CandidateDetailModal"
import AssignJobModal from "../components/modals/AssignJobModal"
import PaginationCus from "../components/PaginationCus"
import RecruitmentLayout from "./RecruitmentLayout"

import { EmptyContent } from "@apps/components/common/EmptyContent"
const Candidates = (props) => {
  // ** Props

  const candidates = useSelector((state) => state.app.modules.candidates)
  const module = candidates.config
  const metas = candidates.metas
  const options = candidates.options
  const moduleName = candidates.config.name
  const ability = useContext(AbilityContext)
  const userSetting = useSelector((state) => state.auth.settings)
  const [state, setState] = useMergedState({
    params: {
      search: "",
      filters: {},
      page: 1,
      limit: 12
    },
    pagination: {
      perPage: 12,
      toltalRow: 0,
      currentPage: 1
    },
    dataList: [],
    dataReview: "",
    dataDetail: {},
    listCVUpload: {},
    listCVInvalid: {},
    listFileCV: [],
    listEmployeeEmail: [],
    modalDetail: false,
    modalAddnew: false,
    settingModal: false,
    uploadCVModal: false,
    showPreviewCV: false,
    loading: false,
    viewGrid: false,
    recruitmentProposal: {}
  })
  const handleNewRe = () => {
    setState({ modalAddnew: !state.modalAddnew })
  }

  const handleDetail = (data, modal = !state.modalDetail) => {
    if (data) {
      candidatesApi.getInfo(data.id).then((res) => {
        setState({
          modalDetail: modal,
          dataDetail: res.data,
          loading: false
        })
      })
    } else {
      setState({ modalDetail: !state.modalDetail })
    }
  }

  const loadData = (props) => {
    const paramsEx = {
      ...state.params,
      ...props
    }
    setState({ loading: true })
    recruitmentsApi.loadCandidate(paramsEx).then((res) => {
      setState({
        loading: false,
        dataList: res.data.results,
        dataReview: res.data.reviews,
        params: { ...paramsEx },
        pagination: {
          ...state.pagination,
          toltalRow: res.data.recordsTotal,
          currentPage: paramsEx.page,
          perPage: paramsEx.limit
        }
      })
    })
  }
  useEffect(() => {
    loadData()
  }, [])
  // ** Function to getTasks based on search query

  const addBtn = ability.can("add", moduleName) ? (
    <Button.Ripple color="primary" onClick={() => handleNewRe()}>
      <i className="icpega Actions-Plus"></i> &nbsp;
      <span className="align-self-center">
        {useFormatMessage("modules.candidates.button.new_candidate")}
      </span>
    </Button.Ripple>
  ) : (
    ""
  )
  const renderCandidate = () => {
    if (!state.dataList.length) {
      return (
        <Col sm={12}>
          <EmptyContent />
        </Col>
      )
    }
    return state.dataList?.map((item) => {
      return (
        <Col sm={3} key={item.id} className="mb-3">
          <CardCandidate
            item={item}
            review={state.dataReview[item.id]}
            handleDetail={handleDetail}
          />
        </Col>
      )
    })
  }
  return (
    <Fragment>
      <RecruitmentLayout
        state={state}
        setState={setState}
        module={module}
        moduleName={moduleName}
        metas={metas}
        options={options}
        loadData={loadData}
        filter={<FiltersCandidates state={state} loadData={loadData} />}
        breadcrumbs={
          <Breadcrumbs
            list={[
              {
                title: useFormatMessage("menu.candidates")
              }
            ]}
            custom={addBtn}
          />
        }>
        <div className="pt-3">
          <Row>
            {state.loading ? (
              <AppSpinner />
            ) : (
              <>
                {renderCandidate()}
                <div className="col-12 mt-2">
                  {Math.ceil(
                    state.pagination.toltalRow / state.pagination.perPage
                  ) > 1 && (
                    <PaginationCus
                      currentPage={state.pagination.currentPage}
                      pagination={state.pagination}
                      loadData={loadData}
                    />
                  )}
                </div>
              </>
            )}
          </Row>
        </div>
      </RecruitmentLayout>
      <AddCandidateModal
        loadData={loadData}
        modal={state.modalAddnew}
        handleNewRe={handleNewRe}
        handleDetail={handleDetail}
      />
      <CandidateDetail
        modal={state.modalDetail}
        dataDetail={state.dataDetail}
        handleDetail={handleDetail}
        loadData={loadData}
      />
    </Fragment>
  )
}

export default Candidates
