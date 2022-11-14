// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { Table } from "rsuite"

const { Cell } = Table

const NumberOfFileCell = (props) => {
  const {
    // ** props
    rowData
    // ** methods
  } = props

  const isDocument = rowData?.type === "document"
  
  // ** render
  return (
    <Cell {...props}>
      {isDocument
        ? `${JSON.parse(rowData.upload_filename).length} ${useFormatMessage(
            "modules.documents.text.files"
          )}`
        : ""}
    </Cell>
  )
}

export default NumberOfFileCell
