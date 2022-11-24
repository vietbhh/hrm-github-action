import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { ErpUserSelect } from "@apps/components/common/ErpField"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { timeoffApi } from "@modules/TimeOff/common/api"
import { isEmpty } from "lodash"
import { Fragment, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Spinner } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import AddAdjustment from "../components/employeetimeoff/AddAdjustment"
import BalanceHistory from "../components/mytimeoff/BalanceHistory"
import TableMyRequests from "../components/mytimeoff/TableMyRequests"
import TimeoffCarousel from "../components/mytimeoff/TimeoffCarousel"

const today = new Date()
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
const firstDayYMD = `${firstDay.getFullYear()}-${
  firstDay.getMonth() + 1
}-${firstDay.getDate()}`
const lastDayYMD = `${lastDay.getFullYear()}-${
  lastDay.getMonth() + 1
}-${lastDay.getDate()}`
const firstDayOfyear = new Date(today.getFullYear(), 0, 1)
const lastDayOfyear = new Date(today.getFullYear(), 11, 31)
const firstDayOfyearYMD = `${firstDayOfyear.getFullYear()}-${
  firstDayOfyear.getMonth() + 1
}-${firstDayOfyear.getDate()}`
const lastDayOfyearYMD = `${lastDayOfyear.getFullYear()}-${
  lastDayOfyear.getMonth() + 1
}-${lastDayOfyear.getDate()}`

const EmployeeTime = () => {
  const ability = useContext(AbilityContext)

  if (ability.can("accessEmployeeTimeOff", "time_off") === false) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

  const [state, setState] = useMergedState({
    loading: false,
    data_requests: [],
    pagination: {
      current: 1,
      pageSize: 10
    },
    sorter: {},
    filter: {
      filter_type: "",
      filter_status: "",
      filter_datefrom: firstDayYMD,
      filter_dateto: lastDayYMD
    },
    data_balance_history: [],
    filter_balance: {
      filter_type: "",
      filter_datefrom: firstDayOfyearYMD,
      filter_dateto: lastDayOfyearYMD
    },
    pagination_balance: {
      current: 1,
      pageSize: 10
    },
    loading_balance: false,
    data_type: {},
    loading_data_type: false,
    id_user_select: "",
    loading_export: false
  })

  const moduleData = useSelector((state) => state.app.modules.time_off_requests)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options

  const setFilter = (props) => {
    setState({ filter: { ...state.filter, ...props } })
  }

  const loadRequest = (props) => {
    setState({
      loading: true
    })
    const params = {
      id_user_select: state.id_user_select,
      filter_type: state.filter.filter_type,
      filter_status: state.filter.filter_status,
      filter_datefrom: state.filter.filter_datefrom,
      filter_dateto: state.filter.filter_dateto,
      pagination: state.pagination,
      sorter: state.sorter,
      ...props
    }
    if (
      isEmpty(state.filter.filter_datefrom) ||
      isEmpty(state.filter.filter_dateto)
    ) {
      setState({ data_requests: [], loading: false })
      return
    }
    timeoffApi
      .getEmployeeTimeOffRequest(params)
      .then((res) => {
        setState({
          data_requests: res.data.data,
          pagination: {
            ...params.pagination,
            total: res.data.total
          },
          sorter: params.sorter,
          loading: false
        })
      })
      .catch((err) => {
        setState({ loading: false })
        console.log(err)
      })
  }

  useEffect(() => {
    loadRequest({ pagination: { ...state.pagination, current: 1 } })
  }, [state.filter, state.id_user_select])

  const loadDataCarousel = () => {
    setState({ loading_data_type: true })
    const params = {
      id_user_select: state.id_user_select
    }
    timeoffApi
      .getEmployeeTimeOffCarousel(params)
      .then((res) => {
        setState({ data_type: res.data, loading_data_type: false })
      })
      .catch((err) => {
        console.log(err)
        setState({ loading_data_type: false })
      })
  }

  useEffect(() => {
    if (!isEmpty(state.id_user_select)) {
      loadDataCarousel()
    }
  }, [state.id_user_select])

  const loadBalanceHistory = (props) => {
    setState({ loading_balance: true })
    const params = {
      id_user_select: state.id_user_select,
      filter_type: state.filter_balance.filter_type,
      filter_datefrom: state.filter_balance.filter_datefrom,
      filter_dateto: state.filter_balance.filter_dateto,
      pagination_balance: state.pagination_balance,
      ...props
    }

    if (
      isEmpty(state.filter_balance.filter_datefrom) ||
      isEmpty(state.filter_balance.filter_dateto)
    ) {
      setState({ data_balance_history: [], loading_balance: false })
      return
    }

    timeoffApi
      .getEmployeeTimeOffBalanceHistory(params)
      .then((res) => {
        setState({
          data_balance_history: res.data.data,
          loading_balance: false,
          pagination_balance: {
            ...params.pagination_balance,
            total: res.data.total
          }
        })
      })
      .catch((err) => {
        setState({ loading_balance: false })
        console.log(err)
      })
  }

  useEffect(() => {
    if (!isEmpty(state.id_user_select)) {
      loadBalanceHistory({
        pagination_balance: { ...state.pagination_balance, current: 1 }
      })
    }
  }, [state.filter_balance, state.id_user_select])

  const setFilterBalance = (props) => {
    setState({ filter_balance: { ...state.filter_balance, ...props } })
  }

  const exportExcel = () => {
    setState({ loading_export: true })
    const params = {
      id_user_select: state.id_user_select,
      filter_type: state.filter.filter_type,
      filter_status: state.filter.filter_status,
      filter_datefrom: state.filter.filter_datefrom,
      filter_dateto: state.filter.filter_dateto,
      pagination: state.pagination,
      sorter: state.sorter
    }
    if (
      isEmpty(state.filter.filter_datefrom) ||
      isEmpty(state.filter.filter_dateto)
    ) {
      setState({ loading_export: false })
      return
    }
    timeoffApi
      .getExportExcel(params)
      .then((response) => {
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `TimeOff.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        setState({ loading_export: false })
      })
      .catch((err) => {
        setState({ loading_export: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.error")
        })
      })
  }

  return (
    <Fragment>
      <Breadcrumbs
        className="breadcrumbs-edit"
        list={[
          {
            title: useFormatMessage("modules.time_off_requests.time_off")
          },
          {
            title: useFormatMessage(
              "modules.time_off_requests.employee_time_off.title"
            )
          }
        ]}
        custom={
          <div style={{ width: "400px" }}>
            <ErpUserSelect
              nolabel
              isMulti={false}
              isClearable={true}
              placeholder={useFormatMessage(
                "modules.time_off_requests.employee_time_off.type_to_search_employee"
              )}
              onChange={(e) => {
                setState({ id_user_select: e?.value || "" })
              }}
            />
          </div>
        }
      />

      {!isEmpty(state.id_user_select) && (
        <TimeoffCarousel
          data_type={state.data_type}
          loading_data_type={state.loading_data_type}
        />
      )}

      <Card className="my-requests">
        <CardHeader>
          <div className="d-flex flex-wrap w-100 mb-7">
            <div className="d-flex align-items-center">
              <i className="far fa-file-alt icon-circle bg-icon-green"></i>
              <span className="instruction-bold">
                {useFormatMessage(
                  "modules.time_off_requests.employee_time_off.employee_request"
                )}
              </span>
            </div>

            <div className="d-flex align-items-center ms-auto">
              <Button.Ripple
                color="secondary"
                className="ms-10 btn-secondary-edit"
                disabled={state.loading_export}
                onClick={() => {
                  exportExcel()
                }}>
                <span className="align-self-center">
                  {state.loading_export ? (
                    <Spinner size="sm" />
                  ) : (
                    <i className="far fa-download"></i>
                  )}
                </span>
              </Button.Ripple>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <TableMyRequests
            metas={metas}
            moduleName={moduleName}
            options={options}
            setFilter={setFilter}
            datefrom_default={firstDay}
            dateto_default={lastDay}
            data_requests={state.data_requests}
            loadingMyRequests={state.loading}
            loadMyRequests={loadRequest}
            pagination={state.pagination}
            type="employee"
            afterAction={() => {
              if (!isEmpty(state.id_user_select)) {
                loadBalanceHistory({
                  pagination_balance: {
                    ...state.pagination_balance,
                    current: 1
                  }
                })
                loadDataCarousel()
              }
            }}
          />
        </CardBody>
      </Card>

      {!isEmpty(state.id_user_select) && (
        <BalanceHistory
          metas={metas}
          moduleName={moduleName}
          options={options}
          setFilterBalance={setFilterBalance}
          data_balance={state.data_balance_history}
          loading_balance={state.loading_balance}
          pagination_balance={state.pagination_balance}
          loadBalanceHistory={loadBalanceHistory}
          firstDayOfyear={firstDayOfyear}
          lastDayOfyear={lastDayOfyear}
          addAdjustment={
            <AddAdjustment
              id_user_select={state.id_user_select}
              afterAction={() => {
                loadBalanceHistory({
                  pagination_balance: {
                    ...state.pagination_balance,
                    current: 1
                  }
                })
                loadDataCarousel()
              }}
            />
          }
        />
      )}
    </Fragment>
  )
}

export default EmployeeTime
