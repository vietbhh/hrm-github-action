// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { TimeOffBalanceApi } from "../../common/TimeOffBalanceApi"
// ** Styles
import { Button, Spinner } from "reactstrap"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"

const FilterTimeOffBalance = (props) => {
  const {
    // ** props
    filter,
    moduleName,
    metas,
    options,
    moduleNameEmployee,
    metasEmployee,
    optionsEmployee,
    optionsModules,
    // ** methods
    setFilter
  } = props

  const [loading, setLoading] = useState(false)

  const methods = useForm()
  const { watch } = methods

  const handleExport = () => {
    setLoading(true)
    TimeOffBalanceApi.exportTimeOffBalance(filter)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `time_off_balance.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        setLoading(false)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.error")
        })
        setLoading(false)
      })
  }

  // ** effect
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        setFilter({ ...value })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // ** render
  return (
    <Fragment>
      <div className="d-flex justify-content-between filter-container mb-2">
        <div className="d-flex">
          <div className="me-1 filter-item">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.type
              }}
              nolabel={true}
              optionsModules={optionsModules}
              defaultValue=""
              useForm={methods}
            />
          </div>
          <div className="me-1 filter-item">
            <FieldHandle
              module={moduleNameEmployee}
              fieldData={{
                ...metasEmployee.department_id
              }}
              nolabel={true}
              optionsModules={optionsModules}
              defaultValue=""
              useForm={methods}
            />
          </div>
          <div className="me-1 filter-item">
            <FieldHandle
              module={moduleNameEmployee}
              fieldData={{
                ...metasEmployee.office
              }}
              nolabel={true}
              optionsModules={optionsModules}
              defaultValue=""
              useForm={methods}
            />
          </div>
          <div className="me-1 filter-item">
            <FieldHandle
              module={moduleNameEmployee}
              fieldData={{
                ...metasEmployee.status
              }}
              nolabel={true}
              options={optionsEmployee}
              defaultValue=""
              useForm={methods}
            />
          </div>
        </div>
        <div>
          <Button.Ripple
            size="sm"
            color="primary"
            onClick={() => handleExport()}
            className="d-flex"
            disabled={loading}>
            {!loading ? (
              <i className="far fa-download me-25" />
            ) : (
              <Spinner size="sm" className="me-25" />
            )}
            {useFormatMessage(
              "modules.reports.time_off_balance.buttons.export"
            )}
          </Button.Ripple>
        </div>
      </div>
    </Fragment>
  )
}

export default FilterTimeOffBalance
