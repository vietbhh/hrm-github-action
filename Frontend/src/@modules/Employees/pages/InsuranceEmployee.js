import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { Card, CardBody, CardHeader } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { InsuranceApi } from "../common/api"
import FilterInsurance from "../components/insurance/FilterInsurance"
import TableInsurance from "../components/insurance/TableInsurance"

const InsuranceEmployee = () => {
  const ability = useContext(AbilityContext)

  if (ability.can("manage", "employees") === false) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

  const [state, setState] = useMergedState({
    loadPage: true,
    loading_table: false,
    option_insurance: [],
    searchVal: "",
    filter: {
      insurance: ""
    },
    data_table: [],
    pagination: {
      current: 1,
      pageSize: 20
    }
  })

  const setSearchVal = (props) => {
    setState({ searchVal: props })
  }

  const setFilter = (props) => {
    setState({ filter: { ...state.filter, ...props } })
  }

  const loadConfig = () => {
    setState({ loadPage: true })
    InsuranceApi.getConfig()
      .then((res) => {
        setState({
          option_insurance: res.data,
          loadPage: false,
          filter: {
            ...state.filter,
            insurance: res.data[0].value
          }
        })
      })
      .catch((err) => {
        setState({ loadPage: false })
      })
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const loadTable = (props) => {
    setState({ loading_table: true })
    const params = {
      filter: state.filter,
      searchVal: state.searchVal,
      pagination: state.pagination,
      ...props
    }

    InsuranceApi.getTable(params)
      .then((res) => {
        setState({
          loading_table: false,
          data_table: res.data.data_table,
          pagination: {
            ...params.pagination,
            total: res.data.total
          }
        })
      })
      .catch((err) => {
        setState({ loading_table: false })
      })
  }

  useEffect(() => {
    if (state.loadPage === false) {
      loadTable({ pagination: { ...state.pagination, current: 1 } })
    }
  }, [state.filter, state.searchVal])

  return (
    <Fragment>
      <Breadcrumbs
        className="team-attendance-breadcrumbs"
        list={[
          {
            title: useFormatMessage("modules.insurance.title")
          }
        ]}
      />

      <Card className="team-attendance">
        <CardHeader className="btn-header">
          <div className="d-flex flex-wrap w-100 mb-7">
            <div className="d-flex align-items-center">
              <i className="fa-regular fa-house-medical icon-circle bg-icon-green"></i>
              <span className="instruction-bold">
                {useFormatMessage("modules.insurance.title")}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="attendance-body">
          {state.loadPage && <DefaultSpinner />}

          {!state.loadPage && (
            <>
              <FilterInsurance
                option_insurance={state.option_insurance}
                setFilter={setFilter}
                setSearchVal={setSearchVal}
                loading_table={state.loading_table}
              />
              <TableInsurance
                loading_table={state.loading_table}
                data_table={state.data_table}
                pagination={state.pagination}
                loadTable={loadTable}
              />
            </>
          )}
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default InsuranceEmployee
