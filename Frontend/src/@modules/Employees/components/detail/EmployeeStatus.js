import { DownOutlined } from "@ant-design/icons"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { employeesApi } from "@modules/Employees/common/api"
import notification from "@apps/utility/notification"
import { Dropdown } from "antd"
import classnames from "classnames"
import { isUndefined } from "lodash-es"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "reactstrap"
const { Fragment } = require("react")

const EmployeeStatus = (props) => {
  const {
    defaultValue,
    employeeId,
    className,
    afterUpdateStatus,
    readOnly,
    loadDataOverView
  } = props
  const modules = useSelector((state) => state.app.modules)
  const status = modules.employees.options.status
  const disableStatus =
    modules.employees.metas.status.field_options?.disableStatus
  const optClass = modules.employees.metas.status.field_options?.optionClass
  const [state, setState] = useMergedState({
    opt: {}
  })
  const changeStatus = (status) => {
    employeesApi
      .updateEmployeeStatus(employeeId, {
        status: parseInt(status.value)
      })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({
          opt: status
        })
        if (!isUndefined(afterUpdateStatus)) {
          afterUpdateStatus(status)
        }
        loadDataOverView()
      })
      .catch((err) => {})
  }
  useEffect(() => {
    setState({
      opt: defaultValue
    })
  }, [defaultValue])

  const items = [
    ...status
      .filter((item) => {
        return !disableStatus.includes(parseInt(item.value))
      })
      .map((item, index) => ({
        key: index,
        label: (
          <span
            className={classnames({
              [`stt_${optClass[parseInt(item.value)]}`]: !isUndefined(
                optClass[parseInt(item.value)]
              )
            })}
            onClick={() => {
              changeStatus(item)
            }}>
            {useFormatMessage(`${item?.label}`)}
          </span>
        ),
        className: "employeeStatusDropdown"
      }))
  ]

  return (
    <Fragment>
      {!disableStatus.includes(parseInt(state?.opt?.value)) && !readOnly ? (
        <Dropdown
          className={classnames("employeeStatus", {
            [className]: className
          })}
          menu={{ items }}
          trigger={["click"]}>
          <Button.Ripple
            color="secondary"
            className={classnames({
              [`stt_${optClass[parseInt(state?.opt?.value)]}`]: !isUndefined(
                optClass[parseInt(state.opt?.value)]
              ),
              [className]: className
            })}
            outline>
            {useFormatMessage(`${state?.opt?.label}`)} <DownOutlined />
          </Button.Ripple>
        </Dropdown>
      ) : (
        <Button.Ripple
          color="secondary"
          tag="span"
          className={classnames("employeeStatus", {
            [`stt_${optClass[parseInt(state?.opt?.value)]}`]: !isUndefined(
              optClass[parseInt(state.opt?.value)]
            ),
            [className]: className
          })}
          outline>
          {useFormatMessage(`${state?.opt?.label}`)}
        </Button.Ripple>
      )}
    </Fragment>
  )
}

export default EmployeeStatus
