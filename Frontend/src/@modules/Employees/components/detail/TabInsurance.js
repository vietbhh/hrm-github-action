import { ErpSelect } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { InsuranceApi } from "@modules/Employees/common/api"
import { Fragment, useEffect } from "react"
import { Card, CardBody, CardHeader } from "reactstrap"
import TableInsurance from "../insurance/TableInsurance"

const today = new Date()
const year = today.getFullYear()
const recordYear = [
  {
    value: year - 1,
    label: year - 1
  },
  {
    value: year,
    label: year
  },
  {
    value: year + 1,
    label: year + 1
  }
]

const TabInsurance = (props) => {
  const { employeeData, loading } = props
  const [state, setState] = useMergedState({
    yearInsurance: year,
    loading_table: true,
    data_table: []
  })

  const loadData = () => {
    setState({ loading_table: true })
    const params = { year: state.yearInsurance, employeeId: employeeData.id }

    InsuranceApi.getTableProfile(params)
      .then((res) => {
        setState({
          loading_table: false,
          data_table: res.data
        })
      })
      .catch((err) => {
        setState({ loading_table: false })
      })
  }

  useEffect(() => {
    if (!loading) {
      loadData()
    }
  }, [state.yearInsurance, loading])

  return (
    <Fragment>
      <Card className="card-inside with-border-radius life-card employee-insurance">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">
                <i className="fa-regular fa-house-medical" />
              </span>
              <span>
                {useFormatMessage("modules.employees.tabs.insurance.title")}
              </span>
            </h1>
            <div className="d-flex ms-auto">
              <div style={{ minWidth: "90px" }}>
                <ErpSelect
                  onChange={(e) => {
                    setState({ yearInsurance: e.value })
                  }}
                  options={recordYear}
                  defaultValue={recordYear[1]}
                  nolabel
                  isClearable={false}
                  isSearchable={false}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {(loading || state.loading_table) && <DefaultSpinner />}
          {!loading && !state.loading_table && (
            <TableInsurance
              loading_table={state.loading_table}
              data_table={state.data_table}
              request_type="profile"
            />
          )}
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default TabInsurance
