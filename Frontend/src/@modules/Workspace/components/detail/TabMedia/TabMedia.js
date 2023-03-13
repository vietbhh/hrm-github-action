// ** React Imports
import { useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useParams } from "react-router-dom"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import MediaHeader from "./MediaHeader"
import MediaContent from "./MediaContent"

const TabMedia = (props) => {
  const {
    // ** props
    tabActive
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    mediaTabActive: 1,
    data: {}
  })

  const { id } = useParams()

  const setMediaTabActive = (tab) => {
    if (state.mediaTabActive !== tab) {
      setState({
        mediaTabActive: tab
      })
    }
  }

  const loadData = () => {
    setState({
      loading: true
    })

    workspaceApi
      .loadMedia(id, {
        media_type: state.mediaTabActive
      })
      .then((res) => {
        setState({
          data: res.data
        })
      })
      .catch((err) => {})
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.mediaTabActive])

  // ** render
  return (
    <div className="tab-media">
      <Card>
        <CardBody>
          <div>
            <MediaHeader />
          </div>
          <div>
            <MediaContent
              mediaTabActive={state.mediaTabActive}
              data={state.data}
              setMediaTabActive={setMediaTabActive}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default TabMedia
