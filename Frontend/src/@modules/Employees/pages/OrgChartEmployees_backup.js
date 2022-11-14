import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { isEmpty } from "lodash-es"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Card, CardBody, CardHeader } from "reactstrap"
import { employeesApi } from "../common/api"
import OrganizationalChart from "../components/org-chart/OrganizationalChart"

const OrgChartEmployees = (props) => {
  const moduleData = useSelector((state) => state.app.modules.employees)
  const compName = useSelector((state) => state.layout.app_name)
  const compLogo = useSelector((state) => state.layout.logo_default)
  const { name, metas } = moduleData

  const [state, setState] = useMergedState({
    tree: {},
    loading: true
  })
  const { tree } = state

  useEffect(() => {
    loadData().then((res) => {
      let newState = {
        id: 9092020,
        person: {
          id: 9092020,
          avatar: compLogo,
          department: "",
          name: compName,
          title: "",
          totalReports: 0
        },
        hasChild: false,
        hasParent: false,
        isHighlight: true,
        children: []
      }
      if (!isEmpty(res.data)) {
        newState = {
          ...newState,
          hasChild: true,
          children: res.data
        }
      }
      setState({
        tree: {
          ...newState
        }
      })
    })
  }, [])
  const loadData = (parent) => {
    return employeesApi.getOrgData(parent)
  }
  return (
    <Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage("menu.organizationalChart")
          }
        ]}
      />
      <Card>
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">
                <i className="fad fa-sitemap"></i>
              </span>
              <span>
                {useFormatMessage("modules.employees.org_chart.title")}
              </span>
            </h1>
          </div>
        </CardHeader>
        <CardBody className="pt-1">
          {isEmpty(tree) && <DefaultSpinner center="true" />}
          {!isEmpty(tree) && (
            <OrganizationalChart tree={tree} loadData={loadData} />
          )}
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default OrgChartEmployees
