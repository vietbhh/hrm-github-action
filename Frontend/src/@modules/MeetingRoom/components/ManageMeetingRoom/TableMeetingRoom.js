// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
import { Table, Pagination } from "rsuite"
import { Space } from "antd"
// ** Components
import { ErpSwitch } from "@apps/components/common/ErpField"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"

const { Column, HeaderCell, Cell } = Table

const TableMeetingRoom = (props) => {
  const {
    // ** props
    loading,
    listMeetingRoom,
    totalData,
    filter,
    // ** methods
    setListMeetingRoom,
    setFilter,
    handleClickAdd,
    loadData
  } = props

  const page = filter.page
  const limit = filter.perPage

  const handleChangeStatus = (id, status) => {
    const updateObj = {
      id: id,
      status: status
    }
    defaultModuleApi
      .postSave("meeting_room", updateObj)
      .then((res) => {
        setListMeetingRoom(updateObj, "update")
      })
      .catch((err) => {
        notification.showError()
      })
  }

  const setPage = (page) => {
    setFilter({
      page: page
    })
  }

  const handleChangeLimit = (limit) => {
    setFilter({
      perPage: limit
    })
  }

  const handleClickRemove = (id) => {
    SwAlert.showWarning({
      title: useFormatMessage("notification.confirm.title"),
      text: useFormatMessage("notification.confirm.text")
    }).then((resSw) => {
      if (resSw.isConfirmed === true) {
        defaultModuleApi
          .delete("meeting_room", id)
          .then((res) => {
            if (filter.page === 1) {
              loadData()
            } else {
              setFilter({
                page: 1
              })
            }
          })
          .catch((err) => {
            notification.showError()
          })
      }
    })
  }

  // ** render
  const StatusCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <ErpSwitch
          defaultChecked={rowData.status}
          onChange={() => handleChangeStatus(rowData.id, !rowData.status)}
        />
      </Cell>
    )
  }

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <Space>
          <Button.Ripple
            className="btn-icon"
            color="flat-secondary"
            size="sm"
            onClick={() => handleClickAdd(rowData.id)}>
            <i className="far fa-edit"></i>
          </Button.Ripple>
          <Button.Ripple
            className="btn-icon"
            color="flat-danger"
            size="sm"
            onClick={() => handleClickRemove(rowData.id)}>
            <i className="fas fa-trash-alt"></i>
          </Button.Ripple>
        </Space>
      </Cell>
    )
  }

  return (
    <Card>
      <CardBody>
        <Table
          loading={loading}
          data={listMeetingRoom}
          autoHeight={true}
          headerHeight={60}
          rowHeight={60}
          wordWrap="break-word"
          affixHorizontalScrollbar>
          <Column flexGrow={2} align="left" fixed verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage("modules.meeting_room.fields.name")}
            </HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={1} align="left" fixed verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage("modules.meeting_room.fields.status")}
            </HeaderCell>
            <StatusCell />
          </Column>
          <Column width={150} align="left" fixed verticalAlign="middle">
            <HeaderCell></HeaderCell>
            <ActionCell />
          </Column>
        </Table>
        <div className="mt-1 p-1 pb-0">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={["total", "-", "limit", "|", "pager", "skip"]}
            total={totalData}
            limitOptions={[10, 30, 50]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
      </CardBody>
    </Card>
  )
}

export default TableMeetingRoom
