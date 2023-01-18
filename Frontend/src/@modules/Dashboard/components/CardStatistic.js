// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { DashboardApi } from "../common/api"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"
import TotalPayment from "../components/details/statistic/TotalPayment/TotalPayment"
import GrossTaxChart from "../components/details/statistic/GrossTaxChart/GrossTaxChart"
import EmployeeOverview from "../components/details/statistic/EmployeeOverview/EmployeeOverview"
import { ErpSelect } from "@apps/components/common/ErpField"

const CardStatistic = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    dataEmployeeOverview: {},
    filter: {}
  })

  const loadStatisticData = () => {
    setState({
      loading: true
    })

    DashboardApi.getStatisticData(state.filter)
      .then((res) => {
        setState({
          dataEmployeeOverview: res.data.data_employee_overview,
          loading: false
        })
      })
      .catch((err) => {})
  }

  // ** effect
  useEffect(() => {
    loadStatisticData()
  }, [])

  // ** render
  const renderFilter = () => {
    return <ErpSelect name="filter-month" className="me-1"/>
  }

  return (
    <LayoutDashboard
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
            width="30px"
            height="30px"
            viewBox="0 0 30 30"
            enableBackground="new 0 0 30 30"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="30"
              height="30"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAArlBMVEUAAAAA5G0A4WwA4WsA 4GwA4W0A4GwA4GwA4GsA4WsA5msA4WwA33AA4W4A32oA4mwA4WsA4W0A4WwA4mwA4WwQ4nUv5oc/ 6JAg5H6/99r///+f88cf5H7v/fXv/faP8r9Q65pA6ZGf9Mjf++3f++y/+Nof5X4g5X4Q43WP8b6P 8r4/6ZBA6JFg7KNv7qx/77XP+eNf7KIv54dw7qww5odP6ppP6pkw54ev9tEw54j4gK5zAAAAFHRS TlMAL2+fz9+/r99fH+8gXzCv35/Pv89T0wgAAAABYktHRBp1Z+QyAAAACXBIWXMAAAsTAAALEwEA mpwYAAAAB3RJTUUH5wEOAigJPS8deQAAATVJREFUKM91k+tCgjAYhsc4CIJYNkUHLoGpYKVpZXn/ NxbsxIT5/tm+PYx9RwCELGg7LmrkeiNogXtBB93JDzRouWggfyxpECKDQvFChMwS3H2AkdPSibTm i4RpoXjQXV6usFKa8TMPgFjQNXnd5EyboqSCjwHkm2256x7dkxXfQDBla4Vr3akDmbPVBjxdb/hd xx94J3x3TViaTwD1cF3rpsLHJuKs3eDEhJlOKC0/aZIch7ebiA/4jItL2X4ose5aRWjj8j7Pv5Rr PLBv/MPixTwfV/wrAnsWaTmxdP1dmJli/u+RSirJurCXtJBJjWSaaX3lBT3Xa1mAGABP8ELVk2wF 9fV2qG68oLdKbwd5fSift2L4AItWtsyNrCYhMo2BPkiT3gcz2JuyGE5f+AjObBjL03+7BEQb3FNR IwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMS0xNFQwMjo0MDowOSswMDowMPSMTzQAAAAldEVY dGRhdGU6bW9kaWZ5ADIwMjMtMDEtMTRUMDI6NDA6MDkrMDA6MDCF0feIAAAAAElFTkSuQmCC"
            />
          </svg>
        ),
        classIconBg: "calendar-bg",
        classNameHeader: "card-header-statistic",
        titleLink: "/statistic",
        customRight: renderFilter(),
        ...props
      }}>
      <Card className="dashboard-card-statistic">
        <CardBody className="ps-3 pe-3 pt-1 pb-3">
          <div className="d-flex align-items-start justify-content-between mb-2">
            <div className="w-20">
              <TotalPayment />
            </div>
            <div className="w-80">
              <GrossTaxChart />
            </div>
          </div>
          <div>
            <EmployeeOverview data={state.dataEmployeeOverview} />
          </div>
        </CardBody>
      </Card>
    </LayoutDashboard>
  )
}

export default CardStatistic
