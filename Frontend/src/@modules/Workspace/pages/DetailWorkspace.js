import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { map } from "lodash-es"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams, useSearchParams, useLocation } from "react-router-dom"
import { TabContent, TabPane } from "reactstrap"
import { workspaceApi } from "../common/api"
import TabFeed from "../components/detail/TabFeed/TabFeed"
import TabIntroduction from "../components/detail/TabIntroduction/TabIntroduction"
import TabMedia from "../components/detail/TabMedia/TabMedia"
import TabMember from "../components/detail/TabMember/TabMember"
import TabPinned from "../components/detail/TabPinned/TabPinned"
import TabPrivate from "../components/detail/TabPrivate"
import WorkspaceHeader from "../components/detail/WorkspaceHeader"
import { getTabByNameOrId } from "../common/common"

const DetailWorkspace = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchText = searchParams.get("search")
  const tab = searchParams.get("tab")
  const tabId = getTabByNameOrId({
    value: tab,
    type: "name"
  })

  const [state, setState] = useMergedState({
    prevScrollY: 0,
    tabActive: tabId === undefined ? 1 : parseInt(tabId),
    detailWorkspace: {},
    searchTextFeed: searchText === null ? "" : searchText,
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
  const offsetTop = 95
  const offsetBottom = 30
  const handleScroll = (e) => {
    if (window.scrollY < state.prevScrollY) {
      scrollUpwards()
    } else {
      scrollDownwards()
    }
    setState({ prevScrollY: window.scrollY })
  }

  const setSearchTextFeed = (str) => {
    setState({
      searchTextFeed: str
    })
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

  const handleUnPinPost = (idPost) => {
    const dataPinned = [...state.detailWorkspace.pinPosts]
    const index = dataPinned.findIndex((p) => p.post === idPost)
    dataPinned.splice(index, 1)
    let numStt = 1
    const dataPinnedUpdate = []
    map(dataPinned, (item, key) => {
      dataPinnedUpdate.push({ post: item.post, stt: numStt })
      numStt += 1
    })
    // detailWorkspace.pinPosts = dataPinnedUpdate
    const dataUpdate = {
      pinPosts: JSON.stringify(dataPinnedUpdate)
    }
    workspaceApi.update(params.id, dataUpdate).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      loadData()
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
        searchTextFeed={state.searchTextFeed}
        tabToggle={tabToggle}
        loadData={loadData}
        setSearchTextFeed={setSearchTextFeed}
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
              <TabFeed
                searchTextFeed={state.searchTextFeed}
                detailWorkspace={state.detailWorkspace}
                handleUnPinPost={handleUnPinPost}
              />
            )}
          </TabPane>
          <TabPane tabId={2}>
            {!state.isJoined && !state.workspacePublic && (
              <div>
                <TabPrivate data={state.detailWorkspace} />
              </div>
            )}
            {(state.isJoined || state.workspacePublic) && (
              <TabPinned
                detailWorkspace={state.detailWorkspace}
                handleUnPinPost={handleUnPinPost}
              />
            )}
          </TabPane>
          <TabPane tabId={3}>
            {!state.isJoined && !state.workspacePublic && (
              <div>
                <TabPrivate data={state.detailWorkspace} />
              </div>
            )}
            {(state.isJoined || state.workspacePublic) && (
              <TabIntroduction detailWorkspace={state.detailWorkspace} />
            )}
          </TabPane>
          <TabPane tabId={4}>
            {!state.isJoined && !state.workspacePublic && (
              <div>
                <TabPrivate data={state.detailWorkspace} />
              </div>
            )}
            {(state.isJoined || state.workspacePublic) && (
              <TabMember
                tabActive={state.tabActive}
                tabId={4}
                detailWorkspace={state.detailWorkspace}
              />
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
