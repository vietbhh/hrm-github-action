import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { timeoffApi } from "@modules/TimeOff/common/api"
import { isEmpty } from "lodash"
import { Fragment, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Card, CardBody, CardHeader } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import TableMyRequests from "../components/mytimeoff/TableMyRequests"

const today = new Date()
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
const firstDayYMD = `${firstDay.getFullYear()}-${
  firstDay.getMonth() + 1
}-${firstDay.getDate()}`
const lastDayYMD = `${lastDay.getFullYear()}-${
  lastDay.getMonth() + 1
}-${lastDay.getDate()}`

const ApprovalTimeOff = (props) => {
  const moduleData = useSelector((state) => state.app.modules.time_off_requests)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  const ability = useContext(AbilityContext)

  if (ability.can("accessApprovalTimeOff", "time-off") === false) {
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
      filter_status: options["status"].filter(
        (item) => item.name_option === "pending"
      )[0],
      filter_datefrom: firstDayYMD,
      filter_dateto: lastDayYMD
    }
  })

  const setFilter = (props) => {
    setState({ filter: { ...state.filter, ...props } })
  }

  const loadTeamTimeOff = (props) => {
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
      .getApprovalTimeOff(params)
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
      })
  }

  useEffect(() => {
    loadTeamTimeOff({ pagination: { ...state.pagination, current: 1 } })
  }, [state.filter])

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
              "modules.time_off_requests.approval_time_off"
            )
          }
        ]}
      />

      <Card className="my-requests">
        <CardHeader>
          <div className="d-flex flex-wrap w-100 mb-7">
            <div className="d-flex align-items-center">
              <i className="far fa-file-alt icon-circle bg-icon-green"></i>
              <span className="instruction-bold">
                {useFormatMessage(
                  "modules.time_off_requests.approval_time_off"
                )}
              </span>
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
            loadMyRequests={loadTeamTimeOff}
            pagination={state.pagination}
            type="approval"
          />
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ApprovalTimeOff
