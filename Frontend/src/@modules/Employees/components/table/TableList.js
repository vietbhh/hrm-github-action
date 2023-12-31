import { ErpCheckbox } from "@apps/components/common/ErpField"
import TableLoader from "@apps/components/spinner/TableLoader"
import {
  fieldLabel,
  useMergedState,
  useFormatMessage
} from "@apps/utility/common"
import DragAndDrop from "@apps/utility/DragAndDrop"
import { isUndefined } from "@apps/utility/handleData"
import { cellHandle } from "@apps/utility/TableHandler"
import { Space } from "antd"
import classNames from "classnames"
import { filter, isEmpty, isFunction, isNull, map, orderBy } from "lodash"
import { Fragment, useContext, useEffect, useRef, useMemo } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Button } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { useDispatch } from "react-redux"
import { showOffboardingModal } from "@modules/Employees/common/offboardingReducer"
import { Pagination, Table } from "rsuite"
import InviteEmployeesModal from "../modals/InviteEmployeesModal"
import SwAlert from "@apps/utility/SwAlert"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"

const { Column, HeaderCell, Cell } = Table

const CellDisplay = (props) => {
  const { field, rowData } = props
  return cellHandle(field, rowData, {})
}
const CheckCell = ({ rowData, onChange, selectedRows, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: "46px" }}>
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
    item: { id },
    type: "COLUMN",
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
  const isActive = canDrop && isOver

  drag(drop(ref))

  const styles = {
    ...style,
    opacity: isDragging ? 0 : 1,
    background: isActive ? "#ddd" : null
  }

  return (
    <HeaderCell {...rest}>
      <div
        ref={ref}
        style={styles}
        className={classNames("", {
          drag_border_left: isActive
        })}>
        {children}
      </div>
    </HeaderCell>
  )
}

const TableList = (props) => {
  const {
    metas,
    data,
    loading,
    CustomCell,
    recordsTotal,
    currentPage,
    perPage,
    module,
    pagination,
    onChangePage,
    onChangeLength,
    allowSelectRow,
    onSelectedRow,
    onSortColumn,
    onDragColumn,
    onResize,
    customColumnBefore,
    customColumnAfter,
    currentSort,
    onComplete,
    loadData
  } = props
  const [state, setState] = useMergedState({
    selectedRows: [],
    listMemberInvite: [],
    listMemberOffBoarding: [],
    metas: { ...metas },
    modalInvite: false
  })

  const dispatch = useDispatch()

  const ability = useContext(AbilityContext)
  const canTermination = ability.can("termination", "employees")

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

  const toggleModalInvite = () => {
    setState({
      modalInvite: !state.modalInvite
    })
  }

  const handleDragColumn = (sourceId = null, targetId = null) => {
    const targetPosition = parseInt(metas[targetId]?.field_table_order) || null
    const sourcePosition = parseInt(metas[sourceId]?.field_table_order) || null
    const newMetas = orderBy(
      map(
        filter(metas, (field) => field.field_table_show && field.field_enable),
        (fieldData) => {
          const field = { ...fieldData }
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
      filter(newMetas, (field) => field.update_user_metas === true),
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

  const handleOnChangePage = (page) => {
    setState({
      selectedRows: []
    })
    onChangePage(page)
  }

  const handleClickInviteEmployees = () => {
    toggleModalInvite()
  }

  const handleClickOffBoardingEmployees = () => {
    dispatch(showOffboardingModal(state.listMemberOffBoarding))
  }

  const handleDeleteClick = (idDelete = "") => {
    if (idDelete !== "") {
      const ids = _.isArray(idDelete) ? idDelete : [idDelete]
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.delete")
      }).then((res) => {
        if (res.value) {
          _handleDeleteClick(ids)
        }
      })
    }
  }

  const _handleDeleteClick = (ids) => {
    defaultModuleApi
      .delete(module, ids.join(), "/employees/delete")
      .then((result) => {
        loadData(
          {
            page: state.currentPage
          },
          { selectedRows: [] }
        )
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })
        setState({
          selectedRows: []
        })
      })
      .catch((err) => {
        notification.showError({ text: err.message })
      })
  }

  useEffect(() => {
    handleDragColumn()
  }, [metas])

  useEffect(() => {
    let checked = false
    let indeterminate = false
    if (state.selectedRows.length === data.length) {
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

    const tempInvite = []
    const tempOffBoarding = []
    state.selectedRows.map((item) => {
      const [currentUserSelected] = data.filter(
        (itemFilter) => parseInt(itemFilter.id) === parseInt(item)
      )

      if (
        currentUserSelected?.status?.name_option !== "offboarding" &&
        currentUserSelected?.status?.name_option !== "resigned" &&
        (currentUserSelected?.account_status?.name_option === "uninvited" ||
          currentUserSelected?.status?.name_option === "invited")
      ) {
        tempInvite.push(currentUserSelected)
      } else if (
        [11, 12, 13, 14].includes(
          parseInt(currentUserSelected?.status?.value)
        ) &&
        canTermination
      ) {
        tempOffBoarding.push(currentUserSelected)
      }
    })

    setState({
      listMemberInvite: tempInvite,
      listMemberOffBoarding: tempOffBoarding
    })
  }, [data, state.selectedRows])

  if (loading) {
    return <TableLoader rows="15" />
  }

  const renderActionButton = () => {
    return (
      <Fragment>
        {state.listMemberInvite.length > 0 && (
          <Button.Ripple
            color="success"
            onClick={() => handleClickInviteEmployees()}>
            {useFormatMessage("modules.employees.buttons.invite_member", {
              number: state.listMemberInvite.length
            })}
          </Button.Ripple>
        )}

        {state.listMemberOffBoarding.length > 0 && (
          <Button.Ripple
            color="warning"
            onClick={() => handleClickOffBoardingEmployees()}>
            {useFormatMessage("modules.employees.buttons.onboarding_member", {
              number: state.listMemberOffBoarding.length
            })}
          </Button.Ripple>
        )}

        {(ability.can("delete", module) || ability.can("deleteAll", module)) &&
          state.selectedRows.length > 0 && (
            <Fragment>
              <Button.Ripple
                color="danger"
                onClick={() => {
                  handleDeleteClick(state.selectedRows)
                }}>
                {useFormatMessage("app.delete")}
              </Button.Ripple>
            </Fragment>
          )}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Space className="mb-1">
        <Fragment>{renderActionButton()}</Fragment>
      </Space>
      <DragAndDrop>
        <div>
          <Table
            affixHorizontalScrollbar
            virtualized
            headerHeight={45}
            autoHeight={true}
            data={data}
            renderLoading={() => {
              return loading ? <TableLoader rows="15" /> : ""
            }}
            sortColumn={currentSort.sortColumn}
            sortType={currentSort.sortType}
            onSortColumn={(key, type) => {
              if (isFunction(onSortColumn)) {
                onSortColumn(key, type)
              }
            }}
            className="table-employees">
            {(allowSelectRow || isUndefined(allowSelectRow)) && (
              <Column
                align="center"
                verticalAlign="middle"
                width={50}
                fixed="left">
                <HeaderCell style={{ padding: 0 }}>
                  <div style={{ lineHeight: "40px" }}>
                    <ErpCheckbox
                      id="select_all_row"
                      name="select_all_row"
                      inline
                      defaultChecked={false}
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
              const colProps = {
                key: index,
                align: "left",
                verticalAlign: "middle",
                resizable: true,
                onResize: (columnWidth, key) => {
                  if (isFunction(onResize)) {
                    onResize(field, columnWidth)
                  }
                },
                sortable: field_table_sortable || true
              }
              if (
                !isUndefined(field_table_width) &&
                parseInt(field_table_width) > 0
              ) {
                colProps.width = parseInt(field_table_width)
              }

              const cellProps = field_options?.table?.cellProps
              const canDrag = field_options?.table?.drag
              return (
                <Column {...colProps} {...cellProps} fullText>
                  {canDrag === false ? (
                    <HeaderCell
                      className={classNames(
                        `table_header_cell_${field.field} table_header_no_drag`,
                        {
                          table_header_icon:
                            currentSort.sortColumn === field.field
                        }
                      )}>
                      {fieldLabel(field.moduleName, field.field)}
                    </HeaderCell>
                  ) : (
                    <DraggableHeaderCell
                      className={classNames(
                        `table_header_cell_${field.field} table_header_can_drag`,
                        {
                          table_header_icon:
                            currentSort.sortColumn === field.field
                        }
                      )}
                      onDrag={handleDragColumn}
                      id={field.field}>
                      {fieldLabel(field.moduleName, field.field)}
                    </DraggableHeaderCell>
                  )}

                  <Cell
                    dataKey={field.field}
                    className={`table_cell_${field.field} table_cell_${field.field_type}`}>
                    {(rowData, dataKey) =>
                      isUndefined(CustomCell) ? (
                        <CellDisplay
                          field={field}
                          rowData={rowData}
                          dataKey={dataKey}
                        />
                      ) : (
                        <CustomCell
                          field={field}
                          rowData={rowData}
                          dataKey={dataKey}
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
          onChangePage={handleOnChangePage}
          onChangeLimit={onChangeLength}
          className="mt-2"
          layout={["limit", "|", "total", "-", "pager"]}
        />
      ) : (
        ""
      )}
      <InviteEmployeesModal
        modal={state.modalInvite}
        listEmployee={state.listMemberInvite}
        handleModal={toggleModalInvite}
        onComplete={onComplete}
      />
    </Fragment>
  )
}

export default TableList
