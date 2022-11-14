// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { Table } from "rsuite"

const { Column, HeaderCell, Cell } = Table

const ListEmployeeOvertime = (props) => {
  const {
    // ** props
    employees
    // ** methods
  } = props

  // ** render
  const NameCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="name-cell">
        <div>
          <Avatar className="me-50" imgHeight={30} imgWidth={30}/>
          <span>{rowData.full_name}</span>
        </div>
      </Cell>
    )
  }

  return (
    <Fragment>
      <div>
        <p>{useFormatMessage("modules.overtimes.fields.employee")}: </p>
        <Table
          data={employees}
          autoHeight={true}
          rowHeight={50}
          rowExpandedHeight={150}
          className="ms-n1">
          <Column width={280} align="left" fixed verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage("modules.overtimes.text.name")}
            </HeaderCell>
            <NameCell />
          </Column>
          <Column width={230} align="left" fixed verticalAlign="middle"> 
            <HeaderCell>
              {useFormatMessage("modules.overtimes.text.username")}
            </HeaderCell>
            <Cell dataKey="label" />
          </Column>
          <Column width={520} align="left" fixed verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage("modules.overtimes.text.email")}
            </HeaderCell>
            <Cell dataKey="email" />
          </Column>
        </Table>
      </div>
    </Fragment>
  )
}

export default ListEmployeeOvertime
