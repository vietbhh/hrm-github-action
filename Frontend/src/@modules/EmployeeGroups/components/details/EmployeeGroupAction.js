// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { employeeGroupApi } from "@modules/EmployeeGroups/common/api"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
// ** Components
import notification from "@apps/utility/notification"

const EmployeeGroupAction = (props) => {
  const {
    // ** props
    filterFieldNameMeetAll,
    filterFieldNameMeetAny,
    groupId,
    filter,
    optionType,
    employeeGroup,
    showPreviewButton,
    methods,
    // ** methods
    setEmployeeGroup,
    setShowListEmployeeGroup
  } = props

  const [loading, setLoading] = useState(false)

  const { handleSubmit, formState, getValues } = methods

  const history = useNavigate()

  const _getCondition = () => {
    const meetAllCondition = filter.meetAll.map((item, index) => {
      if (item?.field?.value?.fieldType === "text") {
        const fieldValue = getValues(`value-${filterFieldNameMeetAll}-${index}`)
        return { ...item, value: fieldValue }
      }

      return { ...item }
    })

    const meetAnyCondition = filter.meetAny.map((item, index) => {
      if (item?.field?.value?.fieldType === "text") {
        const fieldValue = getValues(`value-${filterFieldNameMeetAny}-${index}`)
        return { ...item, value: fieldValue }
      }

      return { ...item }
    })

    return {
      meet_all: meetAllCondition,
      meet_any: meetAnyCondition,
      except_employee: filter.exceptEmployee
    }
  }

  const onSubmit = (values) => {
    if (optionType === "match_criteria") {
      values.list_employee = employeeGroup
    } else if (optionType === "specific_employee") {
      values.list_employee = filter.specificEmployee
    }

    values.type = optionType
    values.condition = _getCondition()
    employeeGroupApi
      .editEmployeeGroup(groupId, values)
      .then((res) => {
        setLoading(false)
        notification.showSuccess()
      })
      .catch((err) => {
        setLoading(false)
        notification.showError()
      })
  }

  const handlePreview = () => {
    setLoading(true)
    const condition = _getCondition()
    employeeGroupApi
      .previewEmployee(condition)
      .then((res) => {
        setEmployeeGroup(res.data.list_employee)
        setLoading(false)
        setShowListEmployeeGroup(true)
      })
      .catch((err) => {
        setEmployeeGroup([])
        setLoading(false)
        setShowListEmployeeGroup(true)
      })
  }

  const handleCancel = () => {
    history("/settings/groups")
  }

  // ** render
  const renderPreviewButton = () => {
    return (
      <Button.Ripple
        type="button"
        color="primary"
        onClick={() => handlePreview()}
        disabled={loading}>
        <i className="far fa-eye me-50" />
        {useFormatMessage("modules.employee_groups.buttons.preview")}
      </Button.Ripple>
    )
  }

  const renderComponent = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Space>
          <Button.Ripple
            type="submit"
            color="primary"
            disabled={
              loading || formState.isSubmitting || formState.isValidating
            }>
            {useFormatMessage("modules.employee_groups.buttons.save")}
          </Button.Ripple>
          {showPreviewButton && renderPreviewButton()}
          <Button.Ripple
            type="button"
            color="danger"
            onClick={() => handleCancel()}
            disabled={loading}>
            {useFormatMessage("modules.employee_groups.buttons.cancel")}
          </Button.Ripple>
        </Space>
      </form>
    )
  }

  return <div>{renderComponent()}</div>
}

export default EmployeeGroupAction
