// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { employeesApi } from "@modules/Employees/common/api"
// ** Styles
// ** Components
import AutoGenerateCodeInfo from "./AutoGenerateCodeInfo"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const TabAutoGenerateCode = (props) => {
  const {
    // ** props
    tab
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    content: {}
  })

  const tabName = tab.replace("-", "_")

  const loadContent = () => {
    setState({
      loading: true
    })
    let module = ""
    let field = ""
    if (tab === "employee-code") {
      module = "employees"
      field = "employee_code"
    } else if (tab === "contract-code") {
      module = "contracts"
      field = "contract_code"
    }
    employeesApi
      .loadAutoGenerateCode(module, field)
      .then((res) => {
        setState({
          content: res.data.data,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          content: {},
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadContent()
  }, [tab])

  // ** render
  const renderAutoGenerateCodeInfo = () => {
    if (state.loading) {
      return <AppSpinner />
    }

    return <AutoGenerateCodeInfo tabName={tabName} content={state.content} />
  }

  return (
    <Fragment>
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="mb-0">
              <i className="far fa-server icon-circle bg-icon-green" />
              {useFormatMessage(
                `modules.employee_setting.title.tabs.${tabName}`
              )}
            </h4>
          </div>
        </div>
        <div>
          <Fragment>{renderAutoGenerateCodeInfo()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default TabAutoGenerateCode
