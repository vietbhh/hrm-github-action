import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { convertDate } from "@modules/Payrolls/common/common"
import { Table } from "antd"
import { isEmpty, map } from "lodash"
import { Fragment } from "react"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import FilterTimeOff from "../FilterTimeOff"

const BalanceHistory = (props) => {
  const {
    metas,
    moduleName,
    options,
    data_balance,
    loading_balance,
    pagination_balance,
    loadBalanceHistory,
    setFilterBalance,
    firstDayOfyear,
    lastDayOfyear,
    addAdjustment
  } = props
  const [state, setState] = useMergedState({
    loading: false
  })

  const drawTable = (data_balance) => {
    const columns = [
      {
        title: useFormatMessage("modules.time_off_requests.date"),
        dataIndex: "date",
        key: "date",
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("modules.time_off_requests.event"),
        dataIndex: "event",
        key: "event",
        render: (text, record) => {
          return <>{useFormatMessage(text)}</>
        }
      },
      {
        title: useFormatMessage("modules.time_off_requests.type"),
        dataIndex: "type",
        key: "type",
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("modules.time_off_requests.change_by"),
        dataIndex: "change_by",
        key: "change_by",
        render: (text, record) => {
          return isEmpty(text) ? (
            <Fragment>
              <span className="span-icon-balance">
                <i className="far fa-cog"></i>
              </span>
              <span>
                {useFormatMessage("modules.time_off_requests.system")}
              </span>
            </Fragment>
          ) : (
            <Fragment>
              <Avatar
                style={{ cursor: "default" }}
                className="img"
                size="sm"
                src={text.icon}
              />
              <span>{text.full_name}</span>
            </Fragment>
          )
        }
      },
      {
        title: useFormatMessage("modules.time_off_requests.change_day"),
        dataIndex: "change_day",
        key: "change_day",
        render: (text, record) => {
          return (
            <>
              {text[0] > 0
                ? "+" + Math.round(text[0] * 1000) / 1000
                : Math.round(text[0] * 1000) / 1000}
            </>
          )
        }
      }
    ]

    const data_table = [
      ...map(data_balance, (values, index) => {
        return {
          key: index,
          date: convertDate(values.date),
          event: values.event ? values.event.label : "",
          type: values.type ? values.type.label : "",
          change_by: values.changed_by,
          change_day: [
            values.change,
            values.event ? values.event.name_option : ""
          ]
        }
      })
    ]

    const changeTable = (pagination) => {
      loadBalanceHistory({ pagination_balance: pagination })
    }

    return (
      <Table
        loading={loading_balance}
        columns={columns}
        dataSource={data_table}
        expandable={true}
        pagination={pagination_balance}
        onChange={changeTable}
      />
    )
  }

  return (
    <Fragment>
      <Card className="my-requests">
        <CardHeader>
          <div className="d-flex flex-wrap w-100 mb-7">
            <div className="d-flex align-items-center">
              <i className="far fa-file-alt icon-circle bg-icon-green"></i>
              <span className="instruction-bold">
                {useFormatMessage("modules.time_off_requests.balance_history")}
              </span>
            </div>

            {addAdjustment && (
              <div
                className="d-flex align-items-center"
                style={{ marginLeft: "auto" }}>
                {addAdjustment}
              </div>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <FilterTimeOff
            metas={metas}
            moduleName={moduleName}
            options={options}
            setFilter={setFilterBalance}
            type="balance"
            datefrom_default={firstDayOfyear}
            dateto_default={lastDayOfyear}
          />

          <Row>
            <Col sm={12} style={{ overflow: "auto" }}>
              {drawTable(data_balance)}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default BalanceHistory
