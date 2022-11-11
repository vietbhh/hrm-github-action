import { FormLoader } from "@apps/components/spinner/FormLoader"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { isEmpty, map } from "lodash"
import { useEffect } from "react"
import { Tool } from "react-feather"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"
import { appSettingApi } from "../common/api"
import AppSettingForm from "../components/app/AppSettingForm"

const AppSetting = () => {
  const [state, setState] = useMergedState({
    loading: true,
    tabs: [],
    tabsData: {},
    active: 0
  })

  const loadData = () => {
    setState({
      loading: true
    })
    appSettingApi
      .get()
      .then((res) => {
        if (!isEmpty(res.data)) {
          setState({
            loading: false,
            tabs: res.data.tabs,
            tabsData: res.data.tabsData
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggle = (tab) => {
    if (state.active !== tab) {
      setState({
        active: tab
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <Tool size={16} /> Application Configuration
        </CardTitle>
      </CardHeader>
      <CardBody>
        {state.loading && <FormLoader />}
        {!state.loading && (
          <div className="nav-vertical">
            <Nav tabs className="nav-left">
              {map(state.tabs, (item, index) => (
                <NavItem key={index}>
                  <NavLink
                    active={state.active === index}
                    onClick={() => {
                      toggle(index)
                    }}>
                    <i className={`fal fa-${item.icon}`}></i>{" "}
                    {useFormatMessage(`settings.apps.tabs.${item.name}`)}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={state.active}>
              {map(state.tabs, (item, index) => (
                <TabPane key={index} tabId={index}>
                  <AppSettingForm
                    loading={state.loading}
                    fields={state.tabsData[item.key]}
                  />
                </TabPane>
              ))}
            </TabContent>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default AppSetting
