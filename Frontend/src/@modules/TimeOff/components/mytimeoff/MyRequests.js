import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { timeoffApi } from "@modules/TimeOff/common/api"
import { userApi } from "@modules/Employees/common/api"
import { isEmpty } from "lodash"
import { Fragment, useEffect } from "react"
import { Button, Card, CardBody, CardHeader } from "reactstrap"
import AddRequestModal from "./modal/AddRequestModal"
import TableMyRequests from "./TableMyRequests"
import { GoogleOAuthProvider } from "@react-oauth/google"
import SyncGoogleCalendar from "./SyncGoogleCalendar"
import { Space } from "antd"
import classNames from "classnames"

const MyRequests = (props) => {
  const {
    metas,
    moduleName,
    ability,
    options,
    type,
    line_manager,
    firstDayOfyear,
    lastDayOfyear,
    firstDayOfyearYMD,
    lastDayOfyearYMD,
    pagination_balance,
    loadBalanceHistory,
    loadDataBalance,
    data_holiday,
    data_schedule
  } = props
  const [state, setState] = useMergedState({
    loadingUserInfo: false,
    loadingSyncGoogleCalendar: false,
    loading: false,
    addModal: false,
    modal_file: false,
    data_requests: [],
    id_file_change: 0,
    pagination: {
      current: 1,
      pageSize: 10
    },
    sorter: {},
    filter: {
      filter_type: "",
      filter_status: "",
      filter_datefrom: firstDayOfyearYMD,
      filter_dateto: lastDayOfyearYMD
    },
    syncedWithGoogleCalendar: false,
    syncStatus: false
  })

  const loadMyRequests = (props) => {
    setState({
      loading: true
    })
    const params = {
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
      .getMyRequests(params)
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

  const loadUserInfo = () => {
    setState({
      loadingUserInfo: true
    })
    userApi
      .getUserInfo()
      .then((res) => {
        setState({
          syncedWithGoogleCalendar: res.data.synced,
          syncStatus: res.data.sync_calendar_status,
          loadingUserInfo: false
        })
      })
      .catch((err) => {
        setState({
          syncedWithGoogleCalendar: false,
          syncStatus: false,
          loadingUserInfo: false
        })
      })
  }

  useEffect(() => {
    loadUserInfo()
  }, [])

  useEffect(() => {
    if (!state.loadingUserInfo) {
      loadMyRequests({ pagination: { ...state.pagination, current: 1 } })
    }
  }, [state.filter, state.loadingUserInfo])

  const toggleAddModal = () => {
    setState({
      addModal: !state.addModal
    })
  }

  const setFilter = (props) => {
    setState({ filter: { ...state.filter, ...props } })
  }

  const setLoadingSyncGoogleCalendar = (status) => {
    setState({
      loadingSyncGoogleCalendar: status
    })
  }

  const toggleSyncStatus = () => {
    setState({
      syncStatus: !state.syncStatus
    })
  }

  const addBtn = ability.can("add", moduleName) ? (
    <Button.Ripple
      color="primary"
      onClick={() => {
        toggleAddModal()
      }}>
      <i className="icpega Actions-Plus button-icon"></i> &nbsp;
      <span className="align-self-center">
        {useFormatMessage("modules.time_off_requests.button.add")}
      </span>
    </Button.Ripple>
  ) : (
    ""
  )

  const syncBtn = (
    <GoogleOAuthProvider clientId="802894112425-nrku771q46jnvtht22vactg5n5jki5nl.apps.googleusercontent.com">
      <SyncGoogleCalendar
        loadingSyncGoogleCalendar={state.loadingSyncGoogleCalendar}
        syncedWithGoogleCalendar={state.syncedWithGoogleCalendar}
        syncStatus={state.syncStatus}
        loadUserInfo={loadUserInfo}
        setLoadingSyncGoogleCalendar={setLoadingSyncGoogleCalendar}
        toggleSyncStatus={toggleSyncStatus}
      />
    </GoogleOAuthProvider>
  )

  return (
    <Fragment>
      <Card className="my-requests">
        <div className="ant-spin-nested-loading">
          {state.loadingSyncGoogleCalendar && (
            <div>
              <div
                className="ant-spin ant-spin-spinning"
                aria-live="polite"
                aria-busy="true"
                style={{ height: "400px" }}>
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
              "ant-spin-blur": state.loadingSyncGoogleCalendar
            })}>
            <CardHeader>
              <div className="d-flex flex-wrap w-100 mb-7">
                <div className="d-flex align-items-center">
                  <i className="far fa-file-alt icon-circle bg-icon-green"></i>
                  <span className="instruction-bold">
                    {useFormatMessage("modules.time_off_requests.my_requests")}
                  </span>
                </div>

                <div
                  className="d-flex align-items-center"
                  style={{ marginLeft: "auto" }}>
                  <Space>
                    {addBtn}
                    {syncBtn}
                  </Space>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <TableMyRequests
                metas={metas}
                moduleName={moduleName}
                options={options}
                setFilter={setFilter}
                datefrom_default={firstDayOfyear}
                dateto_default={lastDayOfyear}
                data_requests={state.data_requests}
                loadingMyRequests={state.loading}
                loadMyRequests={loadMyRequests}
                pagination={state.pagination}
                afterAction={() => {
                  loadBalanceHistory({
                    pagination_balance: { ...pagination_balance, current: 1 }
                  })
                  loadDataBalance()
                }}
                type="request"
              />
            </CardBody>
          </div>
        </div>
      </Card>

      <AddRequestModal
        modal={state.addModal}
        toggleAddModal={toggleAddModal}
        metas={metas}
        moduleName={moduleName}
        options={options}
        type={type}
        line_manager={line_manager}
        pagination={state.pagination}
        loadMyRequests={loadMyRequests}
        pagination_balance={pagination_balance}
        loadBalanceHistory={loadBalanceHistory}
        loadDataBalance={loadDataBalance}
        data_holiday={data_holiday}
        data_schedule={data_schedule}
      />
    </Fragment>
  )
}

export default MyRequests
