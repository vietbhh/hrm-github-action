// ** React Imports
import { Fragment, useState } from "react"
import { formatDate, useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { Table, Pagination } from "rsuite"

const { Column, HeaderCell, Cell } = Table

const ListRecruitment = (props) => {
  const {
    // ** props
    recruitmentData,
    hiringWorkflowData
    // ** methods
  } = props

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)

  const tableData = recruitmentData.filter((item, index) => {
    const start = limit * (page - 1)
    const end = start + limit
    return index >= start && index < end
  })

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  // ** render
  const CreatedAtCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{formatDate(rowData.created_at)}</Cell>
  }

  const renderTable = () => {
    return (
      <Table
        autoHeight={true}
        data={tableData}
        rowHeight={60}
        affixHorizontalScrollbar>
        <Column width={300} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage(
              "modules.reports.recruitment.text.table.recruitment_code"
            )}
          </HeaderCell>
          <Cell dataKey="recruitment_code" />
        </Column>
        <Column width={200} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage(
              "modules.reports.recruitment.text.table.created_at"
            )}
          </HeaderCell>
          <Cell dataKey="created_at" />
        </Column>
        <Column width={200} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.reports.recruitment.text.table.process")}
          </HeaderCell>
          <Cell dataKey="total_process" />
        </Column>
        {hiringWorkflowData.map((item, index) => {
          return (
            <Column
              flexGrow={1}
              align="left"
              verticalAlign="middle"
              key={`cell-${index}`}>
              <HeaderCell>
                {useFormatMessage(
                  `modules.recruitments.kanban.stages.${item.stage}`
                )}
              </HeaderCell>
              <Cell dataKey={`total_${item.stage}`} />
            </Column>
          )
        })}
      </Table>
    )
  }

  const renderPagination = () => {
    return (
      <div className="table-pagination">
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
          total={recruitmentData.length}
          limitOptions={[10, 20]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    )
  }

  return (
    <Fragment>
      {renderTable()}
      {renderPagination()}
    </Fragment>
  )
}

export default ListRecruitment
