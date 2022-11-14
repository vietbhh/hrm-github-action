import { EmptyContent } from "@apps/components/common/EmptyContent"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import {
  convertDate,
  convertDateToMonthDay
} from "@modules/Payrolls/common/common"
import { Collapse, Timeline } from "antd"
import { isEmpty } from "lodash-es"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Card, CardBody, CardHeader } from "reactstrap"
const { Panel } = Collapse

const TabActivity = (props) => {
  const modules = useSelector((state) => state.app.modules)
  const employeesModule = modules.employees

  const [state, setState] = useMergedState({
    loading: true,
    dataActivity: {},
    collapseFirstKey: ""
  })

  const loadActivity = () => {
    if (!isEmpty(props.employeeData.id)) {
      props.api
        .getRelatedList("employee_histories")
        .then((res) => {
          setState({
            loading: false,
            dataActivity: res.data.results,
            collapseFirstKey: res.data.firstKey
          })
        })
        .catch((err) => {
          setState({
            loading: false
          })
        })
    }
  }

  useEffect(() => {
    loadActivity()
  }, [props.employeeData])

  const renderTimeLine = () => {
    if (_.isEmpty(state.dataActivity)) {
      return <EmptyContent />
    }

    const renderPanel = () => {
      const renderDescription = (description) => {
        const des_split = description.split("@")
        let out = ""
        if (des_split[0] === "changed") {
          const check_isFieldDate = description.toLowerCase().search("date")
          let isFieldDate = false
          let date_from = ""
          let date_to = ""
          if (check_isFieldDate !== -1) {
            isFieldDate = true
            date_from = des_split[3].replace('"', "")
            date_from = date_from.replace('"', "")
            date_from = date_from.replace(" ", "")
            date_from = date_from.replace(" ", "")
            date_to = des_split[5].replace('"', "")
            date_to = date_to.replace('"', "")
            date_to = date_to.replace(" ", "")
            date_to = date_to.replace(" ", "")
          }
          out =
            useFormatMessage(`modules.employees.fields.${des_split[1]}`) +
            " " +
            useFormatMessage(
              `modules.employees.tabs.activity.${des_split[2]}`
            ) +
            (isFieldDate === true
              ? ' "' + convertDate(date_from) + '" '
              : des_split[3]) +
            useFormatMessage(
              `modules.employees.tabs.activity.${des_split[4]}`
            ) +
            (isFieldDate === true
              ? ' "' + convertDate(date_to) + '" '
              : des_split[5])
        }
        if (des_split[0] === "joining") {
          let date = des_split[7].replace('"', "")
          date = date.replace('"', "")
          date = date.replace(" ", "")
          date = date.replace(" ", "")
          out =
            useFormatMessage(
              `modules.employees.tabs.activity.${des_split[0]}`
            ) +
            des_split[1] +
            useFormatMessage(
              `modules.employees.tabs.activity.${des_split[2]}`
            ) +
            des_split[3] +
            useFormatMessage(
              `modules.employees.tabs.activity.${des_split[4]}`
            ) +
            des_split[5] +
            useFormatMessage(
              `modules.employees.tabs.activity.${des_split[6]}`
            ) +
            ' "' +
            convertDate(date) +
            '" '
        }

        return out
      }

      return _.map(state.dataActivity, (value, year) => {
        const year_ = year.replace('"', "")
        return (
          <Panel header={year_} key={year_}>
            <Timeline>
              {_.map(value, (item, date) => {
                return (
                  <Timeline.Item key={date} dot={convertDateToMonthDay(date)}>
                    {_.map(item, (description, key) => {
                      return <p key={key}>{renderDescription(description)}</p>
                    })}
                  </Timeline.Item>
                )
              })}
            </Timeline>
          </Panel>
        )
      })
    }

    return (
      <Collapse
        className="employee-payroll-collapse employee-activity"
        defaultActiveKey={[`${state.collapseFirstKey}`]}
        ghost>
        {renderPanel()}
      </Collapse>
    )
  }

  return (
    <Fragment>
      <Card className="card-inside with-border-radius life-card employee-activity">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">
                <i className="fal fa-clipboard-list-check" />
              </span>
              <span>
                {useFormatMessage("modules.employees.tabs.activity.title")}
              </span>
            </h1>
            <div className="d-flex ms-auto"></div>
          </div>
        </CardHeader>
        <CardBody>
          {state.loading && <DefaultSpinner />}

          {!state.loading && renderTimeLine()}
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default TabActivity
