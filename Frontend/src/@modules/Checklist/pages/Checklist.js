import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { useSelector } from "react-redux"
import { AbilityContext } from "utility/context/Can"
import {
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { ChecklistApi } from "../common/api"
import { useLocation } from "react-router-dom"
import { Col, Row, Card, CardBody } from "reactstrap"
import { Space } from "antd"
import EmployeeTag from "../components/detail/EmployeeTag"
import AssignedChecklistInfo from "../components/detail/AssignedChecklistInfo"
import CompleteTaskModal from "../components/modals/CompleteTaskModal"
import RevertTaskModal from "../components/modals/RevertTaskModal"
import AddTaskModal from "../components/modals/AddTaskModal"
import ConfirmCompleteAllTaskModal from "../components/modals/ConfirmCompleteAllTaskModal"
import notification from "@apps/utility/notification"
import AssignChecklistModal from "../components/modals/AssignChecklistModal"
import { debounce } from "lodash-es"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpInput } from "@apps/components/common/ErpField"

const { Fragment, useEffect, useContext, useRef } = require("react")

const Checklist = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    dataAdditional: [],
    loading: true,
    perPage: 15,
    recordsTotal: 0,
    currentPage: 1,
    searchVal: "",
    modalData: [],
    dataCurrentChecklist: {},
    completeModal: false,
    revertModal: false,
    editTaskModal: false,
    fillDataChecklistDetail: {},
    viewChecklistDetailInfoOnly: false,
    confirmCompleteAllTaskModal: false,
    assignChecklistModal: false,
    isCompleteTask: false,
    chosenEmployee: {},
    currentChecklistIndex: "",
    orderCol: "id",
    orderType: "desc"
  })

  const moduleData = useSelector((state) => state.app.modules.checklist)
  const module = moduleData.config
  const moduleName = module.name
  const ability = useContext(AbilityContext)
  const metas = moduleData.metas
  const options = moduleData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const { pathname } = useLocation()

  const moduleEmployeeData = useSelector((state) => state.app.modules.employees)
  const moduleEmployee = moduleEmployeeData.config
  const moduleEmployeeName = moduleEmployee.name
  const metasEmployee = moduleEmployeeData.metas
  const optionsEmployee = moduleEmployeeData.options

  const moduleChecklistDetailData = useSelector(
    (state) => state.app.modules.checklist_detail
  )
  const optionsChecklistDetail = moduleChecklistDetailData.options
  const metasChecklistDetail = moduleChecklistDetailData.metas
  const moduleChecklistDetail = moduleChecklistDetailData.config
  const moduleNameChecklistDetail = moduleChecklistDetail.name

  const getType = (getTypeText = false) => {
    const typeParam = pathname.substring(pathname.lastIndexOf("/") + 1)
    if (getTypeText === true) {
      return typeParam
    }
    const getChosenType = (type, item) => {
      return item.name_option === type
    }

    const getCurrentType = () => {
      const [currentType] = options.type.filter(
        getChosenType.bind(this, typeParam.toLowerCase())
      )
      return currentType
    }
    return getCurrentType().value
  }

  const [filters, setFilters] = useMergedState({
    status: getOptionValue(options, "status", "inprogress"),
    employee_id: 0,
    hr_in_charge: 0,
    search_text: "",
    type: getType()
  })

  const toggleCompleteModal = () => {
    setState({
      completeModal: !state.completeModal
    })
  }

  const toggleRevertModal = () => {
    setState({
      revertModal: !state.revertModal
    })
  }

  const toggleEditTaskModal = () => {
    setState({
      editTaskModal: !state.editTaskModal
    })
  }

  const toggleConfirmCompleteAllTaskModal = () => {
    setState({
      confirmCompleteAllTaskModal: !state.confirmCompleteAllTaskModal
    })
  }

  const toggleAssignChecklistModal = () => {
    setState({
      assignChecklistModal: !state.assignChecklistModal
    })
  }

  const setModalData = (data) => {
    setState({
      modalData: data
    })
  }

  const setCurrentDataChecklist = (checklist) => {
    setState({
      dataCurrentChecklist: checklist
    })
  }

  const setFillDataChecklistDetail = (data) => {
    setState({
      fillDataChecklistDetail: data
    })
  }

  const setViewChecklistDetailInfoOnly = (status) => {
    setState({
      viewChecklistDetailInfoOnly: status
    })
  }

  const setChosenEmployee = (employee) => {
    setState({
      chosenEmployee: employee
    })
  }

  const setIsCompleteTask = (status) => {
    setState({
      isCompleteTask: status
    })
  }

  const setData = (index, data) => {
    const newData = [...state.data]
    newData[index] = { ...data }
    setState({
      data: [...newData]
    })
  }

  const setChecklistDetailData = (index, data, type = "update") => {
    const newDataAdditional = { ...state.dataAdditional }
    let newChecklistDetail = []
    if (type === "update") {
      newChecklistDetail = newDataAdditional.checklistDetail.map((item) => {
        if (item.id === index) {
          return { ...data }
        }
        return { ...item }
      })
    } else if (type === "remove") {
      newChecklistDetail = newDataAdditional.checklistDetail.filter((item) => {
        return item.id !== index
      })
    }
    newDataAdditional.checklistDetail = newChecklistDetail
    setState({
      dataAdditional: { ...newDataAdditional }
    })
  }

  const setCurrentChecklistIndex = (key) => {
    setState({
      currentChecklistIndex: key
    })
  }

  const loadData = () => {
    setState({
      loading: true
    })
    const params = {
      perPage: state.perPage,
      orderCol: state.orderCol,
      orderType: state.orderType,
      filters: filters,
      ...props
    }
    ChecklistApi.getDataTaskList(params).then((res, stateParams = {}) => {
      setState({
        data: res.data.results,
        dataAdditional: res.data.resultsAdditional,
        loading: false,
        recordsTotal: res.data.recordsTotal,
        currentPage: res.data.page,
        perPage: params.perPage,
        orderCol: params.orderCol,
        orderType: params.orderType,
        ...stateParams
      })
    })
  }

  const completeChecklist = (id, values, toggleConfirmModal = true) => {
    ChecklistApi.postCompleteChecklist(id, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        if (toggleConfirmModal) {
          toggleConfirmCompleteAllTaskModal()
          document.body.style.overflow = "scroll"
        }
        loadData()
        setState({ loading: false })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const debounceSearch = useRef(
    debounce((nextValue) => {
      setState({
        data: [],
        loading: true,
        page: 1
      })
      setFilters({ search_text: nextValue })
    }, process.env.REACT_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [filters, state.searchVal])

  useEffect(() => {
    setFilters({
      type: getType()
    })
  }, [getType()])

  // ** render
  const renderBreadCrumb = () => {
    return (
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage(`modules.checklist.title.checklist`)
          },
          {
            title: useFormatMessage(`modules.checklist.title.${getType(true)}`)
          }
        ]}
      />
    )
  }

  const renderFilter = () => {
    return (
      <Card
        className="employees_list_tbl no-box-shadow"
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }}>
        <CardBody className="d-flex flex-wrap w-100">
          <Row style={{ width: "100%" }}>
            <Col sm={3} className="mb-0">
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.status
                }}
                nolabel
                isClearable={false}
                options={options}
                optionsModules={optionsModules}
                onChange={(e) => {
                  setFilters({ status: e?.value })
                }}
              />
            </Col>
            <Col sm={3} className="mb-0">
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.hr_in_charge
                }}
                nolabel
                isClearable={true}
                optionsModules={optionsModules}
                onChange={(e) => {
                  setFilters({ hr_in_charge: e?.id })
                }}
              />
            </Col>
            <Col sm={3} className="mb-0">
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.employee_id
                }}
                nolabel
                options={options}
                isClearable={true}
                optionsModules={optionsModules}
                onChange={(e) => {
                  setFilters({ employee_id: e?.id })
                }}
              />
            </Col>
            <Col sm={3} className="mb-0">
              <ErpInput
                placeholder="search..."
                formGroupClass="search-filter"
                prepend={<i className="iconly-Search icli" />}
                nolabel
                onKeyUp={(e) => handleSearchVal(e)}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }

  const renderCompleteModal = () => {
    return (
      <CompleteTaskModal
        isMyTask={false}
        currentChecklistIndex={state.currentChecklistIndex}
        dataCurrentChecklist={state.dataCurrentChecklist}
        data={state.modalData}
        modal={state.completeModal}
        handleModal={toggleCompleteModal}
        moduleName={moduleEmployeeName}
        metas={metasEmployee}
        moduleNameChecklistDetail={moduleNameChecklistDetail}
        optionsModules={optionsModules}
        viewChecklistDetailInfoOnly={state.viewChecklistDetailInfoOnly}
        setData={setData}
        setChecklistDetailData={setChecklistDetailData}
        isCompleteTaskFromTodo={state.isCompleteTask}
      />
    )
  }

  const renderRevertModal = () => {
    return (
      <RevertTaskModal
        isMyTask={false}
        currentChecklistIndex={state.currentChecklistIndex}
        data={state.modalData}
        modal={state.revertModal}
        handleModal={toggleRevertModal}
        loadData={loadData}
        moduleName={moduleNameChecklistDetail}
        setData={setData}
        setChecklistDetailData={setChecklistDetailData}
      />
    )
  }

  const renderEditTaskModal = () => {
    return (
      <AddTaskModal
        modal={state.editTaskModal}
        handleModal={toggleEditTaskModal}
        loadData={loadData}
        metas={metasChecklistDetail}
        options={optionsChecklistDetail}
        module={moduleChecklistDetail}
        checklistInfo={state.dataCurrentChecklist}
        optionsModules={optionsModules}
        fillData={state.fillDataChecklistDetail}
        isEditModal={true}
        modalType="checklist_detail"
        checklistType={getType(true)}
        setChecklistDetailData={setChecklistDetailData}
      />
    )
  }

  const renderConfirmCompleteAllTaskModal = () => {
    return (
      <ConfirmCompleteAllTaskModal
        modal={state.confirmCompleteAllTaskModal}
        handleModal={toggleConfirmCompleteAllTaskModal}
        loadData={loadData}
        data={state.dataCurrentChecklist}
        completeChecklist={completeChecklist}
      />
    )
  }

  const renderAssignChecklistModal = () => {
    return (
      <AssignChecklistModal
        modal={state.assignChecklistModal}
        handleModal={toggleAssignChecklistModal}
        options={options}
        metas={metas}
        optionsModules={optionsModules}
        loadData={loadData}
        module={module}
        moduleName={moduleName}
        chosenEmployee={state.chosenEmployee}
        modalTitle={useFormatMessage("modules.checklist.modal.title.edit")}
        checklistTypeProps={state.dataCurrentChecklist.type.value}
        fillData={state.dataCurrentChecklist}
        isEditModal={true}
        moduleEmployeeName={moduleEmployeeName}
      />
    )
  }

  const renderAssignedChecklist = () => {
    return (
      <Space direction="vertical">
        {state.data.map((checklist, index) => {
          const isChecklistCompleted = checklist.status.name_option === "completed"
          return (
            <div key={checklist.id}>
              <AssignedChecklistInfo
                isChecklistCompleted={isChecklistCompleted}
                checklistIndex={index}
                checklist={checklist}
                checklistType={filters.type}
                dataAdditional={state.dataAdditional}
                options={options}
                optionsModules={optionsModules}
                handleModal={toggleCompleteModal}
                handleRevertModal={toggleRevertModal}
                optionsChecklistDetail={optionsChecklistDetail}
                handleEditTaskModal={toggleEditTaskModal}
                setModalData={setModalData}
                setCurrentDataChecklist={setCurrentDataChecklist}
                setFillDataChecklistDetail={setFillDataChecklistDetail}
                setViewChecklistDetailInfoOnly={setViewChecklistDetailInfoOnly}
                toggleConfirmCompleteAllTaskModal={
                  toggleConfirmCompleteAllTaskModal
                }
                completeChecklist={completeChecklist}
                assignChecklistModal={state.assignChecklistModal}
                handleAssignChecklistModal={toggleAssignChecklistModal}
                setChosenEmployee={setChosenEmployee}
                setCurrentChecklistIndex={setCurrentChecklistIndex}
                setData={setData}
                setChecklistDetailData={setChecklistDetailData}
                setIsCompleteTask={setIsCompleteTask}
              />
            </div>
          )
        })}
      </Space>
    )
  }

  const renderEmployeeTag = () => {
    return (
      <EmployeeTag
        data={state.dataAdditional}
        options={options}
        metas={metas}
        optionsModules={optionsModules}
        loadData={loadData}
        module={module}
        moduleName={moduleName}
        checklistType={filters.type}
        moduleEmployeeName={moduleEmployeeName}
      />
    )
  }

  return (
    <Fragment>
      {renderBreadCrumb()}

      <div className="checklist-page">
        {renderFilter()}
        {state.loading ? (
          <AppSpinner />
        ) : (
          <Fragment>
            {renderEmployeeTag()}
            {state.data.length > 0 ? (
              renderAssignedChecklist()
            ) : (
              <EmptyContent />
            )}
            {state.completeModal && renderCompleteModal()}
            {state.revertModal && renderRevertModal()}
            {state.editTaskModal && renderEditTaskModal()}
            {state.confirmCompleteAllTaskModal &&
              renderConfirmCompleteAllTaskModal()}
            {state.assignChecklistModal && renderAssignChecklistModal()}
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default Checklist
