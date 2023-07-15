import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classNames from "classnames"
import { isEmpty } from "lodash"
import { Fragment, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { AbilityContext } from "utility/context/Can"
import { timeoffApi } from "../common/api"
import BalanceHistory from "../components/mytimeoff/BalanceHistory"
import MyRequests from "../components/mytimeoff/MyRequests"
import TimeoffCarousel from "../components/mytimeoff/TimeoffCarousel"
import moment from "moment"

const today = new Date()
const firstDayOfyear = new Date(today.getFullYear(), 0, 1)
const lastDayOfyear = new Date(today.getFullYear(), 11, 31)

const firstDayOfyearYMD = `${firstDayOfyear.getFullYear()}-${
  firstDayOfyear.getMonth() + 1
}-${firstDayOfyear.getDate()}`
const lastDayOfyearYMD = `${lastDayOfyear.getFullYear()}-${
  lastDayOfyear.getMonth() + 1
}-${lastDayOfyear.getDate()}`

const MyTimeOff = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    type: [],
    line_manager: {},
    data_balance_history: [],
    loading_balance: false,
    pagination_balance: {
      current: 1,
      pageSize: 10
    },
    loading_data_type: false,
    data_type: {},
    data_holiday: {},
    loadPage: true,
    data_schedule: [],
    filter_balance: {
      filter_type: "",
      filter_datefrom: firstDayOfyearYMD,
      filter_dateto: lastDayOfyearYMD
    }
  })

  const moduleData = useSelector((state) => state.app.modules.time_off_requests)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  const ability = useContext(AbilityContext)

  const loadDataBalance = () => {
    setState({ loading_data_type: true })
    timeoffApi
      .getBalance()
      .then((res) => {
        setState({ data_type: res.data, loading_data_type: false })
      })
      .catch((err) => {
        setState({ loading_data_type: false })
      })
  }

  useEffect(() => {
    setState({
      loadPage: true
    })
    timeoffApi
      .getMytimeOffConfig()
      .then((res) => {
        setState({
          loadPage: false,
          type: res.data.data_type,
          line_manager: res.data.data_linemanager.line_manager,
          data_holiday: res.data.holiday,
          data_schedule: res.data.work_schedule
        })
      })
      .catch((err) => {
        setState({
          loadPage: false
        })
      })

    loadDataBalance()
  }, [])

  const loadBalanceHistory = (props) => {
    setState({ loading_balance: true })
    const params = {
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
      .getBalanceHistory(params)
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
      })
  }

  useEffect(() => {
    loadBalanceHistory({
      pagination_balance: { ...state.pagination_balance, current: 1 }
    })
  }, [state.filter_balance])

  const setFilterBalance = (props) => {
    setState({ filter_balance: { ...state.filter_balance, ...props } })
  }

  return (
    <Fragment>
      <div className="ant-spin-nested-loading">
        {state.loadPage && (
          <div>
            <div
              className="ant-spin ant-spin-spinning"
              aria-live="polite"
              aria-busy="true"
              style={{ height: "225px" }}>
              <span className="ant-spin-dot ant-spin-dot-spin">
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
              </span>
            </div>
          </div>
        )}

        <div
          className={classNames({
            "ant-spin-blur": state.loadPage
          })}>
          <Breadcrumbs
            className="breadcrumbs-edit"
            list={[
              {
                title: useFormatMessage("modules.time_off_requests.time_off")
              },
              {
                title: useFormatMessage("modules.time_off_requests.my_time_off")
              }
            ]}
          />

          <TimeoffCarousel
            data_type={state.data_type}
            loading_data_type={state.loading_data_type}
          />
          <MyRequests
            metas={metas}
            moduleName={moduleName}
            ability={ability}
            options={options}
            type={state.type}
            line_manager={state.line_manager}
            firstDayOfyearYMD={firstDayOfyearYMD}
            lastDayOfyearYMD={lastDayOfyearYMD}
            pagination_balance={state.pagination_balance}
            loadBalanceHistory={loadBalanceHistory}
            loadDataBalance={loadDataBalance}
            data_holiday={state.data_holiday}
            data_schedule={state.data_schedule}
            firstDayOfyear={firstDayOfyear}
            lastDayOfyear={lastDayOfyear}
          />
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
          />
        </div>
      </div>
    </Fragment>
  )
}

export default MyTimeOff
