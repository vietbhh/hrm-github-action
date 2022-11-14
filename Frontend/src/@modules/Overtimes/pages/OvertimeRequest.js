// ** React Imports
import { Fragment, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { overtimeApi } from "../common/api"
// ** Styles
import { Card, CardHeader, CardBody, NavLink, Button } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import OverTimerFilter from "../components/details/OverTimerFilter"
import ListOvertime from "../components/details/ListOvertime"
import PaginationOvertime from "../components/details/PaginationOvertime"
import AddOverTimeModal from "../components/modals/AddOverTimeModal"

const OvertimeRequest = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    listOvertime: [],
    modal: false,
    isEditModal: false,
    modalData: {},
    filter: {
      page: 1,
      limit: 10,
      status: []
    }
  })

  const moduleData = useSelector((state) => state.app.modules.overtimes)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const toggleModal = () => {
    setState({
      modal: !state.modal
    })
  }

  const setIsEditModal = (status) => {
    setState({
      isEditModal: status
    })
  }

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

  const loadData = () => {
    setState({
      loading: true
    })

    overtimeApi
      .getOvertimeRequest(state.filter)
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

  const handleAddOvertime = () => {
    setIsEditModal(false)
    toggleModal()
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
          {
            title: useFormatMessage("modules.overtimes.title.request_overtime")
          }
        ]}
        custom={
          <Button.Ripple color="primary" onClick={() => handleAddOvertime()}>
            <i className="icpega Actions-Plus"></i> &nbsp;
            <span className="align-self-center">
              {useFormatMessage("modules.overtimes.buttons.new_overtime")}
            </span>
          </Button.Ripple>
        }
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
          fromComponent="request"
          listOvertime={state.listOvertime}
          toggleModalAction={toggleModal}
          setIsEditModal={setIsEditModal}
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

  const renderAddOvertimeModal = () => {
    return (
      <AddOverTimeModal
        modal={state.modal}
        isEditModal={state.isEditModal}
        modalData={state.modalData}
        moduleName={moduleName}
        metas={metas}
        options={options}
        optionsModules={optionsModules}
        handleModal={toggleModal}
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
                    <i className="far fa-calendar-plus" />
                  </span>
                  {useFormatMessage("modules.overtimes.title.request_overtime")}
                </h4>
              </CardHeader>
              <CardBody className="pt-50">
                <Fragment>{renderOvertimeFilter()}</Fragment>
                <Fragment>{renderListOvertime()}</Fragment>
                <Fragment>{renderPagination()}</Fragment>
              </CardBody>
            </Card>
          </div>

          <Fragment>{renderAddOvertimeModal()}</Fragment>
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default OvertimeRequest
