// ** React Imports
import { addComma } from "@apps/utility/common"
// ** Styles
// ** Components
import { Table } from "rsuite"

const { Cell } = Table

const TotalSizeCell = (props) => {
  const {
    // ** props
    rowData
    // ** methods
  } = props

  const mbSize = rowData.size / (1024 * 1024)

  // ** render
  return <Cell {...props}>{addComma(mbSize.toFixed(3))} MB</Cell>
}

export default TotalSizeCell
