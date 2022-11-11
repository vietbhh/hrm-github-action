import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { isEmpty } from "lodash"
import React, { useEffect } from "react"
import { Download, Info } from "react-feather"
import { Navigate, useParams } from "react-router-dom"
import {
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"
import { defaultModuleApi } from "../../../utility/moduleApi"
import DetailFilesDefaultModule from "./detail/DetailFilesDefaultModule"
import DetailTableDefaultModule from "./detail/DetailTableDefaultModule"
import { DetailToolbarWarpperDefaultModule } from "./detail/DetailToolbarDefaultModule"

const DetailDefaultModule = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    block: false,
    data: false,
    files_upload_module: [],
    active: "1"
  })
  const toggle = (tab) => {
    if (state.active !== tab) {
      setState({
        active: tab
      })
    }
  }
  const params = useParams()
  const id = params.id

  if (isEmpty(id)) {
    return (
      <Fragment>
        <AppSpinner />
        <Navigate to="/not-found" replace />
      </Fragment>
    )
  }

  const loadData = () => {
    setState({ loading: true })
    defaultModuleApi.getDetail(props.module.name, id).then((result) => {
      const { data, files_upload_module } = result.data
      setState({
        data: data,
        loading: false,
        files_upload_module: files_upload_module
      })
    })
  }
  useEffect(() => {
    loadData()
  }, [id])

  if (state.loading) return <AppSpinner />
  return (
    <React.Fragment>
      <DetailToolbarWarpperDefaultModule
        module={props.module}
        id={id}
        data={state.data}
        metas={props.metas}
        options={props.options}
        loadData={loadData}
      />
      <Card>
        <CardHeader>
          <Nav tabs className="mb-0">
            <NavItem>
              <NavLink
                active={state.active === "1"}
                onClick={() => {
                  toggle("1")
                }}>
                <Info size={15} />
                {useFormatMessage("module.default.form.tabs.data")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={state.active === "2"}
                onClick={() => {
                  toggle("2")
                }}>
                <Download size={15} />{" "}
                {useFormatMessage("module.default.form.tabs.files")}
              </NavLink>
            </NavItem>
          </Nav>
        </CardHeader>
        <CardBody>
          <TabContent className="py-50" activeTab={state.active}>
            <TabPane tabId="1">
              <DetailTableDefaultModule
                data={state.data}
                fields={props.metas}
                module={props.module}
              />
            </TabPane>
            <TabPane tabId="2">
              <DetailFilesDefaultModule files={state.files_upload_module} />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default DetailDefaultModule
