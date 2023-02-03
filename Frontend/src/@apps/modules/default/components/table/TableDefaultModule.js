import { ErpCheckbox } from "@apps/components/common/ErpField"
import TableLoader from "@apps/components/spinner/TableLoader"
import { fieldLabel, useMergedState } from "@apps/utility/common"
import DragAndDrop from "@apps/utility/DragAndDrop"
import { isUndefined } from "@apps/utility/handleData"
import { cellHandle } from "@apps/utility/TableHandler"
import { filter, isEmpty, isFunction, isNull, map, orderBy } from "lodash"
import { Fragment, useEffect, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Pagination, Table } from "rsuite"
const { Column, HeaderCell, Cell } = Table

const CellDisplay = (props) => {
  const { field, rowData } = props
  return cellHandle(field, rowData, {})
}
const CheckCell = ({ rowData, onChange, selectedRows, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div className="d-flex justify-content-center">
      <ErpCheckbox
        value={rowData[dataKey]}
        inline
        onChange={(e) => {
          onChange(rowData[dataKey], e.target.checked)
        }}
        checked={selectedRows.some((item) => item === rowData[dataKey])}
        id={`select_row_${rowData[dataKey]}`}
        name={`select_row_${rowData[dataKey]}`}
      />
    </div>
  </Cell>
)

const style = {
  cursor: "move",
  display: "inline"
}

function DraggableHeaderCell({ children, onDrag, id, ...rest }) {
  const ref = useRef(null)

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "COLUMN",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    drop(item, monitor) {
      onDrag(item.id, id)
    }
  })

  const [{ isDragging }, drag] = useDrag({
    item: { id, type: "COLUMN" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
  const opacity = isDragging ? 0 : 1
  const isActive = canDrop && isOver

  drag(drop(ref))

  const styles = {
    ...style,
    opacity: isDragging ? 0 : 1,
    background: isActive ? "#ddd" : null
  }

  return (
    <HeaderCell {...rest} style={{ padding: 0 }}>
      <div ref={ref} style={styles}>
        {children}
      </div>
    </HeaderCell>
  )
}

const TableDefaultModule = (props) => {
  const {
    metas,
    data,
    loading,
    CustomCell,
    recordsTotal,
    currentPage,
    perPage,
    pagination,
    onChangePage,
    onChangeLength,
    onSelectedRow,
    onSortColumn,
    onDragColumn,
    onResize,
    customColumnBefore,
    customColumnAfter,
    filterMetas,
    ...rest
  } = props
  const [state, setState] = useMergedState({
    selectedRows: [],
    sortColumn: "id",
    sortType: "desc",
    metas: { ...metas }
  })
  const selectAllRef = useRef()
  const handleCheckAll = (checked) => {
    const selectedRows = checked ? data.map((item) => item.id) : []
    setState({
      selectedRows
    })
  }
  const handleCheck = (value, checked) => {
    const { selectedRows } = state
    const nextSelectedRows = checked
      ? [...selectedRows, value]
      : selectedRows.filter((item) => parseInt(item) !== parseInt(value))
    setState({
      selectedRows: nextSelectedRows
    })
  }
  const handleDragColumn = (sourceId = null, targetId = null) => {
    const targetPosition = parseInt(metas[targetId]?.field_table_order) || null
    const sourcePosition = parseInt(metas[sourceId]?.field_table_order) || null

    const newMetas = orderBy(
      map(
        filter(metas, (field) => {
          if (field.field_table_show) {
            if (isFunction(filterMetas)) {
              return filterMetas(field)
            } else {
              return true
            }
          } else {
            return false
          }
        }),
        (fieldItem) => {
          const field = { ...fieldItem }
          const itemPosition = parseInt(field.field_table_order)
          field.update_user_metas = false
          if (!isNull(targetPosition) && itemPosition >= targetPosition) {
            field.field_table_order = itemPosition + 1
            field.update_user_metas = true
          }
          if (!isNull(sourcePosition) && itemPosition === sourcePosition) {
            field.field_table_order = targetPosition
            field.update_user_metas = true
          }

          return field
        }
      ),
      (field) => parseInt(field.field_table_order),
      "asc"
    )
    const metasUpdate = map(
      filter(metas, (field) => field.update_user_metas === true),
      (field) => {
        return {
          module_id: field.module,
          module_meta_id: field.id,
          field_table_order: parseInt(field.field_table_order)
        }
      }
    )
    if (isFunction(onDragColumn) && !isEmpty(metasUpdate)) {
      onDragColumn(metasUpdate)
    }
    setState({
      metas: newMetas
    })
  }

  useEffect(() => {
    if (!isEmpty(metas)) {
      handleDragColumn()
    }
  }, [metas])

  useEffect(() => {
    let checked = false
    let indeterminate = false
    if (state.selectedRows.length === data.length && data.length > 0) {
      checked = true
    } else if (state.selectedRows.length === 0) {
      checked = false
    } else if (
      state.selectedRows.length > 0 &&
      state.selectedRows.length < data.length
    ) {
      indeterminate = true
    }
    if (selectAllRef.current) {
      selectAllRef.current.checked = checked
      selectAllRef.current.indeterminate = indeterminate
    }
    if (isFunction(onSelectedRow)) {
      onSelectedRow(state.selectedRows)
    }
  }, [data, state.selectedRows])
  return (
    <Fragment>
      <DragAndDrop>
        <div>
          <Table
            affixHorizontalScrollbar
            headerHeight={45}
            autoHeight={true}
            data={data}
            wordWrap="break-word"
            renderLoading={() => {
              return loading ? <TableLoader rows="15" /> : ""
            }}
            loading={loading}
            sortColumn={state.sortColumn}
            sortType={state.sortType}
            onSortColumn={(key, type) => {
              setState({
                sortColumn: key,
                sortType: type
              })
              if (isFunction(onSortColumn)) {
                onSortColumn(key, type)
              }
            }}
            {...rest}>
            {onSelectedRow && isFunction(onSelectedRow) && (
              <Column
                align="center"
                verticalAlign="middle"
                width={50}
                fixed="left">
                <HeaderCell style={{ padding: 0 }}>
                  <div className="d-flex justify-content-center">
                    <ErpCheckbox
                      id="select_all_row"
                      name="select_all_row"
                      onChange={(e) => {
                        handleCheckAll(e.target.checked)
                      }}
                      innerRef={selectAllRef}
                    />
                  </div>
                </HeaderCell>
                <CheckCell
                  dataKey="id"
                  selectedRows={state.selectedRows}
                  onChange={handleCheck}
                />
              </Column>
            )}

            {!isEmpty(customColumnBefore) &&
              map(customColumnBefore, (col, index) => {
                const CellComponent = col.cellComponent
                return (
                  <Column {...col.props}>
                    <HeaderCell>{col.header}</HeaderCell>
                    <CellComponent />
                  </Column>
                )
              })}
            {map(state.metas, (field, index) => {
              const { field_options, field_table_width, field_table_sortable } =
                field
              const resizeProps =
                onResize === false
                  ? { flexGrow: 1, minWidth: 150 }
                  : {
                      resizable: true,
                      onResize: (columnWidth, key) => {
                        if (isFunction(onResize)) {
                          onResize(field, columnWidth)
                        }
                      }
                    }
              const colProps = {
                key: index,
                align: "left",
                verticalAlign: "middle",
                sortable: field_table_sortable || true,
                ...resizeProps
              }

              if (
                !isUndefined(field_table_width) &&
                parseInt(field_table_width) > 0
              ) {
                colProps.width = parseInt(field_table_width)
                colProps.minWidth = parseInt(field_table_width)
              }
              const cellProps = field_options?.table?.cellProps
              const canDrag = field_options?.table?.drag

              return (
                <Column {...colProps} {...cellProps}>
                  {canDrag === false || onDragColumn === false ? (
                    <HeaderCell className={`table_header_cell_${field.field}`}>
                      {fieldLabel(field.moduleName, field.field)}
                    </HeaderCell>
                  ) : (
                    <DraggableHeaderCell
                      className={`table_header_cell_${field.field}`}
                      onDrag={handleDragColumn}
                      id={field.field}>
                      {fieldLabel(field.moduleName, field.field)}
                    </DraggableHeaderCell>
                  )}

                  <Cell
                    dataKey={field.field}
                    className={`table_cell_${field.field} table_cell_${field.field_type}`}>
                    {(rowData) =>
                      isUndefined(CustomCell) ? (
                        <CellDisplay
                          key={`${field.field}_${index}`}
                          field={field}
                          rowData={rowData}
                        />
                      ) : (
                        <CustomCell
                          key={`${field.field}_${index}`}
                          field={field}
                          rowData={rowData}
                        />
                      )
                    }
                  </Cell>
                </Column>
              )
            })}
            {!isEmpty(customColumnAfter) &&
              map(customColumnAfter, (col, index) => {
                const CellComponent = col.cellComponent
                return (
                  <Column
                    key={index}
                    width={120}
                    align="center"
                    verticalAlign="middle"
                    {...col.props}>
                    <HeaderCell>{col.header}</HeaderCell>
                    <CellComponent />
                  </Column>
                )
              })}
          </Table>
        </div>
      </DragAndDrop>
      {(pagination || isUndefined(pagination)) &&
      parseInt(recordsTotal) > parseInt(perPage) ? (
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          limitOptions={[15, 30]}
          activePage={currentPage}
          limit={parseInt(perPage)}
          total={recordsTotal}
          onChangePage={onChangePage}
          onChangeLimit={onChangeLength}
          className="mt-2"
          layout={["limit", "|", "total", "-", "pager"]}
        />
      ) : (
        ""
      )}
    </Fragment>
  )
}

export default TableDefaultModule
