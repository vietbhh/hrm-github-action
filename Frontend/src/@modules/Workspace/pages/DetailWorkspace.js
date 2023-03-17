import { useMergedState } from "@apps/utility/common"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardBody, TabContent, TabPane } from "reactstrap"
import { workspaceApi } from "../common/api"
import TabFeed from "../components/detail/TabFeed/TabFeed"
import TabIntroduction from "../components/detail/TabIntroduction/TabIntroduction"
import TabMember from "../components/detail/TabMember/TabMember"
import WorkspaceHeader from "../components/detail/WorkspaceHeader"
const DetailWorkspace = () => {
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    tabActive: 1,
    detailWorkspace: {}
  })
  const params = useParams()
  const tabToggle = (tab) => {
    if (state.tabActive !== tab) {
      setState({
        tabActive: tab
      })
    }
  }
  const offsetTop = 90
  const offsetBottom = 30

  const handleScroll = (e) => {
    if (window.scrollY < state.prevScrollY) {
      scrollUpwards()
    } else {
      scrollDownwards()
    }
    setState({ prevScrollY: window.scrollY })
  }

  const scrollUpwards = () => {
    document.getElementById("div-sticky").style.top = offsetTop + "px"
  }

  const scrollDownwards = () => {
    const sticky = document.getElementById("div-sticky")
    if (sticky.offsetHeight > window.innerHeight) {
      const offset =
        (sticky.offsetHeight - window.innerHeight + offsetBottom) * -1
      document.getElementById("div-sticky").style.top = offset + "px"
    } else {
      document.getElementById("div-sticky").style.top = offsetTop + "px"
    }
  }
  const loadData = () => {
    workspaceApi.getDetailWorkspace(params.id).then((res) => {
      setState({ detailWorkspace: res.data })
    })
  }
  useEffect(() => {
    loadData()
  }, [])
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [state.prevScrollY])

  return (
    <div className="workspace">
      <WorkspaceHeader
        tabActive={state.tabActive}
        data={state.detailWorkspace}
        tabToggle={tabToggle}
        loadData={loadData}
      />
      <div className="mt-1">
        <TabContent className="py-50" activeTab={state.tabActive}>
          <TabPane tabId={1}>
            <TabFeed detailWorkspace={state.detailWorkspace} />
          </TabPane>
          <TabPane tabId={2}>
            <div className="div-content">
              <div className="div-left">
                <Card>
                  <CardBody>feed 2</CardBody>
                </Card>
              </div>
              <div className="div-right">
                <div id="div-sticky">
                  <Card>
                    <CardBody>sidebar 2</CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tabId={3}>
            <TabIntroduction />
          </TabPane>
          <TabPane tabId={4}>
            <TabMember tabActive={state.tabActive} tabId={4} />
          </TabPane>
        </TabContent>
      </div>
    </div>
  )
}

export default DetailWorkspace
