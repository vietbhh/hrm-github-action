// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { DocumentApi } from "@modules/Documents/common/api"
import notification from "@apps/utility/notification"
import { Fragment } from "react"
// ** redux
import { useSelector } from "react-redux"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
import { Download, Share2 } from "react-feather"
// ** Components
import ModifyDocumentAction from "./ModifyDocumentAction"
import FileSaver from "file-saver"
const DocumentAction = (props) => {
  const {
    // ** props
    folderData,
    // ** methods
    handleModal,
    handleShareModal,
    setModalData,
    setParentFolder,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  const authState = useSelector((state) => state.auth)
  const authUser = authState.userData
  const isEditable = authUser.id === folderData.owner?.value

  const setLoading = (loading) => {
    setState({
      loading: loading
    })
  }

  const handleDownloadFolder = () => {
    setState({ loading: true })
    DocumentApi.postDownloadDocument(folderData.id)
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/zip" })
        FileSaver.saveAs(blob, folderData.name + ".zip")
        setState({ loading: false })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
        setState({ loading: false })
      })
  }

  const handleShareDocument = () => {
    setModalData(folderData)
    handleShareModal()
  }

  // ** render
  return (
    <Fragment>
      <Space>
        <Button.Ripple
          size="sm"
          color="flat-primary"
          className="btn-icon"
          disabled={!isEditable}
          onClick={() => handleShareDocument()}>
          <Share2 size="15" />
        </Button.Ripple>
        <Button.Ripple
          size="sm"
          color="flat-primary"
          className="btn-icon"
          disabled={!isEditable}
          onClick={() => handleDownloadFolder()}>
          <Download size="15" />
        </Button.Ripple>
        <ModifyDocumentAction
          isEditable={isEditable}
          folderData={folderData}
          handleModal={handleModal}
          setModalData={setModalData}
          loadData={loadData}
          loading={state.loading}
          setLoading={setLoading}
          setParentFolder={setParentFolder}
        />
      </Space>
    </Fragment>
  )
}

export default DocumentAction
