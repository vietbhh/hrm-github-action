// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Link } from "react-router-dom"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
// ** Components
import { Table } from "rsuite"
import { ErpSwitch, ErpCheckbox } from "@apps/components/common/ErpField"

const { Column, Cell, HeaderCell } = Table

const GroupTable = (props) => {
  const {
    // ** props
    data
    // ** methods
  } = props

  // ** return
  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div style={{ lineHeight: "46px" }}>
        <ErpCheckbox />
      </div>
    </Cell>
  )

  const ActiveCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <ErpSwitch />
      </Cell>
    )
  }

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <div>
          <Link to={`/settings/groups/${rowData.id}`}>
            <Button.Ripple color="flat-primary" size="sm">
              <i className="fal fa-edit" />
            </Button.Ripple>
          </Link>
          <Button.Ripple color="flat-danger" size="sm">
            <i className="far fa-trash-alt" />
          </Button.Ripple>
        </div>
      </Cell>
    )
  }

  return (
    <div>
      <Table autoHeight={true} data={data}>
        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>
            {useFormatMessage("modules.groups.fields.name")}
          </HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={2} align="center" fixed>
          <HeaderCell>
            {useFormatMessage("modules.groups.fields.is_active")}
          </HeaderCell>
          <ActiveCell />
        </Column>
        <Column width={120} align="center" fixed>
          <HeaderCell></HeaderCell>
          <ActionCell />
        </Column>
      </Table>
    </div>
  )
}

export default GroupTable
