import { useMergedState } from "@apps/utility/common"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardBody, TabContent, TabPane } from "reactstrap"
import { workspaceApi } from "../common/api"
import TabFeed from "../components/detail/TabFeed/TabFeed"
import TabIntroduction from "../components/detail/TabIntroduction/TabIntroduction"
import TabMember from "../components/detail/TabMember/TabMember"
import TabPinned from "../components/detail/TabPinned/TabPinned"
import TabMedia from "../components/detail/TabMedia/TabMedia"
import WorkspaceHeader from "../components/detail/WorkspaceHeader"
import TabPrivate from "../components/detail/TabPrivate"
import { useSelector } from "react-redux"
const DetailWorkspace = () => {
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    tabActive: 1,
    detailWorkspace: {},
    workspacePublic: false
  })
  const params = useParams()
  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0
  const tabToggle = (tab) => {
    if (state.tabActive !== tab) {
      setState({
        tabActive: tab
      })
    }
  }
  const offsetTop = 90
  const offsetBottom = 30
  console.log("state", state.detailWorkspace)
  const handleScroll = (e) => {
    if (window.scrollY < state.prevScrollY) {
      scrollUpwards()
    } else {
      scrollDownwards()
    }
    setState({ prevScrollY: window.scrollY })
  }

  const scrollUpwards = () => {
    const sticky = document.getElementById("div-sticky")
    if (sticky) {
      document.getElementById("div-sticky").style.top = offsetTop + "px"
    }
  }

  const scrollDownwards = () => {
    const sticky = document.getElementById("div-sticky")
    if (sticky) {
      if (sticky.offsetHeight > window.innerHeight) {
        const offset =
          (sticky.offsetHeight - window.innerHeight + offsetBottom) * -1
        document.getElementById("div-sticky").style.top = offset + "px"
      } else {
        document.getElementById("div-sticky").style.top = offsetTop + "px"
      }
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

  useEffect(() => {
    const arrAdmin = state.detailWorkspace?.administrators
      ? state.detailWorkspace?.administrators
      : []
    const arrMember = state.detailWorkspace?.members
      ? state.detailWorkspace?.members
      : []

    const isAdmin = arrAdmin.includes(userId)
    const isMember = arrMember.includes(userId)
    let isJoined = false
    if (isAdmin || isMember) {
      isJoined = true
    }

    let workspacePublic = false
    if (
      state.detailWorkspace?.type &&
      state.detailWorkspace?.type === "public"
    ) {
      workspacePublic = true
    }

    setState({ isJoined: isJoined, workspacePublic: workspacePublic })
  }, [state.detailWorkspace])
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
            {!state.isJoined && !state.workspacePublic && (
              <div>
                <TabPrivate data={state.detailWorkspace} />
              </div>
            )}
            {(state.isJoined || state.workspacePublic) && (
              <TabFeed detailWorkspace={state.detailWorkspace} />
            )}
          </TabPane>
          <TabPane tabId={2}>
            {!state.isJoined && !state.workspacePublic && (
              <div>
                <TabPrivate data={state.detailWorkspace} />
              </div>
            )}
            {(state.isJoined || state.workspacePublic) && (
              <TabPinned detailWorkspace={state.detailWorkspace} />
            )}
          </TabPane>
          <TabPane tabId={3}>
            {!state.isJoined && !state.workspacePublic && (
              <div>
                <TabPrivate data={state.detailWorkspace} />
              </div>
            )}
            {(state.isJoined || state.workspacePublic) && <TabIntroduction />}
          </TabPane>
          <TabPane tabId={4}>
            {!state.isJoined && !state.workspacePublic && (
              <div>
                <TabPrivate data={state.detailWorkspace} />
              </div>
            )}
            {(state.isJoined || state.workspacePublic) && (
              <TabMember tabActive={state.tabActive} tabId={4} />
            )}
          </TabPane>
          <TabPane tabId={5}>
            {!state.isJoined && !state.workspacePublic && (
              <div>
                <TabPrivate data={state.detailWorkspace} />
              </div>
            )}
            {(state.isJoined || state.workspacePublic) && (
              <TabMedia tabActive={state.tabActive} tabId={5} />
            )}
          </TabPane>
        </TabContent>
      </div>
    </div>
  )
}

export default DetailWorkspace
