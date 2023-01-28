// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { DashboardApi } from "../common/api"
import moment from "moment"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"
import TotalPayment from "../components/details/statistic/TotalPayment/TotalPayment"
import GrossTaxChart from "../components/details/statistic/GrossTaxChart/GrossTaxChart"
import EmployeeOverview from "../components/details/statistic/EmployeeOverview/EmployeeOverview"
import { ErpDate } from "@apps/components/common/ErpField"

const CardStatistic = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const [state, setState] = useMergedState({
    loading: true,
    dataEmployeeOverview: {},
    dataGrossTaxChart: {},
    dataTotalPayment: {},
    currentMonth: currentMonth,
    currentYear: currentYear,
    filter: {
      month:
        currentMonth < 10
          ? `${currentYear}-0${currentMonth}`
          : `${currentYear}-${currentMonth}`
    }
  })

  const loadStatisticData = () => {
    setState({
      loading: true
    })

    DashboardApi.getStatisticData(state.filter)
      .then((res) => {
        setState({
          dataEmployeeOverview: res.data.data_employee_overview,
          dataGrossTaxChart: res.data.data_gross_tax_chart,
          dataTotalPayment: res.data.data_total_payment,
          loading: false
        })
      })
      .catch((err) => {})
  }

  const handleChangeFilterMonth = (el) => {
    const month = el.month() + 1
    const year = el.year()

    setState({
      currentMonth: month,
      currentYear: year,
      filter: {
        ...state.filter,
        month: month < 10 ? `${year}-0${month}` : `${year}-${month}`
      }
    })
  }

  // ** effect
  useEffect(() => {
    loadStatisticData()
  }, [state.filter])

  // ** render
  const customFormat = (value) => {
    const month = value.month() + 1
    const year = value.year()

    return `${useFormatMessage(`month.${month}`)}, ${year}`
  }

  const datePicker = () => {
    return (
      <div className="me-1">
        <ErpDate
          name="filter-month"
          className="statistic-filter-month"
          picker="month"
          suffixIcon={<i className="far fa-chevron-down" />}
          format={customFormat}
          defaultValue={moment()}
          allowClear={false}
          onChange={(el) => handleChangeFilterMonth(el)}
        />
      </div>
    )
  }

  const renderComponent = () => {
    if (state.loading) {
      return (
        <div className="w-100 d-flex align-items-center justify-content-center loading-content">
          <div
            className="ant-spin ant-spin-spinning"
            aria-live="polite"
            aria-busy="true">
            <span className="ant-spin-dot ant-spin-dot-spin">
              <i className="ant-spin-dot-item"></i>
              <i className="ant-spin-dot-item"></i>
              <i className="ant-spin-dot-item"></i>
              <i className="ant-spin-dot-item"></i>
            </span>
          </div>
        </div>
      )
    }

    return (
      <Fragment>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="w-20">
            <TotalPayment
              data={state.dataTotalPayment}
              currentMonth={state.currentMonth}
              currentYear={state.currentYear}
            />
          </div>
          <div className="w-80">
            <GrossTaxChart data={state.dataGrossTaxChart} />
          </div>
        </div>
        <div>
          <EmployeeOverview data={state.dataEmployeeOverview} />
        </div>
      </Fragment>
    )
  }

  return (
    <LayoutDashboard
      className="dashboard-card-statistic"
      headerProps={{
        id: "statistic",
        title: useFormatMessage("modules.dashboard.statistic"),
        isRemoveWidget: true,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="18px"
            height="18px"
            viewBox="0 0 18 18"
            enableBackground="new 0 0 18 18"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="18"
              height="18"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAQAAAD8x0bcAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnARoKEjsBOQPwAAAA70lEQVQoz32SUXXCUBBE7+P0v3HA q4LgIM8BEooDcICESEgdlCpIUcBBwQMFiYPbj6SQ9EDv98ye3Z0JjFiwpOBOH85MMdr6iMYlQAAj J+CDI/3EWbAmASlcAVvz4PiL0c4WsFBrnmBtZ7GgBL6eiThT8LrgfzLw9lBkPV/gBYBSAbiEK1ix Aw/heHdVs8/swcbsyWxl5VZNg2hrMpms1Xe1sTTfjKMo/UZjZ1aXYDSZ3A2ilbqerKzt5IS1uhqe uZ/8+NNyImrGk2ztnsaSbe4B9xz4ngUcWbGhHwMGo82DonS2t6rcShfnpeMSxsk/AA/bX5TjTlwA AAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDEtMjZUMDk6MTg6NTkrMDE6MDBVowvHAAAAJXRFWHRk YXRlOm1vZGlmeQAyMDIzLTAxLTI2VDA5OjE4OjU5KzAxOjAwJP6zewAAAABJRU5ErkJggg=="
            />
          </svg>
        ),
        classIconBg: "statistic-bg",
        classNameHeader: "card-header-statistic",
        titleLink: "/statistic",
        customRight: datePicker(),
        ...props
      }}>
      <Card>
        <CardBody className="ps-3 pe-3 pt-1 pb-3 card-body-statistic">
          <Fragment>{renderComponent()}</Fragment>
        </CardBody>
      </Card>
    </LayoutDashboard>
  )
}

export default CardStatistic
