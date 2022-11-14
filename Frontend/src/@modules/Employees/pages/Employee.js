import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import AssignChecklistModal from "@modules/Checklist/components/modals/AssignChecklistModal"
import { isEmpty } from "lodash"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { employeesApi } from "../common/api"
import EmployeeLayout from "../components/detail/EmployeeLayout"
import OffboardingModal from "../components/modals/OffboardingModal"
import RehireModal from "../components/modals/RehireModal"

const Employee = (props) => {
  const navigate = useNavigate()
  const params = useParams()
  const identity = params.identity
  const tab = params.tab || "general"

  if (isEmpty(identity)) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }
  const moduleData = useSelector((state) => state.app.modules.employees)
  const module = moduleData.config
  const moduleName = module.name

  const moduleDataChecklist = useSelector(
    (state) => state.app.modules.checklist
  )
  const moduleChecklist = moduleDataChecklist.config
  const moduleNameChecklist = moduleChecklist.name
  const metasChecklist = moduleDataChecklist.metas
  const optionsChecklist = moduleDataChecklist.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const [state, setState] = useMergedState({
    loading: true,
    employeeData: {},
    assignChecklistModal: false,
    assignType: ""
  })

  const toggleAssignChecklistModal = () => {
    setState({
      assignChecklistModal: !state.assignChecklistModal
    })
  }

  const setAssignType = (type) => {
    setState({
      assignType: type
    })
  }

  const loadData = () => {
    setState({
      loading: true
    })
    employeesApi
      .getDetail(identity)
      .then((res) => {
        setState({
          employeeData: res.data,
          loading: false
        })
      })
      .catch((error) => {
        navigate("/not-found", { replace: true })
      })
  }

  const api = {
    avatar: (avatar) => {
      return employeesApi.changeAvatar(state.employeeData.id, {
        avatar: avatar
      })
    },
    save: (values) => {
      return employeesApi.postUpdate(state.employeeData.id, values)
    },
    getDocuments: () => {
      return employeesApi.getDocuments(state.employeeData.id)
    },
    uploadDocuments: (files) => {
      return employeesApi.postDocuments(state.employeeData.id, {
        files: files
      })
    },
    deleteDocuments: (fileName) => {
      return employeesApi.deleteDocuments(state.employeeData.id, fileName)
    },
    getRelatedList: (module) => {
      return employeesApi.getRelatedList(module, state.employeeData.id)
    },
    getRelatedDetail: (module, id) => {
      return employeesApi.getRelatedDetail(module, state.employeeData.id, id)
    },
    saveRelated: (module, data) => {
      return employeesApi.saveRelated(module, state.employeeData.id, data)
    },
    deleteRelated: (module, id) => {
      return employeesApi.deleteRelated(module, state.employeeData.id, id)
    }
  }

  useEffect(() => {
    loadData()
  }, [identity])

  return (
    <Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage("modules.employees.title"),
            link: "/employees"
          },
          {
            title: state.employeeData.full_name
          }
        ]}
        withBack={true}
      />
      <EmployeeLayout
        loading={state.loading}
        employeeData={state.employeeData}
        tab={tab}
        url={`employees/u/${identity}`}
        page="employees"
        api={api}
        reload={loadData}
        toggleAssignChecklistModal={toggleAssignChecklistModal}
        setAssignType={setAssignType}
      />
      <OffboardingModal
        onComplete={loadData}
        toggleAssignChecklistModal={toggleAssignChecklistModal}
        setAssignType={setAssignType}
      />
      <RehireModal onComplete={loadData} />
      <AssignChecklistModal
        modal={state.assignChecklistModal}
        handleModal={toggleAssignChecklistModal}
        loadData={loadData}
        options={optionsChecklist}
        metas={metasChecklist}
        optionsModules={optionsModules}
        module={moduleChecklist}
        moduleName={moduleNameChecklist}
        chosenEmployee={{}}
        modalTitle={useFormatMessage("modules.checklist.modal.title.edit")}
        isEditModal={false}
        moduleEmployeeName={moduleName}
        openFromListEmployee={true}
        assignType={state.assignType}
      />
    </Fragment>
  )
}

export default Employee
