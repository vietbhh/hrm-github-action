// ** React Imports
import { getDocumentShareContent } from "../../../common/common"
// ** Styles
// ** Components
import { Table } from "rsuite"

const {  Cell } = Table

const SharedWithCell = (props) => {
  const {
    // ** props
    rowData,
    options
    // ** methods
  } = props

  const isDocument = rowData?.type === "document"

  const currentSharedWith = isDocument ? getDocumentShareContent(rowData, options) : ""

  // ** render
  return <Cell {...props}>{currentSharedWith}</Cell>
}

export default SharedWithCell
