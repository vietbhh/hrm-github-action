import AvatarList from "@apps/components/common/AvatarList"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { isObject } from "@apps/utility/handleData"
import { Col } from "antd"
import { isEmpty, map } from "lodash"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap"
import { DashboardApi } from "../common/api"
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"

const CardEmployees = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    data: []
  })

  const loadData = () => {
    setState({ loading: true })
    DashboardApi.getDepartment()
      .then((res) => {
        setState({
          loading: false,
          data: res.data
        })
      })
      .catch((error) => {
        setState({ loading: false })
      })
  }

  useEffect(() => {
    loadData()
  }, [])
  const object2QueryStringUrl = (data, pre = "") => {
    let string = ""
    map(data, (value, key) => {
      if (isObject(value) && !value.hasOwnProperty("_isAMomentObject")) {
        const newKey = pre ? pre : key
        string += object2QueryStringUrl(value, newKey)
      } else if (isObject(value) && value.hasOwnProperty("_isAMomentObject")) {
        const newKey = pre ? pre : key
        string += "&" + newKey + "=" + value.format("YYYY-MM-DD HH:mm")
      } else {
        const newKey = pre ? pre : key
        string += "&" + newKey + "=" + value
      }
    })
    return string
  }
  return (
    <LayoutDashboard
      className="card-user-timeline"
      headerProps={{
        id: "employees",
        title: useFormatMessage("modules.dashboard.employees"),
        isRemoveWidget: true,
        classIconBg: "bg-icon-green",
        icon: (
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M3.75 6.75V12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.9375 6.375C5.28369 6.375 6.375 5.28369 6.375 3.9375C6.375 2.59131 5.28369 1.5 3.9375 1.5C2.59131 1.5 1.5 2.59131 1.5 3.9375C1.5 5.28369 2.59131 6.375 3.9375 6.375Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.75 16.5C4.99264 16.5 6 15.4926 6 14.25C6 13.0074 4.99264 12 3.75 12C2.50736 12 1.5 13.0074 1.5 14.25C1.5 15.4926 2.50736 16.5 3.75 16.5Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.25 16.5C15.4926 16.5 16.5 15.4926 16.5 14.25C16.5 13.0074 15.4926 12 14.25 12C13.0074 12 12 13.0074 12 14.25C12 15.4926 13.0074 16.5 14.25 16.5Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.8475 6.75C4.185 8.0625 5.385 9.03751 6.8025 9.03001L9.375 9.0225C11.34 9.015 13.0125 10.275 13.6275 12.03"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        ...props
      }}>
      <CardBody className="dashboard-employees min-height-50">
        <div className="row">
          {!state.loading && (
            <>
              {isEmpty(state.data) && (
                <EmptyContent
                  icon={<i className="iconly-Send"></i>}
                  title={useFormatMessage("modules.dashboard.employees_empty")}
                  text=""
                />
              )}

              {map(state.data, (value, key) => {
                const arrEmployy = []
                value.employees.map((v) => {
                  const ca = {
                    id: v.id,
                    src: v.avatar,
                    title: v.full_name
                  }
                  arrEmployy.push(ca)
                })
                const params = object2QueryStringUrl({
                  departments: value.deparments_child
                })
                return (
                  <Col key={key}>
                    <div className="box-department">
                      <div className="department">
                        <Link to={"/employees/list?" + params}>
                          {value.name}
                        </Link>
                        <div className="total-employees">
                          {useFormatMessage(
                            "modules.dashboard.employees_total"
                          )}{" "}
                          : <span>{value.employees.length}</span>
                        </div>
                      </div>
                      <div className="avatar-list">
                        <Link to={"/employees/list?" + params}>
                          <AvatarList
                            data={arrEmployy}
                            avatarKey={"avaList" + value.id}
                            showNumberMore={true}
                          />
                        </Link>
                      </div>
                    </div>
                  </Col>
                )
              })}
            </>
          )}
        </div>
      </CardBody>
    </LayoutDashboard>
  )
}

export default CardEmployees
