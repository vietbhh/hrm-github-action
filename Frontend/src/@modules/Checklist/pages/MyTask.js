import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { useSelector } from "react-redux"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { ChecklistApi } from "../common/api"
import { Col, Row, Card, CardBody, Button } from "reactstrap"
import CompleteTaskModal from "../components/modals/CompleteTaskModal"
import { debounce } from "lodash-es"
import { ErpInput } from "@apps/components/common/ErpField"
import TableMyTask from "../components/detail/my-task/TableMyTask"
import SwAlert from "@apps/utility/SwAlert"
import notification from "@apps/utility/notification"

const { Fragment, useEffect, useRef } = require("react")

const MyTask = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    additionalData: [],
    loading: [],
    perPage: 15,
    recordsTotal: 0,
    currentPage: 1,
    searchVal: "",
    orderCol: "id",
    orderType: "desc",
    modalComplete: false,
    modalRevert: false,
    dataCurrentChecklist: {},
    modalData: {},
    isCompleteTaskFromTodo: true,
    chosenTask: []
  })

  const moduleData = useSelector((state) => state.app.modules.checklist_detail)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const [defaultStatus] = options.status.filter((item) => {
    return item.name_option === "inprogress"
  })

  const moduleEmployeeData = useSelector((state) => state.app.modules.employees)
  const moduleEmployee = moduleEmployeeData.config
  const moduleEmployeeName = moduleEmployee.name
  const metasEmployee = moduleEmployeeData.metas
  const optionsEmployee = moduleEmployeeData.options

  const moduleChecklistDetailData = useSelector(
    (state) => state.app.modules.checklist_detail
  )
  const moduleNameChecklistDetail = moduleChecklistDetailData.config.name
  const optionsChecklistDetail = moduleChecklistDetailData.options

  const [filters, setFilters] = useMergedState({
    status: defaultStatus.value,
    task_name: ""
  })

  const loadData = () => {
    setState({ loading: true })
    const params = {
      perPage: state.perPage,
      orderCol: state.orderCol,
      orderType: state.orderType,
      filters: filters
    }
    ChecklistApi.getListToDo(params).then((res) => {
      setState({
        data: res.data.results,
        additionalData: res.data.additionalData,
        loading: false,
        recordsTotal: res.data.recordsTotal,
        currentPage: res.data.page,
        perPage: params.perPage,
        orderCol: params.orderCol,
        orderType: params.orderType
      })
    })
  }

  const toggleCompleteTaskModal = () => {
    setState({
      modalComplete: !state.modalComplete
    })
  }

  const setChosenTask = (data) => {
    setState({
      chosenTask: data
    })
  }

  const handleCompleteTask = (data, isCompleteTaskFromTodo = false) => {
    const [currentChecklist] = state.additionalData.checklist.filter((item) => {
      return item.id === data.checklist_id.value
    })
    setState({
      dataCurrentChecklist: currentChecklist,
      modalData: data,
      isCompleteTaskFromTodo: isCompleteTaskFromTodo
    })
    toggleCompleteTaskModal()
  }

  const handleRevertTask = (data) => {
    setState({ modalData: data })
    toggleRevertTaskModal()
  }

  const debounceSearch = useRef(
    debounce((nextValue) => {
      setState({
        data: [],
        loading: true,
        page: 1
      })
      setFilters({ task_name: nextValue })
    }, process.env.REACT_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  const handleCompleteChosenTask = () => {
    SwAlert.showWarning({
      title: useFormatMessage("modules.checklist.buttons.complete_task"),
      text: useFormatMessage("modules.checklist.text.complete_task_warning")
    }).then((res) => {
      if (res.isConfirmed === true) {
        ChecklistApi.completeMultiChecklistDetail({
          checklist: state.chosenTask
        })
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
            loadData()
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.save.error")
            })
          })
      }
    })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [filters, state.searchVal])

  // ** render
  const renderTable = () => {
    return (
      <TableMyTask
        data={state.data}
        additionalData={state.additionalData}
        chosenTask={state.chosenTask}
        handleCompleteTask={handleCompleteTask}
        setChosenTask={setChosenTask}
      />
    )
  }

  const renderCompleteTaskButton = () => {
    if (state.chosenTask.length > 0) {
      return (
        <Button.Ripple
          size="sm"
          color="primary"
          className="mb-1"
          onClick={() => handleCompleteChosenTask()}>
          {useFormatMessage("modules.checklist.buttons.complete_task")}
        </Button.Ripple>
      )
    }

    return ""
  }

  const renderCompleteModal = () => {
    return (
      <CompleteTaskModal
        isMyTask={true}
        dataCurrentChecklist={state.dataCurrentChecklist}
        data={state.modalData}
        modal={state.modalComplete}
        handleModal={toggleCompleteTaskModal}
        module={moduleEmployeeData}
        moduleName={moduleEmployeeName}
        metas={metasEmployee}
        options={optionsEmployee}
        moduleNameChecklistDetail={moduleNameChecklistDetail}
        optionsChecklistDetail={optionsChecklistDetail}
        optionsModules={optionsModules}
        loadData={loadData}
        viewChecklistDetailInfoOnly={false}
        isCompleteTaskFromTodo={state.isCompleteTaskFromTodo}
      />
    )
  }

  return (
    <Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage(`modules.checklist.title.checklist`)
          },
          {
            title: useFormatMessage(`modules.checklist.title.my_task`)
          }
        ]}
      />
      <div className="checklist-page">
        <Card
          className="employees_list_tbl no-box-shadow"
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }}>
          <CardBody className="d-flex flex-wrap w-100">
            <Row style={{ width: "100%" }}>
              <Col sm={3} className="mb-2">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.status
                  }}
                  nolabel
                  options={options}
                  optionsModules={optionsModules}
                  onChange={(e) => {
                    setFilters({ status: e?.value || "" })
                  }}
                  defaultValue={defaultStatus}
                />
              </Col>
              <Col sm={3} className="mb-25">
                <ErpInput
                  placeholder="search..."
                  formGroupClass="search-filter"
                  prepend={<i className="iconly-Search icli" />}
                  nolabel
                  onKeyUp={(e) => handleSearchVal(e)}
                />
              </Col>
            </Row>
            <Row style={{ width: "100%" }}>
              <Col sm={12}>
                <Fragment>{renderCompleteTaskButton()}</Fragment>
              </Col>
              <Col sm={12} className="mb-0 ps-0 ms-1 mt-2 table-my-task">
                {!state.loading ? renderTable() : <AppSpinner />}
              </Col>
            </Row>
          </CardBody>
        </Card>
        {state.modalComplete && renderCompleteModal()}
      </div>
    </Fragment>
  )
}

export default MyTask
