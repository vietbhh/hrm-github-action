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
    tabActive
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    mediaTabActive: 1,
    mediaInfo: {},
    modalPreview: false
  })

  const { id } = useParams()

  const setMediaTabActive = (tab) => {
    if (state.mediaTabActive !== tab) {
      setState({
        mediaTabActive: tab
      })
    }
  }

  const setMediaInfo = (data) => {
    setState({
      mediaInfo: data
    })
  }

  const handleModalPreview = () => {
    setState({
      modalPreview: !state.modalPreview
    })
  }

  // ** effect
  useEffect(() => {
    if (state.modalPreview) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [state.modalPreview])

  // ** render
  return (
    <div className="tab-media">
      <Card>
        <CardBody>
          <div>
            <MediaHeader mediaTabActive={state.mediaTabActive}/>
          </div>
          <div>
            <MediaContent
              id={id}
              mediaTabActive={state.mediaTabActive}
              modalPreview={state.modalPreview}
              setMediaTabActive={setMediaTabActive}
              setMediaInfo={setMediaInfo}
              handleModalPreview={handleModalPreview}
            />
          </div>
        </CardBody>
      </Card>

      {state.modalPreview && (
        <PreviewMediaContentModal
          modal={state.modalPreview}
          mediaInfo={state.mediaInfo}
          mediaTabActive={state.mediaTabActive}
          handleModal={handleModalPreview}
        />
      )}
    </div>
  )
}

export default TabMedia
