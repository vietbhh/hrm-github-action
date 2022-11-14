// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { SettingTimeOffApi } from "@modules/TimeOff/common/api"
import notification from "@apps/utility/notification"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { getOptionValue } from "@modules/TimeOff/common/common"
import { useSelector } from "react-redux"
// ** Styles
import { Button, Col, Row, Spinner } from "reactstrap"
import { Space } from "antd"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import EmployeeChanges from "./EmployeeChanges"
import ListEmployeeModal from "../../modals/ListEmployeeModal"
import GuildPolicy from "../typeAndPolicy/GuildPolicy"
import ListEmployeeChosen from "./ListEmployeeChosen"
import KeepBalanceElement from "./KeepBalanceElement"
import { ErpUserSelect } from "@apps/components/common/ErpField"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const AddEligibility = (props) => {
  const {
    // ** props
    moduleName,
    metas,
    options,
    optionsModules,
    policyData,
    isEditEligibility,
    // ** methods
    setAddType
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    loadingApi: false,
    currentPolicyData: {},
    loadingEmployee: true,
    showEmployeeGroupSelect: false,
    chosenGroup: 0,
    showEmployeeSelect: false,
    listEmployeeAdd: [],
    listEmployeeRemove: [],
    listEmployeeRemain: [],
    listEmployeeRemoveFromAdd: [],
    listEmployeeRemoveFromRemain: [],
    listEmployeeModal: false,
    listEmployeeModalData: [],
    showListEmployee: false,
    currentEligibilityApplicable: 0
  })

  const moduleEmployeeData = useSelector((state) => state.app.modules.employees)
  const moduleEmployee = moduleEmployeeData.config
  const moduleNameEmployee = moduleEmployee.name
  const metasEmployee = moduleEmployeeData.metas

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, setValue, getValues, watch } = methods
  const onSubmit = (values) => {
    setState({
      loading: true
    })
    const dataEmployees = state.listEmployeeAdd.map((item) => {
      return {
        value: item.value,
        label: item.full_name,
        join_date: item.join_date,
        probation_date: item.probation_end_date
      }
    })

    if (isEditEligibility) {
      const dataEmployeeRemove = state.listEmployeeRemove.map((item) => {
        return {
          value: item.value,
          label: item.full_name,
          join_date: item.join_date,
          probation_date: item.probation_end_date
        }
      })
      const dataEmployeeRemain = state.listEmployeeRemain.map((item) => {
        return {
          value: item.value,
          label: item.full_name,
          join_date: item.join_date,
          probation_date: item.probation_end_date
        }
      })
      values.eligibility_employee_remove = dataEmployeeRemove
      values.eligibility_employee = dataEmployees.concat(dataEmployeeRemain)
      values.timeoff_type = state.currentPolicyData.type
      SettingTimeOffApi.postUpdateEligibility(policyData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          setAddType("")
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.update.error")
          })
          setState({
            loading: false
          })
        })
    } else {
      values.eligibility_employee = dataEmployees
      SettingTimeOffApi.postAssignEligibility(policyData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          setAddType("")
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.update.error")
          })
          setState({
            loading: false
          })
        })
    }
  }

  const toggleListEmployeeModal = () => {
    setState({
      listEmployeeModal: !state.listEmployeeModal
    })
  }

  const setListEmployeeAdd = (data) => {
    setState({
      listEmployeeAdd: data
    })
  }

  const setListEmployeeRemove = (data) => {
    setState({
      listEmployeeRemove: data
    })
  }

  const setListEmployeeRemain = (data) => {
    setState({
      listEmployeeRemain: data
    })
  }

  const setListEmployeeRemoveFromRemain = (data) => {
    setState({
      listEmployeeRemoveFromRemain: data
    })
  }

  const loadEmployeeList = (firstLoad) => {
    const params = {}
    const groupId = getValues("group_id")
    params["group_id"] = groupId?.value
    params["policy_id"] = state.currentPolicyData.id
    params["eligibility_applicable"] = getValues("eligibility_applicable").value
    params["first_load"] = firstLoad
    setState({
      loadingEmployee: true
    })
    SettingTimeOffApi.loadListEmployeeEligibilityChange(params)
      .then((res) => {
        setState({
          listEmployeeAdd: res.data.employee_add,
          listEmployeeRemove: res.data.employee_remove,
          listEmployeeRemain: res.data.employee_remain,
          listEmployeeRemoveFromAdd: res.data.employee_remove_from_add,
          listEmployeeRemoveFromRemain: res.data.employee_remove_from_remain,
          loadingEmployee: false
        })
      })
      .catch((err) => {
        setState({
          loadingEmployee: false
        })
      })
  }

  const handleChangeEligibilityApplicable = (el, firstLoad = false) => {
    setValue("eligibility_applicable", el)
    const currentApplicable = parseInt(el.value)
    if (
      currentApplicable ===
      getOptionValue(options, "eligibility_applicable", "allemployees")
    ) {
      setState({
        showEmployeeSelect: false,
        showEmployeeGroupSelect: false,
        showListEmployee: false
      })
      loadEmployeeList(firstLoad)
    } else if (
      currentApplicable ===
      getOptionValue(options, "eligibility_applicable", "employeegroup")
    ) {
      setState({
        showEmployeeSelect: false,
        showListEmployee: false,
        showEmployeeGroupSelect: true
      })
      loadEmployeeList(firstLoad)
    } else if (
      currentApplicable ===
      getOptionValue(options, "eligibility_applicable", "specificemployees")
    ) {
      if (isEditEligibility === true) {
        setState({
          showEmployeeGroupSelect: false,
          showEmployeeSelect: true,
          showListEmployee: true
        })
        loadEmployeeList(firstLoad)
      } else {
        setState({
          listEmployeeAdd: [],
          listEmployeeRemove: [],
          listEmployeeRemain: [],
          loadingEmployee: false,
          showEmployeeGroupSelect: false,
          showEmployeeSelect: true,
          showListEmployee: true
        })
      }
    }
  }

  const handleChangeGroup = (el) => {
    setValue("group_id", el)
    loadEmployeeList()
  }

  const handleChangeEmployee = (el) => {
    let allowPush = true
    if (state.listEmployeeRemain.some((employee) => parseInt(employee.value) === parseInt(el.value))) {
      allowPush = false
    } else if (
      state.listEmployeeAdd.some((employee) => parseInt(employee.value) === parseInt(el.value))
    ) {
      allowPush = false
    }

    if (allowPush) {
      if (
        state.listEmployeeRemoveFromRemain.some(
          (employee) => parseInt(employee.value) === parseInt(el.value)
        )
      ) {
        const newListEmployeeRemove = state.listEmployeeRemove.filter(
          (item) => {
            return parseInt(item.value) !== parseInt(el.value)
          }
        )

        setState({
          listEmployeeRemain: [...state.listEmployeeRemain, el],
          listEmployeeRemove: newListEmployeeRemove
        })
      } else {
        setState({
          listEmployeeAdd: [...state.listEmployeeAdd, el]
        })

        if (
          state.listEmployeeRemove.some(
            (employee) => parseInt(employee.value) === parseInt(el.value)
          )
        ) {
          const newListEmployeeRemove = state.listEmployeeRemove.filter(
            (item) => {
              return parseInt(item.value) !== parseInt(el.value)
            }
          )
          setState({
            listEmployeeRemove: newListEmployeeRemove,
            listEmployeeRemoveFromAdd: [...state.listEmployeeRemoveFromAdd, el]
          })
        }
      }
    }
  }

  const handleCancel = () => {
    setAddType("")
  }

  const loadDataPolicy = () => {
    setState({
      loadingApi: true
    })
    defaultModuleApi
      .getDetail(moduleName, policyData.id)
      .then((res) => {
        setState({
          currentPolicyData: res.data.data,
          loadingApi: false
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.error")
        })
        setState({
          loadingApi: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadDataPolicy()
  }, [])

  useEffect(() => {
    if (Object.keys(state.currentPolicyData).length > 0) {
      handleChangeEligibilityApplicable(
        state.currentPolicyData.eligibility_applicable,
        true
      )
    }
  }, [state.currentPolicyData])

  // ** render
  const renderGroup = () => {
    return (
      <FieldHandle
        module={moduleNameEmployee}
        fieldData={{
          ...metasEmployee.group_id
        }}
        nolabel={true}
        useForm={methods}
        optionsModules={optionsModules}
        onChange={(el) => handleChangeGroup(el)}
        updateData={state.currentPolicyData.group_id}
      />
    )
  }

  const renderEmployee = () => {
    return (
      <ErpUserSelect
        name="eligibility_employee"
        nolabel={true}
        onChange={(el) => handleChangeEmployee(el)}
        url="time-off-setting/load-employee-select?load=1"
        loadOptionsApi={{
          filters: { assign_date: state.currentPolicyData.assign_date }
        }}
      />
    )
  }

  const renderForm = () => {
    return (
      <Fragment>
        <Row className="mt-2">
          <Col sm={12} className="mb-0">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.eligibility_applicable
              }}
              nolabel={false}
              options={options}
              useForm={methods}
              placeholder={useFormatMessage(
                "modules.time_off_policies.text.select_option"
              )}
              onChange={(el) => handleChangeEligibilityApplicable(el)}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col sm={12} className="mb-0">
            {state.showEmployeeGroupSelect && renderGroup()}
            {state.showEmployeeSelect && renderEmployee()}
          </Col>
        </Row>
      </Fragment>
    )
  }

  const renderChanges = () => {
    return (
      <EmployeeChanges
        listEmployeeAdd={state.listEmployeeAdd}
        listEmployeeRemove={state.listEmployeeRemove}
        toggleListEmployeeModal={toggleListEmployeeModal}
      />
    )
  }

  const renderListEmployeeModal = () => {
    return (
      <ListEmployeeModal
        modal={state.listEmployeeModal}
        listEmployeeAdd={state.listEmployeeAdd}
        listEmployeeRemove={state.listEmployeeRemove}
        handleModal={toggleListEmployeeModal}
      />
    )
  }

  const renderListEmployeeChosen = () => {
    if (!state.loadingEmployee) {
      return (
        <ListEmployeeChosen
          listEmployeeAdd={state.listEmployeeAdd}
          listEmployeeRemove={state.listEmployeeRemove}
          listEmployeeRemain={state.listEmployeeRemain}
          listEmployeeRemoveFromAdd={state.listEmployeeRemoveFromAdd}
          listEmployeeRemoveFromRemain={state.listEmployeeRemoveFromRemain}
          setListEmployeeAdd={setListEmployeeAdd}
          setListEmployeeRemove={setListEmployeeRemove}
          setListEmployeeRemain={setListEmployeeRemain}
          setListEmployeeRemoveFromRemain={setListEmployeeRemoveFromRemain}
        />
      )
    } else {
      return <AppSpinner />
    }
  }

  const renderKeepBalance = () => {
    return <KeepBalanceElement options={options} methods={methods} />
  }

  return (
    <Fragment>
      <Row className="mt-2">
        <Col sm={7} className="mb-25">
          <div className="mb-4">
            <h2>
              {useFormatMessage(
                "modules.time_off_policies.title.assign_eligibility",
                { policy_name: policyData.name }
              )}
            </h2>
          </div>
          <div>
            <FormProvider {...methods}>
              <div className="mb-2">
                <h4>
                  {useFormatMessage(
                    "modules.time_off_policies.title.eligibility"
                  )}
                </h4>
              </div>
              <div className="mb-2">
                {!state.loadingApi ? renderForm() : <AppSpinner />}
              </div>
            </FormProvider>
          </div>
          <div className="mb-2">
            {state.showListEmployee && renderListEmployeeChosen()}
          </div>
          <div className="mb-2">
            {!state.loadingEmployee && renderChanges()}
          </div>
          <div className="mb-2">
            {parseInt(state.listEmployeeRemove.length) > 0 &&
              renderKeepBalance()}
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Space>
                <Button
                  type="submit"
                  color="primary"
                  disabled={
                    state.loading ||
                    state.loadingEmployee ||
                    formState.isSubmitting ||
                    formState.isValidating
                  }>
                  {(state.loading ||
                    formState.isSubmitting ||
                    formState.isValidating) && (
                    <Spinner size="sm" className="me-50" />
                  )}
                  {isEditEligibility
                    ? useFormatMessage("app.update")
                    : useFormatMessage("app.save")}
                </Button>
                <Button color="flat-danger" onClick={() => handleCancel()}>
                  {useFormatMessage("button.cancel")}
                </Button>
              </Space>
            </form>
          </div>
        </Col>
        <Col sm={5} className="mb-25">
          <GuildPolicy lang="en" />
        </Col>
      </Row>
      {state.listEmployeeModal && renderListEmployeeModal()}
    </Fragment>
  )
}

export default AddEligibility
