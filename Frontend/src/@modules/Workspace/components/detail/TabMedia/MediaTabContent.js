// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
// ** Styles
// ** Components
import { EmptyContent } from "@apps/components/common/EmptyContent"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import MediaItem from "./MediaItem"

const MediaTabContent = (props) => {
  const {
    // ** props
    id,
    tabId,
    mediaTabActive,
    // ** methods
    handleModalPreview,
    setMediaInfo
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    data: {}
  })

  const appSetting = useSelector((state) => state.auth.settings)

  const loadData = () => {
    workspaceApi
      .loadMedia(id, {
        media_type: mediaTabActive
      })
      .then((res) => {
        setTimeout(() => {
          setState({
            data: res.data,
            loading: false
          })
        }, 300)
      })
      .catch((err) => {
        setTimeout(() => {
          setState({
            data: {},
            loading: false
          })
        }, 300)
      })
  }

  // ** effect
  useEffect(() => {
    setState({
      data: {},
      loading: true
    })

    if (tabId === mediaTabActive) {
      loadData()
    }
  }, [mediaTabActive])

  // ** render
  const renderContent = () => {
    if (tabId !== mediaTabActive) {
      return ""
    }

    if (state.loading === true) {
      return <AppSpinner className="mt-1" />
    }

    if (Object.keys(state.data).length === 0) {
      return <EmptyContent className="mt-1" />
    }

    return (
      <Fragment>
        {_.map(state.data, (item, index) => {
          return (
            <MediaItem
              mediaItem={item}
              mediaTabActive={mediaTabActive}
              appSetting={appSetting}
              key={`media-item-${item.info._id}`}
              handleModalPreview={handleModalPreview}
              setMediaInfo={setMediaInfo}
            />
          )
        })}
      </Fragment>
    )
  }

  return <Fragment>{renderContent()}</Fragment>
}

export default MediaTabContent
