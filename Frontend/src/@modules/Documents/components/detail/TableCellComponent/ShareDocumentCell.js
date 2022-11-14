// ** React Imports
import { DocumentApi } from "../../../common/api"
import { useFormatMessage } from "@apps/utility/common"
// ** redux
import { useSelector } from "react-redux"
// ** Styles
// ** Components
import { Table } from "rsuite"
import { ErpSwitch } from "@apps/components/common/ErpField"
import notification from "@apps/utility/notification"

const { Cell } = Table

const ShareDocumentCell = (props) => {
  const {
    // ** props
    rowData,
    other
    // ** methods
  } = props

  const { loading, setLoading, loadData } = other

  const authState = useSelector((state) => state.auth)
  const authUser = authState.userData
  const isEditable = authUser.id === rowData?.owner?.value

  const isDocument = rowData?.type === "document"

  const handleChangeShareStatus = (el, documentId) => {
    if (!loading) {
      setLoading(true)
      const values = {
        share: el.target.checked ? 1 : 0
      }

      DocumentApi.postUpdateDocumentShareStatus(documentId, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          loadData()
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
        })
    }
  }

  // ** render
  return (
    <Cell {...props}>
      {isDocument ? (
        <div className="share-cell">
          <ErpSwitch
            id={`share_documents_${rowData.id}`}
            name={`share_documents_${rowData.id}`}
            checked={Boolean(rowData.share)}
            nolabel={true}
            disabled={!isEditable}
            onChange={(el) => handleChangeShareStatus(el, rowData.id)}
          />
        </div>
      ) : (
        ""
      )}
    </Cell>
  )
}

export default ShareDocumentCell
