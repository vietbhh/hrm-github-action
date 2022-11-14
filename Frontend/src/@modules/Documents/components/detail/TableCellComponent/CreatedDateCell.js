// ** React Imports
// ** Styles
// ** Components
import { Table } from "rsuite"

const { Cell } = Table

const CreatedDateCell = (props) => {
  const {
    // ** props
    rowData
    // ** methods
  } = props

  const isDocument = rowData?.type === "document"

  // ** render
  return <Cell {...props}>{isDocument ? rowData.created_at : ""}</Cell>
}

export default CreatedDateCell
