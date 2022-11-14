// ** React Imports
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { overtimeApi } from "../common/api"
// ** Styles
import { Card, CardHeader, CardBody } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import OverTimerFilter from "../components/details/OverTimerFilter"
import ListOvertime from "../components/details/ListOvertime"
import PaginationOvertime from "../components/details/PaginationOvertime"
import ActionOvertimeModal from "../components/modals/ActionOvertimeModal"

const OvertimeManage = (props) => {
  const moduleData = useSelector((state) => state.app.modules.overtimes)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const [defaultStatus] = options.status.filter((item) => {
    return item.name_option === "pending"
  })

  const [state, setState] = useMergedState({
    loading: false,
    listOvertime: [],
    modalAction: false,
    modalData: {},
    actionType: "",
    filter: {
      page: 1,
      limit: 10,
      status: [defaultStatus?.value]
    }
  })

  const setModalData = (data) => {
    setState({
      modalData: data
    })
  }

  const setFilter = (filters) => {
    setState({
      filter: filters
    })
  }

  const toggleModalAction = () => {
    setState({
      modalAction: !state.modalAction
    })
  }

  const setActionType = (type) => {
    setState({
      actionType: type
    })
  }

  const loadData = () => {
    setState({
      loading: true
    })

    overtimeApi
      .getOvertime(state.filter)
      .then((res) => {
        setState({
          listOvertime: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          listOvertime: [],
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.filter])

  // ** render
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[
          { title: useFormatMessage("modules.overtimes.title.index") },
          { title: useFormatMessage("modules.overtimes.title.manage_overtime") }
        ]}
      />
    )
  }

  const renderOvertimeFilter = () => {
    return (
      <OverTimerFilter
        filter={state.filter}
        options={options}
        setFilter={setFilter}
      />
    )
  }

  const renderListOvertime = () => {
    if (state.loading) {
      return ""
    }

    if (state.listOvertime.length > 0) {
      return (
        <ListOvertime
          fromComponent="manage"
          listOvertime={state.listOvertime}
          toggleModalAction={toggleModalAction}
          setActionType={setActionType}
          setModalData={setModalData}
        />
      )
    }

    return <EmptyContent className="mt-3" />
  }

  const renderPagination = () => {
    return (
      <PaginationOvertime
        filter={state.filter}
        listOvertime={state.listOvertime}
        setFilter={setFilter}
      />
    )
  }

  const renderActionOverTimeModal = () => {
    return (
      <ActionOvertimeModal
        modal={state.modalAction}
        modalData={state.modalData}
        actionType={state.actionType}
        moduleName={moduleName}
        metas={metas}
        optionsModules={optionsModules}
        handleModal={toggleModalAction}
        loadData={loadData}
      />
    )
  }

  const renderComponent = () => {
    return (
      <Fragment>
        <div className="overtime-page">
          <div className="overtime-content">
            <Fragment>{renderBreadcrumb()}</Fragment>
            <Card>
              <CardHeader>
                <h4>
                  <span className="title-icon">
                    <i className="far fa-user-clock" />
                  </span>
                  {useFormatMessage("modules.overtimes.title.manage_overtime")}
                </h4>
              </CardHeader>
              <CardBody className="pt-50">
                <Fragment>{renderOvertimeFilter()}</Fragment>
                <Fragment>{renderListOvertime()}</Fragment>
                <Fragment>{renderPagination()}</Fragment>
              </CardBody>
            </Card>
          </div>

          <Fragment>{renderActionOverTimeModal()}</Fragment>
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default OvertimeManage
