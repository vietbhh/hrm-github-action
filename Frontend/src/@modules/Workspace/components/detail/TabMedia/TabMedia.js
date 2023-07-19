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
import PreviewMediaContentModal from "../../modals/PreviewMediaContentModal/PreviewMediaContentModal"

const TabMedia = (props) => {
  const {
    // ** props
    tabActive,
    tabId,
    userId,
    detailWorkspace
    // ** methods
  } = props

  const isLoadable = parseInt(tabActive) === parseInt(tabId)

  const [state, setState] = useMergedState({
    loading: true,
    mediaTabActive: 1,
    mediaInfo: {},
    modalPreview: false
  })

  const arrMember = detailWorkspace?.members ? detailWorkspace?.members : []
  const isMember = arrMember.some(
    (itemSome) => parseInt(itemSome.id_user) === parseInt(userId)
  )

  const { id } = useParams()

  const setMediaTabActive = (tab) => {
    if (state.mediaTabActive !== tab) {
      setState({
        mediaTabActive: tab
      })
    }
  }

  // ** render
  return (
    <div className="tab-media">
      <Card>
        <CardBody>
          <div className="media-header">
            <MediaHeader
              isMember={isMember}
              mediaTabActive={state.mediaTabActive}
            />
          </div>
          <div>
            <MediaContent
              id={id}
              isLoadable={isLoadable}
              detailWorkspace={detailWorkspace}
              mediaTabActive={state.mediaTabActive}
              setMediaTabActive={setMediaTabActive}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default TabMedia
